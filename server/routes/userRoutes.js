// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, updateUserProfile, getUserById, searchUsers, toggleFollow } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// POST /api/users/register
router.post('/register', registerUser);

// POST /api/users/login
router.post('/login', loginUser);

// GET /api/users/me  (protected)
router.get('/me', authMiddleware, getMe);
router.put('/me', authMiddleware, updateUserProfile);

// GET /api/users?search=ira
router.get("/", authMiddleware, searchUsers);

router.get("/:id", authMiddleware, getUserById);

router.post("/:id/follow", authMiddleware, toggleFollow);

module.exports = router;
