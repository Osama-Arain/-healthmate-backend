const express = require('express');
const router = express.Router();
const {
  generateInsight,
  getInsight,
  getAllInsights
} = require('../controllers/insightsController');
const { protect } = require('../middleware/auth');

router.use(protect); // All routes protected

router.post('/generate/:fileId', generateInsight);
router.get('/file/:fileId', getInsight);
router.get('/', getAllInsights);

module.exports = router;