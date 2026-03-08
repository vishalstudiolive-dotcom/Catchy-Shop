import express from 'express';
import Product from '../models/Product.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Add review to product
router.post('/:productId', authenticate, async (req, res, next) => {
  try {
    const { rating, title, comment, images } = req.body;
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const existingReview = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (existingReview) return res.status(400).json({ error: 'You already reviewed this product' });
    product.reviews.push({ user: req.user._id, rating, title, comment, images, verified: true });
    product.avgRating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;
    product.numReviews = product.reviews.length;
    await product.save();
    res.status(201).json({ message: 'Review added', avgRating: product.avgRating, numReviews: product.numReviews });
  } catch (err) { next(err); }
});

// Get product reviews
router.get('/:productId', async (req, res, next) => {
  try {
    const { rating, sort, page = 1 } = req.query;
    const product = await Product.findById(req.params.productId).populate('reviews.user', 'name avatar');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    let reviews = [...product.reviews];
    if (rating) reviews = reviews.filter(r => r.rating === Number(rating));
    if (sort === 'helpful') reviews.sort((a, b) => b.helpfulVotes - a.helpfulVotes);
    else if (sort === 'newest') reviews.sort((a, b) => b.createdAt - a.createdAt);
    else if (sort === 'highest') reviews.sort((a, b) => b.rating - a.rating);
    else if (sort === 'lowest') reviews.sort((a, b) => a.rating - b.rating);
    const startIdx = (page - 1) * 10;
    res.json({ reviews: reviews.slice(startIdx, startIdx + 10), total: reviews.length, avgRating: product.avgRating, numReviews: product.numReviews });
  } catch (err) { next(err); }
});

// Vote review as helpful
router.post('/:productId/:reviewId/helpful', authenticate, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const review = product.reviews.id(req.params.reviewId);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    review.helpfulVotes++;
    await product.save();
    res.json({ helpfulVotes: review.helpfulVotes });
  } catch (err) { next(err); }
});

export default router;
