const ScheduleBlock = require('../models/ScheduleBlock');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');

// @desc    Get schedule blocks for authenticated user by date or date range
// @route   GET /api/schedule
// @access  Private
const getSchedule = async (req, res) => {
  try {
    const { date, startDate, endDate } = req.query;
    const filter = { user: req.user._id };

    if (date) {
      filter.date = date; // Format: YYYY-MM-DD
    } else if (startDate && endDate) {
      filter.date = { $gte: startDate, $lte: endDate };
    }

    const blocks = await ScheduleBlock.find(filter)
      .populate('subject', 'name')
      .sort({ startTime: 1 });

    res.json(blocks);
  } catch (error) {
    console.error('Error fetching schedule:', error.message);
    res.status(500).json({ message: 'Server error while fetching schedule' });
  }
};

// @desc    Create a new day schedule block
// @route   POST /api/schedule
// @access  Private
const createScheduleBlock = async (req, res) => {
  try {
    const { date, startTime, endTime, title, type, subject, notes } = req.body;

    if (!date || !startTime || !endTime || !title) {
      return res.status(400).json({ message: 'Date, start time, end time, and title are required' });
    }

    const newBlock = new ScheduleBlock({
      user: req.user._id,
      date,
      startTime,
      endTime,
      title,
      type: type || 'study',
      subject: subject || null,
      notes: notes || '',
    });

    const savedBlock = await newBlock.save();
    const populatedBlock = await ScheduleBlock.findById(savedBlock._id).populate('subject', 'name');

    res.status(201).json(populatedBlock);
  } catch (error) {
    console.error('Error creating schedule block:', error.message);
    res.status(500).json({ message: 'Server error while creating schedule block' });
  }
};

// @desc    Update a day schedule block
// @route   PUT /api/schedule/:id
// @access  Private
const updateScheduleBlock = async (req, res) => {
  try {
    const { date, startTime, endTime, title, type, subject, completed, notes } = req.body;
    const block = await ScheduleBlock.findById(req.params.id);

    if (!block) {
      return res.status(404).json({ message: 'Schedule block not found' });
    }

    if (block.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this block' });
    }

    if (date) block.date = date;
    if (startTime) block.startTime = startTime;
    if (endTime) block.endTime = endTime;
    if (title) block.title = title;
    if (type) block.type = type;
    block.subject = subject || null;
    if (completed !== undefined) block.completed = completed;
    if (notes !== undefined) block.notes = notes;

    const updatedBlock = await block.save();
    const populatedBlock = await ScheduleBlock.findById(updatedBlock._id).populate('subject', 'name');

    res.json(populatedBlock);
  } catch (error) {
    console.error('Error updating schedule block:', error.message);
    res.status(500).json({ message: 'Server error while updating schedule block' });
  }
};

// @desc    Toggle schedule block completion
// @route   PATCH /api/schedule/:id/toggle
// @access  Private
const toggleScheduleBlock = async (req, res) => {
  try {
    const block = await ScheduleBlock.findById(req.params.id);

    if (!block) {
      return res.status(404).json({ message: 'Schedule block not found' });
    }

    if (block.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to modify this block' });
    }

    block.completed = !block.completed;
    await block.save();
    const populatedBlock = await ScheduleBlock.findById(block._id).populate('subject', 'name');

    res.json(populatedBlock);
  } catch (error) {
    console.error('Error toggling schedule block completion:', error.message);
    res.status(500).json({ message: 'Server error toggling block' });
  }
};

// @desc    Delete a schedule block
// @route   DELETE /api/schedule/:id
// @access  Private
const deleteScheduleBlock = async (req, res) => {
  try {
    const block = await ScheduleBlock.findById(req.params.id);

    if (!block) {
      return res.status(404).json({ message: 'Schedule block not found' });
    }

    if (block.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this block' });
    }

    await block.deleteOne();
    res.json({ message: 'Schedule block deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Error deleting schedule block:', error.message);
    res.status(500).json({ message: 'Server error while deleting schedule block' });
  }
};

// @desc    Auto-generate day schedule blocks from pending topics for a given date
// @route   POST /api/schedule/auto-generate
// @access  Private
const autoGenerateSchedule = async (req, res) => {
  try {
    const { date, startHour = 9, blocksCount = 3, durationMinutes = 60 } = req.body;

    if (!date) {
      return res.status(400).json({ message: 'Date is required for schedule auto-generation' });
    }

    // Get uncompleted topics across user's subjects
    const subjects = await Subject.find({ user: req.user._id });
    const subjectIds = subjects.map((s) => s._id);

    const pendingTopics = await Topic.find({
      subject: { $in: subjectIds },
      completed: false,
    }).populate('subject', 'name');

    if (pendingTopics.length === 0) {
      return res.status(400).json({ message: 'No uncompleted syllabus topics found to schedule!' });
    }

    const createdBlocks = [];
    let currentHour = Number(startHour);

    for (let i = 0; i < Math.min(blocksCount, pendingTopics.length); i++) {
      const topic = pendingTopics[i];
      const startHStr = String(currentHour).padStart(2, '0');
      const startStr = `${startHStr}:00`;
      
      const endHour = currentHour + Math.floor(durationMinutes / 60);
      const endMin = durationMinutes % 60;
      const endHStr = String(endHour).padStart(2, '0');
      const endMStr = String(endMin).padStart(2, '0');
      const endStr = `${endHStr}:${endMStr}`;

      const block = new ScheduleBlock({
        user: req.user._id,
        date,
        startTime: startStr,
        endTime: endStr,
        title: `Study: ${topic.title}`,
        type: 'study',
        subject: topic.subject._id,
        notes: `Focus session for ${topic.subject.name}`,
      });

      const saved = await block.save();
      const populated = await ScheduleBlock.findById(saved._id).populate('subject', 'name');
      createdBlocks.push(populated);

      currentHour += Math.ceil(durationMinutes / 60) + 1; // 1 hr break/gap
    }

    res.status(201).json(createdBlocks);
  } catch (error) {
    console.error('Error auto-generating schedule:', error.message);
    res.status(500).json({ message: 'Server error generating schedule' });
  }
};

module.exports = {
  getSchedule,
  createScheduleBlock,
  updateScheduleBlock,
  toggleScheduleBlock,
  deleteScheduleBlock,
  autoGenerateSchedule,
};
