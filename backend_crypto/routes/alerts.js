const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const auth = require('../middleware/auth');

// GET alerts for user
router.get('/', auth, async (req, res) => {
  try {
    const alerts = await Alert.find({ userId: req.user.id });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST new alert
router.post('/', auth, async (req, res) => {
  const { coin, target } = req.body;

  if (!coin || !target) return res.status(400).json({ message: 'Invalid data' });

  try {
    const alert = new Alert({ userId: req.user.id, coin, target });
    await alert.save();
    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create alert' });
  }
});

module.exports = router;
