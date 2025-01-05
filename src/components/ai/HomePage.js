'use client';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const HomePage = ({ isDarkMode, features, handleFeatureClick }) => {
  return (
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
              className={`flex items-center justify-between ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
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
  );
};

export default HomePage;
