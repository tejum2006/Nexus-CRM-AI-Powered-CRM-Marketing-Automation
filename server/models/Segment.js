const mongoose = require('mongoose');

const segmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    color: {
      type: String, // e.g. '#34d399', 'var(--copper)'
      default: 'var(--text-muted)',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Segment', segmentSchema);
