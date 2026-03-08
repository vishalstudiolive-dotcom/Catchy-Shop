import express from 'express';
import Banner from '../models/Banner.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Get active banners
router.get('/', async (req, res, next) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ position: 1 });
    res.json({ banners });
  } catch (err) { next(err); }
});

// Admin CRUD
router.post('/', authenticate, adminOnly, async (req, res, next) => {
  try { res.status(201).json({ banner: await Banner.create(req.body) }); } catch (err) { next(err); }
});

router.put('/:id', authenticate, adminOnly, async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!banner) return res.status(404).json({ error: 'Banner not found' });
    res.json({ banner });
  } catch (err) { next(err); }
});

router.delete('/:id', authenticate, adminOnly, async (req, res, next) => {
  try { await Banner.findByIdAndDelete(req.params.id); res.json({ message: 'Banner deleted' }); } catch (err) { next(err); }
});

export default router;
