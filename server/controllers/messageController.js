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
      participants: req.user.userId, // ✅ FIXED
    })
      .populate("participants", "name")
      .populate("lastMessage", "text createdAt")
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (err) {
    console.error("getInbox error:", err);
    res.status(500).json({ message: "Failed to load inbox" });
  }
};

/**
 * Get messages in conversation
 */
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversation: req.params.id,
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("getMessages error:", err);
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
