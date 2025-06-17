import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to verify token
export const verifyToken = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check if user has admin role
export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied, admin privileges required' });
  }
  next();
};

// Middleware to check if user has active subscription
export const hasActiveSubscription = async (req, res, next) => {
  try {
    // Get user from database to check current subscription status
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.subscription.status !== 'active') {
      return res.status(403).json({ 
        message: 'Active subscription required for this action',
        subscriptionStatus: user.subscription.status
      });
    }
    
    next();
  } catch (err) {
    console.error('Subscription check error:', err);
    res.status(500).json({ message: 'Server error checking subscription status' });
  }
};
