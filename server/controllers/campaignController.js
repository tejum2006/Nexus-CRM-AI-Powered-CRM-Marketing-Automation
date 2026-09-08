const Campaign = require('../models/Campaign');
const Activity = require('../models/Activity');
const Customer = require('../models/Customer');

// Helper function to log campaign activities
const logCampaignActivity = async (type, title, description, user, campaignId) => {
  try {
    await Activity.create({
      type,
      title,
      description,
      userId: user._id,
      userName: user.name,
      targetId: campaignId,
    });
  } catch (error) {
    console.error('Failed to log campaign activity:', error);
  }
};

// @desc    Get all campaigns (with pagination & filtering)
// @route   GET /api/campaigns
// @access  Private
exports.getCampaigns = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const query = {};

    if (req.query.status) query.status = req.query.status;
    if (req.query.type) query.type = req.query.type;
    
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { subject: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const sortConfig = {};
    if (req.query.sort) {
      const sortField = req.query.sort.replace('-', '');
      sortConfig[sortField] = req.query.sort.startsWith('-') ? -1 : 1;
    } else {
      sortConfig.createdAt = -1; // Default sort
    }

    const campaigns = await Campaign.find(query)
      .sort(sortConfig)
      .skip(startIndex)
      .limit(limit);

    const total = await Campaign.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Campaigns retrieved successfully',
      data: {
        campaigns,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single campaign
// @route   GET /api/campaigns/:id
// @access  Private
exports.getCampaignById = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ success: false, error: 'Campaign not found' });
    }

    res.status(200).json({
      success: true,
      data: campaign
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new campaign
// @route   POST /api/campaigns
// @access  Private
exports.createCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.create(req.body);

    await logCampaignActivity(
      'campaign_generated',
      'Campaign Created',
      `Campaign "${campaign.name}" was created.`,
      req.user,
      campaign._id
    );

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      data: campaign
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update campaign
// @route   PUT /api/campaigns/:id
// @access  Private
exports.updateCampaign = async (req, res, next) => {
  try {
    let campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ success: false, error: 'Campaign not found' });
    }

    // Check if status changed to scheduled/active for logging
    const wasDraft = campaign.status === 'Draft';
    const isNowScheduled = req.body.status === 'Scheduled';

    campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (wasDraft && isNowScheduled) {
       await logCampaignActivity(
         'campaign_assigned',
         'Campaign Scheduled',
         `Campaign "${campaign.name}" is scheduled for ${new Date(campaign.scheduledDate).toLocaleDateString()}.`,
         req.user,
         campaign._id
       );
    }

    res.status(200).json({
      success: true,
      message: 'Campaign updated successfully',
      data: campaign
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete campaign
// @route   DELETE /api/campaigns/:id
// @access  Private
exports.deleteCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ success: false, error: 'Campaign not found' });
    }

    await campaign.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Campaign deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Launch campaign (Execution Engine)
// @route   POST /api/campaigns/:id/launch
// @access  Private
exports.launchCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ success: false, error: 'Campaign not found' });
    }

    if (campaign.status === 'Completed') {
      return res.status(400).json({ success: false, error: 'Campaign is already completed' });
    }

    // Build customer query based on target segments and tags
    const query = {};
    if (campaign.targetSegments && campaign.targetSegments.length > 0) {
      query.segments = { $in: campaign.targetSegments };
    }
    if (campaign.targetTags && campaign.targetTags.length > 0) {
      // If both segments and tags exist, we could do $and or $or. 
      // Usually, it's an AND across criteria, or just whatever matches either if we treat them broadly.
      // Let's do an $or to be inclusive of either matching segments OR tags.
      if (query.segments) {
        query.$or = [
          { segments: query.segments },
          { tags: { $in: campaign.targetTags } }
        ];
        delete query.segments;
      } else {
        query.tags = { $in: campaign.targetTags };
      }
    }

    // Find all matching customers
    // If no targets were defined, it shouldn't send to everyone. It should require at least one target.
    if (Object.keys(query).length === 0) {
       return res.status(400).json({ success: false, error: 'Cannot launch campaign without target segments or tags.' });
    }

    const customers = await Customer.find(query);
    const sentCount = customers.length;

    if (sentCount === 0) {
      return res.status(400).json({ success: false, error: 'No customers match the target criteria.' });
    }

    // Bulk insert activities for all matched customers
    const activitiesToInsert = customers.map(c => ({
      type: 'email_sent',
      title: 'Campaign Received',
      description: `Sent campaign: "${campaign.name}" via ${campaign.type}`,
      customer: c._id,
      user: req.user.id,
      userName: req.user.name
    }));

    if (activitiesToInsert.length > 0) {
      await Activity.insertMany(activitiesToInsert);
    }

    // Update customers lastContacted date
    await Customer.updateMany(
      { _id: { $in: customers.map(c => c._id) } },
      { $set: { lastContacted: new Date() } }
    );

    // Update campaign status and metrics
    campaign.status = 'Completed';
    campaign.metrics.sent = sentCount;
    await campaign.save();

    await logCampaignActivity(
      'campaign_launched',
      'Campaign Launched',
      `Campaign "${campaign.name}" was launched to ${sentCount} customers.`,
      req.user,
      campaign._id
    );

    res.status(200).json({
      success: true,
      message: 'Campaign launched successfully',
      data: campaign
    });

  } catch (error) {
    next(error);
  }
};
