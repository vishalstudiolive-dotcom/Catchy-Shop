import express from 'express';
import passport from 'passport';
import { 
  register, 
  login, 
  refreshTokenHandler, 
  logout, 
  sendOtpHandler, 
  verifyOtpHandler, 
  forgotPassword, 
  resetPassword,
  oauthCallback
} from '../controllers/authController.js';
import { loginLimiter, otpLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.post('/refresh-token', refreshTokenHandler);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);

router.post('/send-otp', otpLimiter, sendOtpHandler);
router.post('/verify-otp', verifyOtpHandler);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/api/auth/oauth-failed', session: false }), oauthCallback);

// Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/api/auth/oauth-failed', session: false }), oauthCallback);

router.get('/oauth-failed', (req, res) => res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`));

export default router;
