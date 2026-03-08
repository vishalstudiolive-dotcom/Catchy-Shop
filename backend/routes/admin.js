import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Dashboard stats
router.get('/stats', authenticate, adminOnly, async (req, res, next) => {
  try {
    const [totalProducts, totalUsers, totalOrders, orders] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Order.countDocuments(),
      Order.find({ status: { $ne: 'cancelled' } })
    ]);
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const ordersToday = await Order.countDocuments({ createdAt: { $gte: today } });

    // Sales by category
    const categoryStats = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.brand', total: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
      { $sort: { total: -1 } }, { $limit: 8 }
    ]);

    // Weekly sales
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklySales = await Order.aggregate([
      { $match: { createdAt: { $gte: weekAgo }, status: { $ne: 'cancelled' } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Low stock products
    const lowStock = await Product.find({ totalStock: { $lt: 10 }, isActive: true }).limit(10).select('title brand totalStock images');

    res.json({ totalProducts, totalUsers, totalOrders, totalRevenue, ordersToday, categoryStats, weeklySales, lowStock });
  } catch (err) { next(err); }
});

// User management
router.get('/users', authenticate, adminOnly, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    let query = { role: 'user' };
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    const [users, total] = await Promise.all([
      User.find(query).select('-password -refreshToken -cart -wishlist').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
      User.countDocuments(query)
    ]);
    res.json({ users, total, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

// Ban/unban user
router.put('/users/:id/toggle-status', authenticate, adminOnly, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ user: { id: user._id, name: user.name, email: user.email, isActive: user.isActive } });
  } catch (err) { next(err); }
});

export default router;
