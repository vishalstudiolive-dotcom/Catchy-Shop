import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { mockProducts } from '../data/mockData';
import { addToCart } from '../store/cartSlice';
import { toggleWishlist } from '../store/wishlistSlice';
import { showToast, addRecentlyViewed } from '../store/uiSlice';
import { RootState } from '../store/store';
import ProductCard from '../components/common/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const wishlist = useSelector((s: RootState) => s.wishlist.items);
  const recentlyViewed = useSelector((s: RootState) => s.ui.recentlyViewed);
  const product = mockProducts.find(p => p._id === id);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [pincode, setPincode] = useState('');
  const [pincodeMsg, setPincodeMsg] = useState('');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [reviewFilter, setReviewFilter] = useState(0);

  const isWishlisted = wishlist.some(w => w._id === id);
  const similar = useMemo(() => product ? mockProducts.filter(p => p._id !== product._id && (p.category === product.category || p.brand === product.brand) && p.gender === product.gender).slice(0, 6) : [], [product]);
  const recentProducts = useMemo(() => recentlyViewed.filter(rid => rid !== id).map(rid => mockProducts.find(p => p._id === rid)).filter(Boolean).slice(0, 6) as typeof mockProducts, [recentlyViewed, id]);

  useEffect(() => {
    if (id) { dispatch(addRecentlyViewed(id)); window.scrollTo(0, 0); }
    setSelectedImage(0); setSelectedSize(''); setSelectedColor('');
  }, [id, dispatch]);

  if (!product) return <div className="text-center py-20"><span className="text-6xl block mb-4">😕</span><h2 className="text-2xl font-bold">Product not found</h2><Link to="/products" className="btn-primary mt-4 inline-block">Browse Products</Link></div>;

  const handleAddToCart = () => {
    if (!selectedSize) { dispatch(showToast({ message: 'Please select a size', type: 'warning' })); return; }
    dispatch(addToCart({ product, size: selectedSize, color: selectedColor || product.colors?.[0]?.name }));
    dispatch(showToast({ message: `${product.title} added to bag!`, type: 'success' }));
  };

  const handleBuyNow = () => { handleAddToCart(); };

  const checkPincode = () => {
    if (pincode.length === 6) setPincodeMsg(`✅ Delivery available! Estimated delivery by ${new Date(Date.now() + 5 * 86400000).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}`);
    else setPincodeMsg('❌ Please enter a valid 6-digit pincode');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPosition({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  const filteredReviews = product.reviews ? (reviewFilter > 0 ? product.reviews.filter(r => r.rating === reviewFilter) : product.reviews) : [];

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/" className="hover:text-primary-500">Home</Link><span>/</span>
        <Link to={`/products?gender=${product.gender}`} className="hover:text-primary-500 capitalize">{product.gender}</Link><span>/</span>
        <Link to={`/products?category=${product.category}`} className="hover:text-primary-500">{product.category}</Link><span>/</span>
        <span className="text-dark-700 truncate max-w-[200px]">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="flex gap-4">
          {/* Thumbnails */}
          <div className="hidden sm:flex flex-col gap-2 w-16 flex-shrink-0">
            {product.images.map((img, idx) => (
              <button key={idx} onClick={() => setSelectedImage(idx)}
                className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-primary-500' : 'border-gray-200 hover:border-gray-400'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          {/* Main Image */}
          <div className="flex-1 relative">
            <div className="aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden cursor-zoom-in relative"
              onClick={() => setShowFullScreen(true)}
              onMouseEnter={() => setIsZooming(true)} onMouseLeave={() => setIsZooming(false)} onMouseMove={handleMouseMove}>
              <img src={product.images[selectedImage]} alt={product.title}
                className="w-full h-full object-cover transition-transform duration-200"
                style={isZooming ? { transform: 'scale(2)', transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : {}} />
            </div>
            {/* Mobile Image Dots */}
            <div className="flex sm:hidden justify-center gap-2 mt-3">
              {product.images.map((_, idx) => (
                <button key={idx} onClick={() => setSelectedImage(idx)}
                  className={`w-2 h-2 rounded-full ${selectedImage === idx ? 'bg-primary-500' : 'bg-gray-300'}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Link to={`/products?brand=${product.brand}`} className="text-sm font-bold text-gray-500 hover:text-primary-500 transition-colors uppercase tracking-wide">{product.brand}</Link>
          <h1 className="text-xl lg:text-2xl font-semibold text-dark-700 mt-1 mb-3">{product.title}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1 bg-green-600 text-white text-sm font-bold px-2.5 py-1 rounded-lg">
              <span>{product.avgRating}</span><span>★</span>
            </div>
            <span className="text-sm text-gray-400">{product.numReviews.toLocaleString()} Ratings</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6 pb-6 border-b">
            <span className="text-2xl font-bold text-dark-700">₹{product.price.toLocaleString()}</span>
            <span className="text-lg text-gray-400 line-through">MRP ₹{product.mrp.toLocaleString()}</span>
            <span className="text-lg font-bold text-secondary-500">({product.discount}% OFF)</span>
          </div>

          {/* Size Selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-dark-700">Select Size</h3>
              <button onClick={() => setShowSizeGuide(true)} className="text-sm font-semibold text-primary-500 hover:underline">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(s => (
                <button key={s.size} onClick={() => setSelectedSize(s.size)} disabled={s.stock === 0}
                  className={`w-12 h-12 rounded-xl font-semibold text-sm border-2 transition-all ${selectedSize === s.size ? 'border-primary-500 bg-primary-500 text-white' : s.stock === 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed line-through' : 'border-gray-300 text-dark-700 hover:border-primary-400'}`}>
                  {s.size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          {product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-dark-700 mb-3">Select Color</h3>
              <div className="flex gap-3">
                {product.colors.map(c => (
                  <button key={c.name} onClick={() => setSelectedColor(c.name)} title={c.name}
                    className={`w-9 h-9 rounded-full border-2 transition-all hover:scale-110 ${selectedColor === c.name ? 'border-primary-500 ring-2 ring-primary-300 ring-offset-2' : 'border-gray-200'}`}
                    style={{ backgroundColor: c.hex }} />
                ))}
              </div>
              {selectedColor && <p className="text-sm text-gray-500 mt-2">{selectedColor}</p>}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <button onClick={handleAddToCart} className="flex-1 btn-primary flex items-center justify-center gap-2 text-base py-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              ADD TO BAG
            </button>
            <button onClick={() => { dispatch(toggleWishlist(product)); dispatch(showToast({ message: isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist', type: 'success' })); }}
              className={`flex-1 flex items-center justify-center gap-2 text-base py-4 font-semibold rounded-lg border-2 transition-all ${isWishlisted ? 'border-primary-500 bg-primary-50 text-primary-500' : 'border-gray-300 text-dark-700 hover:border-primary-400'}`}>
              <svg className={`w-5 h-5 ${isWishlisted ? 'fill-primary-500 text-primary-500' : ''}`} fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              {isWishlisted ? 'WISHLISTED' : 'WISHLIST'}
            </button>
          </div>

          {/* Buy Now */}
          <Link to="/checkout" onClick={handleBuyNow} className="block w-full text-center btn-dark py-4 text-base mb-6">⚡ BUY NOW</Link>

          {/* Pincode Checker */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-dark-700 mb-2">Delivery Options</h4>
            <div className="flex gap-2">
              <input type="text" placeholder="Enter Pincode" maxLength={6} value={pincode} onChange={e => { setPincode(e.target.value.replace(/\D/g, '')); setPincodeMsg(''); }}
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
              <button onClick={checkPincode} className="px-4 py-2 text-sm font-semibold text-primary-500 border border-primary-500 rounded-lg hover:bg-primary-50">Check</button>
            </div>
            {pincodeMsg && <p className="text-sm mt-2">{pincodeMsg}</p>}
            <div className="grid grid-cols-3 gap-3 mt-3 text-center">
              {[{ icon: '🚚', text: 'Free Delivery' }, { icon: '↩️', text: 'Easy Returns' }, { icon: '💰', text: 'COD Available' }].map(d => (
                <div key={d.text} className="text-xs text-gray-500"><span className="text-lg block mb-1">{d.icon}</span>{d.text}</div>
              ))}
            </div>
          </div>

          {/* Offers */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-dark-700 mb-3">Available Offers</h4>
            <div className="space-y-2 text-sm">
              {['10% Instant Discount on HDFC Cards', 'Flat ₹200 off on orders above ₹999 - Use code FLAT200', 'EMI starting ₹166/month on orders above ₹3000', 'Free shipping on orders above ₹499'].map(offer => (
                <div key={offer} className="flex items-start gap-2"><span className="text-primary-500 flex-shrink-0">🏷️</span><span className="text-gray-600">{offer}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12 border-t pt-8">
        <div className="flex gap-1 border-b mb-6 overflow-x-auto">
          {[{ key: 'description', label: 'Product Details' }, { key: 'size-fit', label: 'Size & Fit' }, { key: 'delivery', label: 'Delivery & Returns' }, { key: 'reviews', label: `Reviews (${product.numReviews})` }].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.key ? 'text-primary-500 border-primary-500' : 'text-gray-500 border-transparent hover:text-dark-700'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'description' && (
          <div className="prose max-w-3xl">
            <p className="text-gray-600 leading-relaxed mb-4">{product.description}</p>
            <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-sm">
              <div><span className="font-semibold text-dark-700">Fabric:</span> <span className="text-gray-600">{product.fabric}</span></div>
              <div><span className="font-semibold text-dark-700">Fit:</span> <span className="text-gray-600">{product.fit}</span></div>
              <div><span className="font-semibold text-dark-700">Occasion:</span> <span className="text-gray-600">{product.occasion?.join(', ')}</span></div>
              <div><span className="font-semibold text-dark-700">Wash Care:</span> <span className="text-gray-600">{product.washCare}</span></div>
            </div>
          </div>
        )}

        {activeTab === 'size-fit' && (
          <div className="max-w-2xl">
            <p className="text-sm text-gray-600 mb-4">The model is wearing size M. Model measurements: Height 5'10", Chest 38", Waist 32".</p>
            <table className="w-full text-sm border-collapse">
              <thead><tr className="bg-gray-50"><th className="px-4 py-3 text-left font-semibold">Size</th><th className="px-4 py-3 text-left font-semibold">Chest (in)</th><th className="px-4 py-3 text-left font-semibold">Waist (in)</th><th className="px-4 py-3 text-left font-semibold">Hip (in)</th></tr></thead>
              <tbody>{[['XS','34','28','36'],['S','36','30','38'],['M','38','32','40'],['L','40','34','42'],['XL','42','36','44'],['XXL','44','38','46']].map(r => (
                <tr key={r[0]} className="border-b hover:bg-gray-50"><td className="px-4 py-3 font-medium">{r[0]}</td><td className="px-4 py-3">{r[1]}</td><td className="px-4 py-3">{r[2]}</td><td className="px-4 py-3">{r[3]}</td></tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {activeTab === 'delivery' && (
          <div className="max-w-2xl space-y-4 text-sm text-gray-600">
            <div><h4 className="font-semibold text-dark-700 mb-1">Delivery</h4><p>Free delivery on orders above ₹499. Standard delivery in 4-6 business days. Express delivery available for select pincodes.</p></div>
            <div><h4 className="font-semibold text-dark-700 mb-1">Returns</h4><p>Easy 15-day return policy. Item must be unused, unwashed, and with tags attached. Refund will be processed within 5-7 business days.</p></div>
            <div><h4 className="font-semibold text-dark-700 mb-1">Exchange</h4><p>Free exchange available for size or color changes. Subject to stock availability.</p></div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="max-w-3xl">
            {/* Rating Summary */}
            <div className="flex items-start gap-8 mb-8 p-6 bg-gray-50 rounded-xl">
              <div className="text-center">
                <div className="text-4xl font-bold text-dark-700">{product.avgRating}</div>
                <div className="flex gap-0.5 my-1 justify-center">{[1,2,3,4,5].map(s => <span key={s} className={`text-lg ${s <= Math.round(product.avgRating) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>)}</div>
                <p className="text-xs text-gray-400">{product.numReviews} reviews</p>
              </div>
              <div className="flex-1 space-y-1">
                {[5,4,3,2,1].map(star => {
                  const count = product.reviews?.filter(r => r.rating === star).length || 0;
                  const pct = product.reviews?.length ? (count / product.reviews.length * 100) : 0;
                  return (
                    <button key={star} onClick={() => setReviewFilter(reviewFilter === star ? 0 : star)} className="flex items-center gap-2 w-full group">
                      <span className="text-xs w-4 text-gray-500">{star}★</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} /></div>
                      <span className="text-xs text-gray-400 w-6">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Review List */}
            <div className="space-y-4">
              {filteredReviews.map(r => (
                <div key={r._id} className="p-4 border rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-0.5 text-xs font-bold text-white bg-green-600 rounded">{r.rating}★</span>
                    <span className="font-semibold text-sm">{r.title}</span>
                    {r.verified && <span className="text-xs text-green-600 font-medium">✓ Verified</span>}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{r.comment}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{typeof r.user === 'object' ? r.user.name : 'User'} · {new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
                    <button className="hover:text-dark-700">👍 Helpful ({r.helpfulVotes})</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Similar Products */}
      {similar.length > 0 && (
        <section className="mt-12 pt-8 border-t">
          <h2 className="text-xl font-display font-bold text-dark-700 mb-6">Similar Products</h2>
          <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
            {similar.map(p => <div key={p._id} className="flex-shrink-0 w-[200px]"><ProductCard product={p} /></div>)}
          </div>
        </section>
      )}

      {/* Recently Viewed */}
      {recentProducts.length > 0 && (
        <section className="mt-12 pt-8 border-t">
          <h2 className="text-xl font-display font-bold text-dark-700 mb-6">Recently Viewed</h2>
          <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
            {recentProducts.map(p => <div key={p._id} className="flex-shrink-0 w-[200px]"><ProductCard product={p} /></div>)}
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowSizeGuide(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold">Size Guide</h3><button onClick={() => setShowSizeGuide(false)} className="text-2xl text-gray-400 hover:text-dark-700">×</button></div>
            <table className="w-full text-sm border-collapse">
              <thead><tr className="bg-gray-50"><th className="px-3 py-2 text-left">Size</th><th className="px-3 py-2 text-left">Chest (in)</th><th className="px-3 py-2 text-left">Waist (in)</th><th className="px-3 py-2 text-left">Hip (in)</th></tr></thead>
              <tbody>{[['XS','34','28','36'],['S','36','30','38'],['M','38','32','40'],['L','40','34','42'],['XL','42','36','44'],['XXL','44','38','46']].map(r => (
                <tr key={r[0]} className="border-b"><td className="px-3 py-2 font-medium">{r[0]}</td><td className="px-3 py-2">{r[1]}</td><td className="px-3 py-2">{r[2]}</td><td className="px-3 py-2">{r[3]}</td></tr>
              ))}</tbody>
            </table>
            <p className="text-xs text-gray-400 mt-4">Measurements are in inches. For best fit, measure over your innerwear.</p>
          </div>
        </div>
      )}

      {/* Full Screen Image Modal */}
      {showFullScreen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center" onClick={() => setShowFullScreen(false)}>
          <button className="absolute top-4 right-4 text-white text-3xl z-10 hover:text-gray-300">×</button>
          <img src={product.images[selectedImage]} alt={product.title} className="max-w-full max-h-full object-contain" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {product.images.map((img, idx) => (
              <button key={idx} onClick={e => { e.stopPropagation(); setSelectedImage(idx); }}
                className={`w-12 h-14 rounded-lg overflow-hidden border-2 ${selectedImage === idx ? 'border-white' : 'border-transparent opacity-60'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sticky Mobile Add to Cart */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-3 flex gap-3 lg:hidden z-40">
        <button onClick={() => { dispatch(toggleWishlist(product)); }} className="p-3 border rounded-xl">
          <svg className={`w-6 h-6 ${isWishlisted ? 'fill-primary-500 text-primary-500' : 'text-gray-400'}`} fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>
        <button onClick={handleAddToCart} className="flex-1 btn-primary py-3 text-base">ADD TO BAG</button>
      </div>
    </div>
  );
}
