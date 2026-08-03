const Timetable = require('../models/Timetable');

// GET /api/timetable
const getTimetable = async (req, res) => {
  try {
    const userSection = req.user?.section || 'Section A';
    const entries = await Timetable.find({ section: userSection })
      .populate('subject', 'name code ltpc')
      .sort({ day: 1, startTime: 1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching timetable' });
  }
};

// POST /api/timetable (Admin only)
const createTimetableEntry = async (req, res) => {
  try {
    const { day, startTime, endTime, subject, room, teacher, section } = req.body;
    if (!day || !startTime || !endTime || !subject) {
      return res.status(400).json({ message: 'Day, startTime, endTime, and subject are required' });
    }

    const entry = new Timetable({
      day,
      startTime,
      endTime,
      subject,
      room: room || 'LT-3',
      teacher: teacher || '',
      section: section || 'Section A',
    });

    await entry.save();
    const populated = await Timetable.findById(entry._id).populate('subject', 'name code ltpc');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error creating timetable entry' });
  }
};

// PUT /api/timetable/:id (Admin only)
const updateTimetableEntry = async (req, res) => {
  try {
    const { day, startTime, endTime, subject, room, teacher, section } = req.body;
    const entry = await Timetable.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Timetable entry not found' });
    }

    if (day) entry.day = day;
    if (startTime) entry.startTime = startTime;
    if (endTime) entry.endTime = endTime;
    if (subject) entry.subject = subject;
    if (room !== undefined) entry.room = room;
    if (teacher !== undefined) entry.teacher = teacher;
    if (section) entry.section = section;

    await entry.save();
    const populated = await Timetable.findById(entry._id).populate('subject', 'name code ltpc');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error updating timetable entry' });
  }
};

// DELETE /api/timetable/:id (Admin only)
const deleteTimetableEntry = async (req, res) => {
  try {
    const entry = await Timetable.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: 'Timetable entry not found' });
    }

    await entry.deleteOne();
    res.json({ message: 'Timetable entry deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error deleting timetable entry' });
  }
};

module.exports = {
  getTimetable,
  createTimetableEntry,
  updateTimetableEntry,
  deleteTimetableEntry,
};
