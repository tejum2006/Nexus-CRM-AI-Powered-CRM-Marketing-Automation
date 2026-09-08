const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    company: {
      type: String,
      trim: true,
      default: '',
    },
    industry: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Lead', 'Active', 'Inactive', 'Churned'],
      default: 'Lead',
    },
    segments: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    notes: [
      {
        content: { type: String, required: true },
        author: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
          required: true,
        },
        authorName: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster search and filtering
customerSchema.index({ name: 'text', email: 'text', company: 'text' });
customerSchema.index({ status: 1 });
customerSchema.index({ segments: 1 });
customerSchema.index({ tags: 1 });

module.exports = mongoose.model('Customer', customerSchema);
