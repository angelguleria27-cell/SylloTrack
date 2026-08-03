const Announcement = require('../models/Announcement');

// GET /api/announcements
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ section: 'Section A' })
      .populate('author', 'name email role')
      .sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching announcements' });
  }
};

// POST /api/announcements (Admin only)
const createAnnouncement = async (req, res) => {
  try {
    const { title, content, priority, section } = req.body;
    if (!title || !title.trim() || !content || !content.trim()) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const announcement = new Announcement({
      title: title.trim(),
      content: content.trim(),
      priority: priority || 'normal',
      section: section || 'Section A',
      author: req.user._id,
    });

    await announcement.save();
    const populated = await Announcement.findById(announcement._id).populate('author', 'name email role');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error creating announcement' });
  }
};

// PUT /api/announcements/:id (Admin only)
const updateAnnouncement = async (req, res) => {
  try {
    const { title, content, priority, section } = req.body;
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    if (title) announcement.title = title.trim();
    if (content) announcement.content = content.trim();
    if (priority) announcement.priority = priority;
    if (section) announcement.section = section;

    await announcement.save();
    const populated = await Announcement.findById(announcement._id).populate('author', 'name email role');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error updating announcement' });
  }
};

// DELETE /api/announcements/:id (Admin only)
const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    await announcement.deleteOne();
    res.json({ message: 'Announcement deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error deleting announcement' });
  }
};

module.exports = {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
