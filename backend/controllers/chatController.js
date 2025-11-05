const Message = require('../models/Message');
const User = require('../models/user');

// @desc    Get last 50 messages (Chat History)
// @route   GET /api/chat/history
// @access  Protected
const getChatHistory = async (req, res) => {
  try {
    const messages = await Message.find({})
      .sort({ createdAt: 1 }) // Sort by oldest first
      .limit(50) // Get the last 50 messages
      .populate('sender', 'username'); // Populate sender details (only username)

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get application statistics (Total Users & Total Messages/Chats)
// @route   GET /api/chat/stats
// @access  Public (or Protected, depending on preference)
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMessages = await Message.countDocuments();

    res.json({
      totalUsers,
      totalChatCounts: totalMessages, // Using the required naming
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getChatHistory,
  getStats,
};