const mongoose = require('mongoose');

const HoldingSchema = new mongoose.Schema({
  coinId: String,
  symbol: String,
  name: String,
  image: String,
  current_price: Number,
  quantity: Number,
});

const PortfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true, // ✅ ensures one document per user
    required: true
  },
  holdings: [HoldingSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
