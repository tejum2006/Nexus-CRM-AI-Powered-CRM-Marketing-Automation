const Customer = require('../models/Customer');
const Campaign = require('../models/Campaign');
const Activity = require('../models/Activity');

// @desc    Get dashboard analytics
// @route   GET /api/dashboard/analytics
// @access  Private
exports.getAnalytics = async (req, res, next) => {
  try {
    // 1. Customers by Segment (aggregate)
    const segmentData = await Customer.aggregate([
      { $unwind: "$segments" },
      { $group: { _id: "$segments", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const formattedSegmentData = segmentData.map(s => ({
      name: s._id,
      count: s.count
    }));

    // 2. Most Used Tags (aggregate)
    const tagsData = await Customer.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const formattedTagsData = tagsData.map(t => ({
      name: t._id,
      count: t.count
    }));

    // Basic stats
    const totalCustomers = await Customer.countDocuments();
    const activeCustomers = await Customer.countDocuments({ status: 'Active' });
    const totalCampaigns = await Campaign.countDocuments({ status: { $ne: 'Draft' } });

    // Recent Activity
    const recentActivity = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(6);

    // 3. Campaign Performance (recent non-draft campaigns)
    const campaignPerformance = await Campaign.find({ status: { $ne: 'Draft' } })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name metrics status createdAt');

    // 4. Customer Growth (Last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1); // Start of the month 6 months ago
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const customerGrowthData = await Customer.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { 
        $group: { 
          _id: { 
            month: { $month: "$createdAt" }, 
            year: { $year: "$createdAt" } 
          }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Format customer growth for charts (e.g. "Jan", "Feb")
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedCustomerGrowth = customerGrowthData.map(item => ({
      name: `${monthNames[item._id.month - 1]}`,
      customers: item.count
    }));

    res.status(200).json({
      success: true,
      message: 'Analytics retrieved successfully',
      data: {
        totalCustomers,
        activeCustomers,
        totalCampaigns,
        segmentDistribution: formattedSegmentData,
        topTags: formattedTagsData,
        recentActivity,
        campaignPerformance,
        customerGrowth: formattedCustomerGrowth
      }
    });
  } catch (error) {
    next(error);
  }
};
