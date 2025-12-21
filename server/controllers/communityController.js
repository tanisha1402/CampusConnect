const Community = require("../models/Community");

// Create community
const createCommunity = async (req, res) => {
  try {
    const { name, description } = req.body;

    const exists = await Community.findOne({ name });
    if (exists) return res.status(400).json({ message: "Community already exists" });

    const community = await Community.create({
      name,
      description,
      createdBy: req.user.userId,
      members: [req.user.userId],
    });

    res.status(201).json(community);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// Get all communities
const getCommunities = async (req, res) => {
  try {
    const communities = await Community.find().sort({ createdAt: -1 });
    res.json(communities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single community by ID
const getCommunityById = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id).populate("members", "name email");

    if (!community) return res.status(404).json({ message: "Community not found" });

    res.json(community);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const joinCommunity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const communityId = req.params.id;

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    if (!community.members.includes(userId)) {
      community.members.push(userId);
      await community.save();
    }

    // ✅ RETURN UPDATED COMMUNITY
    const updatedCommunity = await Community.findById(communityId)
      .populate("members", "_id name");

    res.json(updatedCommunity);
  } catch (err) {
    console.error("Join community error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const leaveCommunity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const communityId = req.params.id;

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    community.members = community.members.filter(
      (id) => id.toString() !== userId
    );

    await community.save();

    // ✅ RETURN UPDATED COMMUNITY
    const updatedCommunity = await Community.findById(communityId)
      .populate("members", "_id name");

    res.json(updatedCommunity);
  } catch (err) {
    console.error("Leave community error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Get communities joined by logged-in user
const getMyCommunities = async (req, res) => {
  try {
    const userId = req.user.userId;

    const communities = await Community.find({
      members: userId
    }).sort({ createdAt: -1 });

    res.json(communities);
  } catch (error) {
    console.error("Error fetching user communities", error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  createCommunity,
  getCommunities,
  getCommunityById,
  joinCommunity,
  leaveCommunity,
  getMyCommunities
};

