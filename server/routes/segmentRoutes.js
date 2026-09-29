const express = require('express');
const {
  getSegments,
  createSegment,
  updateSegment,
  deleteSegment,
  exportSegments
} = require('../controllers/segmentController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/export', exportSegments);

router
  .route('/')
  .get(getSegments)
  .post(createSegment);

router
  .route('/:id')
  .put(updateSegment)
  .delete(deleteSegment);

module.exports = router;
