const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Notification = require("../models/Notification");

// GET MY NOTIFICATIONS
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.userId,
    })
      .populate("fromUser", "name")
      .populate("post")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Failed to load notifications" });
  }
});

// MARK ONE AS READ
router.put("/:id/read", authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Not found" });
    }

    if (notification.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    notification.read = true;
    await notification.save();

    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: "Failed to mark read" });
  }
});

// MARK ALL AS READ
router.put("/read-all", authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.userId, read: false },
      { read: true }
    );

    res.json({ message: "All notifications marked read" });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark all read" });
  }
});

module.exports = router;
