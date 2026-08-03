const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getTimetable,
  createTimetableEntry,
  updateTimetableEntry,
  deleteTimetableEntry,
} = require('../controllers/timetableController');

router.get('/', protect, getTimetable);
router.post('/', protect, admin, createTimetableEntry);
router.put('/:id', protect, admin, updateTimetableEntry);
router.delete('/:id', protect, admin, deleteTimetableEntry);

module.exports = router;
