const Assignment = require('../models/Assignment');
const UserAssignment = require('../models/UserAssignment');
const Event = require('../models/Event');

// GET /api/assignments
const getAssignments = async (req, res) => {
  try {
    const userId = req.user._id;

    const assignments = await Assignment.find({ section: 'Section A' })
      .populate('subject', 'name code')
      .sort({ dueDate: 1 });

    const userSubmissions = await UserAssignment.find({ user: userId });
    const submittedSet = new Set(userSubmissions.filter(s => s.submitted).map(s => s.assignment.toString()));

    const formattedAssignments = assignments.map((a) => {
      const isSubmitted = submittedSet.has(a._id.toString());
      return {
        _id: a._id,
        title: a.title,
        subject: a.subject,
        dueDate: a.dueDate,
        dueTime: a.dueTime,
        description: a.description,
        priority: a.priority,
        section: a.section,
        submitted: isSubmitted,
        createdAt: a.createdAt,
      };
    });

    res.json(formattedAssignments);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching assignments' });
  }
};

// POST /api/assignments (Admin only)
const createAssignment = async (req, res) => {
  try {
    const { title, subject, dueDate, dueTime, description, priority, section } = req.body;
    if (!title || !title.trim() || !subject || !dueDate) {
      return res.status(400).json({ message: 'Title, subject, and due date are required' });
    }

    const assignment = new Assignment({
      title: title.trim(),
      subject,
      dueDate: new Date(dueDate),
      dueTime: dueTime || '23:59',
      description: description || '',
      priority: priority || 'medium',
      section: section || 'Section A',
      createdBy: req.user._id,
    });

    await assignment.save();

    // Sync into Event calendar system as an assignment deadline for general visibility
    try {
      await Event.create({
        user: req.user._id,
        title: `[Assignment] ${title.trim()}`,
        type: 'assignment',
        subject: subject,
        date: new Date(dueDate),
        time: dueTime || '23:59',
        priority: priority || 'medium',
        description: description || 'Master section assignment created by admin.',
      });
    } catch (e) {
      console.error('Failed to mirror assignment to Event model:', e.message);
    }

    const populated = await Assignment.findById(assignment._id).populate('subject', 'name code');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error creating assignment' });
  }
};

// PUT /api/assignments/:id (Admin only)
const updateAssignment = async (req, res) => {
  try {
    const { title, subject, dueDate, dueTime, description, priority, section } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (title) assignment.title = title.trim();
    if (subject) assignment.subject = subject;
    if (dueDate) assignment.dueDate = new Date(dueDate);
    if (dueTime !== undefined) assignment.dueTime = dueTime;
    if (description !== undefined) assignment.description = description;
    if (priority) assignment.priority = priority;
    if (section) assignment.section = section;

    await assignment.save();
    const populated = await Assignment.findById(assignment._id).populate('subject', 'name code');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error updating assignment' });
  }
};

// DELETE /api/assignments/:id (Admin only)
const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    await UserAssignment.deleteMany({ assignment: req.params.id });
    await assignment.deleteOne();
    res.json({ message: 'Assignment deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error deleting assignment' });
  }
};

// PATCH /api/assignments/:id/submit (Student toggle submission)
const toggleAssignmentSubmitted = async (req, res) => {
  try {
    const userId = req.user._id;
    const assignmentId = req.params.id;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    let userAssig = await UserAssignment.findOne({ user: userId, assignment: assignmentId });
    if (!userAssig) {
      userAssig = new UserAssignment({
        user: userId,
        assignment: assignmentId,
        submitted: true,
      });
    } else {
      userAssig.submitted = !userAssig.submitted;
      userAssig.submittedAt = new Date();
    }

    await userAssig.save();
    res.json({
      assignmentId,
      submitted: userAssig.submitted,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error toggling assignment submission status' });
  }
};

module.exports = {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  toggleAssignmentSubmitted,
};
