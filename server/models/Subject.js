const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
});

const unitSchema = new mongoose.Schema({
  unitNumber: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  topics: [topicSchema],
});

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true,
  },
  code: {
    type: String,
    required: [true, 'Subject code is required'],
    trim: true,
    uppercase: true,
  },
  semester: {
    type: Number,
    required: true,
    default: 5,
  },
  ltpc: {
    type: String,
    default: '3-0-0-3',
  },
  section: {
    type: String,
    default: 'Section A',
  },
  description: {
    type: String,
    default: '',
  },
  isGlobal: {
    type: Boolean,
    default: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  units: [unitSchema],
  totalTopics: {
    type: Number,
    default: 0,
  },
  completedTopics: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Subject', subjectSchema);
