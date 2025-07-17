const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
router.get('/dashboard', auth, (req, res) => {
  res.json({ msg: 'Welcome to the dashboard', user: req.user });
});
module.exports = router;