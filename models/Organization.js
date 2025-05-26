import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Organization name is required"],
    unique: true,
    trim: true
  },

  description: {
    type: String,
    default: ""
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export const Organization = mongoose.model('Organization', organizationSchema);
