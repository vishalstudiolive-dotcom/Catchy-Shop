import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import { showToast } from '../store/uiSlice';

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', gender: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    setTimeout(() => {
      dispatch(login({
        user: { id: 'new_' + Date.now(), name: formData.name, email: formData.email, phone: formData.phone, gender: formData.gender, role: 'user' },
        token: 'demo_token_' + Date.now()
      }));
      dispatch(showToast({ message: 'Account created! Welcome to Catchy Shop 🎉', type: 'success' }));
      navigate('/');
      setLoading(false);
    }, 800);
  };

  const update = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <div className="page-enter min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="card p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-2xl font-bold">C</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-dark-700">Create Account</h1>
            <p className="text-sm text-gray-400 mt-1">Join Catchy Shop for exclusive deals</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-dark-700 block mb-1.5">Full Name</label>
              <input type="text" required value={formData.name} onChange={e => update('name', e.target.value)} placeholder="Your full name" className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-dark-700 block mb-1.5">Email Address</label>
              <input type="email" required value={formData.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com" className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-dark-700 block mb-1.5">Mobile Number</label>
              <div className="flex">
                <span className="px-3 py-3 bg-gray-100 border border-r-0 rounded-l-lg text-sm text-gray-500">+91</span>
                <input type="tel" maxLength={10} value={formData.phone} onChange={e => update('phone', e.target.value.replace(/\D/g, ''))} placeholder="Mobile number" className="input-field rounded-l-none" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-dark-700 block mb-1.5">Gender</label>
              <div className="flex gap-3">
                {['Male', 'Female', 'Other'].map(g => (
                  <button key={g} type="button" onClick={() => update('gender', g.toLowerCase())}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg border-2 transition-all ${formData.gender === g.toLowerCase() ? 'border-primary-500 bg-primary-50 text-primary-500' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-dark-700 block mb-1.5">Password</label>
              <input type="password" required value={formData.password} onChange={e => update('password', e.target.value)} placeholder="Min. 6 characters" className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-dark-700 block mb-1.5">Confirm Password</label>
              <input type="password" required value={formData.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} placeholder="Confirm your password" className="input-field" />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-xs text-center text-gray-400 mt-4">By signing up, you agree to our <a href="#" className="underline">Terms</a> & <a href="#" className="underline">Privacy Policy</a></p>
          <p className="text-sm text-center text-gray-400 mt-4">Already have an account? <Link to="/login" className="text-primary-500 font-semibold hover:underline">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}
