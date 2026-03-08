import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import { showToast } from '../store/uiSlice';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mode, setMode] = useState<'email' | 'otp'>('email');
  const [formData, setFormData] = useState({ email: '', password: '', phone: '', otp: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    // Demo login - accept any credentials
    setTimeout(() => {
      if (formData.email === 'admin@catchyshop.com' && formData.password === 'admin123') {
        dispatch(login({ user: { id: 'admin_001', name: 'Admin', email: 'admin@catchyshop.com', role: 'admin' }, token: 'demo_admin_token' }));
        dispatch(showToast({ message: 'Welcome, Admin!', type: 'success' }));
        navigate('/admin');
      } else {
        dispatch(login({ user: { id: 'user_001', name: formData.email.split('@')[0] || 'User', email: formData.email, role: 'user' }, token: 'demo_token_' + Date.now() }));
        dispatch(showToast({ message: 'Login successful!', type: 'success' }));
        navigate('/');
      }
      setLoading(false);
    }, 800);
  };

  const handleOTPLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      if (formData.phone.length !== 10) { setError('Enter a valid 10-digit number'); return; }
      setOtpSent(true); dispatch(showToast({ message: 'OTP sent to +91-' + formData.phone, type: 'success' })); return;
    }
    setLoading(true);
    setTimeout(() => {
      dispatch(login({ user: { id: 'user_otp', name: 'User', email: '', phone: formData.phone, role: 'user' }, token: 'demo_otp_token' }));
      dispatch(showToast({ message: 'Login successful!', type: 'success' }));
      navigate('/'); setLoading(false);
    }, 800);
  };

  return (
    <div className="page-enter min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="card p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-2xl font-bold">C</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-dark-700">Welcome Back!</h1>
            <p className="text-sm text-gray-400 mt-1">Login to your Catchy Shop account</p>
          </div>

          {/* Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button onClick={() => { setMode('email'); setError(''); }} className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${mode === 'email' ? 'bg-white shadow text-primary-500' : 'text-gray-500'}`}>Email</button>
            <button onClick={() => { setMode('otp'); setError(''); setOtpSent(false); }} className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${mode === 'otp' ? 'bg-white shadow text-primary-500' : 'text-gray-500'}`}>OTP Login</button>
          </div>

          {mode === 'email' ? (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-dark-700 block mb-1.5">Email Address</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com" className="input-field" />
              </div>
              <div>
                <label className="text-sm font-medium text-dark-700 block mb-1.5">Password</label>
                <input type="password" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password" className="input-field" />
              </div>
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-primary-500 hover:underline">Forgot Password?</Link>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOTPLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-dark-700 block mb-1.5">Mobile Number</label>
                <div className="flex">
                  <span className="px-3 py-3 bg-gray-100 border border-r-0 rounded-l-lg text-sm text-gray-500">+91</span>
                  <input type="tel" maxLength={10} required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                    placeholder="Enter mobile number" className="input-field rounded-l-none" />
                </div>
              </div>
              {otpSent && (
                <div className="animate-fade-in">
                  <label className="text-sm font-medium text-dark-700 block mb-1.5">Enter OTP</label>
                  <input type="text" maxLength={6} required value={formData.otp} onChange={e => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '') })}
                    placeholder="6-digit OTP" className="input-field text-center text-lg tracking-[0.5em]" />
                  <button type="button" onClick={() => dispatch(showToast({ message: 'OTP resent!', type: 'success' }))} className="text-xs text-primary-500 hover:underline mt-2">Resend OTP</button>
                </div>
              )}
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                {loading ? 'Verifying...' : otpSent ? 'Verify & Login' : 'Send OTP'}
              </button>
            </form>
          )}

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t"/></div><div className="relative flex justify-center text-xs"><span className="bg-white px-4 text-gray-400">or continue with</span></div></div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button className="flex items-center justify-center gap-2 py-2.5 border rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium" onClick={() => { dispatch(login({ user: { id: 'g_user', name: 'Google User', email: 'user@gmail.com', role: 'user' }, token: 'google_token' })); navigate('/'); }}>
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 border rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium" onClick={() => { dispatch(login({ user: { id: 'fb_user', name: 'Facebook User', email: 'user@fb.com', role: 'user' }, token: 'fb_token' })); navigate('/'); }}>
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </button>
            </div>
          </div>

          <p className="text-sm text-center text-gray-400 mt-6">Don't have an account? <Link to="/register" className="text-primary-500 font-semibold hover:underline">Sign Up</Link></p>
          <p className="text-[10px] text-center text-gray-300 mt-2">Demo: Use any email/password or admin@catchyshop.com / admin123</p>
        </div>
      </div>
    </div>
  );
}
