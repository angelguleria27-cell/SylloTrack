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
          unitName: unit.title,
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

// POST /api/subjects (Create subject)
const createSubject = async (req, res) => {
  try {
    const { name, code, semester, ltpc, description, units, topics, isGlobal } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Subject name is required' });
    }

    const isAdmin = req.user && req.user.role === 'admin';

    let initialUnits = units || [];
    if ((!initialUnits || initialUnits.length === 0) && topics && Array.isArray(topics) && topics.length > 0) {
      const validTopics = topics
        .map((t) => (typeof t === 'string' ? t.trim() : (t && t.title ? t.title.trim() : '')))
        .filter((t) => t.length > 0);
      if (validTopics.length > 0) {
        initialUnits = [
          {
            unitNumber: 1,
            title: 'General Topics',
            topics: validTopics.map((title) => ({ title })),
          },
        ];
      }
    }

    const subject = new Subject({
      name: name.trim(),
      code: code ? code.trim().toUpperCase() : 'CUSTOM-101',
      semester: semester || 5,
      ltpc: ltpc || '3-0-0-3',
      section: req.user?.section || 'Section A',
      description: description || '',
      isGlobal: isAdmin ? (isGlobal !== undefined ? isGlobal : true) : false,
      user: isAdmin ? null : req.user._id,
      units: initialUnits,
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

    const isAdmin = req.user && req.user.role === 'admin';
    if (!isAdmin && subject.user && subject.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this subject' });
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

    const isAdmin = req.user && req.user.role === 'admin';

    if (subject.isGlobal) {
      if (!isAdmin) {
        await UserProgress.deleteMany({ subject: req.params.id, user: req.user._id });
        return res.json({ message: 'Progress for global subject reset successfully.' });
      }
    } else {
      if (!isAdmin && subject.user && subject.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this subject' });
      }
    }

    await UserProgress.deleteMany({ subject: req.params.id });
    await Subject.findByIdAndDelete(req.params.id);

    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/subjects/:id/units (Add Unit)
const addUnit = async (req, res) => {
  try {
    const { unitNumber, title, topics } = req.body;
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const newUnit = {
      unitNumber: unitNumber || (subject.units ? subject.units.length + 1 : 1),
      title: title ? title.trim() : `Unit ${subject.units.length + 1}`,
      topics: (topics || []).map((t) => ({ title: typeof t === 'string' ? t.trim() : t.title.trim() })),
    };

    subject.units.push(newUnit);
    await subject.save();

    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/subjects/:id/units/:unitId (Update Unit)
const updateUnit = async (req, res) => {
  try {
    const { unitNumber, title } = req.body;
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const unit = subject.units.id(req.params.unitId);
    if (!unit) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    if (unitNumber) unit.unitNumber = unitNumber;
    if (title) unit.title = title.trim();

    await subject.save();
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/subjects/:id/units/:unitId (Delete Unit)
const deleteUnit = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const unitIndex = subject.units.findIndex((u) => u._id.toString() === req.params.unitId);
    if (unitIndex === -1) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    subject.units.splice(unitIndex, 1);
    await subject.save();

    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/subjects/:id/units/:unitId/topics (Add Topic to Unit)
const addTopicToUnit = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Topic title is required' });
    }

    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const unit = subject.units.id(req.params.unitId);
    if (!unit) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    unit.topics.push({ title: title.trim() });
    await subject.save();

    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/subjects/:id/units/:unitId/topics/:topicId (Update Topic in Unit)
const updateTopicInUnit = async (req, res) => {
  try {
    const { title } = req.body;
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const unit = subject.units.id(req.params.unitId);
    if (!unit) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    const topic = unit.topics.id(req.params.topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    if (title) topic.title = title.trim();
    await subject.save();

    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/subjects/:id/units/:unitId/topics/:topicId (Delete Topic from Unit)
const deleteTopicFromUnit = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const unit = subject.units.id(req.params.unitId);
    if (!unit) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    const topicIndex = unit.topics.findIndex((t) => t._id.toString() === req.params.topicId);
    if (topicIndex === -1) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    unit.topics.splice(topicIndex, 1);
    await subject.save();

    res.json(subject);
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
  addUnit,
  updateUnit,
  deleteUnit,
  addTopicToUnit,
  updateTopicInUnit,
  deleteTopicFromUnit,
};
