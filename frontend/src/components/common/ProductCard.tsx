import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Product } from '../../types';
import { toggleWishlist } from '../../store/wishlistSlice';
import { addToCart } from '../../store/cartSlice';
import { showToast } from '../../store/uiSlice';
import { RootState } from '../../store/store';

interface Props { product: Product; }

export default function ProductCard({ product }: Props) {
  const dispatch = useDispatch();
  const wishlist = useSelector((s: RootState) => s.wishlist.items);
  const isWishlisted = wishlist.some(w => w._id === product._id);
  const [selectedSize, setSelectedSize] = useState('');
  const [showSizes, setShowSizes] = useState(false);
  const isOutOfStock = product.totalStock === 0;
  const stars = Math.round(product.avgRating);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedSize) { setShowSizes(true); return; }
    dispatch(addToCart({ product, size: selectedSize, color: product.colors?.[0]?.name }));
    dispatch(showToast({ message: `${product.title} added to bag!`, type: 'success' }));
    setShowSizes(false);
    setSelectedSize('');
  };

  return (
    <div className="product-card group card relative">
      <Link to={`/product/${product._id}`} className="block">
        {/* Image Section */}
        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
          <img src={product.images[0]} alt={product.title} loading="lazy"
            className="product-img-primary absolute inset-0 w-full h-full object-cover" />
          {product.images[1] && (
            <img src={product.images[1]} alt={product.title} loading="lazy"
              className="product-img-secondary absolute inset-0 w-full h-full object-cover" />
          )}

          {/* Wishlist Button */}
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); dispatch(toggleWishlist(product)); dispatch(showToast({ message: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', type: isWishlisted ? 'info' : 'success' })); }}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10">
            <svg className={`w-4 h-4 transition-colors ${isWishlisted ? 'text-primary-500 fill-primary-500' : 'text-gray-400'}`} fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </button>

          {/* Discount Badge */}
          {product.discount > 0 && (
            <span className="absolute top-3 left-3 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
              {product.discount}% OFF
            </span>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="bg-dark-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">OUT OF STOCK</span>
            </div>
          )}

          {/* Quick Action Overlay */}
          {!isOutOfStock && (
            <div className="product-overlay absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
              {showSizes ? (
                <div className="flex flex-wrap gap-1.5 justify-center animate-fade-in">
                  {product.sizes.filter(s => s.stock > 0).map(s => (
                    <button key={s.size} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedSize(s.size); }}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${selectedSize === s.size ? 'bg-primary-500 text-white' : 'bg-white text-dark-700 hover:bg-primary-50'}`}>
                      {s.size}
                    </button>
                  ))}
                  {selectedSize && (
                    <button onClick={handleQuickAdd} className="w-full mt-1 py-2 bg-primary-500 text-white text-xs font-bold rounded-lg hover:bg-primary-600 transition-colors">
                      ADD TO BAG — {selectedSize}
                    </button>
                  )}
                </div>
              ) : (
                <button onClick={handleQuickAdd}
                  className="w-full py-2.5 bg-white/95 text-dark-700 text-xs font-bold rounded-lg hover:bg-white transition-colors shadow-md">
                  + ADD TO BAG
                </button>
              )}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="p-3">
          <p className="text-xs font-bold text-dark-700 uppercase tracking-wide truncate">{product.brand}</p>
          <p className="text-sm text-gray-500 truncate mt-0.5">{product.title}</p>

          {/* Price */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-bold text-dark-700">₹{product.price.toLocaleString()}</span>
            {product.discount > 0 && (
              <>
                <span className="text-xs text-gray-400 line-through">₹{product.mrp.toLocaleString()}</span>
                <span className="text-xs font-semibold text-secondary-500">({product.discount}% off)</span>
              </>
            )}
          </div>

          {/* Rating */}
          {product.numReviews > 0 && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="flex items-center gap-0.5 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                <span>{product.avgRating}</span>
                <span>★</span>
              </div>
              <span className="text-xs text-gray-400">({product.numReviews.toLocaleString()})</span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
