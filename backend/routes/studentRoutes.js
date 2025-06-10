const express = require("express");
const router = express.Router();
const Student = require("../models/student");
const Transaction = require("../models/transaction");
const multer = require('multer');
const path = require('path');
const Receipt = require('../models/Receipt');

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/receipts/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

router.post("/register", async (req, res) => {
  const { email, ...rest } = req.body;

  try {
    const student = await Student.findOneAndUpdate(
      { email }, // 🔍 Match by email
      { email, ...rest }, // 🆕 Replace fields
      { upsert: true, new: true } // ✅ Create if not exists
    );
    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Example GET request: GET http://localhost:5000/api/students/studentemail@gmail.com
router.get("/:email", async (req, res) => {
  const email = req.params.email.trim(); // removes any \n or space
  console.log("Looking for email:", email);

  try {
    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/allocate/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ error: "Student not found" });

    if (student.roomNumber) {
      return res.json({ message: "Already allocated", roomNumber: student.roomNumber });
    }

    // Determine block
    const block = student.gender === "Male" ? "A" : "B";
    const roomPrefix = block === "A" ? "A-" : "B-";
    const roomStart = block === "A" ? 101 : 101;
    const roomEnd = block === "A" ? 120 : 120;

    // Get all students of same block
    const allStudents = await Student.find({ gender: student.gender });

    const roomOccupancy = {};

    for (let s of allStudents) {
      if (s.roomNumber) {
        if (!roomOccupancy[s.roomNumber]) {
          roomOccupancy[s.roomNumber] = [];
        }
        roomOccupancy[s.roomNumber].push(s);
      }
    }

    let assignedRoom = null;

    for (let i = roomStart; i <= roomEnd; i++) {
      const roomNumber = `${roomPrefix}${i}`;
      const occupants = roomOccupancy[roomNumber] || [];

      if (
        occupants.length < 2 &&
        (occupants.length === 0 ||
          (occupants[0].department === student.department &&
           occupants[0].year === student.year))
      ) {
        assignedRoom = roomNumber;
        break;
      }
    }

    if (!assignedRoom) {
      return res.status(500).json({ error: "No suitable room available" });
    }

    student.roomNumber = assignedRoom;
    await student.save();

    res.json({ roomNumber: assignedRoom });
  } catch (err) {
    console.error("Allocation error:", err.message);
    res.status(500).json({ error: "Allocation failed" });
  }
});

router.post("/login", async (req, res) => { 
  const { email, password } = req.body; 

  try { 
    // 1. Check if payment exists 
    const payment = await Transaction.findOne({ email }); 
    if (!payment) { 
      return res.status(401).json({ error: "No payment record found for this email" }); 
    } 

    // 2. Check if student with matching password exists 
    const student = await Student.findOne({ email, password }); 
    if (!student) { 
      return res.status(401).json({ error: "Incorrect email or password" }); 
    } 

    // 3. Login success 
    res.json({ success: true, student }); 
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  } 
});

router.get("/residents/all", async (req, res) => { 
  try { 
    const residents = await Student.find({ roomNumber: { $ne: null } }); 
    res.json(residents); 
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  } 
});

// 📩 POST complaint by student 
router.post("/complaint/:email", async (req, res) => { 
  const email = req.params.email; 
  const { complaint } = req.body; 

  try { 
    const student = await Student.findOne({ email }); 
    if (!student) return res.status(404).json({ error: "Student not found" }); 

    student.complaint = complaint; 
    await student.save(); 

    res.json({ success: true }); 
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  } 
}); 

// ✅ GET only students with complaints 
router.get("/complaints/all", async (req, res) => { 
  try { 
    const studentsWithComplaints = await Student.find({ complaint: { $ne: null } }); 
    res.json(studentsWithComplaints); 
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  } 
}); 

// ❌ Clear complaint after resolved
router.post("/resolve-complaint/:email", async (req, res) => {
  const email = req.params.email.trim(); // ✅ Trim to ensure match
  try {
    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ error: "Student not found" });

    student.complaint = ""; // Clear the complaint
    await student.save();

    res.json({ success: true, message: "Complaint marked as resolved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset password endpoint
router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ error: "Student not found" });

    student.password = newPassword;
    await student.save();

    res.json({ success: true, message: "Password updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/phone/:phone", async (req, res) => {
  const student = await Student.findOne({ phone: req.params.phone });
  if (!student) return res.status(404).json({ error: "Not found" });
  res.json(student);
});


// Upload Receipt
router.post('/upload-receipt', upload.single('receipt'), async (req, res) => {
  try {
    const { studentName, email, roomNumber } = req.body;
    const newReceipt = new Receipt({
      studentName,
      email,
      roomNumber,
      receiptUrl: `http://localhost:5000/uploads/receipts/${req.file.filename}`,
    });
    await newReceipt.save();
    res.json({ success: true, message: 'Uploaded successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get All Receipts
router.get('/receipts/all', async (req, res) => {
  const receipts = await Receipt.find().sort({ uploadedAt: -1 });
  res.json(receipts);
});

// Delete a Receipt
router.delete('/receipts/:id', async (req, res) => {
  try {
    await Receipt.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

// Get all students
router.get("/all", async (req, res) => {
  try {
    const students = await Student.find({});
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all receipts
router.get("/receipts/all", async (req, res) => {
  try {
    const receipts = await Receipt.find({});
    res.json(receipts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload receipt endpoint
router.post("/upload-receipt", upload.single('receipt'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const receipt = new Receipt({
      studentName: req.body.studentName,
      email: req.body.email,
      roomNumber: req.body.roomNumber,
      receiptUrl: `/uploads/receipts/${req.file.filename}`
    });

    await receipt.save();
    res.json({ success: true, receipt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
