const mongoose = require("mongoose");

const chatbotSchema = new mongoose.Schema({
  keyword: {
    type: [String], // Array of strings
    required: true,
    lowercase: true,
    trim: true
  },
  response: {
    type: String,
    required: true
  }
}, { collection: "chatbot_data" });

module.exports = mongoose.model("Chatbot", chatbotSchema);
