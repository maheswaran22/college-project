const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  studentName: String,
  email: String,
  roomNumber: String,
  receiptUrl: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Receipt', receiptSchema);
