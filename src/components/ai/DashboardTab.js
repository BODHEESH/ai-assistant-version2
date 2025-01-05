// src/components/ai/DashboardTab.js
'use client';
import { useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
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
import { motion } from 'framer-motion';

// Register ChartJS components
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

export default function DashboardTab() {
  // Dummy data for charts
  const chatData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Chat Sessions',
        data: [12, 19, 15, 25, 22, 30],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  const taskData = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [
      {
        data: [65, 20, 15],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(234, 179, 8, 0.8)',
        ],
      },
    ],
  };

  const usageData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Usage Time (minutes)',
        data: [45, 59, 80, 81, 56, 55, 40],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto p-4 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* Stats Cards */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold">Total Chats</h3>
          <p className="text-3xl font-bold mt-2">124</p>
          <p className="text-sm opacity-80 mt-1">+12% from last month</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold">Tasks Completed</h3>
          <p className="text-3xl font-bold mt-2">85</p>
          <p className="text-sm opacity-80 mt-1">+8% from last month</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold">Active Time</h3>
          <p className="text-3xl font-bold mt-2">416 min</p>
          <p className="text-sm opacity-80 mt-1">+15% from last month</p>
        </div>

        {/* Charts */}
        <div className="col-span-full md:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Chat Activity</h3>
          <Line data={chatData} options={{ responsive: true }} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Task Status</h3>
          <Doughnut data={taskData} options={{ responsive: true }} />
        </div>

        <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Weekly Usage</h3>
          <Bar data={usageData} options={{ responsive: true }} />
        </div>
      </motion.div>
    </div>
  );
}