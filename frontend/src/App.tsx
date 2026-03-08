import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store/store';
import { removeToast, acceptCookies, closeAuthModal } from './store/uiSlice';
import { useEffect, useState } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import AuthModal from './components/auth/AuthModal';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  const dispatch = useDispatch();
  const { toasts, cookieConsent, authModalOpen, authModalView } = useSelector((s: RootState) => s.ui);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-remove toasts
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => dispatch(removeToast(toasts[0].id)), 3000);
      return () => clearTimeout(timer);
    }
  }, [toasts, dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />

      {/* Toast Notifications */}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast-enter flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-md border ${
            toast.type === 'success' ? 'bg-emerald-50/95 border-emerald-200 text-emerald-800' :
            toast.type === 'error' ? 'bg-red-50/95 border-red-200 text-red-800' :
            toast.type === 'warning' ? 'bg-amber-50/95 border-amber-200 text-amber-800' :
            'bg-blue-50/95 border-blue-200 text-blue-800'
          }`}>
            <span className="text-xl">
              {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : toast.type === 'warning' ? '⚠' : 'ℹ'}
            </span>
            <span className="text-sm font-medium flex-1">{toast.message}</span>
            <button onClick={() => dispatch(removeToast(toast.id))} className="text-gray-400 hover:text-gray-600 text-lg">×</button>
          </div>
        ))}
      </div>

      {/* Cookie Consent */}
      {!cookieConsent && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-dark-700 text-white p-4 animate-slide-up">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-300">🍪 We use cookies to personalize your experience. By continuing, you agree to our cookie policy.</p>
            <div className="flex gap-3">
              <button onClick={() => dispatch(acceptCookies())} className="px-6 py-2 bg-primary-500 rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors">Accept All</button>
              <button onClick={() => dispatch(acceptCookies())} className="px-6 py-2 border border-gray-500 rounded-lg text-sm hover:bg-dark-600 transition-colors">Essential Only</button>
            </div>
          </div>
        </div>
      )}

      {showBackToTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-all hover:scale-110 animate-bounce-in flex items-center justify-center text-xl">
          ↑
        </button>
      )}
      
      {/* Global Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => dispatch(closeAuthModal())} 
        initialView={authModalView} 
      />
    </div>
  );
}

export default App;
