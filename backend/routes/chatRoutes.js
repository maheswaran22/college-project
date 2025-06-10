const express = require("express");
const router = express.Router();
const Chatbot = require("../models/chatModel");

router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "❌ No message received." });
  }

  const keyword = message.trim().toLowerCase();

  try {
    const chat = await Chatbot.findOne({
      keyword: { $elemMatch: { $regex: new RegExp(`^${keyword}$`, "i") } }
    });

    if (chat) {
      res.json({ reply: chat.response });
    } else {
      res.json({ reply: "❓ Sorry, I don't know that answer." });
    }
  } catch (err) {
    console.error("🔥 ERROR in chatbot route:", err);
    res.status(500).json({ reply: "Server error" });
  }
});

module.exports = router;
