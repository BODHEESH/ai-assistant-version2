'use client';

import React, { useState, useRef, useEffect } from 'react';
import { generateResponse } from '@/services/groqService';
import { Send, Bot, User } from 'lucide-react';

const Message = ({ role, content }) => (
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
      <p className="text-sm font-medium text-gray-200">
        {role === 'assistant' ? 'AI Assistant' : 'You'}
      </p>
      <div className="prose prose-invert max-w-none">
        <p className="text-gray-300 whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  </div>
);

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message to chat
    const newMessages = [
      ...messages,
      { role: 'user', content: userMessage }
    ];
    setMessages(newMessages);

    try {
      // Get AI response
      const response = await generateResponse([
        ...newMessages,
      ]);

      // Add AI response to chat
      setMessages([
        ...newMessages,
        { role: 'assistant', content: response }
      ]);
    } catch (error) {
      console.error('Error getting response:', error);
      // Add error message to chat
      setMessages([
        ...newMessages,
        { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error while processing your request. Please try again.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

    return (
      <div className="flex flex-col h-[calc(100vh-12rem)] md:h-[calc(100vh-8rem)] max-h-[calc(100vh-12rem)] md:max-h-[calc(100vh-8rem)] bg-gray-900">      {/* Chat header */}
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

      {/* Chat messages */}
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
            <Message key={index} {...message} />
          ))
        )}
        <div ref={messagesEndRef} className="h-4" /> {/* Added height for better spacing */}
      </div>

       {/* Chat input - Fixed at bottom above navigation */}
       <div className="flex-shrink-0 border-t border-gray-800 bg-gray-900/95 backdrop-blur-sm sticky bottom-0 z-10 md:pb-4">
        <form onSubmit={handleSubmit} className="px-4 pt-2">
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-800 text-white rounded-lg px-2 py-3 md:py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`px-4 md:px-5 py-2 md:py-3.5 rounded-lg bg-blue-600 text-white flex items-center gap-2 transition-all duration-200 ${
                (!input.trim() || isLoading) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-blue-700 hover:shadow-lg'
              }`}
            >
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline">{isLoading ? 'Sending...' : 'Send'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}