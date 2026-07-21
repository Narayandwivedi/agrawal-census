const mongoose = require('mongoose');

/**
 * Leader Sub-Schema
 * Represents a community leader with designation, name, and mobile number.
 * _id generation is disabled to keep sub-documents lightweight.
 */
const leaderSchema = new mongoose.Schema(
  {
    designation: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    mobile: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

/**
 * Samaj Schema
 * Represents a community (Samaj) in the Agrawal Samaj Census system.
 * Holds community details along with a list of associated leaders.
 */
const samajSchema = new mongoose.Schema(
  {
    samajName: {
      type: String,
      required: [true, 'Samaj name is required'],
      trim: true,
    },
    officeAddress: {
      type: String,
      trim: true,
    },
    mobile: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    leaders: {
      type: [leaderSchema],
      default: [],
    },
    city: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Samaj', samajSchema);
