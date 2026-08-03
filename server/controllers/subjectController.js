const Subject = require('../models/Subject');
const UserProgress = require('../models/UserProgress');
const Topic = require('../models/Topic');

// GET /api/subjects
const getSubjects = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch global Section A subjects as well as any custom subjects created by this user
    const subjects = await Subject.find({
      $or: [{ isGlobal: true }, { user: userId }],
    }).sort({ semester: 1, code: 1, createdAt: -1 });

    // Fetch user progress records for all these subjects
    const subjectIds = subjects.map((s) => s._id);
    const progressList = await UserProgress.find({
      user: userId,
      subject: { $in: subjectIds },
    });

    const progressMap = {};
    progressList.forEach((p) => {
      progressMap[p.subject.toString()] = p.completedTopics.map((id) => id.toString());
    });

    const formattedSubjects = subjects.map((subject) => {
      let totalTopics = 0;
      let unitsCount = 0;

      if (subject.units && subject.units.length > 0) {
        unitsCount = subject.units.length;
        totalTopics = subject.units.reduce((acc, u) => acc + (u.topics ? u.topics.length : 0), 0);
      } else {
        totalTopics = subject.totalTopics || 0;
      }

      const completedTopicIds = progressMap[subject._id.toString()] || [];
      const completedTopics = completedTopicIds.length;
      const progressPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

      return {
        _id: subject._id,
        name: subject.name,
        code: subject.code || 'SEC-A',
        semester: subject.semester || 5,
        ltpc: subject.ltpc || '3-0-0-3',
        section: subject.section || 'Section A',
        description: subject.description || '',
        isGlobal: subject.isGlobal,
        user: subject.user,
        unitsCount,
        totalTopics,
        completedTopics,
        progressPercentage,
        createdAt: subject.createdAt,
      };
    });

    res.json(formattedSubjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/subjects/:id
const getSubjectById = async (req, res) => {
  try {
    const userId = req.user._id;
    const subjectId = req.params.id;

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Fetch user progress for this subject
    let userProgress = await UserProgress.findOne({ user: userId, subject: subjectId });
    const completedSet = new Set(
      userProgress ? userProgress.completedTopics.map((id) => id.toString()) : []
    );

    let formattedUnits = [];
    let totalTopics = 0;
    let totalCompleted = 0;

    if (subject.units && subject.units.length > 0) {
      formattedUnits = subject.units.map((unit) => {
        const unitTopics = (unit.topics || []).map((t) => {
          const isCompleted = completedSet.has(t._id.toString());
          if (isCompleted) totalCompleted++;
          totalTopics++;
          return {
            _id: t._id,
            title: t.title,
            completed: isCompleted,
          };
        });

        const unitCompletedCount = unitTopics.filter((t) => t.completed).length;
        const unitTotalCount = unitTopics.length;
        const unitPercentage = unitTotalCount > 0 ? Math.round((unitCompletedCount / unitTotalCount) * 100) : 0;

        return {
          _id: unit._id,
          unitNumber: unit.unitNumber,
          title: unit.title,
          totalTopics: unitTotalCount,
          completedTopics: unitCompletedCount,
          progressPercentage: unitPercentage,
          topics: unitTopics,
        };
      });
    } else {
      // Fallback for legacy flat topic subjects if any exist
      const legacyTopics = await Topic.find({ subjectId });
      totalTopics = legacyTopics.length;
      totalCompleted = legacyTopics.filter((t) => t.completed).length;
    }

    const overallPercentage = totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 0;

    res.json({
      _id: subject._id,
      name: subject.name,
      code: subject.code || 'SEC-A',
      semester: subject.semester || 5,
      ltpc: subject.ltpc || '3-0-0-3',
      section: subject.section || 'Section A',
      description: subject.description || '',
      isGlobal: subject.isGlobal,
      user: subject.user,
      totalTopics,
      completedTopics: totalCompleted,
      progressPercentage: overallPercentage,
      units: formattedUnits,
      createdAt: subject.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/subjects/:id/toggle-topic
const toggleTopicCompletion = async (req, res) => {
  try {
    const userId = req.user._id;
    const subjectId = req.params.id;
    const { topicId, completed } = req.body;

    if (!topicId) {
      return res.status(400).json({ message: 'Topic ID is required' });
    }

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    let userProgress = await UserProgress.findOne({ user: userId, subject: subjectId });
    if (!userProgress) {
      userProgress = new UserProgress({
        user: userId,
        subject: subjectId,
        completedTopics: [],
      });
    }

    const topicIdStr = topicId.toString();
    const index = userProgress.completedTopics.findIndex((id) => id.toString() === topicIdStr);

    let isCompletedNow = false;
    if (completed !== undefined) {
      if (completed && index === -1) {
        userProgress.completedTopics.push(topicId);
        isCompletedNow = true;
      } else if (!completed && index !== -1) {
        userProgress.completedTopics.splice(index, 1);
        isCompletedNow = false;
      } else {
        isCompletedNow = Boolean(completed);
      }
    } else {
      if (index === -1) {
        userProgress.completedTopics.push(topicId);
        isCompletedNow = true;
      } else {
        userProgress.completedTopics.splice(index, 1);
        isCompletedNow = false;
      }
    }

    userProgress.updatedAt = new Date();
    await userProgress.save();

    // Calculate updated stats
    const completedSet = new Set(userProgress.completedTopics.map((id) => id.toString()));
    let totalTopics = 0;
    let totalCompleted = 0;

    if (subject.units && subject.units.length > 0) {
      subject.units.forEach((unit) => {
        (unit.topics || []).forEach((t) => {
          totalTopics++;
          if (completedSet.has(t._id.toString())) {
            totalCompleted++;
          }
        });
      });
    }

    const overallPercentage = totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 0;

    res.json({
      success: true,
      topicId,
      completed: isCompletedNow,
      totalTopics,
      completedTopics: totalCompleted,
      progressPercentage: overallPercentage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/subjects (Create custom subject)
const createSubject = async (req, res) => {
  try {
    const { name, code, semester, ltpc, description, units } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Subject name is required' });
    }

    const subject = new Subject({
      name: name.trim(),
      code: code ? code.trim().toUpperCase() : 'CUSTOM-101',
      semester: semester || 5,
      ltpc: ltpc || '3-0-0-3',
      section: 'Section A',
      description: description || '',
      isGlobal: false,
      user: req.user._id,
      units: units || [],
    });

    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/subjects/:id
const updateSubject = async (req, res) => {
  try {
    const { name, code, semester, ltpc, description } = req.body;
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    if (name) subject.name = name.trim();
    if (code) subject.code = code.trim().toUpperCase();
    if (semester) subject.semester = semester;
    if (ltpc) subject.ltpc = ltpc.trim();
    if (description !== undefined) subject.description = description.trim();

    await subject.save();
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/subjects/:id
const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Allow deleting custom subjects or resetting progress for global subjects
    if (subject.isGlobal) {
      await UserProgress.deleteMany({ subject: req.params.id, user: req.user._id });
      return res.json({ message: 'Progress for global subject reset successfully.' });
    }

    await UserProgress.deleteMany({ subject: req.params.id });
    await Subject.findByIdAndDelete(req.params.id);

    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSubjects,
  getSubjectById,
  toggleTopicCompletion,
  createSubject,
  updateSubject,
  deleteSubject,
};
