const express = require('express');
const { getChatHistory, getStats } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/history', protect, getChatHistory);
router.get('/stats', getStats); // Can be public

module.exports = router;