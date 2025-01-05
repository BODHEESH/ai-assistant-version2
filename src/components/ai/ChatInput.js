'use client';
import { Send } from 'lucide-react';

const ChatInput = ({ value, onChange, onSubmit, loading, selectedFeature }) => {
  return (
    <div className="p-4 border-t dark:border-gray-700">
      <form onSubmit={onSubmit} className="flex space-x-2">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={selectedFeature 
            ? `Ask your ${selectedFeature.name} assistant...` 
            : "Type your message..."}
          className="flex-1 rounded-lg border p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className={`px-4 py-2 rounded-lg bg-indigo-600 text-white ${
            loading || !value.trim() 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-indigo-700'
          }`}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
