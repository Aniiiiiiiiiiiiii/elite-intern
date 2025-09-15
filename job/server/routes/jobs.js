const express = require('express');
const Job = require('../models/Job');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all jobs with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalJobs = await Job.countDocuments();
    const totalPages = Math.ceil(totalJobs / limit);

    res.json({
      jobs,
      currentPage: page,
      totalPages,
      totalJobs,
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search jobs
router.get('/search', async (req, res) => {
  try {
    const { title, location } = req.query;
    const query = {};

    if (title) {
      query.$or = [
        { title: { $regex: title, $options: 'i' } },
        { description: { $regex: title, $options: 'i' } },
        { company: { $regex: title, $options: 'i' } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error('Error searching jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create job (protected route)
router.post('/', auth, async (req, res) => {
  try {
    const { title, company, location, description, salary, type } = req.body;
    
    const job = new Job({
      title,
      company,
      location,
      description,
      salary,
      type,
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update job (protected route)
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, company, location, description, salary, type } = req.body;
    
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { title, company, location, description, salary, type },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete job (protected route)
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;