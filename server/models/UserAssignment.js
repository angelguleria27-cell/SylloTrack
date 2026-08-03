const mongoose = require('mongoose');

const userAssignmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
  },
  submitted: {
    type: Boolean,
    default: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

userAssignmentSchema.index({ user: 1, assignment: 1 }, { unique: true });

module.exports = mongoose.model('UserAssignment', userAssignmentSchema);
