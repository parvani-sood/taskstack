import express from 'express';
import { signupUser, loginUser, logoutUser, getMe, refreshToken, getUsers } from '../controllers/authController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);
router.get('/refresh', refreshToken);
router.get('/users', protect, admin, getUsers);

export default router;
