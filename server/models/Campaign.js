const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      trim: true,
    },
    content: {
      type: String, // HTML or plain text
    },
    type: {
      type: String,
      enum: ['Email', 'SMS'],
      default: 'Email',
    },
    status: {
      type: String,
      enum: ['Draft', 'Scheduled', 'Active', 'Completed'],
      default: 'Draft',
    },
    targetSegments: [{
      type: String, // Storing segment names directly as strings, matching how we store them on customers
    }],
    targetTags: [{
      type: String,
    }],
    scheduledDate: {
      type: Date,
    },
    metrics: {
      sent: { type: Number, default: 0 },
      opened: { type: Number, default: 0 },
      clicked: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for faster queries on lists
campaignSchema.index({ status: 1 });
campaignSchema.index({ type: 1 });
campaignSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Campaign', campaignSchema);
