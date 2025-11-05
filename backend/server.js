// palm-chat/backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const Message = require('./models/Message');
const User = require('./models/user'); 

// Load environment variables
dotenv.config();

// Connect to MongoDB
// NOTE: connectDB must be a function that returns a promise or handles its own errors
connectDB()
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err));

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000', // Allow your React frontend
    methods: ['GET', 'POST'],
  },
});

// Explicit CORS setup for REST API (CRITICAL for fetch() requests)
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.use(express.json());

// Function to broadcast the current online count to ALL clients
const emitOnlineUsersCount = () => {
    // io.engine.clientsCount provides the accurate number of currently connected sockets
    const count = io.engine.clientsCount; 
    io.emit('online users', count);
    console.log(`📡 Current online users: ${count}`);
};

// --- REST API Routes ---
app.use('/api/users', authRoutes);
app.use('/api/chat', chatRoutes);

// --- Socket.IO Events ---
io.on('connection', (socket) => {
  console.log(`⚡ User connected: ${socket.id}`);

  // 1. Send the current online count to everyone immediately
  emitOnlineUsersCount();

  // Handle chat message
  socket.on('sendMessage', async (data) => {
    try {
      const { userId, content } = data;

      // Save message in MongoDB
      const message = await Message.create({ sender: userId, content });

      // Fetch username to include with message
      const user = await User.findById(userId).select('username');

      // Broadcast message to all users
      io.emit('message', {
        _id: message._id,
        content: message.content,
        sender: {
          _id: user._id,
          username: user.username,
        },
        createdAt: message.createdAt,
      });
    } catch (error) {
      console.error('❌ Error saving or broadcasting message:', error.message);
    }
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
    // 2. Broadcast the updated count after disconnect
    emitOnlineUsersCount();
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});