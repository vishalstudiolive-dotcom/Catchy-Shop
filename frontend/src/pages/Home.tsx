import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import { mockProducts, mockBanners, categoryShortcuts, topBrands } from '../data/mockData';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dealTime, setDealTime] = useState({ hours: 5, minutes: 23, seconds: 47 });

  const featured = useMemo(() => mockProducts.filter(p => p.isFeatured).slice(0, 8), []);
  const newArrivals = useMemo(() => mockProducts.filter(p => p.isNewArrival).slice(0, 8), []);
  const trending = useMemo(() => [...mockProducts].sort((a, b) => b.numReviews - a.numReviews).slice(0, 10), []);

  // Auto-rotate banner
  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % mockBanners.length), 4000);
    return () => clearInterval(timer);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setDealTime(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="page-enter">
      {/* Hero Banner Slider */}
      <section className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px] overflow-hidden bg-gray-100">
        {mockBanners.map((banner, idx) => (
          <div key={banner._id} className={`absolute inset-0 transition-all duration-700 ease-in-out ${idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}>
            <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
                <div className="max-w-lg animate-slide-up">
                  <span className="inline-block px-3 py-1 bg-primary-500/90 text-white text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                    ✨ {banner.ctaText}
                  </span>
                  <h2 className="text-3xl sm:text-4xl lg:text-6xl font-display font-extrabold text-white mb-3 leading-tight">
                    {banner.title}
                  </h2>
                  <p className="text-base sm:text-lg text-white/80 mb-6">{banner.subtitle}</p>
                  <Link to={banner.link || '/products'} className="inline-flex items-center gap-2 bg-white text-dark-700 hover:bg-primary-500 hover:text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl">
                    {banner.ctaText} <span className="text-lg">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {mockBanners.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'}`} />
          ))}
        </div>
        {/* Nav Arrows */}
        <button onClick={() => setCurrentSlide(p => (p - 1 + mockBanners.length) % mockBanners.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur rounded-full flex items-center justify-center text-white transition-colors">❮</button>
        <button onClick={() => setCurrentSlide(p => (p + 1) % mockBanners.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur rounded-full flex items-center justify-center text-white transition-colors">❯</button>
      </section>

      {/* Category Shortcuts */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-4">
            {categoryShortcuts.map(cat => (
              <Link key={cat.name} to={cat.link} className="group flex flex-col items-center">
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${cat.bg} flex items-center justify-center text-2xl md:text-3xl shadow-md group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                  {cat.icon}
                </div>
                <span className="mt-2 text-xs sm:text-sm font-semibold text-dark-700 group-hover:text-primary-500 transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Now */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-dark-700">🔥 Trending Now</h2>
              <p className="text-sm text-gray-400 mt-1">Most popular picks this week</p>
            </div>
            <Link to="/products?sort=popular" className="text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors">View All →</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
            {trending.map(product => (
              <div key={product._id} className="flex-shrink-0 w-[200px] sm:w-[220px] snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Brands */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-dark-700 text-center mb-8">Top Brands</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {topBrands.map(brand => (
              <Link key={brand.name} to={`/products?brand=${brand.name}`}
                className="group px-6 py-4 bg-gray-50 rounded-xl hover:bg-primary-50 hover:shadow-md transition-all duration-300">
                <span className="text-lg font-display font-bold text-gray-400 group-hover:text-primary-500 transition-colors">{brand.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Deal of the Day */}
      <section className="py-12 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-bold text-white mb-4">⚡ FLASH SALE</span>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white mb-4">Deal of the Day</h2>
          <p className="text-white/80 mb-6">Grab before it's gone! Limited time offer.</p>
          {/* Countdown Timer */}
          <div className="flex justify-center gap-3 mb-8">
            {[
              { val: dealTime.hours, label: 'Hours' },
              { val: dealTime.minutes, label: 'Minutes' },
              { val: dealTime.seconds, label: 'Seconds' }
            ].map(t => (
              <div key={t.label} className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-3 min-w-[70px]">
                <span className="text-3xl font-bold text-white">{t.val.toString().padStart(2, '0')}</span>
                <p className="text-xs text-white/70 mt-1">{t.label}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 justify-start md:justify-center" style={{ scrollbarWidth: 'none' }}>
            {mockProducts.filter(p => p.discount >= 30).slice(0, 4).map(product => (
              <div key={product._id} className="flex-shrink-0 w-[200px] sm:w-[220px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-dark-700">✨ New Arrivals</h2>
              <p className="text-sm text-gray-400 mt-1">Fresh styles just dropped!</p>
            </div>
            <Link to="/products?sort=newest" className="text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors">View All →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {newArrivals.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Complete The Look */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-dark-700 text-center mb-2">👗 Complete The Look</h2>
          <p className="text-sm text-gray-400 text-center mb-8">Curated outfit combinations for every occasion</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Casual Weekend', products: mockProducts.filter(p => p.gender === 'men').slice(0, 3), bg: 'from-blue-50 to-indigo-50' },
              { title: 'Office Ready', products: mockProducts.filter(p => p.category === 'Shirts').slice(0, 3), bg: 'from-amber-50 to-orange-50' },
              { title: 'Party Night', products: mockProducts.filter(p => p.gender === 'women').slice(0, 3), bg: 'from-pink-50 to-rose-50' },
            ].map(look => (
              <div key={look.title} className={`bg-gradient-to-br ${look.bg} rounded-2xl p-6 hover:shadow-lg transition-shadow`}>
                <h3 className="text-lg font-bold text-dark-700 mb-4">{look.title}</h3>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {look.products.map(p => (
                    <Link key={p._id} to={`/product/${p._id}`} className="aspect-square rounded-xl overflow-hidden hover:scale-105 transition-transform">
                      <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                    </Link>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-dark-700">
                    ₹{look.products.reduce((s, p) => s + p.price, 0).toLocaleString()} total
                  </span>
                  <Link to="/products" className="text-sm font-bold text-primary-500 hover:text-primary-600">Shop Look →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-dark-700">⭐ Featured Picks</h2>
              <p className="text-sm text-gray-400 mt-1">Handpicked by our stylists</p>
            </div>
            <Link to="/products" className="text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors">View All →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* App Download Banner */}
      <section className="py-12 bg-dark-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-500 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary-500 rounded-full blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white mb-3">Shop On The Go! 📱</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">Download the Catchy Shop app for exclusive app-only deals, instant notifications, and a seamless shopping experience.</p>
          <div className="flex justify-center gap-4">
            <a href="#" className="px-6 py-3 bg-white text-dark-700 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"> App Store</a>
            <a href="#" className="px-6 py-3 bg-white text-dark-700 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"> Google Play</a>
          </div>
        </div>
      </section>
    </div>
  );
}
