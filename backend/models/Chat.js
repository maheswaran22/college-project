// backend/models/Chat.js
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  keyword: String,
  response: String,
});

module.exports = mongoose.model("Chat", chatSchema);
