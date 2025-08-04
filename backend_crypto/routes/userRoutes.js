const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const User = require('../models/User');

// 🔐 GET user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✏️ UPDATE profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, avatar } = req.body; // frontend sends `avatar`

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.email = email || user.email;

    // ✅ Save avatar to the correct field
    if (avatar) {
      user.avatarUrl = avatar;
    }

    await user.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Profile update failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// 🔐 UPDATE password
router.put('/password', auth, async (req, res) => {
  const { password } = req.body;
  if (!password || password.length < 6) {
    return res.status(400).json({ msg: 'Password must be at least 6 characters' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error('Password update error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ⚙️ UPDATE settings
router.put('/settings', auth, async (req, res) => {
  const { darkMode, notificationEnabled, defaultCurrency } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.settings = {
      ...user.settings,
      ...(darkMode !== undefined && { darkMode }),
      ...(notificationEnabled !== undefined && { notificationEnabled }),
      ...(defaultCurrency && { defaultCurrency })
    };

    await user.save();

    res.json({ msg: 'Settings updated successfully', settings: user.settings });
  } catch (err) {
    console.error('Settings update error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});


module.exports = router;
