// server/routes/postRoutes.js
const express = require('express');
const router = express.Router();

const { createPost, getPosts } = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');


// GET /api/posts → list posts (protected)
router.get('/', authMiddleware, getPosts);

// POST /api/posts → create new post (protected)
router.post('/', authMiddleware, createPost);

module.exports = router;
