import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { removeFromWishlist } from '../store/wishlistSlice';
import { addToCart } from '../store/cartSlice';
import { showToast } from '../store/uiSlice';
import { useState } from 'react';

export default function Wishlist() {
  const dispatch = useDispatch();
  const { items } = useSelector((s: RootState) => s.wishlist);
  const [movingId, setMovingId] = useState('');

  const handleMoveToCart = (product: typeof items[0]) => {
    setMovingId(product._id);
    dispatch(addToCart({ product, size: 'M', color: product.colors?.[0]?.name }));
    dispatch(removeFromWishlist(product._id));
    dispatch(showToast({ message: `${product.title} moved to bag!`, type: 'success' }));
    setTimeout(() => setMovingId(''), 300);
  };

  if (items.length === 0) {
    return (
      <div className="page-enter max-w-4xl mx-auto px-4 py-20 text-center">
        <span className="text-7xl block mb-4">❤️</span>
        <h2 className="text-2xl font-display font-bold text-dark-700 mb-2">Your wishlist is empty!</h2>
        <p className="text-gray-400 mb-6">Save items you love to your wishlist and review them anytime.</p>
        <Link to="/products" className="btn-primary inline-block">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-dark-700">
          My Wishlist <span className="text-gray-400 font-normal text-lg">({items.length} item{items.length > 1 ? 's' : ''})</span>
        </h1>
        <button onClick={() => navigator.clipboard?.writeText(window.location.href).then(() => dispatch(showToast({ message: 'Wishlist link copied!', type: 'success' })))}
          className="text-sm font-semibold text-primary-500 hover:text-primary-600 flex items-center gap-1">
          📤 Share Wishlist
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map(product => (
          <div key={product._id} className={`card relative transition-all ${movingId === product._id ? 'scale-95 opacity-50' : ''}`}>
            <Link to={`/product/${product._id}`}>
              <div className="aspect-[3/4] bg-gray-100 overflow-hidden relative">
                <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" loading="lazy" />
                {product.discount >= 30 && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    🔥 Price Drop
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs font-bold text-dark-700 uppercase truncate">{product.brand}</p>
                <p className="text-sm text-gray-500 truncate">{product.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-dark-700">₹{product.price.toLocaleString()}</span>
                  {product.discount > 0 && (
                    <>
                      <span className="text-xs text-gray-400 line-through">₹{product.mrp.toLocaleString()}</span>
                      <span className="text-xs font-semibold text-secondary-500">({product.discount}% off)</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
            {/* Actions */}
            <div className="p-3 pt-0 flex gap-2">
              <button onClick={() => handleMoveToCart(product)}
                className="flex-1 py-2 text-xs font-bold border-2 border-primary-500 text-primary-500 rounded-lg hover:bg-primary-500 hover:text-white transition-all">
                MOVE TO BAG
              </button>
              <button onClick={() => { dispatch(removeFromWishlist(product._id)); dispatch(showToast({ message: 'Removed from wishlist', type: 'info' })); }}
                className="w-10 h-10 flex items-center justify-center border rounded-lg text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors">
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
