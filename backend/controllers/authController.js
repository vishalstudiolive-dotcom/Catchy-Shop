import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendEmail } from '../utils/sendEmail.js';
import { sendOTP, generateOTP } from '../utils/sendOTP.js';
import crypto from 'crypto';

const generateTokens = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'catchy-shop-jwt-secret-key-2024', { expiresIn: process.env.JWT_EXPIRE || '15m' });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET || 'catchy-shop-refresh-secret-key-2024', { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' });
  return { token, refreshToken };
};

const sendTokenResponse = async (user, statusCode, res) => {
  const { token, refreshToken } = generateTokens(user._id);
  user.refreshToken = refreshToken;
  user.loginAttempts = 0;
  user.lockoutUntil = undefined;
  await user.save();

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  };

  res
    .status(statusCode)
    .cookie('refreshToken', refreshToken, options)
    .json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, gender: user.gender, role: user.role, avatar: user.avatar }
    });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, gender } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, ...(phone ? [{ phone }] : [])] });
    if (existingUser) return res.status(400).json({ error: 'Email or phone already registered' });
    
    const user = await User.create({ name, email, phone, password, gender });
    
    // Send welcome email asynchronously
    sendEmail({
      email: user.email,
      subject: 'Welcome to Catchy Shop!',
      html: `<h2>Hi ${user.name},</h2><p>Welcome to Catchy Shop! We are glad to have you here.</p>`
    });

    sendTokenResponse(user, 201, res);
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check account lockout
    if (user.lockoutUntil && user.lockoutUntil > Date.now()) {
      const waitMinutes = Math.ceil((user.lockoutUntil - Date.now()) / (60 * 1000));
      return res.status(403).json({ error: `Account locked. Please try again after ${waitMinutes} minutes.` });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) {
        user.lockoutUntil = Date.now() + 15 * 60 * 1000; // 15 mins lockout
        await user.save();
        return res.status(403).json({ error: 'Too many failed attempts. Account locked for 15 minutes.' });
      }
      await user.save();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isActive) return res.status(403).json({ error: 'Account is banned' });

    sendTokenResponse(user, 200, res);
  } catch (err) { next(err); }
};

export const refreshTokenHandler = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) return res.status(401).json({ error: 'No refresh token provided' });
    
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'catchy-shop-refresh-secret-key-2024');
    const user = await User.findById(decoded.id);
    
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) { next(err); }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'catchy-shop-refresh-secret-key-2024');
      const user = await User.findById(decoded.id);
      if (user) {
        user.refreshToken = undefined;
        await user.save();
      }
    }
    res.cookie('refreshToken', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });
    res.json({ success: true, message: 'User logged out' });
  } catch (err) { next(err); }
};

export const sendOtpHandler = async (req, res, next) => {
  try {
    const { phone } = req.body;
    let user = await User.findOne({ phone });
    // create user if does not exist? For login using OTP, you can create user dynamically
    if (!user) {
      user = await User.create({ name: 'User', phone, email: `${phone}@temp.catchyshop.com` });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    await sendOTP(phone, otp);
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (err) { next(err); }
};

export const verifyOtpHandler = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;
    const user = await User.findOne({ phone, otp, otpExpire: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    user.otp = undefined;
    user.otpExpire = undefined;
    user.isPhoneVerified = true;
    
    // Check if lockout is in place and clear it
    if (user.lockoutUntil && user.lockoutUntil > Date.now()) {
      user.lockoutUntil = undefined;
      user.loginAttempts = 0;
    }

    sendTokenResponse(user, 200, res);
  } catch (err) { next(err); }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    const message = `You requested a password reset. Please click on this link to reset your password: <a href="${resetUrl}">${resetUrl}</a>\nThis link is valid for 15 minutes.`;

    await sendEmail({
      email: user.email,
      subject: 'Password Reset Token',
      html: message
    });

    res.json({ success: true, message: 'Password reset link sent to email' });
  } catch (err) { next(err); }
};

export const resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) { next(err); }
};

export const oauthCallback = (req, res) => {
  // Successful authentication, send token response
  try {
    const user = req.user;
    const { token, refreshToken } = generateTokens(user._id);
    
    user.refreshToken = refreshToken;
    user.loginAttempts = 0;
    user.lockoutUntil = undefined;
    user.save(); // Don't await in order to respond fast

    const options = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    };

    res.cookie('refreshToken', refreshToken, options);
    // Redirect to frontend with access token in URL snippet or as script setup
    // the safest is to redirect to the frontend with token in the query, then frontend stores it in memory
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/oauth-success?token=${token}`);
  } catch (err) {
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`);
  }
};
