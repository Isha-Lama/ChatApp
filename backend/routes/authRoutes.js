// palm-chat/backend/routes/authRoutes.js

const express = require('express');
// Ensure getUsers is imported, as it's needed for the Admin Dashboard
const { registerUser, loginUser, getMe, updateUser, deleteUser, getUsers } = require('../controllers/authController'); 
const { protect, admin } = require('../middleware/authMiddleware'); 
const router = express.Router();

// --- 1. Basic Auth Operations ---
router.post('/register', registerUser); // C: Create (Registration)
router.post('/login', loginUser);       // Authentication

// --- 2. Read Operations (Admin Authorization) ---

// R: Read your own data - Must be logged in (Authentication)
router.get('/me', protect, getMe); 

// R: Read ALL user data (Admin Dashboard)
// Must be logged in AND be an admin (protect, admin)
router.get('/', protect, admin, getUsers); 


// --- 3. Update Operation (Self-Authorization) ---
// U: Update your own profile/password - Must be logged in (protect + controller check)
router.put('/:id', protect, updateUser); 

// --- 4. Delete Operation (Admin Authorization) ---
// D: Delete any user account - Must be logged in AND be an admin (protect, admin)
router.delete('/:id', protect, admin, deleteUser); 

module.exports = router;