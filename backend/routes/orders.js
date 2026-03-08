import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Coupon from '../models/Coupon.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Create order
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { items, shippingAddress, payment, couponCode } = req.body;
    let itemsTotal = items.reduce((sum, item) => sum + (item.mrp * item.quantity), 0);
    let totalDiscount = items.reduce((sum, item) => sum + ((item.mrp - item.price) * item.quantity), 0);
    let deliveryCharges = itemsTotal - totalDiscount >= 499 ? 0 : 49;
    let couponDiscount = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true, expiresAt: { $gt: new Date() } });
      if (coupon && (itemsTotal - totalDiscount) >= coupon.minOrderAmount) {
        couponDiscount = coupon.type === 'percentage'
          ? Math.min((itemsTotal - totalDiscount) * coupon.value / 100, coupon.maxDiscount || Infinity)
          : coupon.value;
        coupon.usedCount++;
        await coupon.save();
      }
    }

    const totalAmount = itemsTotal - totalDiscount - couponDiscount + deliveryCharges;
    const order = await Order.create({
      user: req.user._id, items, shippingAddress, payment,
      itemsTotal, totalDiscount, deliveryCharges, couponDiscount, couponCode,
      totalAmount,
      timeline: [{ status: 'confirmed', description: 'Order confirmed' }],
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    });

    // Clear cart
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();

    res.status(201).json({ order });
  } catch (err) { next(err); }
});

// Get user orders
router.get('/', authenticate, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) { next(err); }
});

// Get single order
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    res.json({ order });
  } catch (err) { next(err); }
});

// Cancel order
router.put('/:id/cancel', authenticate, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Not authorized' });
    if (['shipped', 'delivered'].includes(order.status)) return res.status(400).json({ error: 'Cannot cancel shipped/delivered order' });
    order.status = 'cancelled';
    order.cancelReason = req.body.reason;
    order.timeline.push({ status: 'cancelled', description: req.body.reason || 'Cancelled by user' });
    await order.save();
    res.json({ order });
  } catch (err) { next(err); }
});

// Admin: Update order status
router.put('/:id/status', authenticate, adminOnly, async (req, res, next) => {
  try {
    const { status, description } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.status = status;
    order.timeline.push({ status, description: description || `Order ${status}` });
    if (status === 'delivered') order.deliveredAt = new Date();
    if (status === 'paid' || status === 'delivered') order.payment.status = 'paid';
    await order.save();
    res.json({ order });
  } catch (err) { next(err); }
});

// Admin: Get all orders
router.get('/admin/all', authenticate, adminOnly, async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let query = {};
    if (status) query.status = status;
    const [orders, total] = await Promise.all([
      Order.find(query).populate('user', 'name email').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
      Order.countDocuments(query)
    ]);
    res.json({ orders, total, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

export default router;
