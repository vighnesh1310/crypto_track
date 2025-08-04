// routes/trades.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Portfolio = require('../models/Portfolio');

// POST /api/trades
router.post('/', auth, async (req, res) => {
  try {
    const { coinId, symbol, name, image, current_price, quantity, type } = req.body;
    const userId = req.user.id;

    if (!coinId || !symbol || !current_price || !quantity || !type) {
      return res.status(400).json({ error: 'Missing required trade data' });
    }

    const portfolio = await Portfolio.findOne({ user: userId });

    // 🔹 If no portfolio, create one with initial buy
    if (!portfolio) {
      if (type === 'buy') {
        const newPortfolio = new Portfolio({
          user: userId,
          holdings: [{
            coinId,
            symbol,
            name,
            image,
            current_price,
            quantity
          }]
        });
        await newPortfolio.save();
        return res.status(201).json({ message: 'Portfolio created and trade recorded.' });
      } else {
        return res.status(400).json({ error: 'No holdings to sell.' });
      }
    }

    // 🔍 Check if the coin already exists in holdings
    const holdingIndex = portfolio.holdings.findIndex(h => h.coinId === coinId);

    if (type === 'buy') {
      if (holdingIndex > -1) {
        // Coin exists – update quantity and price
        portfolio.holdings[holdingIndex].quantity += quantity;
        portfolio.holdings[holdingIndex].current_price = current_price;
      } else {
        // Coin doesn't exist – add new holding
        portfolio.holdings.push({
          coinId,
          symbol,
          name,
          image,
          current_price,
          quantity
        });
      }
    }

    if (type === 'sell') {
      if (holdingIndex === -1) {
        return res.status(400).json({ error: 'Coin not found in portfolio.' });
      }

      const holding = portfolio.holdings[holdingIndex];
      if (holding.quantity < quantity) {
        return res.status(400).json({ error: 'Not enough quantity to sell.' });
      }

      holding.quantity -= quantity;

      if (holding.quantity <= 0) {
        portfolio.holdings.splice(holdingIndex, 1); // remove holding
      }
    }

    await portfolio.save();
    res.status(200).json({ message: `${type} trade processed successfully.` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = router;
