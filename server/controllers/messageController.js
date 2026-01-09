const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

/**
 * Start or get a conversation
 */
exports.startConversation = async (req, res) => {
  const { userId } = req.body;
  const me = req.user.userId; // ✅ FIXED

  try {
    let conversation = await Conversation.findOne({
      participants: { $all: [me, userId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [me, userId],
      });
    }

    res.json(conversation);
  } catch (err) {
    console.error("startConversation error:", err);
    res.status(500).json({ message: "Failed to start conversation" });
  }
};

/**
 * Inbox
 */
exports.getInbox = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.userId,
    })
      .populate("participants", "name")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    const result = await Promise.all(
      conversations.map(async (c) => {
        const unreadCount = await Message.countDocuments({
          conversation: c._id,
          sender: { $ne: req.user.userId },
          seenBy: { $ne: req.user.userId },
        });

        return {
          ...c.toObject(),
          unreadCount,
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load inbox" });
  }
};


/**
 * Get messages in conversation
 */
exports.getMessages = async (req, res) => {
  try {
    // mark messages as seen
    await Message.updateMany(
      {
        conversation: req.params.id,
        seenBy: { $ne: req.user.userId },
      },
      {
        $addToSet: { seenBy: req.user.userId },
      }
    );

    const messages = await Message.find({
      conversation: req.params.id,
    }).sort("createdAt");

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to load messages" });
  }
};

/**
 * Send message
 */
exports.sendMessage = async (req, res) => {
  try {
    const message = await Message.create({
      conversation: req.params.id,
      sender: req.user.userId, // ✅ FIXED
      text: req.body.text,
    });

    await Conversation.findByIdAndUpdate(req.params.id, {
      lastMessage: message._id,
      updatedAt: Date.now(),
    });

    res.json(message);
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
};
