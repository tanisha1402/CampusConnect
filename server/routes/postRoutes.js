const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");
const authMiddleware = require("../middlewares/authMiddleware");

const {
  createPost,
  getPosts,
  getCommunityPosts,
  likePost,
  commentOnPost,
  getUserPosts,
  editPost,
  deletePost
} = require("../controllers/postController");

// CREATE POST (with file upload)
router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  createPost
);

// GET ALL POSTS
router.get("/", authMiddleware, getPosts);

// GET COMMUNITY POSTS
router.get("/community/:id", authMiddleware, getCommunityPosts);

// GET USER POSTS
router.get("/user/:id", authMiddleware, getUserPosts);

// LIKE POST
router.post("/:id/like", authMiddleware, likePost);

// COMMENT ON POST
router.post("/:id/comments", authMiddleware, commentOnPost);

// ✏️ EDIT POST
router.put("/:id", authMiddleware, editPost);

// 🗑️ DELETE POST
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
