const express = require('express');
const SavedJob = require('../models/SavedJob');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's saved jobs
router.get('/', auth, async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ user: req.user._id })
      .populate('job')
      .sort({ createdAt: -1 });

    res.json(savedJobs);
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save a job
router.post('/', auth, async (req, res) => {
  try {
    const { jobId } = req.body;

    // Check if job is already saved
    const existingSavedJob = await SavedJob.findOne({
      user: req.user._id,
      job: jobId,
    });

    if (existingSavedJob) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    const savedJob = new SavedJob({
      user: req.user._id,
      job: jobId,
    });

    await savedJob.save();
    await savedJob.populate('job');

    res.status(201).json(savedJob);
  } catch (error) {
    console.error('Error saving job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove saved job
router.delete('/:jobId', auth, async (req, res) => {
  try {
    const savedJob = await SavedJob.findOneAndDelete({
      user: req.user._id,
      job: req.params.jobId,
    });

    if (!savedJob) {
      return res.status(404).json({ message: 'Saved job not found' });
    }

    res.json({ message: 'Job removed from saved jobs' });
  } catch (error) {
    console.error('Error removing saved job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;