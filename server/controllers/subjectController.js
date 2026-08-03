const Subject = require('../models/Subject');
const Topic = require('../models/Topic');

// Helper to recalculate and sync subject stats
const updateSubjectStats = async (subjectId) => {
  const totalTopics = await Topic.countDocuments({ subjectId });
  const completedTopics = await Topic.countDocuments({ subjectId, completed: true });
  await Subject.findByIdAndUpdate(subjectId, { totalTopics, completedTopics });
  return { totalTopics, completedTopics };
};

// GET /api/subjects
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/subjects/:id
const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, user: req.user._id });
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/subjects
const createSubject = async (req, res) => {
  try {
    const { name, topics } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Subject name is required' });
    }

    const subject = new Subject({
      name: name.trim(),
      user: req.user._id,
    });
    await subject.save();

    let createdTopics = [];
    if (Array.isArray(topics) && topics.length > 0) {
      const topicDocs = topics
        .filter(t => (typeof t === 'string' ? t.trim() : t.title && t.title.trim()))
        .map(t => ({
          subjectId: subject._id,
          title: typeof t === 'string' ? t.trim() : t.title.trim(),
          completed: typeof t === 'object' && t.completed ? true : false,
          completedAt: typeof t === 'object' && t.completed ? new Date() : null,
        }));

      if (topicDocs.length > 0) {
        createdTopics = await Topic.insertMany(topicDocs);
      }
    }

    await updateSubjectStats(subject._id);
    const updatedSubject = await Subject.findById(subject._id);

    res.status(201).json({
      subject: updatedSubject,
      topics: createdTopics,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/subjects/:id
const updateSubject = async (req, res) => {
  try {
    const { name } = req.body;
    const subject = await Subject.findOne({ _id: req.params.id, user: req.user._id });
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    if (name && name.trim() !== '') {
      subject.name = name.trim();
    }
    await subject.save();

    await updateSubjectStats(subject._id);
    const updatedSubject = await Subject.findById(subject._id);

    res.json(updatedSubject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/subjects/:id
const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, user: req.user._id });
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    await Topic.deleteMany({ subjectId: req.params.id });
    await Subject.findByIdAndDelete(req.params.id);

    res.json({ message: 'Subject and associated topics deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
  updateSubjectStats,
};
