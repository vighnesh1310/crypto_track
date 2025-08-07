const mongoose = require('mongoose');

const HoldingSchema = new mongoose.Schema({
  coinId: String,
  symbol: String,
  name: String,
  image: String,
  current_price: Number,
  quantity: Number,
  type: {
    type: String,
    enum: ['buy', 'track'],
    default: 'buy'
  }
});

const PortfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true
  },
  holdings: [HoldingSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
