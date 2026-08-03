const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getSchedule,
  createScheduleBlock,
  updateScheduleBlock,
  toggleScheduleBlock,
  deleteScheduleBlock,
  autoGenerateSchedule,
} = require('../controllers/scheduleController');

router.route('/')
  .get(protect, getSchedule)
  .post(protect, createScheduleBlock);

router.post('/auto-generate', protect, autoGenerateSchedule);

router.route('/:id')
  .put(protect, updateScheduleBlock)
  .delete(protect, deleteScheduleBlock);

router.patch('/:id/toggle', protect, toggleScheduleBlock);

module.exports = router;
