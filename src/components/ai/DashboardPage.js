'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Filter, ArrowUpDown } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  // Dummy data
  const stats = {
    totalChats: 6,
    codeReviews: 8,
    totalResponses: 14
  };

  const activityData = {
    labels: ['2024-09-11', '2024-09-12', '2024-09-13', '2024-09-14'],
    datasets: [
      {
        label: 'Activity',
        data: [1, 1, 4, 2],
        borderColor: '#60A5FA',
        backgroundColor: 'rgba(96, 165, 250, 0.5)',
        tension: 0.4
      },
      {
        label: 'Responses',
        data: [1, 1, 3, 3],
        borderColor: '#34D399',
        backgroundColor: 'rgba(52, 211, 153, 0.5)',
        tension: 0.4
      }
    ]
  };

  const distributionData = {
    labels: ['Code Review', 'Chats', 'Fitness Coach', 'Poem', 'Story'],
    datasets: [{
      data: [8, 6, 3, 2, 1],
      backgroundColor: [
        '#60A5FA',
        '#34D399',
        '#FBBF24',
        '#F87171',
        '#A78BFA'
      ]
    }]
  };

  const pieData = {
    labels: ['Chat', 'Code Review'],
    datasets: [{
      data: [43, 57],
      backgroundColor: [
        '#34D399',
        '#60A5FA'
      ]
    }]
  };

  const chatHistory = [
    { title: 'Wayanad landslide', date: '14/09/2024', type: 'chat' },
    { title: 'Code Review: JavaScript', date: '14/09/2024', type: 'code' },
    { title: 'Code Review: Java', date: '14/09/2024', type: 'code' },
    { title: 'Create a documentation', date: '14/09/2024', type: 'chat' },
    { title: 'How to sleep in two minutes', date: '14/09/2024', type: 'chat' },
    { title: 'Tell me a story', date: '14/09/2024', type: 'chat' }
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: isDarkMode ? '#E5E7EB' : '#374151'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: isDarkMode ? '#E5E7EB' : '#374151'
        }
      },
      x: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: isDarkMode ? '#E5E7EB' : '#374151'
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: isDarkMode ? '#E5E7EB' : '#374151'
        }
      }
    }
  };

  const filteredHistory = chatHistory
    .filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!dateFilter || item.date.includes(dateFilter))
    )
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'date') {
        return direction * (new Date(b.date) - new Date(a.date));
      }
      return direction * (a.title.localeCompare(b.title));
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Object.entries(stats).map(([key, value]) => (
          <motion.div
            key={key}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          >
            <h3 className="text-lg font-semibold mb-2">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </h3>
            <p className="text-3xl font-bold">{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          style={{ height: '300px' }}
        >
          <h3 className="text-lg font-semibold mb-4">Activity Over Time</h3>
          <Line data={activityData} options={chartOptions} />
        </motion.div>

        <motion.div
          className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          style={{ height: '300px' }}
        >
          <h3 className="text-lg font-semibold mb-4">Chat vs Code Review</h3>
          <Pie data={pieData} options={pieOptions} />
        </motion.div>
      </div>

      <motion.div
        className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg mb-8`}
        style={{ height: '300px' }}
      >
        <h3 className="text-lg font-semibold mb-4">Feature Distribution</h3>
        <Bar data={distributionData} options={chartOptions} />
      </motion.div>

      {/* History Table */}
      <motion.div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg p-6`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h3 className="text-lg font-semibold whitespace-nowrap">History</h3>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                } border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}
              />
            </div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
              } border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <th
                  className="py-3 text-left cursor-pointer"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center gap-2">
                    Title
                    <ArrowUpDown size={16} />
                  </div>
                </th>
                <th
                  className="py-3 text-left cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-2">
                    Date
                    <ArrowUpDown size={16} />
                  </div>
                </th>
                <th className="py-3 text-left">Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <td className="py-3">{item.title}</td>
                  <td className="py-3">{item.date}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        item.type === 'chat'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;
