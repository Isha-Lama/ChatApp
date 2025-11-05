// palm-chat/frontend/src/Chat.js
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import MessageList from './MessageList';

const SOCKET_URL = 'http://localhost:5000';
const API_BASE = 'http://localhost:5000/api/chat';

function Chat({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  // stats.totalUsers is for registered users (from DB API)
  const [stats, setStats] = useState({ totalUsers: 0, totalChatCounts: 0 });
  // usersOnline is for currently active sockets (from Socket.IO event)
  const [usersOnline, setUsersOnline] = useState(0); 
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('userToken');

    // Initialize Socket.IO
    socketRef.current = io(SOCKET_URL, {
      query: { token },
    });

    // Listen for incoming messages
    socketRef.current.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
      setStats((prev) => ({ ...prev, totalChatCounts: prev.totalChatCounts + 1 }));
    });

    // FIX: Listen for the server's authoritative online count
    socketRef.current.on('online users', (count) => {
      setUsersOnline(count); 
    });

    // REMOVED UNRELIABLE/INCORRECT LOGIC:
    // socketRef.current.on('user joined', ...) and the client-side disconnect logic are gone.

    socketRef.current.on('connect', () => {
      console.log('Connected to Socket.IO server.');
    });
    
    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server.');
    });

    // Fetch chat history & stats (Total Registered Users) from API
    const fetchHistoryAndStats = async () => {
      try {
        // Fetch history
        const historyRes = await fetch(`${API_BASE}/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          setMessages(historyData);
          setStats((prev) => ({ ...prev, totalChatCounts: historyData.length }));
        }

        // Fetch stats (Total Registered Users)
        const statsRes = await fetch(`${API_BASE}/stats`);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats((prev) => ({ ...prev, totalUsers: statsData.totalUsers }));
        }
      } catch (err) {
        console.error('Error fetching chat history or stats:', err);
      }
    };

    fetchHistoryAndStats();

    // CRITICAL CLEANUP: Disconnect the socket when the component unmounts (e.g., user logs out)
    return () => {
      socketRef.current.off('message');
      socketRef.current.off('online users');
      socketRef.current.disconnect(); 
    };
  }, [user._id]);

  // --- Send message ---
  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const messageData = {
      userId: user._id,
      content: input,
    };

    // Emit to server
    socketRef.current.emit('sendMessage', messageData);
    setInput('');
  };

  return (
    <div className="w-full max-w-3xl h-[80vh] flex flex-col bg-white shadow-2xl rounded-xl">
      <header className="p-4 border-b border-gray-200 bg-indigo-600 text-white rounded-t-xl">
        <h1 className="text-xl font-bold">Palm Chat (Logged in as: {user.username})</h1>
        <p className="text-sm">
          Users (Registered): <strong>{stats.totalUsers}</strong> | Total Chats: <strong>{stats.totalChatCounts}</strong> | Online: <strong>{usersOnline}</strong>
        </p>
      </header>

      <MessageList messages={messages} currentUserId={user._id} />

      <footer className="p-4 border-t border-gray-200">
        <form onSubmit={handleSend} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
            disabled={!input.trim()}
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}

export default Chat;