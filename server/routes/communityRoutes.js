const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");

const {
  createCommunity,
  getCommunities,
  getCommunityById,
  joinCommunity,
  leaveCommunity
} = require("../controllers/communityController");

router.post("/", auth, createCommunity);
router.get("/", auth, getCommunities);
router.get("/:id", auth, getCommunityById);

router.post("/:id/join", auth, joinCommunity);
router.post("/:id/leave", auth, leaveCommunity);

module.exports = router;
