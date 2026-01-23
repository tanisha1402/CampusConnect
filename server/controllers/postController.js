const Post = require("../models/Post");
const User = require("../models/User");
const createNotification = require("../utils/createNotification");

// CREATE POST
const createPost = async (req, res) => {
  try {
    const { content, communityId } = req.body;

    // ✅ HARD VALIDATION
    if (!content?.trim() && !req.file) {
      return res.status(400).json({ message: "Post cannot be empty" });
    }

    let fileData = null;

    if (req.file) {
      fileData = {
        url: `/uploads/${req.file.filename}`,
        type: req.file.mimetype.startsWith("image")
          ? "image"
          : "file",
        name: req.file.originalname
      };
    }

    const post = await Post.create({
      user: req.user.userId,
      content: content || "",
      community: communityId || null,
      file: fileData
    });
    const followers = await User.findById(req.user.userId).select("followers");

for (let followerId of followers.followers) {
  await createNotification({
    user: followerId,
    fromUser: req.user.userId,
    type: "new_post",
    post: post._id,
  });
}
    const populated = await Post.findById(post._id)
      .populate("user", "name")
      .populate("comments.user", "name");

    res.status(201).json(populated);

  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ message: err.message });
  }
};

// EDIT POST
const editPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // only owner can edit
    if (post.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    post.content = req.body.content;
    post.editedAt = new Date();

    await post.save(); // ✅ updatedAt changes here

    const populatedPost = await Post.findById(post._id)
      .populate("user", "name email")
      .populate("comments.user", "name email");

    res.json(populatedPost);
  } catch (err) {
    console.error("Edit post error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// DELETE POST
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post)
      return res.status(404).json({ message: "Post not found" });

    // ✅ Only post owner can delete
    if (post.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted", postId: post._id });
  } catch (err) {
    console.error("Delete post error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// GET POSTS
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name role")
      .populate("user", "name profilePic")
      .select("+savedBy") 
      .populate("comments.user", "name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getCommunityPosts = async (req, res) => {
  try {
  const posts = await Post.find({ community: req.params.id })
  .populate("user", "name role")
  .populate("user", "name profilePic")
  .populate("comments.user", "name")
  .select("+savedBy") // 👈 ADD THIS
  .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
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

  // 🔔 NOTIFY POST OWNER
  await createNotification({
    user: post.user._id,
    fromUser: userId,
    type: "like",
    post: post._id,
  });
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
    // 🔔 NOTIFY POST OWNER
await createNotification({
  user: post.user,
  fromUser: userId,
  type: "comment",
  post: post._id,
});

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
  .populate("user", "name role profilePic")
.populate("comments.user", "name")
.select("content createdAt likes comments savedBy file user editedAt")
.sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ message: "Server error while fetching user posts" });
  }
};

// SAVE / UNSAVE POST
const savePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const postId = req.params.id;

    const post = await Post.findById(postId).select("+savedBy");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadySaved = post.savedBy.some(
      id => id.toString() === userId
    );

    if (alreadySaved) {
      post.savedBy = post.savedBy.filter(
        id => id.toString() !== userId
      );
    } else {
      post.savedBy.push(userId);
      await createNotification({
    user: post.user,
    fromUser: userId,
    type: "save",
    post: post._id,
  });
    }

    await post.save();

    const populatedPost = await Post.findById(postId)
      .populate("user", "name role")
      .populate("comments.user", "name")
      .select("+savedBy");

    res.json(populatedPost);
  } catch (err) {
    console.error("Save post error:", err);
    res.status(500).json({ message: "Failed to save post" });
  }
};



// GET SAVED POSTS
const getSavedPosts = async (req, res) => {
  try {
    const userId = req.user.userId;

    const posts = await Post.find({
      savedBy: userId,
    })
      .populate("user", "name role profilePic")
.populate("comments.user", "name")
.select("content createdAt likes comments savedBy file user editedAt")
.sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Get saved posts error:", err);
    res.status(500).json({ message: "Failed to load saved posts" });
  }
};

// CREATE RESOURCE POST
const createResourcePost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content?.trim() && !req.file) {
      return res.status(400).json({ message: "Resource cannot be empty" });
    }

    let fileData = null;

    if (req.file) {
      fileData = {
        url: `/uploads/${req.file.filename}`,
        type: req.file.mimetype.startsWith("image") ? "image" : "file",
        name: req.file.originalname,
      };
    }

    const post = await Post.create({
      user: req.user.userId,
      content: content || "",
      file: fileData,
      type: "resource",
    });

    const populated = await Post.findById(post._id)
      .populate("user", "name role");

    res.status(201).json(populated);

  } catch (err) {
    console.error("Create resource post error:", err);
    res.status(500).json({ message: "Failed to create resource post" });
  }
};

// GET RESOURCE POSTS
const getResourcePosts = async (req, res) => {
  try {
    const posts = await Post.find({ type: "resource" })
      .populate("user", "name role")
      .populate("user", "name profilePic")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Get resource posts error:", err);
    res.status(500).json({ message: "Failed to load resources" });
  }
};

// CREATE EVENT POST
const createEventPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content?.trim() && !req.file) {
      return res.status(400).json({ message: "Event cannot be empty" });
    }

    let fileData = null;
    if (req.file) {
      fileData = {
        url: `/uploads/${req.file.filename}`,
        type: req.file.mimetype.startsWith("image") ? "image" : "file",
        name: req.file.originalname,
      };
    }

    const post = await Post.create({
      user: req.user.userId,
      content: content || "",
      file: fileData,
      type: "event",
    });

    const populated = await Post.findById(post._id)
      .populate("user", "name role");

    res.status(201).json(populated);
  } catch (err) {
    console.error("Create event post error:", err);
    res.status(500).json({ message: "Failed to create event post" });
  }
};

// GET EVENT POSTS
const getEventPosts = async (req, res) => {
  try {
    const posts = await Post.find({ type: "event" })
      .populate("user", "name role")
      .populate("user", "name profilePic")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Get event posts error:", err);
    res.status(500).json({ message: "Failed to load events" });
  }
};



module.exports = {
  createPost,
  getPosts,
  getCommunityPosts,
  likePost,
  commentOnPost,
  getUserPosts,
  editPost,
  deletePost,
  savePost,
  getSavedPosts,
  createResourcePost,
  getResourcePosts,
  createEventPost,
  getEventPosts,
};
