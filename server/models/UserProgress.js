const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  completedTopics: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userProgressSchema.index({ user: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);
