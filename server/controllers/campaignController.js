const Campaign = require('../models/Campaign');
const Activity = require('../models/Activity');
const Customer = require('../models/Customer');
const { sendEmail, sendBulkEmails } = require('../services/emailService');

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
    const isSimulation = req.body.isSimulation !== false; // Default to true if not explicitly false

    let sentCount = 0;
    let failedCount = 0;

    if (isSimulation) {
      sentCount = customers.length;
    } else {
      // REAL EMAIL SENDING
      const validCustomers = customers.filter(c => c.email && c.email.includes('@'));
      if (validCustomers.length === 0) {
        return res.status(400).json({ success: false, error: 'No customers with valid emails found.' });
      }

      const messages = validCustomers.map(c => ({
        to: c.email,
        subject: campaign.subject || campaign.name,
        html: campaign.content,
      }));

      try {
        await sendBulkEmails(messages);
        sentCount = validCustomers.length;
      } catch (err) {
        return res.status(500).json({ success: false, error: 'Failed to send campaign emails via provider.' });
      }
    }

    // Bulk insert activities for all matched customers (only those successfully processed)
    // For simplicity, we assume if bulk send succeeds, all sent.
    const processedCustomers = isSimulation ? customers : customers.filter(c => c.email && c.email.includes('@'));

    const activitiesToInsert = processedCustomers.map(c => ({
      type: 'email_sent',
      title: isSimulation ? 'Campaign Received (Simulated)' : 'Campaign Received',
      description: `Sent campaign: "${campaign.name}" via ${campaign.type}${isSimulation ? ' [SIMULATION]' : ''}`,
      customer: c._id,
      user: req.user.id,
      userName: req.user.name
    }));

    if (activitiesToInsert.length > 0) {
      await Activity.insertMany(activitiesToInsert);
    }

    // Update customers lastContacted date
    await Customer.updateMany(
      { _id: { $in: processedCustomers.map(c => c._id) } },
      { $set: { lastContacted: new Date() } }
    );

    // Update campaign status and metrics
    campaign.status = 'Completed';
    campaign.metrics.sent = sentCount;
    await campaign.save();

    await logCampaignActivity(
      'campaign_launched',
      isSimulation ? 'Campaign Simulated' : 'Campaign Launched',
      `Campaign "${campaign.name}" was ${isSimulation ? 'simulated' : 'launched'} to ${sentCount} customers.`,
      req.user,
      campaign._id
    );

    res.status(200).json({
      success: true,
      message: isSimulation ? 'Campaign simulated successfully' : 'Campaign launched successfully',
      data: campaign
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Send a test email for a campaign
// @route   POST /api/campaigns/:id/test-email
// @access  Private
exports.sendTestEmail = async (req, res, next) => {
  try {
    const { testEmail } = req.body;
    
    if (!testEmail || !testEmail.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid test email is required' });
    }

    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ success: false, error: 'Campaign not found' });
    }

    if (!campaign.content) {
      return res.status(400).json({ success: false, error: 'Campaign content is empty. Generate content first.' });
    }

    try {
      await sendEmail({
        to: testEmail,
        subject: `[TEST] ${campaign.subject || campaign.name}`,
        html: campaign.content
      });

      res.status(200).json({
        success: true,
        message: 'Test email sent successfully'
      });
    } catch (sendError) {
      return res.status(500).json({ success: false, error: 'Failed to send test email. Ensure SendGrid is properly configured.' });
    }

  } catch (error) {
    next(error);
  }
};
