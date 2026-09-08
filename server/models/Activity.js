const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        'customer_created',
        'customer_updated',
        'note_added',
        'campaign_generated',
        'campaign_assigned',
        'campaign_created',
        'status_changed',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    // Optional — activities can be global (e.g. campaigns) or per-customer
    customer: {
      type: mongoose.Schema.ObjectId,
      ref: 'Customer',
    },
    // Optional — campaign activities
    campaign: {
      type: mongoose.Schema.ObjectId,
      ref: 'Campaign',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    userName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index by customer for fast timeline retrieval
activitySchema.index({ customer: 1, createdAt: -1 });
// Index for global activity feed
activitySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
