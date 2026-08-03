const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getOverview } = require('../controllers/adminController');

router.get('/overview', protect, admin, getOverview);

module.exports = router;
