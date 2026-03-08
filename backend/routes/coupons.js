import express from 'express';
import Coupon from '../models/Coupon.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Validate coupon
router.post('/validate', authenticate, async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true, expiresAt: { $gt: new Date() } });
    if (!coupon) return res.status(404).json({ error: 'Invalid or expired coupon' });
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ error: 'Coupon usage limit reached' });
    if (orderAmount < coupon.minOrderAmount) return res.status(400).json({ error: `Minimum order amount is ₹${coupon.minOrderAmount}` });
    const discount = coupon.type === 'percentage'
      ? Math.min(orderAmount * coupon.value / 100, coupon.maxDiscount || Infinity)
      : coupon.value;
    res.json({ coupon: { code: coupon.code, type: coupon.type, value: coupon.value, discount: Math.round(discount), description: coupon.description } });
  } catch (err) { next(err); }
});

// Admin: CRUD
router.get('/', authenticate, adminOnly, async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ coupons });
  } catch (err) { next(err); }
});

router.post('/', authenticate, adminOnly, async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ coupon });
  } catch (err) { next(err); }
});

router.put('/:id', authenticate, adminOnly, async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ error: 'Coupon not found' });
    res.json({ coupon });
  } catch (err) { next(err); }
});

router.delete('/:id', authenticate, adminOnly, async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted' });
  } catch (err) { next(err); }
});

export default router;
