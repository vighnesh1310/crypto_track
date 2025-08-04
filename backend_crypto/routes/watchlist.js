const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Watchlist = require('../models/Watchlist');

// GET watchlist for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    let watchlist = await Watchlist.findOne({ userId });

    if (!watchlist) {
      return res.json({ watchlist: [] }); // Return empty list if none found
    }

    res.json({ watchlist: watchlist.coins });
  } catch (err) {
    console.error('Watchlist GET error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT to add/remove coin from watchlist
router.put('/', auth, async (req, res) => {
  try {
    const { coinId, action } = req.body;
    const userId = req.user.id;

    let watchlist = await Watchlist.findOne({ userId });

    if (!watchlist) {
      watchlist = new Watchlist({ userId, coins: [] });
    }

    if (action === 'add' && !watchlist.coins.includes(coinId)) {
      watchlist.coins.push(coinId);
    } else if (action === 'remove') {
      watchlist.coins = watchlist.coins.filter((id) => id !== coinId);
    }

    await watchlist.save();
    res.json({ watchlist: watchlist.coins });
  } catch (err) {
    console.error('Watchlist PUT error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
