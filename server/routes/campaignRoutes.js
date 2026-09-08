const express = require('express');
const {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  launchCampaign
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

router.post('/:id/launch', launchCampaign);

module.exports = router;
