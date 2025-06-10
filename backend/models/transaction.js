const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  email: String,
  amount: Number,
  currency: String,
  paymentId: String,
  status: String,
  created: Date
});

module.exports = mongoose.model("Transaction", transactionSchema);
