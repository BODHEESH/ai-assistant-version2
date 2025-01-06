'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Bell, Globe, Lock, HelpCircle, User, Shield } from 'lucide-react';

const SettingsPage = ({ isDarkMode, setIsDarkMode }) => {
  const settingsCategories = [
    {
      title: 'Appearance',
      icon: isDarkMode ? Moon : Sun,
      items: [
        {
          name: 'Theme',
          description: 'Toggle between light and dark mode',
          action: () => setIsDarkMode(!isDarkMode),
          value: isDarkMode ? 'Dark' : 'Light',
          isToggle: true,
          enabled: isDarkMode
        }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          name: 'Push Notifications',
          description: 'Get notified about new messages',
          isToggle: true,
          enabled: true
        },
        {
          name: 'Email Notifications',
          description: 'Receive email updates',
          isToggle: true,
          enabled: false
        }
      ]
    },
    {
      title: 'Language & Region',
      icon: Globe,
      items: [
        {
          name: 'Language',
          description: 'Choose your preferred language',
          value: 'English',
          isToggle: false
        },
        {
          name: 'Time Zone',
          description: 'Set your local time zone',
          value: 'UTC+05:30',
          isToggle: false
        }
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Lock,
      items: [
        {
          name: 'Two-Factor Authentication',
          description: 'Add an extra layer of security',
          isToggle: true,
          enabled: false
        },
        {
          name: 'Data Usage',
          description: 'Manage how your data is used',
          isToggle: false
        }
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Settings
      </h1>

      <div className="space-y-8">
        {settingsCategories.map((category, index) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}
            >
              <div className="flex items-center mb-4">
                <Icon className={`w-6 h-6 mr-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <h2 className="text-xl font-semibold">{category.title}</h2>
              </div>

              <div className="space-y-4">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.description}
                      </p>
                    </div>
                    {item.isToggle ? (
                      <button
                        onClick={item.action}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          item.enabled
                            ? 'bg-blue-600'
                            : isDarkMode
                            ? 'bg-gray-600'
                            : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            item.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    ) : (
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.value}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SettingsPage;
