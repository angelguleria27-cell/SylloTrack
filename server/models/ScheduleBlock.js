const mongoose = require('mongoose');

const scheduleBlockSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: [true, 'Date (YYYY-MM-DD) is required'],
  },
  startTime: {
    type: String, // Format: HH:mm (e.g. "09:00")
    required: [true, 'Start time is required'],
  },
  endTime: {
    type: String, // Format: HH:mm (e.g. "10:30")
    required: [true, 'End time is required'],
  },
  title: {
    type: String,
    required: [true, 'Schedule title is required'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['study', 'exam', 'assignment', 'break', 'other'],
    default: 'study',
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    default: null,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ScheduleBlock', scheduleBlockSchema);
