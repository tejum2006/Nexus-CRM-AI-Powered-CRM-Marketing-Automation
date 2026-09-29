const express = require('express');
const {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  launchCampaign,
  sendTestEmail
} = require('../controllers/campaignController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getCampaigns)
  .post(createCampaign);

router
  .route('/:id')
  .get(getCampaignById)
  .put(updateCampaign)
  .delete(authorize('Admin'), deleteCampaign);

router.post('/:id/launch', authorize('Admin', 'Marketing Manager'), launchCampaign);
router.post('/:id/test-email', authorize('Admin', 'Marketing Manager'), sendTestEmail);

module.exports = router;
