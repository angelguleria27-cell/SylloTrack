const express = require('express');
const router = express.Router();
const {
  getSubjects,
  getSubjectById,
  toggleTopicCompletion,
  createSubject,
  updateSubject,
  deleteSubject,
} = require('../controllers/subjectController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getSubjects)
  .post(createSubject);

router.post('/:id/toggle-topic', toggleTopicCompletion);

router.route('/:id')
  .get(getSubjectById)
  .put(updateSubject)
  .delete(deleteSubject);

module.exports = router;
