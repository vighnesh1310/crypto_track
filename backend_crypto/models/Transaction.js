// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  coinId: { type: String, required: true },
  symbol: { type: String, required: true },
  type: { type: String, enum: ['buy', 'sell'], required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  realizedProfit: { type: Number, default: 0}
});

module.exports = mongoose.model('Transaction', transactionSchema);
