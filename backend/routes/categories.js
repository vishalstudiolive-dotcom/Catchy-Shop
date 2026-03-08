import express from 'express';
import Category from '../models/Category.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Get all categories (nested)
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1 });
    // Build tree structure
    const map = {};
    const roots = [];
    categories.forEach(c => { map[c._id] = { ...c.toObject(), children: [] }; });
    categories.forEach(c => {
      if (c.parent && map[c.parent]) map[c.parent].children.push(map[c._id]);
      else roots.push(map[c._id]);
    });
    res.json({ categories: roots });
  } catch (err) { next(err); }
});

// Admin CRUD
router.post('/', authenticate, adminOnly, async (req, res, next) => {
  try { res.status(201).json({ category: await Category.create(req.body) }); } catch (err) { next(err); }
});

router.put('/:id', authenticate, adminOnly, async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json({ category });
  } catch (err) { next(err); }
});

router.delete('/:id', authenticate, adminOnly, async (req, res, next) => {
  try { await Category.findByIdAndDelete(req.params.id); res.json({ message: 'Category deleted' }); } catch (err) { next(err); }
});

export default router;
