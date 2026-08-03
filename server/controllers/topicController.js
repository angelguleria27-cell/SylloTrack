const Topic = require('../models/Topic');
const Subject = require('../models/Subject');
const { updateSubjectStats } = require('./subjectController');

// GET /api/topics/:subjectId
const getTopicsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const isAdmin = req.user && req.user.role === 'admin';

    // Verify subject ownership or global access
    const subject = await Subject.findOne(
      isAdmin
        ? { _id: subjectId }
        : { _id: subjectId, $or: [{ isGlobal: true }, { user: req.user._id }] }
    );
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const topics = await Topic.find({ subjectId }).sort({ createdAt: 1 });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/topics
const createTopic = async (req, res) => {
  try {
    const { subjectId, title, completed } = req.body;
    if (!subjectId) {
      return res.status(400).json({ message: 'Subject ID is required' });
    }
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Topic title is required' });
    }

    const isAdmin = req.user && req.user.role === 'admin';

    // Verify subject ownership or global access
    const subject = await Subject.findOne(
      isAdmin
        ? { _id: subjectId }
        : { _id: subjectId, $or: [{ isGlobal: true }, { user: req.user._id }] }
    );
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const isCompleted = Boolean(completed);
    const topic = new Topic({
      subjectId,
      title: title.trim(),
      completed: isCompleted,
      completedAt: isCompleted ? new Date() : null,
    });

    await topic.save();

    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/topics/:id
const updateTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const topic = await Topic.findById(id);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    const isAdmin = req.user && req.user.role === 'admin';
    const subject = await Subject.findOne(
      isAdmin
        ? { _id: topic.subjectId }
        : { _id: topic.subjectId, $or: [{ isGlobal: true }, { user: req.user._id }] }
    );
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found or access denied' });
    }

    if (title !== undefined && title.trim() !== '') {
      topic.title = title.trim();
    }

    if (completed !== undefined) {
      const isCompleted = Boolean(completed);
      if (topic.completed !== isCompleted) {
        topic.completed = isCompleted;
        topic.completedAt = isCompleted ? new Date() : null;
      }
    }

    await topic.save();
    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/topics/:id
const deleteTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const topic = await Topic.findById(id);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    const isAdmin = req.user && req.user.role === 'admin';
    const subject = await Subject.findOne(
      isAdmin
        ? { _id: topic.subjectId }
        : { _id: topic.subjectId, $or: [{ isGlobal: true }, { user: req.user._id }] }
    );
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found or access denied' });
    }

    await Topic.findByIdAndDelete(id);
    res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTopicsBySubject,
  createTopic,
  updateTopic,
  deleteTopic,
};
