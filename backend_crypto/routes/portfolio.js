const express = require('express');
const auth = require('../middleware/authMiddleware');
const Portfolio = require('../models/Portfolio');
const router = express.Router();
// POST /api/portfolio
router.post('/', authMiddleware, async (req, res) => {
  const { coinId, quantity, buyPrice } = req.body;
  const holding = new Holding({ userId: req.user, coinId, quantity, buyPrice });
  await holding.save();
  res.json({ msg: 'Added to portfolio' });
});

// GET /api/portfolio
router.get('/', authMiddleware, async (req, res) => {
  const holdings = await Holding.find({ userId: req.user });
  res.json(holdings);
});

module.exports = router;