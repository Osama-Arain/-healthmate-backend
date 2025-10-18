const express = require('express');
const router = express.Router();
const {
  addVitals,
  getVitals,
  getVital,
  updateVitals,
  deleteVitals,
  getVitalsAdvice
} = require('../controllers/vitalsController');
const { protect } = require('../middleware/auth');

router.use(protect); // All routes protected

router.post('/', addVitals);
router.get('/', getVitals);
router.get('/:id', getVital);
router.put('/:id', updateVitals);
router.delete('/:id', deleteVitals);
router.get('/:id/advice', getVitalsAdvice);

module.exports = router;