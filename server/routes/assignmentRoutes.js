const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  toggleAssignmentSubmitted,
} = require('../controllers/assignmentController');

router.get('/', protect, getAssignments);
router.post('/', protect, admin, createAssignment);
router.put('/:id', protect, admin, updateAssignment);
router.delete('/:id', protect, admin, deleteAssignment);
router.patch('/:id/submit', protect, toggleAssignmentSubmitted);

module.exports = router;
