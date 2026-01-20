
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const uploadCommunityCover = require("../middlewares/communityUpload");

const {
  createCommunity,
  getCommunities,
  getCommunityById,
  joinCommunity,
  leaveCommunity,
  getMyCommunities,
  toggleAdmin,
  deleteCommunity
} = require("../controllers/communityController");
// server/routes/communityRoutes.js

router.post("/",auth,uploadCommunityCover.single("cover"),createCommunity);

router.get("/", auth, getCommunities);

// ✅ FIX: put this ABOVE :id
router.get("/my", auth, getMyCommunities);

router.delete("/:id", auth, deleteCommunity);

router.get("/:id", auth, getCommunityById);
router.post("/:id/join", auth, joinCommunity);
router.post("/:id/leave", auth, leaveCommunity);
router.put("/:id/admins/:userId",auth,toggleAdmin);


module.exports = router;
