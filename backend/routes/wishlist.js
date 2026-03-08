import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get wishlist
router.get('/', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'title brand images price mrp discount slug avgRating numReviews sizes');
    res.json({ wishlist: user.wishlist });
  } catch (err) { next(err); }
});

// Add to wishlist
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    const populated = await User.findById(req.user._id).populate('wishlist', 'title brand images price mrp discount slug avgRating numReviews sizes');
    res.json({ wishlist: populated.wishlist });
  } catch (err) { next(err); }
});

// Remove from wishlist
router.delete('/:productId', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.productId);
    await user.save();
    const populated = await User.findById(req.user._id).populate('wishlist', 'title brand images price mrp discount slug avgRating numReviews sizes');
    res.json({ wishlist: populated.wishlist });
  } catch (err) { next(err); }
});

// Move to cart
router.post('/move-to-cart/:productId', authenticate, async (req, res, next) => {
  try {
    const { size, color } = req.body;
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.productId);
    const existingCart = user.cart.find(i => i.product.toString() === req.params.productId && i.size === size);
    if (!existingCart) {
      user.cart.push({ product: req.params.productId, quantity: 1, size, color });
    }
    await user.save();
    res.json({ message: 'Moved to cart' });
  } catch (err) { next(err); }
});

export default router;
