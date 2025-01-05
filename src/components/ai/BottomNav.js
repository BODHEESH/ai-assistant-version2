'use client';
import { Home, MessageSquare, Bell, User, Bot, BarChart2, Settings } from 'lucide-react';

const BottomNav = ({ activeTab, setActiveTab, isDarkMode }) => {
  const navItems = [
    { name: 'Home', icon: Home, id: 'home' },
    { name: 'Bodhi-AI', icon: Bot, id: 'ai-assistant' },
    { name: 'Chat', icon: MessageSquare, id: 'chat' },
    { name: 'Dashboard', icon: BarChart2, id: 'dashboard' },
    { name: 'Profile', icon: User, id: 'profile' },
    { name: 'Settings', icon: Settings, id: 'settings' }
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg z-50`}>
      <div className="flex justify-around items-center p-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              activeTab === item.id
                ? `${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`
                : `${isDarkMode ? 'text-gray-400' : 'text-gray-600'} hover:${
                    isDarkMode ? 'text-gray-300' : 'text-gray-900'
                  }`
            }`}
          >
            <item.icon size={20} className="mb-0.5" />
            <span className="text-[10px] leading-tight">{item.name}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;