const Community = require("../models/Community");

// Create community
const createCommunity = async (req, res) => {
  try {
    const { name, description } = req.body;

    const exists = await Community.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Community already exists" });
    }

    const community = await Community.create({
      name,
      description,
      createdBy: req.user.userId,
      members: [
        {
          user: req.user.userId,
          role: "admin",
        },
      ],
    });

    const populated = await Community.findById(community._id)
      .populate("members.user", "name email");

    res.status(201).json(populated);
  } catch (error) {
    console.error("Create community error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// GET /api/communities?search=dev
const getCommunities = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};
    if (search) {
      query.name = {
        $regex: search,
        $options: "i", // case-insensitive
      };
    }

    const communities = await Community.find(query)
      .sort({ createdAt: -1 });

    res.json(communities);
  } catch (error) {
    console.error("Error fetching communities", error);
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
    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const alreadyMember = community.members.some(
      (m) => m.user.toString() === userId
    );

    if (!alreadyMember) {
      community.members.push({
        user: userId,
        role: "member",
      });
      await community.save();
    }

    const populated = await Community.findById(community._id)
      .populate("members.user", "name email");

    res.json(populated);
  } catch (err) {
    console.error("Join community error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const leaveCommunity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const member = community.members.find(
      (m) => m.user.toString() === userId
    );

    if (!member) {
      return res.status(400).json({ message: "Not a member" });
    }

    // ❌ Prevent last admin from leaving
    if (member.role === "admin") {
      const adminCount = community.members.filter(
        (m) => m.role === "admin"
      ).length;

      if (adminCount === 1) {
        return res.status(400).json({
          message: "You must assign another admin before leaving",
        });
      }
    }

    community.members = community.members.filter(
      (m) => m.user.toString() !== userId
    );

    await community.save();

    const populated = await Community.findById(community._id)
      .populate("members.user", "name email");

    res.json(populated);
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
      "members.user": userId,
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

