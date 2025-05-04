import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];  
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findById(decoded.id).select('username role');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = { id: user._id, username: user.username, role: user.role };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};


export const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};