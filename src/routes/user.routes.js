const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

router.get('/protected', authMiddleware, (req, res) => {
  // Access userId from req object
  const userId = req.userId;
  res.status(200).json({ message: 'Access granted to protected route', userId });
});

module.exports = router;
