const mongoose = require('mongoose');

/**
 * Family Member Sub-Schema
 * Represents an individual member within a family unit.
 * _id generation is disabled to keep the sub-document lightweight.
 */
const familyMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Family member name is required'],
      trim: true,
    },
    relation: {
      type: String,
      required: [true, 'Relation with family leader is required'],
      trim: true,
    },
    mobile: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
      min: [0, 'Age cannot be negative'],
      default: 0,
    },
    gender: {
      type: String,
      enum: {
        values: ['Male', 'Female', 'Other'],
        message: '{VALUE} is not a valid gender',
      },
      required: [true, 'Gender is required'],
      trim: true,
    },
    occupation: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    _id: false,
  }
);

/**
 * Family Schema
 * Represents a family unit in the Agrawal Samaj Census system.
 * Each family document contains an array of family members as sub-documents.
 */
const familySchema = new mongoose.Schema(
  {
    leaderName: {
      type: String,
      required: [true, 'Family leader name is required'],
      trim: true,
    },
    leaderMobile: {
      type: String,
      trim: true,
    },
    totalMembers: {
      type: Number,
      default: 1,
      min: [1, 'Total members must be at least 1'],
    },
    address: {
      type: String,
      trim: true,
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
    members: {
      type: [familyMemberSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Family', familySchema);
