'use client';
import { Home, Bot, MessageSquare, BarChart2, User, Bell } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab, selectedFeature }) => {
  const navItems = [
    { name: 'Home', icon: Home, id: 'home' },
    { name: selectedFeature ? selectedFeature.name : 'AI Assistant', icon: Bot, id: 'ai-assistant' },
    { name: 'Chat', icon: MessageSquare, id: 'chat' },
    { name: 'Dashboard', icon: BarChart2, id: 'dashboard' },
    { name: 'Profile', icon: User, id: 'profile' },
    { name: 'Notifications', icon: Bell, id: 'notifications' }
  ];

  return (
    <nav className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              activeTab === item.id
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
          >
            <Icon size={24} />
            <span className="text-xs mt-1">{item.name}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;
