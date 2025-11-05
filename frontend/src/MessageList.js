// palm-chat/frontend/src/MessageList.js
import React, { useRef, useEffect } from 'react';

function MessageList({ messages, currentUserId }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg, index) => {
        const isSelf = msg.sender._id === currentUserId;
        const bubbleClass = isSelf
          ? 'bg-blue-500 text-white ml-auto'
          : 'bg-gray-300 text-gray-800 mr-auto';
        const justifyClass = isSelf ? 'justify-end' : 'justify-start';

        return (
          <div key={index} className={`flex ${justifyClass}`}>
            <div
              className={`max-w-xs p-3 rounded-xl shadow ${bubbleClass}`}
              style={{ maxWidth: '80%' }}
            >
              <div className="text-xs font-semibold mb-1 opacity-75">
                {isSelf ? 'You' : msg.sender.username}
              </div>
              <div>{msg.content}</div>
              <div className="text-xs mt-1 text-right opacity-50">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;