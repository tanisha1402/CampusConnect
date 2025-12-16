const Post = require("../models/Post");

// CREATE POST
const createPost = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { content } = req.body;

    if (!content.trim()) {
      return res.status(400).json({ message: "Content is required" });
    }

    const post = await Post.create({
      user: userId,
      content,
    });

    await post.populate("user", "name role");

    res.status(201).json(post);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET POSTS
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name role")
      .populate("comments.user", "name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// LIKE POST
const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    const post = await Post.findById(postId)
      .populate("user", "name")
      .populate("comments.user", "name");

    if (!post) return res.status(404).json({ message: "Post not found" });

    // If already liked → unlike
    if (post.likes?.includes(userId)) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.json(post);
  } catch (err) {
    console.error("Error liking post:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// COMMENT ON POST
const commentOnPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;
    const { text } = req.body;

    if (!text.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({
      user: userId,
      text,
    });

    await post.save();

    const populated = await Post.findById(postId)
      .populate("user", "name")
      .populate("comments.user", "name");

    res.json(populated);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// GET /api/users/:id/posts  (get posts by user)
const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.id;

    const posts = await Post.find({ user: userId })
      .populate("user", "name role")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ message: "Server error while fetching user posts" });
  }
};

module.exports = {
  createPost,
  getPosts,
  likePost,
  commentOnPost,
  getUserPosts
};
