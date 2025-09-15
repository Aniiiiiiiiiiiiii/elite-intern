const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
  },
}, {
  timestamps: true,
});

// Text index for search functionality
jobSchema.index({ title: 'text', description: 'text', company: 'text' });

module.exports = mongoose.model('Job', jobSchema);