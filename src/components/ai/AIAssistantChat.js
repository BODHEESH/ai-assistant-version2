'use client';
import { motion, useEffect } from 'framer-motion';
import { Send } from 'lucide-react';

const AIAssistantChat = ({ 
  isDarkMode, 
  isLoading, 
  showAiAssistantChat, 
  selectedFeature,
  aiAssistantInput,
  setAiAssistantInput,
  aiAssistantLanguage,
  setAiAssistantLanguage,
  aiAssistantDescription,
  setAiAssistantDescription,
  chatMessages,
  chatInput,
  setChatInput,
  getFeatureColor,
  setShowAiAssistantChat,
  setIsLoading,
  selectedChat
}) => {
  useEffect(() => {
    if (selectedChat) {
      setAiAssistantInput(selectedChat.content || '');
      setShowAiAssistantChat(true);
    }
  }, [selectedChat]);

  return (
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
            <div className="loader"></div>
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
                  <div className={`max-w-3/4 p-2 rounded-lg ${
                    message.sender === 'user'
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
                <button className="p-2">
                  <Send size={20} className={isDarkMode ? 'text-white' : 'text-black'} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AIAssistantChat;
