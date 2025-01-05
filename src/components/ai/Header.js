'use client';
import { Menu, Sun, Moon, Settings, LogOut } from 'lucide-react';

const Header = ({ isDarkMode, toggleTheme, toggleSidebar, handleLogoClick, handleLogout, setActiveTab }) => {
  return (
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
  );
};

export default Header;
