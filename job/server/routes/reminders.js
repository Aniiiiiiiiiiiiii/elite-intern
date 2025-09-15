const express = require('express');
const Reminder = require('../models/Reminder');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's reminders
router.get('/', auth, async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user._id })
      .sort({ dueDate: 1 });

    res.json(reminders);
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create reminder
router.post('/', auth, async (req, res) => {
  try {
    const { title, dueDate, notes } = req.body;

    const reminder = new Reminder({
      user: req.user._id,
      title,
      dueDate: new Date(dueDate),
      notes,
    });

    await reminder.save();
    res.status(201).json(reminder);
  } catch (error) {
    console.error('Error creating reminder:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update reminder
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, dueDate, notes } = req.body;

    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, dueDate: new Date(dueDate), notes },
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    res.json(reminder);
  } catch (error) {
    console.error('Error updating reminder:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete reminder
router.delete('/:id', auth, async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;