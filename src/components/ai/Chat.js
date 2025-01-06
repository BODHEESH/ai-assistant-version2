'use client';

import React, { useState, useRef, useEffect } from 'react';
import { generateResponse } from '@/services/groqService';
import { Send, Bot, User } from 'lucide-react';
import { db, auth } from '@/config/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, updateDoc, doc, limit } from 'firebase/firestore';

const Message = ({ role, content, status, error, timestamp, metadata }) => (
  <div className={`flex gap-3 ${role === 'assistant' ? 'bg-gray-800/50' : ''} p-4 rounded-lg`}>
    <div className="flex-shrink-0">
      {role === 'assistant' ? (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
    <div className="flex-1 space-y-2">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-gray-200">
          {role === 'assistant' ? 'AI Assistant' : 'You'}
        </p>
        {status && (
          <span className={`text-xs px-2 py-1 rounded ${
            status === 'completed' ? 'bg-green-600/20 text-green-400' :
            status === 'loading' ? 'bg-blue-600/20 text-blue-400' :
            status === 'pending' ? 'bg-yellow-600/20 text-yellow-400' :
            'bg-red-600/20 text-red-400'
          }`}>
            {status === 'loading' ? 'Thinking...' : status}
          </span>
        )}
      </div>
      <div className="prose prose-invert max-w-none">
        {status === 'loading' ? (
          <div className="flex items-center space-x-2">
            <div className="animate-bounce">.</div>
            <div className="animate-bounce delay-100">.</div>
            <div className="animate-bounce delay-200">.</div>
          </div>
        ) : (
          <p className="text-gray-300 whitespace-pre-wrap">{content}</p>
        )}
        {error && (
          <p className="text-red-400 text-sm mt-2">Error: {error}</p>
        )}
      </div>
      {timestamp && (
        <div className="text-xs text-gray-500">
          {new Date(timestamp).toLocaleTimeString()}
        </div>
      )}
      {metadata && metadata.processingTime && (
        <div className="text-xs text-gray-500 mt-2">
          Processed in: {metadata.processingTime}ms
        </div>
      )}
    </div>
  </div>
);

export default function Chat({ selectedChat, onNewMessage }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'chats'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .reverse();
      setMessages(fetchedMessages);
      setError(null);
    }, (error) => {
      console.error("Error fetching messages:", error);
      setError(error.message);
    });

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = {
      content: message.trim(),
      role: 'user',
      userId: auth.currentUser.uid,
      timestamp: serverTimestamp(),
      status: 'pending'
    };

    setMessage('');
    setLoading(true);
    setError(null);

    try {
      // Add user message to messages immediately for UI feedback
      const userMessageWithClientTimestamp = {
        ...userMessage,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessageWithClientTimestamp]);

      // Add user message to Firestore
      const docRef = await addDoc(collection(db, 'chats'), userMessage);
      
      // Add loading message for UI feedback
      const loadingMessage = {
        role: 'assistant',
        content: '...',
        status: 'loading',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, loadingMessage]);

      // Generate AI response
      const aiResponse = await generateResponse(message.trim(), 'chat');
      
      // Remove loading message and add real response
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => msg.status !== 'loading');
        return [...withoutLoading, {
          content: aiResponse,
          role: 'assistant',
          timestamp: new Date(),
          status: 'completed'
        }];
      });

      // Add AI response to Firestore
      await addDoc(collection(db, 'chats'), {
        content: aiResponse,
        role: 'assistant',
        userId: auth.currentUser.uid,
        timestamp: serverTimestamp(),
        status: 'completed'
      });

      // Update user message status
      await updateDoc(doc(db, 'chats', docRef.id), {
        status: 'completed'
      });

    } catch (error) {
      console.error('Error handling message:', error);
      setError(error.message);
      
      // Update UI to show error
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => msg.status !== 'loading');
        return [...withoutLoading, {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          status: 'error',
          timestamp: new Date(),
          error: error.message
        }];
      });
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const chatContainer = chatContainerRef.current;
      const isScrolledToBottom = chatContainer.scrollHeight - chatContainer.clientHeight <= chatContainer.scrollTop + 100;

      if (isScrolledToBottom) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] md:h-[calc(100vh-8rem)] max-h-[calc(100vh-12rem)] md:max-h-[calc(100vh-8rem)] bg-gray-900">
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">AI Chat</h2>
            <p className="text-sm text-gray-400">Ask me anything</p>
          </div>
        </div>
      </div>

      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#4B5563 #1F2937'
        }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <Bot className="w-12 h-12 mb-4" />
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">Start a conversation by sending a message below.</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <Message key={message.id} {...message} />
          ))
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      <div className="flex-shrink-0 border-t border-gray-800 bg-gray-900/95 backdrop-blur-sm sticky bottom-0 z-10 md:pb-4">
        <form onSubmit={handleSubmit} className="px-4 pt-2">
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-800 text-white rounded-lg px-2 py-3 md:py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!message.trim() || loading}
              className={`px-4 md:px-5 py-2 md:py-3.5 rounded-lg bg-blue-600 text-white flex items-center gap-2 transition-all duration-200 ${
                (!message.trim() || loading) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-blue-700 hover:shadow-lg'
              }`}
            >
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline">{loading ? 'Sending...' : 'Send'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}