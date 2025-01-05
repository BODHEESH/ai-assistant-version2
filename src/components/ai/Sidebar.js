'use client';
import { Search, Calendar, X } from 'lucide-react';

const Sidebar = ({ 
  isDarkMode, 
  sidebarOpen, 
  sidebarRef, 
  setSidebarOpen, 
  activeTab, 
  searchTerm, 
  setSearchTerm, 
  dateFilter, 
  setDateFilter, 
  chatHistory 
}) => {
  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-full w-64 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-gray-700">
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

export default Sidebar;
