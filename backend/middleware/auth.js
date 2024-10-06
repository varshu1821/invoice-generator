const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Check for token in 'x-auth-token' or 'Authorization' header
  const token = req.header('x-auth-token') || req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify the presence of JWT_SECRET
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ msg: 'JWT secret is not defined in environment variables' });
    }

    // Log token and secret for debugging
    console.log('JWT Token:', token);
    console.log('JWT_SECRET:', process.env.JWT_SECRET);

    // Verify token with JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user info to request object
    req.user = decoded.user;

    // Proceed to the next middleware
    next();
  } catch (err) {
    console.error('JWT Error:', err.message);

    if (err.username === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token has expired' });
    }

    // Return detailed error message in case of invalid token
    return res.status(401).json({ msg: `Token is not valid: ${err.message}` });
  }
};
