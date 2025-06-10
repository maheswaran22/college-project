const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const studentRoutes = require("./routes/studentRoutes");
const paymentRoutes = require("./routes/paymentRoute");
const chatRoutes = require("./routes/chatRoutes");
const path = require('path');
const announcementsRouter = require('./routes/announcements');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from uploads/receipts directory
app.use('/uploads/receipts', express.static(path.join(__dirname, 'uploads/receipts')));

// Connect MongoDB
mongoose.connect("mongodb://localhost:27017/chatbotdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("DB error:", err));

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/chatbot", chatRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/announcements', announcementsRouter);
app.listen(5000, () => console.log("✅ Backend running on http://localhost:5000"));
