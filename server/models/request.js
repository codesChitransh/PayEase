// models/request.js

import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  requesterUsername: {
    type: String,
    required: true,
  },
  receiverUsername: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export const Request = mongoose.model('Request', requestSchema);
