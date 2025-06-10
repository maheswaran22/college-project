const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Create announcement schema
const announcementSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Announcement = mongoose.model('Announcement', announcementSchema);

// Get all announcements
router.get('/all', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add new announcement
router.post('/add', async (req, res) => {
  try {
    const { text } = req.body;
    const announcement = new Announcement({
      text,
      createdAt: new Date()
    });
    await announcement.save();
    res.json({ success: true, announcement });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete announcement
router.delete('/delete/:id', async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;