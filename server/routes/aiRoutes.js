const express = require('express');
const { generateContent } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/generate', generateContent);

module.exports = router;
