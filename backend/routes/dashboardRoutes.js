const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/dashboardController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

router.get('/analytics', authMiddleware, roleMiddleware(['admin']), getAnalytics);

module.exports = router;
