const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get token from cookies or headers
  const token = req.headers.authorization?.split(' ')[1];
  console.log(token)
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - Missing token' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, 'accessTokenSecret');
    req.userId = decoded.userId; 
    next(); 
  } catch (error) {
    return res.status(403).json({ message: 'Forbidden - Invalid token' });
  }
};

module.exports = authMiddleware;
