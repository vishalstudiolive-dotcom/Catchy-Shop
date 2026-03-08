import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: String,
  comment: { type: String, required: true },
  images: [String],
  helpfulVotes: { type: Number, default: 0 },
  verified: { type: Boolean, default: false }
}, { timestamps: true });

const sizeStockSchema = new mongoose.Schema({
  size: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 }
});

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  brand: { type: String, required: true },
  description: { type: String, required: true },
  shortDescription: String,
  images: [{ type: String, required: true }],
  category: { type: String, required: true },
  subCategory: String,
  mrp: { type: Number, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  sizes: [sizeStockSchema],
  colors: [{
    name: String,
    hex: String,
    images: [String]
  }],
  fabric: String,
  fit: String,
  occasion: [String],
  washCare: String,
  gender: { type: String, enum: ['men', 'women', 'kids', 'unisex'], required: true },
  tags: [String],
  reviews: [reviewSchema],
  avgRating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  totalStock: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  completeLook: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

// Create slug from title before saving
productSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  // Calculate total stock
  if (this.sizes && this.sizes.length > 0) {
    this.totalStock = this.sizes.reduce((sum, s) => sum + s.stock, 0);
  }
  // Calculate average rating
  if (this.reviews && this.reviews.length > 0) {
    this.avgRating = this.reviews.reduce((sum, r) => sum + r.rating, 0) / this.reviews.length;
    this.numReviews = this.reviews.length;
  }
  next();
});

// Text search index
productSchema.index({ title: 'text', brand: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, gender: 1, price: 1 });
productSchema.index({ slug: 1 });

export default mongoose.model('Product', productSchema);
