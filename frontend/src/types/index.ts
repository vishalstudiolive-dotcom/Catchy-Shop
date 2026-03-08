export interface Product {
  _id: string;
  title: string;
  slug: string;
  brand: string;
  description: string;
  shortDescription?: string;
  images: string[];
  category: string;
  subCategory?: string;
  mrp: number;
  price: number;
  discount: number;
  sizes: { size: string; stock: number }[];
  colors: { name: string; hex: string; images?: string[] }[];
  fabric?: string;
  fit?: string;
  occasion?: string[];
  washCare?: string;
  gender: 'men' | 'women' | 'kids' | 'unisex';
  tags?: string[];
  reviews?: Review[];
  avgRating: number;
  numReviews: number;
  totalStock: number;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  completeLook?: Product[];
  createdAt?: string;
}

export interface Review {
  _id: string;
  user: { _id: string; name: string; avatar?: string } | string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  helpfulVotes: number;
  verified: boolean;
  createdAt: string;
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  size: string;
  color?: string;
}

export interface WishlistItem extends Product {}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  role: 'user' | 'admin';
  avatar?: string;
}

export interface Address {
  _id?: string;
  name: string;
  mobile: string;
  pincode: string;
  address: string;
  city: string;
  state: string;
  landmark?: string;
  isDefault?: boolean;
}

export interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: Address;
  payment: { method: string; transactionId?: string; status: string };
  itemsTotal: number;
  totalDiscount: number;
  deliveryCharges: number;
  couponDiscount: number;
  couponCode?: string;
  totalAmount: number;
  status: string;
  timeline: { status: string; date: string; description: string }[];
  estimatedDelivery?: string;
  deliveredAt?: string;
  createdAt: string;
}

export interface OrderItem {
  product: string;
  title: string;
  brand: string;
  image: string;
  size: string;
  color?: string;
  quantity: number;
  price: number;
  mrp: number;
}

export interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  ctaText: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  gender?: string;
  image?: string;
  children?: Category[];
}

export interface Coupon {
  code: string;
  description: string;
  type: 'percentage' | 'flat';
  value: number;
  discount: number;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}
