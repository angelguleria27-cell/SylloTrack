const Subject = require('../models/Subject');
const Assignment = require('../models/Assignment');
const Announcement = require('../models/Announcement');
const Timetable = require('../models/Timetable');
const User = require('../models/User');
const UserProgress = require('../models/UserProgress');

// GET /api/admin/overview (Admin only)
const getOverview = async (req, res) => {
  try {
    const [
      subjects,
      assignments,
      announcements,
      timetableEntries,
      students,
      recentProgress,
    ] = await Promise.all([
      Subject.find({ isGlobal: true }),
      Assignment.find({}).populate('subject', 'name code').sort({ dueDate: 1 }),
      Announcement.find({}).sort({ createdAt: -1 }).limit(5),
      Timetable.find({}).populate('subject', 'name code'),
      User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 }),
      UserProgress.find({})
        .populate('user', 'name email')
        .populate('subject', 'name code')
        .sort({ updatedAt: -1 })
        .limit(10),
    ]);

    let totalUnits = 0;
    let totalTopics = 0;
    subjects.forEach((s) => {
      if (s.units && s.units.length > 0) {
        totalUnits += s.units.length;
        s.units.forEach((u) => {
          totalTopics += (u.topics ? u.topics.length : 0);
        });
      } else {
        totalTopics += (s.totalTopics || 0);
      }
    });

    const now = new Date();
    const upcomingDeadlines = assignments.filter((a) => new Date(a.dueDate) >= now);

    res.json({
      summary: {
        totalSubjects: subjects.length,
        totalUnits,
        totalTopics,
        totalAssignments: assignments.length,
        upcomingDeadlinesCount: upcomingDeadlines.length,
        totalStudents: students.length,
        totalAnnouncements: announcements.length,
        totalTimetableEntries: timetableEntries.length,
      },
      recentStudents: students.slice(0, 10),
      upcomingDeadlines: upcomingDeadlines.slice(0, 5),
      recentAnnouncements: announcements,
      recentStudentActivity: recentProgress.map((p) => ({
        _id: p._id,
        studentName: p.user?.name || 'Unknown Student',
        studentEmail: p.user?.email || '',
        subjectName: p.subject?.name || 'Unknown Subject',
        completedCount: p.completedTopics ? p.completedTopics.length : 0,
        updatedAt: p.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching admin overview:', error);
    res.status(500).json({ message: error.message || 'Error loading admin dashboard stats' });
  }
};

module.exports = {
  getOverview,
};
