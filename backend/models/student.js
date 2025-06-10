const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  fatherName: String,
  motherName: String,
  phone: { type: String, required: true },
  gender: String,
  department: String,
  year: String,
  verified: Boolean,
  roomNumber: { type: String, default: "" },
  password: String,
  complaint: { type: String }, // ✅ Add this line

});

module.exports = mongoose.model("Student", studentSchema);
