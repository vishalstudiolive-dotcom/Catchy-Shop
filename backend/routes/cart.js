import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get cart
router.get('/', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product', 'title brand images price mrp discount sizes slug');
    res.json({ cart: user.cart });
  } catch (err) { next(err); }
});

// Add to cart
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { productId, size, color, quantity = 1 } = req.body;
    const user = await User.findById(req.user._id);
    const existingItem = user.cart.find(item => item.product.toString() === productId && item.size === size && item.color === color);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity, size, color });
    }
    await user.save();
    const populated = await User.findById(req.user._id).populate('cart.product', 'title brand images price mrp discount sizes slug');
    res.json({ cart: populated.cart });
  } catch (err) { next(err); }
});

// Update cart item
router.put('/:itemId', authenticate, async (req, res, next) => {
  try {
    const { quantity, size } = req.body;
    const user = await User.findById(req.user._id);
    const item = user.cart.id(req.params.itemId);
    if (!item) return res.status(404).json({ error: 'Cart item not found' });
    if (quantity !== undefined) item.quantity = quantity;
    if (size) item.size = size;
    await user.save();
    const populated = await User.findById(req.user._id).populate('cart.product', 'title brand images price mrp discount sizes slug');
    res.json({ cart: populated.cart });
  } catch (err) { next(err); }
});

// Remove from cart
router.delete('/:itemId', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter(item => item._id.toString() !== req.params.itemId);
    await user.save();
    const populated = await User.findById(req.user._id).populate('cart.product', 'title brand images price mrp discount sizes slug');
    res.json({ cart: populated.cart });
  } catch (err) { next(err); }
});

// Clear cart
router.delete('/', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();
    res.json({ cart: [] });
  } catch (err) { next(err); }
});

export default router;
