// models/Alert.js
const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  coin: String,
  triggered: Boolean
});

module.exports = mongoose.model('Alert', AlertSchema);
