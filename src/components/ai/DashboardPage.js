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
import { db, auth } from '@/config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

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

const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

const DashboardPage = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [stats, setStats] = useState({
    totalChats: 0,
    assistantTypes: 0,
    totalResponses: 0
  });
  const [activityData, setActivityData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Chats',
        data: [],
        borderColor: '#60A5FA',
        backgroundColor: 'rgba(96, 165, 250, 0.5)',
        tension: 0.4
      },
      {
        label: 'AI Responses',
        data: [],
        borderColor: '#34D399',
        backgroundColor: 'rgba(52, 211, 153, 0.5)',
        tension: 0.4
      }
    ]
  });
  const [distributionData, setDistributionData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#60A5FA',
        '#34D399',
        '#FBBF24',
        '#F87171',
        '#A78BFA'
      ]
    }]
  });
  const [chatHistory, setChatHistory] = useState([]);
  const [pieData, setPieData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#34D399',
        '#60A5FA'
      ]
    }]
  });
  const [chartOptions, setChartOptions] = useState({
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
  });
  const [pieOptions, setPieOptions] = useState({
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
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!auth.currentUser) return;

      try {
        // Simple query without ordering
        const chatsQuery = query(
          collection(db, 'chats'),
          where('userId', '==', auth.currentUser.uid)
        );
        
        const chatsSnapshot = await getDocs(chatsQuery);
        
        // Process messages
        const processedChats = [];
        const chatGroups = new Map(); // Group messages by their parent chat

        // First pass: collect all messages by their parent chat
        chatsSnapshot.docs.forEach(doc => {
          const data = doc.data();
          const timestamp = data.timestamp?.toDate?.() || new Date(data.timestamp);
          
          if (data.assistantType) {
            // This is a parent chat message
            chatGroups.set(doc.id, {
              id: doc.id,
              assistantType: data.assistantType,
              content: data.content,
              timestamp,
              messages: []
            });
          } else if (data.parentChatId && chatGroups.has(data.parentChatId)) {
            // This is a child message
            const chat = chatGroups.get(data.parentChatId);
            chat.messages.push({
              role: data.role,
              content: data.content,
              timestamp
            });
          }
        });

        // Convert to array and sort by timestamp
        processedChats.push(...Array.from(chatGroups.values())
          .sort((a, b) => b.timestamp - a.timestamp));

        // Update chat history
        const formattedHistory = processedChats.map(chat => ({
          title: truncateText(chat.content || 'Untitled Chat'),
          fullTitle: chat.content || 'Untitled Chat', // Store full title for tooltip
          date: chat.timestamp.toLocaleDateString(),
          type: truncateText(chat.assistantType || 'General Chat', 20)
        }));
        setChatHistory(formattedHistory);

        // Calculate stats
        const totalChats = processedChats.length;
        const assistantTypes = processedChats.reduce((acc, chat) => {
          const type = chat.assistantType || 'General Chat';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});

        const totalResponses = processedChats.reduce((acc, chat) => 
          acc + chat.messages.filter(msg => msg.role === 'assistant').length, 0
        );

        setStats({
          totalChats,
          assistantTypes: Object.keys(assistantTypes).length,
          totalResponses
        });

        // Calculate activity data
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date.toISOString().split('T')[0];
        }).reverse();

        const activityCounts = last7Days.map(date => {
          const dayChats = processedChats.filter(chat => {
            const chatDate = chat.timestamp.toISOString().split('T')[0];
            return chatDate === date;
          });

          return {
            date,
            chats: dayChats.length,
            responses: dayChats.reduce((acc, chat) => 
              acc + chat.messages.filter(msg => msg.role === 'assistant').length, 0
            )
          };
        });

        setActivityData({
          labels: last7Days.map(date => new Date(date).toLocaleDateString()),
          datasets: [
            {
              label: 'Chats',
              data: activityCounts.map(count => count.chats),
              borderColor: '#60A5FA',
              backgroundColor: 'rgba(96, 165, 250, 0.5)',
              tension: 0.4
            },
            {
              label: 'AI Responses',
              data: activityCounts.map(count => count.responses),
              borderColor: '#34D399',
              backgroundColor: 'rgba(52, 211, 153, 0.5)',
              tension: 0.4
            }
          ]
        });

        // Calculate distribution data
        const colors = [
          '#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA',
          '#EC4899', '#8B5CF6', '#6366F1', '#10B981', '#F59E0B'
        ];

        setDistributionData({
          labels: Object.keys(assistantTypes),
          datasets: [{
            data: Object.values(assistantTypes),
            backgroundColor: colors.slice(0, Object.keys(assistantTypes).length)
          }]
        });

        // Update pie chart for top assistant types
        const topTypes = Object.entries(assistantTypes)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5);

        setPieData({
          labels: topTypes.map(([type]) => type),
          datasets: [{
            data: topTypes.map(([,count]) => count),
            backgroundColor: colors.slice(0, topTypes.length)
          }]
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [auth.currentUser]);

  const filteredHistory = chatHistory
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!dateFilter) return matchesSearch;
      
      const itemDate = new Date(item.date);
      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      const monthAgo = new Date(today);
      monthAgo.setMonth(today.getMonth() - 1);
      
      switch (dateFilter) {
        case 'today':
          return matchesSearch && itemDate.toDateString() === today.toDateString();
        case 'week':
          return matchesSearch && itemDate >= weekAgo;
        case 'month':
          return matchesSearch && itemDate >= monthAgo;
        default:
          return matchesSearch;
      }
    })
    .sort((a, b) => {
      const aValue = sortField === 'date' ? new Date(a.date) : a.title;
      const bValue = sortField === 'date' ? new Date(b.date) : b.title;
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className="text-lg font-semibold mb-2">Total Chats</h3>
          <p className="text-3xl font-bold">{stats.totalChats}</p>
          <p className="text-sm text-gray-500 mt-1">All-time conversations</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className="text-lg font-semibold mb-2">Assistant Types</h3>
          <p className="text-3xl font-bold">{stats.assistantTypes}</p>
          <p className="text-sm text-gray-500 mt-1">Different AI assistants used</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className="text-lg font-semibold mb-2">Total Responses</h3>
          <p className="text-3xl font-bold">{stats.totalResponses}</p>
          <p className="text-sm text-gray-500 mt-1">AI assistant responses</p>
        </motion.div>
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
          <h3 className="text-lg font-semibold mb-4">Top Assistant Types</h3>
          <Pie data={pieData} options={pieOptions} />
        </motion.div>
      </div>

      <motion.div
        className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg mb-8`}
        style={{ height: '300px' }}
      >
        <h3 className="text-lg font-semibold mb-4">Assistant Type Distribution</h3>
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
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th 
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center gap-2">
                    Title
                    <ArrowUpDown size={16} />
                  </div>
                </th>
                <th 
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-2">
                    Date
                    <ArrowUpDown size={16} />
                  </div>
                </th>
                <th className="px-4 py-2 text-left">Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  } hover:bg-gray-50 dark:hover:bg-gray-800`}
                >
                  <td className="px-4 py-2">
                    <div 
                      className="cursor-help" 
                      title={item.fullTitle}
                    >
                      {item.title}
                    </div>
                  </td>
                  <td className="px-4 py-2">{item.date}</td>
                  <td className="px-4 py-2">
                    <div 
                      className="cursor-help" 
                      title={item.type.length > 20 ? item.type : ''}
                    >
                      {item.type}
                    </div>
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
