// models/Trade.js
const tradeSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['buy', 'sell'], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now }
});
