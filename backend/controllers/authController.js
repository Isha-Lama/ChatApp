// palm-chat/backend/controllers/authController.js
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/users/register
const registerUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Please enter all fields' });
    return;
  }

  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  // ⚠️ IMPORTANT: Ensure your User model or pre-save hook handles password hashing!
  const user = await User.create({
    username,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      isAdmin: user.isAdmin || false, // Ensure isAdmin is returned on registration
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id),
      isAdmin: user.isAdmin || false, // Include isAdmin status
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

// @desc    Get current user data (Read - used for profile/verification)
// @route   GET /api/users/me
// @access  Protected
const getMe = (req, res) => {
  // This is guaranteed to be a logged-in user by the 'protect' middleware
  res.status(200).json(req.user);
};

// --- NEW FUNCTION FOR ADMIN DASHBOARD ---
// @desc    Get all users (for Admin Dashboard)
// @route   GET /api/users
// @access  Admin Protected
const getUsers = async (req, res) => {
    // The 'admin' middleware ensures only admins reach this function
    try {
        const users = await User.find({}).select('-password'); // Fetch all users, exclude passwords
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching user list.' });
    }
};

// @desc    Update user (e.g., change username/password)
// @route   PUT /api/users/:id
// @access  Protected (Self or Admin Authorization)
const updateUser = async (req, res) => {
  const { username, password } = req.body;
  const userIdToUpdate = req.params.id;
  
  // --- 🔒 Authorization Check: Self or Admin ---
  // Check if the logged-in user is the target user OR an admin
  if (req.user._id.toString() !== userIdToUpdate && !req.user.isAdmin) {
     return res.status(403).json({ message: 'Not authorized to update this user' });
  }

  const user = await User.findById(userIdToUpdate);

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  // --- Apply Updates ---
  // 1. Username update
  if (username) {
    user.username = username;
  }
  
  // 2. Password update (Requires hashing, assuming your User model handles it on save)
  if (password) {
    // ⚠️ If your model does NOT hash automatically, you must hash the password here before saving!
    user.password = password; 
  }

  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    username: updatedUser.username,
  });
};

// @desc    Delete a user account
// @route   DELETE /api/users/:id
// @access  Protected (Admin Authorization)
const deleteUser = async (req, res) => {
    // The 'protect' and 'admin' middleware ensure only admins can reach this
    const userIdToDelete = req.params.id;

    try {
        const user = await User.findByIdAndDelete(userIdToDelete);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // ⚠️ Optional: You might want to invalidate all tokens for this user upon deletion
        
        res.json({ message: 'User removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateUser,
  deleteUser,
  getUsers,
};