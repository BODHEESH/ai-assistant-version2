'use client';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import Image from 'next/image';

const ProfileTab = ({ isDarkMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center mb-6"
      >
        <div className="relative">
          <Image
            src="https://imgcdn.stablediffusionweb.com/2024/4/12/3b464fee-5501-43b7-8ada-d3d25acf94d7.jpg"
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full"
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
      </motion.div>
    </motion.div>
  );
};

export default ProfileTab;
