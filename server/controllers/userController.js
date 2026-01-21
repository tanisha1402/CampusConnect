// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createNotification = require("../utils/createNotification");

// POST /api/users/register
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({ message: 'User created', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/users/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Logged in successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/users/me
const getMe = async (req, res) => {
  try {
    // auth middleware will set req.user = { userId, role }
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser, getMe };

// PUT /api/users/me
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { name, role, bio, department } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, role, bio, department },
      { new: true }
    ).select('-password');

    res.json(updatedUser);

  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/users?search=ira
const searchUsers = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query).select("-password");

    res.json(users);
  } catch (error) {
    console.error("Error searching users", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/users/suggestions
const getUserSuggestions = async (req, res) => {
  try {
    const currentUserId = req.user.userId;

    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const excludeIds = [
      currentUserId,
      ...currentUser.following.map(id => id.toString()),
    ];

    const suggestions = await User.find({
      _id: { $nin: excludeIds },
    })
      .select("name role")

    res.json(suggestions);
  } catch (error) {
    console.error("Suggestions error:", error);
    res.status(500).json({ message: "Failed to load suggestions" });
  }
};


// FOLLOW / UNFOLLOW USER
const toggleFollow = async (req, res) => {
  try {
    const targetUserId = req.params.id;        // profile being followed
    const currentUserId = req.user.userId;     // logged-in user

    // 🚫 Cannot follow yourself
    if (targetUserId === currentUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      // 🔁 UNFOLLOW
      currentUser.following.pull(targetUserId);
      targetUser.followers.pull(currentUserId);

      // 🔔 NOTIFY TARGET USER
  await createNotification({
    user: targetUserId,
    fromUser: currentUserId,
    type: "follow",
  });
    } else {
      // ➕ FOLLOW
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
    }

    await currentUser.save();
    await targetUser.save();

    res.json({
  isFollowing: !isFollowing,
  followers: targetUser.followers.map(id => id.toString()),
  following: currentUser.following.map(id => id.toString()),
});

  } catch (error) {
    console.error("Follow error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateUserProfile,
  getUserById,
  searchUsers,
  toggleFollow,
  getUserSuggestions,

};

