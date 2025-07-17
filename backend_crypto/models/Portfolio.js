// models/Portfolio.js
const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalValue: Number,
  gain24h: Number
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
