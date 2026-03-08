import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { removeFromCart, updateQuantity, clearCart } from '../store/cartSlice';
import { toggleWishlist } from '../store/wishlistSlice';
import { showToast } from '../store/uiSlice';
import { useState } from 'react';
import { mockProducts } from '../data/mockData';
import ProductCard from '../components/common/ProductCard';

export default function Cart() {
  const dispatch = useDispatch();
  const { items, coupon } = useSelector((s: RootState) => s.cart);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const mrpTotal = items.reduce((s, i) => s + i.product.mrp * i.quantity, 0);
  const priceTotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const totalDiscount = mrpTotal - priceTotal;
  const deliveryCharge = priceTotal >= 499 ? 0 : 49;
  const couponDiscount = coupon?.discount || 0;
  const totalAmount = priceTotal + deliveryCharge - couponDiscount;

  const handleApplyCoupon = () => {
    const c = couponCode.toUpperCase();
    const validCoupons: Record<string, { discount: number; min: number }> = { 'WELCOME10': { discount: Math.round(priceTotal * 0.1), min: 499 }, 'FLAT200': { discount: 200, min: 999 }, 'MEGA30': { discount: Math.min(Math.round(priceTotal * 0.3), 800), min: 1999 }, 'SUPER500': { discount: 500, min: 2499 } };
    const cp = validCoupons[c];
    if (!cp) { setCouponError('Invalid coupon code'); return; }
    if (priceTotal < cp.min) { setCouponError(`Min. order amount is ₹${cp.min}`); return; }
    dispatch({ type: 'cart/applyCoupon', payload: { code: c, discount: cp.discount } });
    dispatch(showToast({ message: `Coupon applied! You save ₹${cp.discount}`, type: 'success' }));
    setCouponError('');
  };

  const recommended = mockProducts.filter(p => !items.some(i => i.product._id === p._id)).slice(0, 4);

  if (items.length === 0) {
    return (
      <div className="page-enter max-w-4xl mx-auto px-4 py-20 text-center">
        <span className="text-7xl block mb-4">🛒</span>
        <h2 className="text-2xl font-display font-bold text-dark-700 mb-2">Your bag is empty!</h2>
        <p className="text-gray-400 mb-6">Looks like you haven't added anything to your bag yet.</p>
        <Link to="/products" className="btn-primary inline-block">Continue Shopping</Link>
        {recommended.length > 0 && (
          <div className="mt-16 text-left">
            <h3 className="text-xl font-bold text-dark-700 mb-6">You might like these</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{recommended.map(p => <ProductCard key={p._id} product={p} />)}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-display font-bold text-dark-700 mb-6">Shopping Bag ({items.length} item{items.length > 1 ? 's' : ''})</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="card p-4 flex gap-4">
              <Link to={`/product/${item.product._id}`} className="w-24 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                <img src={item.product.images[0]} alt={item.product.title} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product._id}`} className="hover:text-primary-500 transition-colors">
                  <p className="text-xs font-bold text-gray-500 uppercase">{item.product.brand}</p>
                  <p className="text-sm font-medium text-dark-700 truncate">{item.product.title}</p>
                </Link>
                <p className="text-xs text-gray-400 mt-1">Size: <span className="font-semibold text-dark-700">{item.size}</span> {item.color && <>· Color: <span className="font-semibold text-dark-700">{item.color}</span></>}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-bold text-dark-700">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                  <span className="text-xs text-gray-400 line-through">₹{(item.product.mrp * item.quantity).toLocaleString()}</span>
                  <span className="text-xs font-semibold text-secondary-500">{item.product.discount}% off</span>
                </div>
                {/* Quantity */}
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))} disabled={item.quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-sm font-bold disabled:opacity-30">−</button>
                    <span className="w-8 h-8 flex items-center justify-center text-sm font-semibold border-x">{item.quantity}</span>
                    <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-sm font-bold">+</button>
                  </div>
                </div>
              </div>
              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button onClick={() => { dispatch(removeFromCart(item.id)); dispatch(showToast({ message: 'Item removed from bag', type: 'info' })); }}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors">✕</button>
                <button onClick={() => { dispatch(toggleWishlist(item.product)); dispatch(removeFromCart(item.id)); dispatch(showToast({ message: 'Moved to wishlist', type: 'success' })); }}
                  className="text-xs text-gray-400 hover:text-primary-500 transition-colors mt-auto" title="Move to Wishlist">♡</button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Price Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Total MRP</span><span className="text-dark-700">₹{mrpTotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-green-600"><span>Discount on MRP</span><span>-₹{totalDiscount.toLocaleString()}</span></div>
              {couponDiscount > 0 && <div className="flex justify-between text-green-600"><span>Coupon ({coupon?.code})</span><span>-₹{couponDiscount.toLocaleString()}</span></div>}
              <div className="flex justify-between"><span className="text-gray-600">Delivery</span><span className={deliveryCharge === 0 ? 'text-green-600 font-semibold' : ''}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span></div>
              <div className="border-t pt-3 flex justify-between text-base font-bold text-dark-700">
                <span>Total Amount</span><span>₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-sm font-semibold text-dark-700 mb-2">Apply Coupon</h4>
              <div className="flex gap-2">
                <input type="text" placeholder="Enter code" value={couponCode} onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm uppercase focus:outline-none focus:ring-2 focus:ring-primary-300" />
                <button onClick={handleApplyCoupon} className="px-4 py-2 text-sm font-bold text-primary-500 border border-primary-500 rounded-lg hover:bg-primary-50">Apply</button>
              </div>
              {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
              <div className="mt-2 space-y-1">
                {['WELCOME10 — 10% off', 'FLAT200 — ₹200 off (₹999+)', 'MEGA30 — 30% off (₹1999+)'].map(c => (
                  <button key={c} onClick={() => setCouponCode(c.split(' —')[0])} className="text-xs text-gray-400 hover:text-primary-500 block">🏷️ {c}</button>
                ))}
              </div>
            </div>

            <Link to="/checkout" className="btn-primary w-full block text-center mt-6 py-4 text-base">PROCEED TO CHECKOUT</Link>
            <p className="text-xs text-center text-green-600 mt-2 font-medium">🔒 Secure Checkout · 100% Genuine</p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommended.length > 0 && (
        <div className="mt-12 pt-8 border-t">
          <h3 className="text-xl font-display font-bold text-dark-700 mb-6">You might also like</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{recommended.map(p => <ProductCard key={p._id} product={p} />)}</div>
        </div>
      )}
    </div>
  );
}
