const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth'); // JWT middleware
const Portfolio = require('../models/Portfolio');
const Alert = require('../models/Alert');
const Watchlist = require('../models/Watchlist');

router.get('/summary', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const portfolio = await Portfolio.findOne({ userId });
    const alerts = await Alert.find({ userId, triggered: true });
    const watchlist = await Watchlist.findOne({ userId });

    res.json({
      total: portfolio?.totalValue || 0,
      gain24h: portfolio?.gain24h || 0,
      alerts: alerts.length,
      watchlist: watchlist?.coins?.length || 0
    });
  } catch (err) {
    console.error('Dashboard Summary Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
