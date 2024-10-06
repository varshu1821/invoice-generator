const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Protected route
router.get('/dashboard', auth, (req, res) => {
  res.json({ msg: 'Welcome to the dashboard!' });
});

module.exports = router;
