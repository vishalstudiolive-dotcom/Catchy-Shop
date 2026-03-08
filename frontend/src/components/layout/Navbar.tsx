import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { logout } from '../../store/authSlice';
import { mockProducts } from '../../data/mockData';

const megaMenuData = [
  {
    label: 'Men', gender: 'men',
    sections: [
      { title: 'Topwear', items: ['T-Shirts', 'Shirts', 'Jackets'] },
      { title: 'Bottomwear', items: ['Jeans'] },
      { title: 'Footwear', items: ['Sneakers'] },
      { title: 'Accessories', items: ['Watches'] },
    ]
  },
  {
    label: 'Women', gender: 'women',
    sections: [
      { title: 'Western', items: ['Dresses', 'Tops', 'Skirts'] },
      { title: 'Ethnic', items: ['Kurtas'] },
      { title: 'Footwear', items: ['Sneakers'] },
      { title: 'Accessories', items: ['Watches'] },
    ]
  },
  {
    label: 'Kids', gender: 'kids',
    sections: [
      { title: 'Clothing', items: ['T-Shirts', 'Dresses', 'Jeans'] },
      { title: 'Footwear', items: ['Sneakers'] },
      { title: 'Winter', items: ['Jackets'] },
    ]
  },
  {
    label: 'Sports', gender: '',
    sections: [
      { title: 'Brands', items: ['Nike', 'Adidas', 'Puma'] },
      { title: 'Categories', items: ['Sneakers', 'T-Shirts', 'Jackets'] },
    ]
  },
];

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: cartItems } = useSelector((s: RootState) => s.cart);
  const { items: wishlistItems } = useSelector((s: RootState) => s.wishlist);
  const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof mockProducts>([]);
  const [activeMega, setActiveMega] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Search suggestions
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const q = searchQuery.toLowerCase();
      const results = mockProducts.filter(p =>
        p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      ).slice(0, 6);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) { setSearchOpen(false); setSuggestions([]); }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSuggestions([]);
      setSearchQuery('');
    }
  };

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-display font-bold text-dark-700 leading-none">Catchy</h1>
                <p className="text-[9px] font-semibold tracking-[0.2em] text-primary-500 uppercase leading-none">Shop</p>
              </div>
            </Link>

            {/* Mega Menu Nav - Desktop */}
            <div className="hidden lg:flex items-center gap-1 ml-6">
              {megaMenuData.map((menu, idx) => (
                <div key={idx} className="nav-item relative"
                  onMouseEnter={() => setActiveMega(idx)} onMouseLeave={() => setActiveMega(null)}>
                  <Link to={`/products?gender=${menu.gender}`}
                    className={`px-4 py-5 text-sm font-semibold uppercase tracking-wide transition-colors hover:text-primary-500 border-b-[3px] ${activeMega === idx ? 'text-primary-500 border-primary-500' : 'text-dark-700 border-transparent'}`}>
                    {menu.label}
                  </Link>
                  {/* Mega Menu Dropdown */}
                  {activeMega === idx && (
                    <div className="mega-menu absolute top-full left-0 bg-white shadow-xl rounded-b-2xl border-t-2 border-primary-500 p-6 min-w-[500px] animate-fade-in" style={{display:'block'}}>
                      <div className="grid grid-cols-3 gap-8">
                        {menu.sections.map((section, sIdx) => (
                          <div key={sIdx}>
                            <h3 className="text-sm font-bold text-primary-500 uppercase mb-3">{section.title}</h3>
                            <ul className="space-y-2">
                              {section.items.map((item, iIdx) => (
                                <li key={iIdx}>
                                  <Link to={`/products?category=${item}&gender=${menu.gender}`}
                                    className="text-sm text-gray-600 hover:text-primary-500 hover:font-medium transition-all" onClick={() => setActiveMega(null)}>
                                    {item}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Search Bar */}
            <div ref={searchRef} className="flex-1 max-w-xl mx-4 relative">
              <form onSubmit={handleSearch} className="relative">
                <input type="text" placeholder="Search for products, brands and more..."
                  value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                  onFocus={() => setSearchOpen(true)}
                  className="w-full h-10 pl-10 pr-4 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent focus:bg-white transition-all" />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </form>
              {/* Search Suggestions */}
              {searchOpen && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-scale-in">
                  {suggestions.map(p => (
                    <Link key={p._id} to={`/product/${p._id}`} onClick={() => { setSearchOpen(false); setSuggestions([]); setSearchQuery(''); }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                      <img src={p.images[0]} alt={p.title} className="w-10 h-12 object-cover rounded-lg" loading="lazy" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-dark-700 truncate">{p.title}</p>
                        <p className="text-xs text-gray-400">{p.brand} · {p.category}</p>
                      </div>
                      <span className="text-sm font-semibold text-dark-700">₹{p.price.toLocaleString()}</span>
                    </Link>
                  ))}
                  <Link to={`/products?search=${encodeURIComponent(searchQuery)}`} onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    className="block text-center py-3 text-sm font-semibold text-primary-500 hover:bg-primary-50 border-t transition-colors">
                    View all results for "{searchQuery}"
                  </Link>
                </div>
              )}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-1">
              {/* Profile */}
              <div ref={profileRef} className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)}
                  className="flex flex-col items-center p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                  <svg className="w-5 h-5 text-dark-700 group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  <span className="text-[10px] font-semibold text-dark-600 hidden md:block mt-0.5">
                    {isAuthenticated ? user?.name?.split(' ')[0] : 'Profile'}
                  </span>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-scale-in">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-3 bg-gray-50 border-b">
                          <p className="font-semibold text-dark-700">{user?.name}</p>
                          <p className="text-xs text-gray-400">{user?.email}</p>
                        </div>
                        <Link to="/profile" onClick={() => setProfileOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors">👤 My Profile</Link>
                        <Link to="/profile?tab=orders" onClick={() => setProfileOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors">📦 My Orders</Link>
                        <Link to="/wishlist" onClick={() => setProfileOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors">❤️ My Wishlist</Link>
                        <Link to="/profile?tab=coupons" onClick={() => setProfileOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors">🏷️ Coupons</Link>
                        {user?.role === 'admin' && (
                          <Link to="/admin" onClick={() => setProfileOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors text-primary-500 font-medium">⚙️ Admin Panel</Link>
                        )}
                        <button onClick={() => { dispatch(logout()); setProfileOpen(false); navigate('/'); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 border-t transition-colors">🚪 Logout</button>
                      </>
                    ) : (
                      <>
                        <div className="p-4 text-center">
                          <p className="text-sm text-gray-500 mb-3">Welcome to Catchy Shop!</p>
                          <Link to="/login" onClick={() => setProfileOpen(false)} className="btn-primary block text-sm text-center py-2.5">Login / Sign Up</Link>
                        </div>
                        <Link to="/profile?tab=orders" onClick={() => setProfileOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-gray-50 border-t transition-colors">📦 Orders</Link>
                        <Link to="/wishlist" onClick={() => setProfileOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors">❤️ Wishlist</Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link to="/wishlist" className="flex flex-col items-center p-2 hover:bg-gray-50 rounded-lg transition-colors group relative">
                <svg className="w-5 h-5 text-dark-700 group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
                <span className="text-[10px] font-semibold text-dark-600 hidden md:block mt-0.5">Wishlist</span>
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-0.5 right-0.5 w-4 h-4 bg-primary-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-bounce-in">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link to="/cart" className="flex flex-col items-center p-2 hover:bg-gray-50 rounded-lg transition-colors group relative">
                <svg className="w-5 h-5 text-dark-700 group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                <span className="text-[10px] font-semibold text-dark-600 hidden md:block mt-0.5">Bag</span>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 right-0.5 w-4 h-4 bg-primary-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-bounce-in">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white animate-slide-in overflow-y-auto">
            <div className="p-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
              <button onClick={() => setMobileMenuOpen(false)} className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl">×</button>
              {isAuthenticated ? (
                <div>
                  <p className="font-semibold text-lg">{user?.name}</p>
                  <p className="text-sm opacity-80">{user?.email}</p>
                </div>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="font-semibold text-lg hover:underline">Login / Sign Up →</Link>
              )}
            </div>
            <div className="p-4">
              {megaMenuData.map((menu, idx) => (
                <div key={idx} className="mb-4">
                  <Link to={`/products?gender=${menu.gender}`} onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-bold text-dark-700 mb-2 block">{menu.label}</Link>
                  <div className="grid grid-cols-2 gap-2">
                    {menu.sections.flatMap(s => s.items).map((item, i) => (
                      <Link key={i} to={`/products?category=${item}&gender=${menu.gender}`} onClick={() => setMobileMenuOpen(false)}
                        className="text-sm text-gray-600 hover:text-primary-500 py-1">{item}</Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
