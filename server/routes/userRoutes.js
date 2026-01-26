// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, updateUserProfile, getUserById, searchUsers, toggleFollow ,  getUserSuggestions} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require("multer");
const path = require("path");
const User = require("../models/User");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profiles");
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.userId}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

router.put("/me/avatar",authMiddleware,upload.single("avatar"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.profilePic = `/uploads/profiles/${req.file.filename}`;
      await user.save();

      res.json(user);
    } catch (err) {
      console.error("Avatar upload error", err);
      res.status(500).json({ message: "Failed to upload avatar" });
    }
  }
);
// POST /api/users/register
router.post('/register', registerUser);

// POST /api/users/login
router.post('/login', loginUser);

// GET /api/users/me  (protected)
router.get('/me', authMiddleware, getMe);
router.put('/me', authMiddleware, updateUserProfile);



// SUGGESTIONS
router.get("/suggestions", authMiddleware, getUserSuggestions);

// GET /api/users?search=ira
router.get("/", authMiddleware, searchUsers);

router.get("/:id", authMiddleware, getUserById);

router.post("/:id/follow", authMiddleware, toggleFollow);

module.exports = router;
