'use client';
import { Menu, Sun, Moon, Settings, LogOut, X } from 'lucide-react';
import { useState } from 'react';

const Header = ({ isDarkMode, toggleTheme, toggleSidebar, handleLogoClick, handleLogout, setActiveTab }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = async () => {
    try {
      setIsLoggingOut(true);
      await handleLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg z-40`}>
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center space-x-4">
            <button onClick={toggleSidebar} className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}>
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
            <button 
              onClick={() => setShowLogoutModal(true)} 
              disabled={isLoggingOut}
              className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <LogOut size={24} className={isLoggingOut ? 'animate-pulse' : ''} />
            </button>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl transform transition-all`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Confirm Logout</h3>
              <button 
                onClick={() => setShowLogoutModal(false)}
                className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'}`}
              >
                <X size={20} />
              </button>
            </div>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className={`px-4 py-2 rounded-md ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutClick}
                disabled={isLoggingOut}
                className={`px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 ${
                  isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
