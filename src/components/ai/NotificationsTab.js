'use client';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, AlertTriangle } from 'lucide-react';

const NotificationsTab = ({ isDarkMode, notifications }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like': return <Heart size={20} className="text-red-500" />;
      case 'comment': return <MessageSquare size={20} className="text-blue-500" />;
      case 'alert': return <AlertTriangle size={20} className="text-yellow-500" />;
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="p-4"
    >
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>

      <div className="space-y-4">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`flex items-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} p-3 rounded-lg`}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="mr-3"
            >
              {getNotificationIcon(notification.type)}
            </motion.div>

            <div className="flex-grow">
              <p className="text-sm">{notification.message}</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {notification.time}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default NotificationsTab;
