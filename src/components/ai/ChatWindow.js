'use client';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const ChatWindow = ({ messages, loading, chatInput, setChatInput, handleSendMessage, selectedFeature }) => {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[70%] rounded-lg p-3 bg-gray-100 dark:bg-gray-800">
              <div className="flex items-center space-x-2">
                <div className="animate-bounce h-2 w-2 bg-gray-500 rounded-full"></div>
                <div className="animate-bounce h-2 w-2 bg-gray-500 rounded-full delay-100"></div>
                <div className="animate-bounce h-2 w-2 bg-gray-500 rounded-full delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ChatInput
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(chatInput);
        }}
        loading={loading}
        selectedFeature={selectedFeature}
      />
    </div>
  );
};

export default ChatWindow;
