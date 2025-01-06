'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { fetchChatById } from '@/utils/firebaseHelper';

export default function ChatHistory({ chatId, assistantType }) {
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadChat();
  }, [chatId]);

  const loadChat = async () => {
    try {
      setLoading(true);
      setError(null);
      const chatData = await fetchChatById(chatId);
      if (chatData) {
        setChat(chatData);
      } else {
        setError('Chat not found');
      }
    } catch (err) {
      console.error('Error loading chat:', err);
      setError('Failed to load chat');
    } finally {
      setLoading(false);
    }
  };

  const getAssistantIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'recipe suggestions': return '🍳';
      case 'code review': return '💻';
      case 'story writing': return '📝';
      case 'chat': return '💬';
      default: return '🤖';
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-red-500 mb-4">{error}</p>
        <Link 
          href="/aiassistant" 
          className="flex items-center text-blue-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assistant
        </Link>
      </div>
    );
  }

  if (!chat) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link 
                href="/aiassistant" 
                className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Link>
              <div className="ml-6 flex items-center">
                <span className="text-2xl mr-2">
                  {getAssistantIcon(chat.assistantType)}
                </span>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {chat.assistantType || 'Chat'} History
                </h1>
              </div>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatTimestamp(chat.timestamp)}
            </span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {chat.messages.map((message, index) => (
            <div
              key={message.id || index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className="mt-1 text-xs opacity-70">
                  {formatTimestamp(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
