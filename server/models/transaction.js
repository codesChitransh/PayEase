
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  payerUsername: String,
  receiverUsername: String,
  amount: Number,
  date: { type: Date, default: Date.now },
});

export const Transaction = mongoose.model('Transaction', transactionSchema);
