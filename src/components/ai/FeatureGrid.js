'use client';
import { motion } from 'framer-motion';

const features = [
  { name: 'Chat Assistant', color: 'bg-blue-600' },
  { name: 'Code Review', color: 'bg-green-600' },
  { name: 'Story Writing', color: 'bg-purple-600' },
  { name: 'Create Poem', color: 'bg-pink-600' },
  { name: 'Ask Anything', color: 'bg-yellow-600' },
  { name: 'Language Translation', color: 'bg-red-600' },
  { name: 'Recipe Suggestions', color: 'bg-orange-600' },
  { name: 'Fitness Coach', color: 'bg-teal-600' },
  { name: 'Music Recommendations', color: 'bg-indigo-600' },
  { name: 'Math Solver', color: 'bg-cyan-600' },
  { name: 'Grammar Checker', color: 'bg-lime-600' },
  { name: 'Programming Help', color: 'bg-emerald-600' },
  { name: 'Time Zone Converter', color: 'bg-amber-600' },
  { name: 'Pet Care Tips', color: 'bg-sky-600' },
  { name: 'Travel Advice', color: 'bg-violet-600' },
  { name: 'Word Definitions', color: 'bg-yellow-500' },
  { name: 'Daily Motivational Quotes', color: 'bg-red-500' },
  { name: 'Virtual Interview Practice', color: 'bg-blue-500' },
  { name: 'Memory Techniques', color: 'bg-green-500' },
  { name: 'Time Management Tips', color: 'bg-purple-500' },
  { name: 'Positive Habit Formation', color: 'bg-pink-500' },
  { name: 'Career Path Planning', color: 'bg-teal-500' },
  { name: 'Speech Writing Help', color: 'bg-indigo-500' },
  { name: 'Stress Relief Exercises', color: 'bg-orange-500' }
];

const FeatureGrid = ({ onFeatureClick }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {features.map((feature, index) => (
        <motion.div
          key={feature.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onFeatureClick(feature)}
          className={`${feature.color} p-4 rounded-lg cursor-pointer transform transition-transform hover:scale-105`}
        >
          <h3 className="text-white font-semibold">{feature.name}</h3>
        </motion.div>
      ))}
    </div>
  );
};

export default FeatureGrid;
