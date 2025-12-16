const express = require('express');
const router = express.Router();

const {
  createPost,
  getPosts,
  likePost,
  commentOnPost,
  getUserPosts
} = require('../controllers/postController');

const authMiddleware = require('../middlewares/authMiddleware');

// Routes
router.get('/', authMiddleware, getPosts);
router.post('/', authMiddleware, createPost);

router.get("/user/:id", authMiddleware, getUserPosts);

router.post('/:id/like', authMiddleware, likePost);
router.post('/:id/comments', authMiddleware, commentOnPost);


module.exports = router;
