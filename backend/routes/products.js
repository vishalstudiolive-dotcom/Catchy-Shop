import express from 'express';
import Product from '../models/Product.js';
import { authenticate, adminOnly, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all products with search, filter, sort, pagination
router.get('/', async (req, res, next) => {
  try {
    const { search, category, brand, gender, minPrice, maxPrice, sizes, colors, discount, rating, fabric, sort, page = 1, limit = 20 } = req.query;
    let query = { isActive: true };

    if (search) query.$text = { $search: search };
    if (category) query.category = { $in: category.split(',') };
    if (brand) query.brand = { $in: brand.split(',') };
    if (gender) query.gender = gender;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (sizes) query['sizes.size'] = { $in: sizes.split(',') };
    if (colors) query['colors.name'] = { $in: colors.split(',') };
    if (discount) query.discount = { $gte: Number(discount) };
    if (rating) query.avgRating = { $gte: Number(rating) };
    if (fabric) query.fabric = { $in: fabric.split(',') };

    let sortObj = { createdAt: -1 };
    if (sort === 'price-low') sortObj = { price: 1 };
    else if (sort === 'price-high') sortObj = { price: -1 };
    else if (sort === 'newest') sortObj = { createdAt: -1 };
    else if (sort === 'popular') sortObj = { numReviews: -1 };
    else if (sort === 'rating') sortObj = { avgRating: -1 };
    else if (search) sortObj = { score: { $meta: 'textScore' } };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(query).sort(sortObj).skip(skip).limit(Number(limit)).select('-reviews'),
      Product.countDocuments(query)
    ]);

    res.json({
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (err) { next(err); }
});

// Search suggestions
router.get('/suggestions', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json({ suggestions: [] });
    const products = await Product.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ], isActive: true
    }).limit(8).select('title brand images price mrp slug category');
    res.json({ suggestions: products });
  } catch (err) { next(err); }
});

// Get featured products
router.get('/featured', async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true }).limit(12).select('-reviews');
    res.json({ products });
  } catch (err) { next(err); }
});

// Get new arrivals
router.get('/new-arrivals', async (req, res, next) => {
  try {
    const products = await Product.find({ isNewArrival: true, isActive: true }).sort({ createdAt: -1 }).limit(12).select('-reviews');
    res.json({ products });
  } catch (err) { next(err); }
});

// Get single product
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name avatar').populate('completeLook', 'title brand images price mrp slug');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ product });
  } catch (err) { next(err); }
});

// Get similar products
router.get('/:id/similar', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const similar = await Product.find({
      _id: { $ne: product._id },
      $or: [{ category: product.category }, { brand: product.brand }],
      gender: product.gender, isActive: true
    }).limit(8).select('-reviews');
    res.json({ products: similar });
  } catch (err) { next(err); }
});

// Admin: Create product
router.post('/', authenticate, adminOnly, async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (err) { next(err); }
});

// Admin: Update product
router.put('/:id', authenticate, adminOnly, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ product });
  } catch (err) { next(err); }
});

// Admin: Delete product
router.delete('/:id', authenticate, adminOnly, async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) { next(err); }
});

export default router;
