const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  startConversation,
  getInbox,
  getMessages,
  sendMessage,
} = require("../controllers/messageController");

router.post("/start", auth, startConversation);
router.get("/inbox", auth, getInbox);
router.get("/:id", auth, getMessages);
router.post("/:id", auth, sendMessage);

module.exports = router;
