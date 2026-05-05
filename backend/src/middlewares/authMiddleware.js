import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token = req.cookies.accessToken;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401);
      next(new Error('Not authorized, token failed'));
    }
  } else {
    res.status(401);
    next(new Error('Not authorized, no token'));
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    next(new Error('Not authorized as an admin'));
  }
};
