import { useState, useEffect } from 'react';
import { getInteractionStats, searchInteractions } from '../services/firebaseService';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const Dashboard = ({ isDarkMode }) => {
  const [stats, setStats] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [codeReviews, setCodeReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    loadStats();
    loadHistory();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getInteractionStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadHistory = async () => {
    try {
      const chats = await searchInteractions(null, '', 'chat');
      const reviews = await searchInteractions(null, '', 'codeReview');
      setChatHistory(chats);
      setCodeReviews(reviews);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkMode ? '#fff' : '#000'
        }
      }
    },
    scales: {
      y: {
        ticks: {
          color: isDarkMode ? '#fff' : '#000'
        }
      },
      x: {
        ticks: {
          color: isDarkMode ? '#fff' : '#000'
        }
      }
    }
  };

  if (!stats) {
    return <div className="p-4">Loading dashboard...</div>;
  }

  const activityData = {
    labels: Object.keys(stats.dailyActivity),
    datasets: [
      {
        label: 'Daily Activity',
        data: Object.values(stats.dailyActivity),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      }
    ]
  };

  const categoryData = {
    labels: Object.keys(stats.categoryDistribution),
    datasets: [
      {
        data: Object.values(stats.categoryDistribution),
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
          '#ec4899',
          '#6366f1'
        ]
      }
    ]
  };

  const featureData = {
    labels: Object.keys(stats.featureUsage),
    datasets: [
      {
        label: 'Feature Usage',
        data: Object.values(stats.featureUsage),
        backgroundColor: 'rgba(59, 130, 246, 0.8)'
      }
    ]
  };

  return (
    <div className={`p-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-lg shadow-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h3 className="text-xl font-semibold mb-2">Total Chats</h3>
          <p className="text-3xl font-bold">{stats.totalChats}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-lg shadow-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h3 className="text-xl font-semibold mb-2">Code Reviews</h3>
          <p className="text-3xl font-bold">{stats.totalCodeReviews}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-lg shadow-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h3 className="text-xl font-semibold mb-2">Total Responses</h3>
          <p className="text-3xl font-bold">{stats.totalResponses}</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-6 rounded-lg shadow-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h3 className="text-xl font-semibold mb-4">Activity Over Time</h3>
          <Line options={chartOptions} data={activityData} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-lg shadow-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h3 className="text-xl font-semibold mb-4">Category Distribution</h3>
          <Pie options={chartOptions} data={categoryData} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`p-6 rounded-lg shadow-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <h3 className="text-xl font-semibold mb-4">Feature Usage</h3>
        <Bar options={chartOptions} data={featureData} />
      </motion.div>

      {/* History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`mt-8 p-6 rounded-lg shadow-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">History</h3>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search..."
              className={`px-4 py-2 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className={`px-4 py-2 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All</option>
              <option value="chat">Chats</option>
              <option value="codeReview">Code Reviews</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {[...chatHistory, ...codeReviews]
            .filter(
              (item) =>
                (selectedType === 'all' || item.type === selectedType) &&
                (item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.type.toLowerCase().includes(searchQuery.toLowerCase()))
            )
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span
                      className={`inline-block px-2 py-1 rounded text-sm ${
                        item.type === 'chat'
                          ? 'bg-blue-500 text-white'
                          : 'bg-green-500 text-white'
                      }`}
                    >
                      {item.type}
                    </span>
                    <p className="mt-2">{item.content}</p>
                  </div>
                  <span className="text-sm opacity-70">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
