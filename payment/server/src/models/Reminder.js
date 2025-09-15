import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  frequency: {
    type: String,
    enum: ['once', 'weekly', 'monthly', 'yearly'],
    default: 'once',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Index for efficient querying
reminderSchema.index({ userId: 1, dueDate: 1 });

export default mongoose.model('Reminder', reminderSchema);