'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from './ai/Header';
import Sidebar from './ai/Sidebar';
import HomePage from './ai/HomePage';
import AIAssistantChat from './ai/AIAssistantChat';
import NotificationsTab from './ai/NotificationsTab';
import ProfileTab from './ai/ProfileTab';
import Dashboard from './Dashboard';
import { promptTemplates } from '@/utils/promptTemplates';
import { generateResponse } from '@/services/groqService';
import BottomNav from './ai/BottomNav';
import { ChevronRight, Send, Heart, MessageSquare, AlertTriangle, Camera, Settings, LogOut, Sun, Moon, Home, Bell, User, BarChart2, Bot, Menu, Search, Calendar, X } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { name: 'Chat Assistant', color: 'bg-blue-600', category: 'general' },
  { name: 'Code Review', color: 'bg-green-600', category: 'development' },
  { name: 'LinkedIn Post', color: 'bg-blue-500', category: 'content' },
  { name: 'Hashnode Blog', color: 'bg-purple-600', category: 'content' },
  { name: 'Technical Article', color: 'bg-indigo-600', category: 'content' },
  { name: 'Study Notes', color: 'bg-teal-600', category: 'education' },
  { name: 'Interview Questions', color: 'bg-red-600', category: 'career' },
  { name: 'Story Writing', color: 'bg-pink-600', category: 'creative' },
  { name: 'Recipe Suggestions', color: 'bg-orange-600', category: 'lifestyle' },
  { name: 'Fitness Coach', color: 'bg-green-500', category: 'health' },
  { name: 'Language Translation', color: 'bg-yellow-600', category: 'language' },
  { name: 'Grammar Checker', color: 'bg-cyan-600', category: 'writing' },
  { name: 'Math Solver', color: 'bg-blue-400', category: 'education' },
  { name: 'Travel Advice', color: 'bg-purple-500', category: 'lifestyle' },
  { name: 'Daily Motivation', color: 'bg-pink-500', category: 'personal' },
  { name: 'Email Writer', color: 'bg-indigo-500', category: 'writing' },
  { name: 'Social Media Manager', color: 'bg-blue-300', category: 'marketing' },
  { name: 'Business Plan', color: 'bg-amber-600', category: 'business' },
  { name: 'Resume Builder', color: 'bg-red-500', category: 'career' },
  { name: 'Project Manager', color: 'bg-yellow-500', category: 'business' },
  { name: 'Design Assistant', color: 'bg-purple-400', category: 'creative' },
  { name: 'Research Assistant', color: 'bg-teal-500', category: 'education' },
  { name: 'Video Script', color: 'bg-rose-500', category: 'content' },
  { name: 'Financial Advisor', color: 'bg-emerald-600', category: 'finance' },
  { name: 'Presentation Maker', color: 'bg-orange-500', category: 'business' }
];

const notifications = [
  { id: 1, type: 'like', message: 'John liked your post', time: '2h ago' },
  { id: 2, type: 'comment', message: 'New comment on your story', time: '3h ago' },
  { id: 3, type: 'alert', message: 'Your subscription is expiring soon', time: '1d ago' },
  { id: 4, type: 'like', message: 'Sarah liked your comment', time: '2d ago' },
];

const chatHistory = [
  { title: 'Wayanad landslide', date: '14/09/2024' },
  { title: 'Tajmahal built details?', date: '14/09/2024' },
  { title: 'Create a documentation about t...', date: '14/09/2024' },
  { title: 'How to sleep in two minutes...', date: '14/09/2024' },
  { title: 'Give me a good night message...', date: '14/09/2024' },
  { title: 'Tell me a story', date: '14/09/2024' },
];

const getFeatureDescription = (featureName) => {
  const descriptions = {
    'Chat Assistant': 'Get help with any question or task',
    'Code Review': 'Get expert feedback on your code',
    'LinkedIn Post': 'Create engaging professional posts',
    'Hashnode Blog': 'Write technical blog posts with proper structure',
    'Technical Article': 'Create detailed technical content',
    'Study Notes': 'Generate organized study materials',
    'Interview Questions': 'Prepare for technical interviews',
    'Story Writing': 'Create engaging stories in any genre',
    'Recipe Suggestions': 'Get personalized recipe ideas',
    'Fitness Coach': 'Get workout and nutrition advice',
    'Language Translation': 'Translate text between languages',
    'Grammar Checker': 'Perfect your writing',
    'Math Solver': 'Solve complex math problems',
    'Travel Advice': 'Get travel tips and recommendations',
    'Daily Motivation': 'Start your day with inspiration',
    'Email Writer': 'Create professional and effective emails',
    'Social Media Manager': 'Optimize your social media content',
    'Business Plan': 'Develop comprehensive business strategies',
    'Resume Builder': 'Create standout professional resumes',
    'Project Manager': 'Plan and organize projects effectively',
    'Design Assistant': 'Get expert design recommendations',
    'Research Assistant': 'Conduct thorough research analysis',
    'Video Script': 'Create engaging video content',
    'Financial Advisor': 'Get personalized financial guidance',
    'Presentation Maker': 'Create impactful presentations'
  };
  return descriptions[featureName] || 'Explore this feature';
};

const AIAssistantApp = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAiAssistantChat, setShowAiAssistantChat] = useState(false);
  const [aiAssistantInput, setAiAssistantInput] = useState('');
  const [aiAssistantLanguage, setAiAssistantLanguage] = useState('English');
  const [aiAssistantDescription, setAiAssistantDescription] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // Add user message to chat immediately
    setChatMessages(prev => [...prev, { text: message, sender: 'user' }]);
    setChatInput('');
    setLoading(true);

    try {
      const messages = [];
      
      if (selectedFeature) {
        const template = promptTemplates[selectedFeature.name];
        if (template) {
          // Add system message based on feature type
          if (selectedFeature.name === 'Recipe Suggestions') {
            const data = {
              diet: message.match(/vegetarian|vegan|gluten-free/i)?.[0] || 'any',
              cuisine: message.match(/italian|chinese|indian|mexican|thai|japanese/i)?.[0] || 'any',
              time: message.match(/(\d+)\s*(minutes|hours)/i)?.[0] || 'any',
              skill: message.match(/beginner|intermediate|advanced/i)?.[0] || 'any',
              ingredients: message.match(/with\s([^.!?]+)/i)?.[1] || 'standard pantry items'
            };

            messages.push({
              role: 'system',
              content: template.systemPrompt(data)
            });
          } else if (selectedFeature.name === 'Code Review') {
            const data = {
              language: message.match(/language:\s*([^\n]+)/i)?.[1] || 'unspecified',
              description: message.match(/description:\s*([^\n]+)/i)?.[1] || '',
              code: message.replace(/language:.*\n|description:.*\n/gi, '').trim()
            };

            messages.push({
              role: 'system',
              content: template.systemPrompt(data)
            });
          } else if (selectedFeature.name === 'Story Writing') {
            const data = {
              genre: message.match(/genre:\s*([^\n]+)/i)?.[1] || 'any',
              theme: message.match(/theme:\s*([^\n]+)/i)?.[1] || 'open',
              length: message.match(/length:\s*([^\n]+)/i)?.[1] || 'medium'
            };

            messages.push({
              role: 'system',
              content: template.systemPrompt(data)
            });
          } else {
            // For other features, use the template directly
            const systemPrompt = typeof template.systemPrompt === 'function'
              ? template.systemPrompt({})
              : template.systemPrompt;
            messages.push({ role: 'system', content: systemPrompt });
          }

          // Add user's message
          messages.push({ role: 'user', content: message });

          // Get response from Groq API
          console.log('Sending to Groq:', messages); // Debug log
          const response = await generateResponse(messages);
          console.log('Received from Groq:', response); // Debug log

          // Add AI response to chat
          if (response) {
            setChatMessages(prev => [...prev, {
              text: response,
              sender: 'ai',
              feature: selectedFeature.name
            }]);
          } else {
            throw new Error('No response received from Groq');
          }
        }
      }
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      setChatMessages(prev => [...prev, {
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        error: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature);
    setActiveTab('ai-assistant');
    setChatMessages([]);
    
    const template = promptTemplates[feature.name];
    if (template) {
      if (feature.name === 'Recipe Suggestions') {
        setChatMessages([{
          text: `I'm your personal chef assistant! I can help you find the perfect recipe. Please tell me:
1. Any dietary preferences (vegetarian, vegan, gluten-free, etc.)
2. Cuisine type you're interested in
3. How much time you have for cooking
4. Your cooking skill level
5. Any specific ingredients you want to use

Or simply ask for a recipe suggestion and I'll help you out!`,
          sender: 'ai'
        }]);
      } else {
        setChatMessages([{
          text: `I'm your ${feature.name} assistant. How can I help you today?`,
          sender: 'ai'
        }]);
      }
    }
  };

  const handleLogoClick = () => {
    setActiveTab('home');
  };

  const getFeatureColor = () => {
    return selectedFeature ? selectedFeature.color : 'bg-blue-600';
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
    <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-slate-100 text-gray-700'} font-sans`}>
      {/* Header */}
      <header className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} flex justify-between items-center`}>
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="mr-4">
            <Menu size={24} />
          </button>
          <h1 className="text-2xl font-bold" onClick={handleLogoClick}>AI-Assistant-Bodhi</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={toggleTheme} className={`${isDarkMode ? 'text-yellow-300' : 'text-gray-600'} hover:text-yellow-500`}>
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <button onClick={() => setActiveTab('settings')} className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}>
            <Settings size={24} />
          </button>
          <button onClick={handleLogout} className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}>
            <LogOut size={24} />
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Search size={20} className="mr-2" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full p-2 rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
              />
            </div>
            <div className="flex items-center">
              <Calendar size={20} className="mr-2" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className={`w-full p-2 rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
              />
            </div>
          </div>
          <div className="overflow-y-auto h-3/4">
            <h3 className="font-semibold mb-2">History</h3>
            <ul className="space-y-2">
              {chatHistory.map((chat, index) => (
                <li key={index} className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                  <p className="text-sm">{chat.title}</p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{chat.date}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <ul className="text-xs space-y-1">
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Pricing</a></li>
              <li><a href="#" className="hover:underline">How to use the app</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto">
        {activeTab === 'home' && (
          <div className={`p-6 pb-24 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <header className="mb-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 shadow-lg flex items-center justify-center"
              >
                <svg className="w-24 h-24 text-white" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="45" fill="currentColor" />
                  <path d="M30 70 Q50 30 70 70" stroke="white" strokeWidth="6" fill="none" />
                  <circle cx="40" cy="40" r="5" fill="white" />
                  <circle cx="60" cy="40" r="5" fill="white" />
                  <text
                    x="50%"
                    y="55%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fontSize="40"
                    fontWeight="bold"
                    fill="gray"
                  >
                    B
                  </text>
                </svg>
              </motion.div>

              <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-4xl font-bold mb-2"
                style={{
                  textShadow: isDarkMode
                    ? '0 0.05em 0 #4a5568, 0 0.1em 0 #2d3748, 0 0.15em 0 #1a202c'
                    : '0 0.05em 0 #e2e8f0, 0 0.1em 0 #cbd5e0, 0 0.15em 0 #a0aec0',
                }}
              >
                Meet Bodhi
              </motion.h1>
              <motion.p
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              >
                Your Intelligent AI Assistant
              </motion.p>
            </header>

            <motion.section
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className={`mb-12 p-8 mx-6 rounded-lg shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <h2 className="text-3xl font-bold mb-4 text-center">Get more done with AI</h2>
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  className="px-3 py-2 bg-blue-500 text-white rounded-full shadow-md text-center text-sm sm:text-base w-28 sm:w-auto"
                >
                  Effortless
                </motion.span>
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  className="px-3 py-2 bg-purple-500 text-white rounded-full shadow-md text-center text-sm sm:text-base w-28 sm:w-auto"
                >
                  Revolutionary
                </motion.span>
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  className="px-3 py-2 bg-green-500 text-white rounded-full shadow-md text-center text-sm sm:text-base w-28 sm:w-auto"
                >
                  Accessible
                </motion.span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
              >
                Try Bodhi Now
              </motion.button>
            </motion.section>

            <motion.section
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 mb-20"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  className={`${feature.color} p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow`}
                  onClick={() => handleFeatureClick(feature)}
                >
                  <h3 className="text-white font-semibold text-lg">{feature.name}</h3>
                  <p className="text-white text-sm mt-2 opacity-80">
                    {getFeatureDescription(feature.name)}
                  </p>
                </motion.div>
              ))}
            </motion.section>
          </div>
        )}

        {activeTab === 'ai-assistant' && (
          <div className="flex flex-col h-[calc(100vh-8rem)]">
            {!showAiAssistantChat ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-4 p-4"
              >
                <h2 className="text-xl font-semibold mb-2">
                  {selectedFeature ? selectedFeature.name : 'AI Assistant'}
                </h2>

                <motion.textarea
                  value={aiAssistantInput}
                  onChange={(e) => setAiAssistantInput(e.target.value)}
                  className={`w-full p-2 rounded-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                  placeholder={`Enter your ${selectedFeature ? selectedFeature.name.toLowerCase() : 'AI assistant'} request here...`}
                  rows={5}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                />

                <motion.select
                  value={aiAssistantLanguage}
                  onChange={(e) => setAiAssistantLanguage(e.target.value)}
                  className={`w-full p-2 rounded-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Chinese</option>
                </motion.select>

                <motion.input
                  type="text"
                  value={aiAssistantDescription}
                  onChange={(e) => setAiAssistantDescription(e.target.value)}
                  className={`w-full p-2 rounded-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                  placeholder="Add a description (optional)"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                />

                <motion.button
                  onClick={() => {
                    setIsLoading(true);
                    setShowAiAssistantChat(true);
                    handleSendMessage(aiAssistantInput);
                  }}
                  className={`w-full text-white px-4 py-2 rounded-lg ${getFeatureColor()}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  Submit
                </motion.button>
              </motion.div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex-grow overflow-y-auto p-4 space-y-4 mb-16">
                  {chatMessages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: message.sender === 'user' ? 100 : -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-3/4 p-4 rounded-lg shadow-lg ${
                          message.sender === 'user'
                            ? getFeatureColor() + ' text-white'
                            : isDarkMode
                              ? 'bg-gray-700 text-white'
                              : 'bg-gray-300 text-black'
                        }`}
                      >
                        {message.sender === 'ai' ? (
                          <div className="prose prose-sm dark:prose-invert">
                            {message.text.split('\n').map((line, i) => {
                              // Check if line is a code block
                              if (line.startsWith('```')) {
                                const language = line.slice(3);
                                return (
                                  <pre key={i} className={`language-${language} bg-gray-800 text-gray-100 p-4 rounded-md my-2 overflow-x-auto`}>
                                    <code>{line}</code>
                                  </pre>
                                );
                              }
                              // Check if line is a bullet point
                              else if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                                return (
                                  <div key={i} className="flex items-start space-x-2 my-1">
                                    <span className="text-blue-400">•</span>
                                    <span>{line.trim().slice(1)}</span>
                                  </div>
                                );
                              }
                              // Check if line is a heading
                              else if (line.startsWith('#')) {
                                const level = line.match(/^#+/)[0].length;
                                const text = line.slice(level).trim();
                                const headingClass = `text-${['2xl', 'xl', 'lg'][level - 1] || 'base'} font-bold my-2`;
                                return <div key={i} className={headingClass}>{text}</div>;
                              }
                              // Check if line contains important text (between asterisks)
                              else if (line.includes('*')) {
                                return (
                                  <div key={i} className="my-1">
                                    {line.split(/(\*[^\*]+\*)/).map((part, j) => {
                                      if (part.startsWith('*') && part.endsWith('*')) {
                                        return <span key={j} className="font-bold text-blue-400">{part.slice(1, -1)}</span>;
                                      }
                                      return <span key={j}>{part}</span>;
                                    })}
                                  </div>
                                );
                              }
                              // Regular text line
                              else if (line.trim()) {
                                return <div key={i} className="my-1">{line}</div>;
                              }
                              // Empty line for spacing
                              return <div key={i} className="h-2"></div>;
                            })}
                          </div>
                        ) : (
                          <div>{message.text}</div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className={`fixed bottom-16 left-0 right-0 p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className={`flex items-center ${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg shadow-lg`}>
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(chatInput);
                        }
                      }}
                      className={`flex-grow bg-transparent p-4 outline-none ${isDarkMode ? 'text-white' : 'text-black'}`}
                      placeholder="Type your message..."
                    />
                    <button 
                      onClick={() => handleSendMessage(chatInput)}
                      className={`p-4 ${getFeatureColor()} text-white rounded-r-lg hover:opacity-90 transition-opacity`}
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <Dashboard isDarkMode={isDarkMode} />
        )}

        {activeTab === 'notifications' && (
          <NotificationsTab isDarkMode={isDarkMode} notifications={notifications} />
        )}

        {activeTab === 'profile' && (
          <ProfileTab isDarkMode={isDarkMode} />
        )}
      </main>

    </div>
      <BottomNav 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
      />
      </>
  );
};

export default AIAssistantApp;