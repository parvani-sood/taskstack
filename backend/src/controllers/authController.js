import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken, setTokenCookies, clearTokenCookies } from '../utils/jwt.js';

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signupUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'member',
    });

    if (user) {
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);
      setTokenCookies(res, accessToken, refreshToken);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);
      setTokenCookies(res, accessToken, refreshToken);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookies
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = (req, res) => {
  clearTokenCookies(res);
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
};

// @desc    Refresh access token
// @route   GET /api/auth/refresh
// @access  Public
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      res.status(401);
      throw new Error('Not authorized, no refresh token');
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }

    const accessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);
    
    setTokenCookies(res, accessToken, newRefreshToken);

    res.json({ message: 'Token refreshed' });
  } catch (error) {
    res.status(401);
    next(new Error('Not authorized, token failed'));
  }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};
