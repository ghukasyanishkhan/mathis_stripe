// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET;

const jwtAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token from the "Bearer <token>" format
  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Attach decoded token payload to request object
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export default jwtAuthMiddleware;
