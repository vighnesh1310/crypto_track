const express = require('express');
const router = express.Router();
const Trade = require('../models/Trade');

// POST /api/trade
router.post('/', async (req, res) => {
  try {
    const { symbol, amount } = req.body;

    if (!symbol || !amount) {
      return res.status(400).json({ message: 'Symbol and amount are required' });
    }

    const trade = new Trade({ symbol, amount });
    await trade.save();

    res.status(201).json({ message: 'Trade saved successfully', trade });
  } catch (error) {
    console.error('Trade error:', error);
    res.status(500).json({ message: 'Server error while saving trade' });
  }
});

module.exports = router;
