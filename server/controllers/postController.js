// server/controllers/postController.js
const Post = require('../models/Post');

// POST /api/posts  (create new post)
const createPost = async (req, res) => {
  try {
    // from authMiddleware.js → req.user
    const userId = req.user.userId || req.user.id || req.user._id;

    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Content is required' });
    }

    const post = await Post.create({
      user: userId,
      content,
    });

    await post.populate('user', 'name role');

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error while creating post' });
  }
};

// GET /api/posts  (get all posts)
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name role')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error while fetching posts' });
  }
};

module.exports = {
  createPost,
  getPosts,
};
