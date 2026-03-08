import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: String,
  brand: String,
  image: String,
  size: String,
  color: String,
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  mrp: { type: Number, required: true }
});

const timelineSchema = new mongoose.Schema({
  status: String,
  date: { type: Date, default: Date.now },
  description: String
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, unique: true },
  items: [orderItemSchema],
  shippingAddress: {
    name: String,
    mobile: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String
  },
  payment: {
    method: { type: String, enum: ['upi', 'card', 'netbanking', 'cod', 'wallet', 'emi'], required: true },
    transactionId: String,
    status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' }
  },
  itemsTotal: { type: Number, required: true },
  totalDiscount: { type: Number, default: 0 },
  deliveryCharges: { type: Number, default: 0 },
  couponDiscount: { type: Number, default: 0 },
  couponCode: String,
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['confirmed', 'packed', 'shipped', 'out-for-delivery', 'delivered', 'cancelled', 'returned'],
    default: 'confirmed'
  },
  timeline: [timelineSchema],
  estimatedDelivery: Date,
  deliveredAt: Date,
  cancelReason: String
}, { timestamps: true });

// Generate order number
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = 'CS' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
  }
  next();
});

export default mongoose.model('Order', orderSchema);
