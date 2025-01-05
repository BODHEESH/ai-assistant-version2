// src/components/ai/SettingsTab.js
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Bell, Globe, Lock, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsTab({ isDarkMode, setIsDarkMode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('en');

  const settings = [
    {
      title: 'Theme',
      description: 'Choose between light and dark mode',
      icon: isDarkMode ? Moon : Sun,
      component: (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`px-4 py-2 rounded-lg ${
              isDarkMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {isDarkMode ? 'Dark' : 'Light'}
          </button>
        </div>
      ),
    },
    {
      title: 'Notifications',
      description: 'Manage your notification preferences',
      icon: Bell,
      component: (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      ),
    },
    {
      title: 'Language',
      description: 'Choose your preferred language',
      icon: Globe,
      component: (
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
        </select>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* User Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">Settings</h2>
          <div className="space-y-6">
            {settings.map((setting, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-4">
                  <setting.icon className="w-5 h-5 text-gray-500" />
                  <div>
                    <h3 className="font-medium">{setting.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {setting.description}
                    </p>
                  </div>
                </div>
                {setting.component}
              </div>
            ))}
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">Account</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <User className="w-5 h-5 text-gray-500" />
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.email || 'Not available'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Lock className="w-5 h-5 text-gray-500" />
              <div>
                <h3 className="font-medium">Account Type</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.emailVerified ? 'Verified Account' : 'Unverified Account'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}