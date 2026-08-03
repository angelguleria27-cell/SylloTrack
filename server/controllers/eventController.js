const Event = require('../models/Event');

// @desc    Get all events for authenticated user
// @route   GET /api/events
// @access  Private
const getEvents = async (req, res) => {
  try {
    const { type, subject, start, end } = req.query;
    
    // Base filter: events created by this user OR assignment events
    const baseConditions = [
      { user: req.user._id },
      { type: 'assignment' },
    ];

    const filter = { $or: baseConditions };

    if (type && type !== 'all') {
      filter.type = type;
    }
    if (subject && subject !== 'all') {
      filter.subject = subject;
    }
    if (start && end) {
      filter.date = {
        $gte: new Date(start),
        $lte: new Date(end),
      };
    }

    const events = await Event.find(filter)
      .populate('subject', 'name')
      .sort({ date: 1, time: 1 });

    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error.message);
    res.status(500).json({ message: 'Server error while fetching events' });
  }
};

// @desc    Create a new event (Exam / Assignment / Study / Other)
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
  try {
    const { title, type, subject, date, time, priority, description } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: 'Title and date are required' });
    }

    const newEvent = new Event({
      user: req.user._id,
      title,
      type: type || 'exam',
      subject: subject || null,
      date: new Date(date),
      time: time || '',
      priority: priority || 'medium',
      description: description || '',
    });

    const savedEvent = await newEvent.save();
    const populatedEvent = await Event.findById(savedEvent._id).populate('subject', 'name');

    res.status(201).json(populatedEvent);
  } catch (error) {
    console.error('Error creating event:', error.message);
    res.status(500).json({ message: 'Server error while creating event' });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = async (req, res) => {
  try {
    const { title, type, subject, date, time, priority, description, completed } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this event' });
    }

    if (title) event.title = title;
    if (type) event.type = type;
    event.subject = subject || null;
    if (date) event.date = new Date(date);
    if (time !== undefined) event.time = time;
    if (priority) event.priority = priority;
    if (description !== undefined) event.description = description;
    if (completed !== undefined) event.completed = completed;

    const updatedEvent = await event.save();
    const populatedEvent = await Event.findById(updatedEvent._id).populate('subject', 'name');

    res.json(populatedEvent);
  } catch (error) {
    console.error('Error updating event:', error.message);
    res.status(500).json({ message: 'Server error while updating event' });
  }
};

// @desc    Toggle event completion
// @route   PATCH /api/events/:id/toggle
// @access  Private
const toggleEventComplete = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to modify this event' });
    }

    event.completed = !event.completed;
    await event.save();
    const populatedEvent = await Event.findById(event._id).populate('subject', 'name');

    res.json(populatedEvent);
  } catch (error) {
    console.error('Error toggling event status:', error.message);
    res.status(500).json({ message: 'Server error toggling status' });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this event' });
    }

    await event.deleteOne();
    res.json({ message: 'Event deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Error deleting event:', error.message);
    res.status(500).json({ message: 'Server error while deleting event' });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  toggleEventComplete,
  deleteEvent,
};
