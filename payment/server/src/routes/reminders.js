import express from 'express';
import Reminder from '../models/Reminder.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all reminders for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user._id })
      .sort({ dueDate: 1 }); // Sort by due date, earliest first

    res.json(reminders);
  } catch (error) {
    console.error('Get reminders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new reminder
router.post('/', auth, async (req, res) => {
  try {
    const { title, amount, dueDate, frequency } = req.body;

    const reminder = new Reminder({
      title,
      amount,
      dueDate,
      frequency,
      userId: req.user._id,
    });

    await reminder.save();
    res.status(201).json(reminder);
  } catch (error) {
    console.error('Create reminder error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a reminder
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, amount, dueDate, frequency } = req.body;

    const reminder = await Reminder.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    reminder.title = title || reminder.title;
    reminder.amount = amount || reminder.amount;
    reminder.dueDate = dueDate || reminder.dueDate;
    reminder.frequency = frequency || reminder.frequency;

    await reminder.save();
    res.json(reminder);
  } catch (error) {
    console.error('Update reminder error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a reminder
router.delete('/:id', auth, async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    console.error('Delete reminder error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;