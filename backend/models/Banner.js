import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: String,
  image: { type: String, required: true },
  link: String,
  ctaText: { type: String, default: 'Shop Now' },
  position: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  startDate: Date,
  endDate: Date
}, { timestamps: true });

export default mongoose.model('Banner', bannerSchema);
