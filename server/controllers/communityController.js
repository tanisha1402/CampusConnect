const Community = require("../models/Community");
const Post = require("../models/Post");

// Create community
const createCommunity = async (req, res) => {
  try {
    
    const { name, description } = req.body;

let coverImage;
if (req.file) {
  coverImage = `/uploads/communities/${req.file.filename}`;
}


    const exists = await Community.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Community already exists" });
    }

    const community = await Community.create({
      name,
      description,
      coverImage,
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
    const community = await Community.findById(req.params.id)
      .populate("members.user", "name email");

    if (!community)
      return res.status(404).json({ message: "Community not found" });

    res.json(community);
  } catch (error) {
    console.error("Get community error:", error);
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

    const memberIndex = community.members.findIndex(
      (m) => m.user.toString() === userId
    );

    if (memberIndex === -1) {
      return res.status(400).json({ message: "Not a member" });
    }

    const isAdmin = community.members[memberIndex].role === "admin";
    const totalMembers = community.members.length;
    const totalAdmins = community.members.filter(
      (m) => m.role === "admin"
    ).length;

    // 🚨 CASE 1: LAST MEMBER → DELETE COMMUNITY
    if (totalMembers === 1) {
      await community.deleteOne();
      return res.json({
        deleted: true,
        message: "Community deleted because last member left",
      });
    }

    // 🚨 CASE 2: LAST ADMIN BUT NOT LAST MEMBER → BLOCK
    if (isAdmin && totalAdmins === 1) {
      return res.status(400).json({
        message:
          "You are the last admin. Assign another admin or delete the community.",
      });
    }

    // ✅ SAFE TO LEAVE
    community.members.splice(memberIndex, 1);

    // 🔁 ADMIN SUCCESSION (KEEP YOUR ORIGINAL LOGIC)
    if (isAdmin) {
      const adminsLeft = community.members.filter(
        (m) => m.role === "admin"
      );

      if (adminsLeft.length === 0 && community.members.length > 0) {
        community.members.sort(
          (a, b) => new Date(a.joinedAt) - new Date(b.joinedAt)
        );
        community.members[0].role = "admin";
      }
    }

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

const toggleAdmin = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // ✅ Check requester is admin
    const isAdmin = community.members.some(
      (m) =>
        m.user.toString() === req.user.userId &&
        m.role === "admin"
    );

    if (!isAdmin) {
      return res.status(403).json({ message: "Admin only action" });
    }

    // 🔁 Find target member
    const member = community.members.find(
      (m) => m.user.toString() === req.params.userId
    );

    if (!member) {
      return res.status(404).json({ message: "User not in community" });
    }

    // 🔥 Toggle role
    member.role = member.role === "admin" ? "member" : "admin";

    await community.save();

    const populated = await Community.findById(community._id)
      .populate("members.user", "name email");

    res.json(populated);
  } catch (err) {
    console.error("Toggle admin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete community (admin only)
const deleteCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const community = await Community.findById(id);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // ✅ Check admin
    const isAdmin = community.members.some(
      (m) =>
        m.user.toString() === userId.toString() &&
        m.role === "admin"
    );

    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "Only admins can delete community" });
    }

    // ✅ Delete all posts belonging to this community
    await Post.deleteMany({ community: id });

    // ✅ Delete community
    await community.deleteOne();

    res.json({ message: "Community deleted successfully" });
  } catch (err) {
    console.error("Delete community error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  createCommunity,
  getCommunities,
  getCommunityById,
  joinCommunity,
  leaveCommunity,
  getMyCommunities,
  toggleAdmin,
  deleteCommunity,
};


