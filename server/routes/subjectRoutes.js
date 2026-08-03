const express = require('express');
const router = express.Router();
const {
  getSubjects,
  getSubjectById,
  toggleTopicCompletion,
  createSubject,
  updateSubject,
  deleteSubject,
  addUnit,
  updateUnit,
  deleteUnit,
  addTopicToUnit,
  updateTopicInUnit,
  deleteTopicFromUnit,
} = require('../controllers/subjectController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getSubjects)
  .post(createSubject);

router.post('/:id/toggle-topic', toggleTopicCompletion);

router.route('/:id')
  .get(getSubjectById)
  .put(admin, updateSubject)
  .delete(deleteSubject);

// Admin Unit routes
router.post('/:id/units', admin, addUnit);
router.put('/:id/units/:unitId', admin, updateUnit);
router.delete('/:id/units/:unitId', admin, deleteUnit);

// Admin Topic inside Unit routes
router.post('/:id/units/:unitId/topics', admin, addTopicToUnit);
router.put('/:id/units/:unitId/topics/:topicId', admin, updateTopicInUnit);
router.delete('/:id/units/:unitId/topics/:topicId', admin, deleteTopicFromUnit);

module.exports = router;
