'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { fetchChatById } from '@/utils/firebaseHelper';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ChatHistoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadChat();
  }, [params.id]);

  const loadChat = async () => {
    try {
      setLoading(true);
      setError(null);
      const chatData = await fetchChatById(params.id);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading chat...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <Link href="/aiassistant" className="mt-4 inline-flex items-center text-blue-500 hover:text-blue-600">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assistant
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!chat) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/aiassistant" className="inline-flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assistant
          </Link>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-2xl">{getAssistantIcon(chat.assistantType)}</span>
            <h1 className="text-xl font-semibold dark:text-white">
              {chat.assistantType || 'Chat'} History
            </h1>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {new Date(chat.timestamp).toLocaleString()}
          </p>
        </div>

        {/* Messages */}
        <div className="space-y-4">
          {chat.messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 dark:text-white'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <div className="mt-1 text-xs opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
