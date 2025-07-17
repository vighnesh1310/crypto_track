const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  coinId: String,
  quantity: Number,
  buyPrice: Number,
});

module.exports = mongoose.model('Holding', holdingSchema);
