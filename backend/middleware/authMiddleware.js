const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to authorize admin access
const admin = (req, res, next) => {
    // This runs AFTER 'protect', so req.user is guaranteed to exist
    // Assumes your User model has an 'isAdmin' boolean field set to true for admins
    if (req.user && req.user.isAdmin) {
        next(); // User is an admin, proceed
    } else {
        // User is authenticated but not an admin, deny access
        return res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };