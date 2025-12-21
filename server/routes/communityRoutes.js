const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");

const {
  createCommunity,
  getCommunities,
  getCommunityById,
  joinCommunity,
  leaveCommunity,
  getMyCommunities
} = require("../controllers/communityController");
// server/routes/communityRoutes.js
router.post("/", auth, createCommunity);
router.get("/", auth, getCommunities);

// ✅ FIX: put this ABOVE :id
router.get("/my", auth, getMyCommunities);

router.get("/:id", auth, getCommunityById);
router.post("/:id/join", auth, joinCommunity);
router.post("/:id/leave", auth, leaveCommunity);

module.exports = router;
