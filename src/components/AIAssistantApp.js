'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, Send, Heart, MessageSquare, AlertTriangle, Camera, Settings, LogOut, Sun, Moon, Home, Bell, User, BarChart2, Bot, Menu, Search, Calendar, X, Filter, Mail, Phone, Linkedin, Github, Briefcase, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, BarChart, Bar, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const AIAssistantApp = () => {
    const [activeTab, setActiveTab] = useState('home');
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [aiAssistantInput, setAiAssistantInput] = useState('');
    const [aiAssistantLanguage, setAiAssistantLanguage] = useState('English');
    const [aiAssistantDescription, setAiAssistantDescription] = useState('');
    const [showAiAssistantChat, setShowAiAssistantChat] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [chatHistoryFilter, setChatHistoryFilter] = useState('');
    const [codeReviewHistoryFilter, setCodeReviewHistoryFilter] = useState('');
    const [allHistoryFilter, setAllHistoryFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [settings, setSettings] = useState({
        emailNotifications: false,
        darkMode: false,
        language: 'English',
        profileVisibility: 'Public',
        dataSharing: false,
    });

    const startLoading = () => {
        setIsLoading(true);
        isSending(true);


        // Simulate a delay and stop loading
        setTimeout(() => {
            setIsLoading(false) 
            setIsSending(false)
    }, 3000);
    };

    useEffect(() => {
        // Check if there's a theme preference in localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
        } else {
            // If no preference, check system preference
            setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
    }, []);

    useEffect(() => {
        // Apply theme to document
        document.documentElement.classList.toggle('dark', isDarkMode);
        // Save theme preference to localStorage
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const handleSaveChanges = () => {
        // Logic to save changes, e.g., update state or make an API call
        console.log('Saving changes:', settings);
    };

    const notifications = [
        { id: 1, type: 'like', message: 'John liked your post', time: '2h ago' },
        { id: 2, type: 'comment', message: 'New comment on your story', time: '3h ago' },
        { id: 3, type: 'alert', message: 'Your subscription is expiring soon', time: '1d ago' },
        { id: 4, type: 'like', message: 'Sarah liked your comment', time: '2d ago' },
    ];

    const activityData = [
        { date: '2024-09-11', chats: 1, codeReviews: 1 },
        { date: '2024-09-12', chats: 1, codeReviews: 1 },
        { date: '2024-09-13', chats: 4, codeReviews: 3 },
        { date: '2024-09-14', chats: 2, codeReviews: 3 },
    ];

    const skillDistribution = [
        { name: 'JavaScript', count: 10 },
        { name: 'React', count: 8 },
        { name: 'Node.js', count: 7 },
        { name: 'MongoDB', count: 5 },
        { name: 'Express.js', count: 6 },
    ];

    const chatHistory = [
        { title: 'Wayanad landslide', date: '14/09/2024' },
        { title: 'Tajmahal built details?', date: '14/09/2024' },
        { title: 'Create a documentation about t...', date: '14/09/2024' },
        { title: 'How to sleep in two minutes...', date: '14/09/2024' },
        { title: 'Give me a good night message...', date: '14/09/2024' },
        { title: 'Tell me a story', date: '14/09/2024' },
    ];

    const codeReviewHistory = [
        { title: 'Code Review: JavaScript', date: '14/09/2024' },
        { title: 'Code Review: Java', date: '14/09/2024' },
        { title: 'Code Review: Java', date: '14/09/2024' },
        { title: 'Code Review: Java', date: '14/09/2024' },
        { title: 'Code Review: JavaScript', date: '14/09/2024' },
        { title: 'Code Review: Python', date: '14/09/2024' },
        { title: 'Code Review: JavaScript', date: '13/09/2024' },
    ];

    const handleSendMessage = (message, isAiAssistant = false) => {
        if (message.trim()) {
            setChatMessages([...chatMessages, { text: message, sender: 'user' }]);
            if (!isAiAssistant) {
                setChatInput('');
            }
            setTimeout(() => {
                setChatMessages(prev => [...prev, { text: "This is a simulated AI response.", sender: 'ai' }]);
            }, 1000);
        }
    };

    const handleAiAssistantSubmit = () => {
        setShowAiAssistantChat(true);
        handleSendMessage(`${aiAssistantInput}\n\nLanguage: ${aiAssistantLanguage}\nDescription: ${aiAssistantDescription}`, true);
        setAiAssistantInput('');
        setAiAssistantDescription('');
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'like': return <Heart size={20} className="text-red-500" />;
            case 'comment': return <MessageSquare size={20} className="text-blue-500" />;
            case 'alert': return <AlertTriangle size={20} className="text-yellow-500" />;
            default: return null;
        }
    };

    const navItems = [
        { name: 'Home', icon: Home, id: 'home' },
        { name: selectedFeature ? selectedFeature.name : 'AI Assistant', icon: Bot, id: 'ai-assistant' },
        { name: 'Chat', icon: MessageSquare, id: 'chat' },
        { name: 'Dashboard', icon: BarChart2, id: 'dashboard' },
        { name: 'Profile', icon: User, id: 'profile' },
        { name: 'Notifications', icon: Bell, id: 'notifications' }
    ];

    const features = [
        { name: 'Chat Assistant', color: 'bg-blue-600' },
        { name: 'Code Review', color: 'bg-green-600' },
        { name: 'Story Writing', color: 'bg-purple-600' },
        { name: 'Create Poem', color: 'bg-pink-600' },
        { name: 'Ask Anything', color: 'bg-yellow-600' },
        { name: 'Language Translation', color: 'bg-red-600' },
        { name: 'Recipe Suggestions', color: 'bg-orange-600' },
        { name: 'Fitness Coach', color: 'bg-teal-600' },
        { name: 'Music Recommendations', color: 'bg-indigo-600' }
    ];

    const handleFeatureClick = (feature) => {
        setSelectedFeature(feature);
        setActiveTab('ai-assistant');
    };


    const handleLogoClick = () => {
        setActiveTab('home');
    };

    const getFeatureColor = () => {
        return selectedFeature ? selectedFeature.color : 'bg-blue-600';
    };


    const handleLogout = () => {
        // Implement logout logic here
        console.log('Logging out...');
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const chatVsCodeReviewData = [
        { name: 'Chat', value: 30 },
        { name: 'Code Review', value: 35 },
        { name: 'Fitness', value: 15 },
        { name: 'Poem', value: 10 },
    ];


    const featureDistribution = [
        { name: 'Code Review', count: 8 },
        { name: 'Chats', count: 6 },
        { name: 'Fitness Coach', count: 3 },
        { name: 'Poem', count: 2 },
        { name: 'Story', count: 1 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const renderHistorySection = (title, data, filterState, setFilterState) => (
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} p-4 rounded-lg`}>
            <h3 className="font-bold mb-2">{title}</h3>
            <div className="flex mb-2 space-x-2">
                <input
                    type="text"
                    placeholder="Search..."
                    value={filterState}
                    onChange={(e) => setFilterState(e.target.value)}
                    className={`flex-grow ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'} p-1 rounded`}
                />
                <button className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'} p-1 rounded`}>
                    <Filter size={20} />
                </button>
            </div>
            <ul className="space-y-2">
                {data
                    .filter(item => item.title.toLowerCase().includes(filterState.toLowerCase()))
                    .map((item, index) => (
                        <li key={index} className="flex justify-between">
                            <span>{item.title}</span>
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{item.date}</span>
                        </li>
                    ))}
            </ul>
        </div>
    );

    const renderSidebar = () => {
        return (
            <div className={`fixed top-0 left-0 h-full w-64 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
                        <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
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
        );
    };

    return (
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

            {/* Main Content */}
            <main className="flex-grow overflow-y-auto">
                {activeTab === 'home' && (
                    <div className={`p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
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
                            className="mb-6"
                        >
                            <h3 className="text-2xl font-semibold mb-4">Product Features</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {features.map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ scale: 1.05, rotate: 1 }}
                                        className={`flex items-center justify-between ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                                            } p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition duration-300`}
                                        onClick={() => handleFeatureClick(feature)}
                                    >
                                        <span className="text-lg">{feature.name}</span>
                                        <ChevronRight size={24} className="text-blue-500" />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>
                    </div>
                )}

                {activeTab === 'ai-assistant' && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="p-4"
                    >
                        <div className="p-4">
                            {/* Spinner for loading */}
                            {isLoading && (
                                <div className="flex justify-center items-center mb-4">
                                    <div className="loader"></div> {/* Spinner CSS included below */}
                                </div>
                            )}

                            {!showAiAssistantChat ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="space-y-4"
                                >
                                    <h2 className="text-xl font-semibold mb-2">
                                        {selectedFeature ? selectedFeature.name : 'AI Assistant'}
                                    </h2>

                                    {/* Textarea for AI Assistant input */}
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

                                    {/* Language selection dropdown */}
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

                                    {/* Description input */}
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

                                    {/* Submit Button */}
                                    <motion.button
                                        onClick={() => {
                                            setIsLoading(true);
                                            setShowAiAssistantChat(true);
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
                                    <div className="flex-grow overflow-y-auto p-4 space-y-4">
                                        {chatMessages.map((message, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: message.sender === 'user' ? 100 : -100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.4 }}
                                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-3/4 p-2 rounded-lg ${message.sender === 'user'
                                                    ? getFeatureColor() + ' text-white'
                                                    : isDarkMode
                                                        ? 'bg-gray-700 text-white'
                                                        : 'bg-gray-300 text-black'
                                                    }`}>
                                                    {message.text}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Chat Input Box */}
                                    <motion.div
                                        className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <div className={`flex items-center ${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg`}>
                                            <input
                                                type="text"
                                                value={chatInput}
                                                onChange={(e) => setChatInput(e.target.value)}
                                                className={`flex-grow bg-transparent p-2 outline-none ${isDarkMode ? 'text-white' : 'text-black'}`}
                                                placeholder="Type your message..."
                                            />
                                            <button onClick={() => {/* handle send message */ }} className="p-2">
                                                <Send size={20} className={isDarkMode ? 'text-white' : 'text-black'} />
                                            </button>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'chat' && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col h-full"
                    >
                        <div className="flex flex-col h-full">
                            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                                {/* Loop through messages */}
                                {chatMessages.map((message, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: message.sender === 'user' ? 100 : -100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-3/4 p-2 rounded-lg ${message.sender === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : isDarkMode
                                                ? 'bg-gray-700 text-white'
                                                : 'bg-gray-300 text-black'
                                            }`}>
                                            {message.text}
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Loading spinner while sending */}
                                {isSending && (
                                    <div className="flex justify-end">
                                        <div className="loader"></div> {/* Spinner CSS provided below */}
                                    </div>
                                )}
                            </div>

                            {/* Input for sending messages */}
                            <div className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                                <div className={`flex items-center ${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg`}>
                                    <input
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        className={`flex-grow bg-transparent p-2 outline-none ${isDarkMode ? 'text-white' : 'text-black'}`}
                                        placeholder="Type your message..."
                                    />

                                    {/* Send button with hover animation */}
                                    <motion.button
                                        onClick={handleSendMessage}
                                        className="p-2"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Send size={20} className={isDarkMode ? 'text-white' : 'text-black'} />
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'notifications' && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="p-4"
                    >
                        <h2 className="text-xl font-semibold mb-4">Notifications</h2>

                        {/* Notification container with space between notifications */}
                        <div className="space-y-4">
                            {/* Iterate through notifications */}
                            {notifications.map((notification, index) => (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className={`flex items-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} p-3 rounded-lg`}
                                >
                                    {/* Notification icon with hover animation */}
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        className="mr-3"
                                    >
                                        {getNotificationIcon(notification.type)}
                                    </motion.div>

                                    <div className="flex-grow">
                                        <p className="text-sm">{notification.message}</p>
                                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {notification.time}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'profile' && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="p-4"
                    >
                        {/* Profile Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex items-center mb-6"
                        >
                            <div className="relative">
                                <img
                                    src="https://imgcdn.stablediffusionweb.com/2024/4/12/3b464fee-5501-43b7-8ada-d3d25acf94d7.jpg"
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                                <button
                                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition duration-300"
                                >
                                    <Camera size={20} />
                                </button>
                            </div>
                            <div className="ml-4">
                                <h2 className="text-2xl font-bold">Virtual User</h2>
                                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>virtual.user@example.com</p>
                            </div>
                        </motion.div>

                        {/* Profile Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="grid grid-cols-3 gap-4 mb-6"
                        >
                            <motion.div
                                className={`text-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} p-4 rounded-lg hover:scale-105 transition-transform duration-300`}
                            >
                                <p className="font-bold text-xl">64</p>
                                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Chat Assistant</p>
                            </motion.div>
                            <motion.div
                                className={`text-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} p-4 rounded-lg hover:scale-105 transition-transform duration-300`}
                            >
                                <p className="font-bold text-xl">842</p>
                                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Code Review</p>
                            </motion.div>
                            <motion.div
                                className={`text-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} p-4 rounded-lg hover:scale-105 transition-transform duration-300`}
                            >
                                <p className="font-bold text-xl">620</p>
                                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Story Writing</p>
                            </motion.div>
                            <motion.div
                                className={`text-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} p-4 rounded-lg hover:scale-105 transition-transform duration-300`}
                            >
                                <p className="font-bold text-xl">256</p>
                                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Create Poem</p>
                            </motion.div>
                            <motion.div
                                className={`text-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} p-4 rounded-lg hover:scale-105 transition-transform duration-300`}
                            >
                                <p className="font-bold text-xl">852</p>
                                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Ask Anything</p>
                            </motion.div>
                            <motion.div
                                className={`text-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} p-4 rounded-lg hover:scale-105 transition-transform duration-300`}
                            >
                                <p className="font-bold text-xl">797</p>
                                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Language Translation</p>
                            </motion.div>
                            <motion.div
                                className={`text-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} p-4 rounded-lg hover:scale-105 transition-transform duration-300`}
                            >
                                <p className="font-bold text-xl">222</p>
                                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Recipe Suggestions</p>
                            </motion.div>
                            <motion.div
                                className={`text-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} p-4 rounded-lg hover:scale-105 transition-transform duration-300`}
                            >
                                <p className="font-bold text-xl">785</p>
                                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Fitness Coach</p>
                            </motion.div>
                            <motion.div
                                className={`text-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} p-4 rounded-lg hover:scale-105 transition-transform duration-300`}
                            >
                                <p className="font-bold text-xl">999</p>
                                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Music Recommendations</p>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}

                {activeTab === 'dashboard' && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4"
                    >
                        {/* Total Chats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} p-4 rounded-lg hover:scale-105 transition-transform duration-300`}
                        >
                            <h3 className="font-bold mb-2">Total Chats</h3>
                            <p className="text-2xl">6</p>
                        </motion.div>

                        {/* Code Reviews */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} p-4 rounded-lg hover:scale-105 transition-transform duration-300`}
                        >
                            <h3 className="font-bold mb-2">Code Reviews</h3>
                            <p className="text-2xl">8</p>
                        </motion.div>

                        {/* Total Responses */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} p-4 rounded-lg hover:scale-105 transition-transform duration-300`}
                        >
                            <h3 className="font-bold mb-2">Total Responses</h3>
                            <p className="text-2xl">14</p>
                        </motion.div>

                        {/* Chat vs Code Review Pie Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} p-4 rounded-lg col-span-1 lg:col-span-1 flex flex-col items-center`}
                        >
                            <h3 className="font-bold mb-2">Chat vs Code Review</h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={chatVsCodeReviewData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {chatVsCodeReviewData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="mt-2 text-center">
                                <p>Chat: 43%</p>
                                <p>Code Review: 57%</p>
                            </div>
                        </motion.div>

                        {/* Activity Over Time Line Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} p-4 rounded-lg col-span-1 lg:col-span-1`}
                        >
                            <h3 className="font-bold mb-2">Activity Over Time</h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={activityData}>
                                    <XAxis dataKey="date" stroke={isDarkMode ? "#fff" : "#000"} />
                                    <YAxis stroke={isDarkMode ? "#fff" : "#000"} />
                                    <Line type="monotone" dataKey="chats" stroke="#8884d8" />
                                    <Line type="monotone" dataKey="codeReviews" stroke="#82ca9d" />
                                </LineChart>
                            </ResponsiveContainer>
                        </motion.div>

                        {/* Feature Distribution Bar Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.0 }}
                            className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} p-4 rounded-lg col-span-1 lg:col-span-1`}
                        >
                            <h3 className="font-bold mb-2">Feature Distribution</h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={featureDistribution}>
                                    <XAxis dataKey="name" stroke={isDarkMode ? "#fff" : "#000"} />
                                    <YAxis stroke={isDarkMode ? "#fff" : "#000"} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#8884d8">
                                        {featureDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </motion.div>

                        {/* History Sections */}
                        {renderHistorySection("Chat History", chatHistory, chatHistoryFilter, setChatHistoryFilter)}
                        {renderHistorySection("Code Review History", codeReviewHistory, codeReviewHistoryFilter, setCodeReviewHistoryFilter)}
                        {renderHistorySection("Liked Responses", [...chatHistory, ...codeReviewHistory].sort((a, b) => new Date(b.date) - new Date(a.date)), allHistoryFilter, setAllHistoryFilter)}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.2 }}
                            className="col-span-full w-full"
                        >
                            {renderHistorySection(
                                "All History",
                                [...chatHistory, ...codeReviewHistory].sort((a, b) => new Date(b.date) - new Date(a.date)),
                                allHistoryFilter,
                                setAllHistoryFilter
                            )}
                        </motion.div>
                    </motion.div>
                )}


                {activeTab === 'settings' && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="p-4"
                    >
                        <h2 className="text-xl font-semibold mb-4">Settings</h2>
                        <div className="space-y-4">
                            {/* Account Settings */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} p-4 rounded-lg hover:scale-105 transition-transform duration-300`}
                            >
                                <h3 className="font-bold mb-2">Account Settings</h3>
                                <ul className="space-y-2">
                                    <li className="flex justify-between items-center">
                                        <span>Email Notifications</span>
                                        <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span>Dark Mode</span>
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-5 w-5 text-blue-600"
                                            checked={isDarkMode}
                                            onChange={toggleTheme}
                                        />
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span>Language</span>
                                        <select className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded p-1`}>
                                            <option>English</option>
                                            <option>Spanish</option>
                                            <option>French</option>
                                        </select>
                                    </li>
                                </ul>
                            </motion.div>

                            {/* Privacy Settings */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} p-4 rounded-lg hover:scale-105 transition-transform duration-300`}
                            >
                                <h3 className="font-bold mb-2">Privacy Settings</h3>
                                <ul className="space-y-2">
                                    <li className="flex justify-between items-center">
                                        <span>Profile Visibility</span>
                                        <select className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded p-1`}>
                                            <option>Public</option>
                                            <option>Friends Only</option>
                                            <option>Private</option>
                                        </select>
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span>Data Sharing</span>
                                        <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
                                    </li>
                                </ul>
                            </motion.div>

                            {/* Save Changes Button */}
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSaveChanges}
                            >
                                Save Changes
                            </motion.button>
                        </div>
                    </motion.div>
                )}

            </main>

            {/* Navigation */}
            <nav className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4`}>
                <ul className="flex justify-around items-center">
                    {navItems.map((item) => (
                        <li
                            key={item.id}
                            className={`cursor-pointer ${activeTab === item.id ? 'text-blue-500' : ''} flex flex-col items-center`}
                            onClick={() => {
                                setActiveTab(item.id);
                                if (item.id === 'ai-assistant') setShowAiAssistantChat(false);
                            }}
                        >
                            <item.icon size={24} className="mb-1" />
                            <span className="hidden sm:inline text-xs">{item.name}</span>
                        </li>
                    ))}
                </ul>
            </nav>
            {/* Sidebar */}
            {renderSidebar()}
        </div>
    );
};

export default AIAssistantApp;


