const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const topicRoutes = require('./routes/topicRoutes');
const eventRoutes = require('./routes/eventRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const adminRoutes = require('./routes/adminRoutes');

const seedSubjects = require('./config/seedSubjects');
const seedAdmin = require('./config/seedAdmin');
const seedTimetable = require('./config/seedTimetable');

const app = express();

// Ensure DB connection for every request in serverless environment
let isSeeded = false;
app.use(async (req, res, next) => {
  await connectDB();
  if (!isSeeded) {
    try {
      await seedSubjects();
      await seedAdmin();
      await seedTimetable();
      isSeeded = true;
    } catch (err) {
      console.error('Seeding warning:', err.message);
    }
  }
  next();
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SylloTrack API is running' });
});

if (process.env.NODE_ENV !== 'production' || require.main === module) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
