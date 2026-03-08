import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); setTimeout(() => setSubscribed(false), 3000); }
  };

  return (
    <footer className="bg-dark-700 text-gray-300 mt-auto">
      {/* Newsletter */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 py-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-display font-bold text-white mb-2">Stay in Style — Subscribe!</h3>
          <p className="text-white/80 mb-6 text-sm">Get 10% off on your first order + exclusive deals straight to your inbox</p>
          <form onSubmit={handleSubscribe} className="flex max-w-md mx-auto gap-3">
            <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required
              className="flex-1 px-4 py-3 rounded-xl bg-white/20 backdrop-blur text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50" />
            <button type="submit" className="px-6 py-3 bg-white text-primary-500 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg">
              {subscribed ? '✓ Subscribed!' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      {/* Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="text-xl font-display font-bold text-white">Catchy Shop</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">Your one-stop fashion destination. Shop the latest trends from top brands with the best deals.</p>
            {/* Social Links */}
            <div className="flex gap-3">
              {['Facebook', 'Twitter', 'Instagram', 'YouTube'].map(s => (
                <a key={s} href="#" className="w-9 h-9 bg-dark-600 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors text-sm" title={s}>
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wide">Shop</h4>
            <ul className="space-y-2">
              {[['Men', '/products?gender=men'], ['Women', '/products?gender=women'], ['Kids', '/products?gender=kids'], ['New Arrivals', '/products?sort=newest'], ['Brands', '/products']].map(([label, link]) => (
                <li key={label}><Link to={link} className="text-sm text-gray-400 hover:text-primary-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wide">Help</h4>
            <ul className="space-y-2">
              {['FAQ', 'Shipping', 'Returns & Exchange', 'Size Guide', 'Contact Us'].map(item => (
                <li key={item}><a href="#" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wide">Company</h4>
            <ul className="space-y-2">
              {['About Us', 'Careers', 'Blog', 'Terms of Use', 'Privacy Policy'].map(item => (
                <li key={item}><a href="#" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wide">Download App</h4>
            <div className="space-y-3">
              <a href="#" className="block px-4 py-2.5 bg-dark-600 rounded-lg hover:bg-dark-500 transition-colors">
                <p className="text-[10px] text-gray-400">Download on the</p>
                <p className="text-sm font-semibold text-white">App Store</p>
              </a>
              <a href="#" className="block px-4 py-2.5 bg-dark-600 rounded-lg hover:bg-dark-500 transition-colors">
                <p className="text-[10px] text-gray-400">GET IT ON</p>
                <p className="text-sm font-semibold text-white">Google Play</p>
              </a>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-10 pt-8 border-t border-dark-600">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[
              { icon: '🚚', title: 'Free Shipping', desc: 'On orders above ₹499' },
              { icon: '↩️', title: 'Easy Returns', desc: '15-day return policy' },
              { icon: '🔒', title: 'Secure Payment', desc: '100% secure checkout' },
              { icon: '✅', title: 'Authentic Products', desc: '100% genuine brands' },
            ].map(badge => (
              <div key={badge.title} className="flex items-center gap-3">
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{badge.title}</p>
                  <p className="text-xs text-gray-400">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Methods */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">We Accept:</span>
              {['VISA', 'MC', 'UPI', 'RuPay', 'COD'].map(m => (
                <span key={m} className="px-2 py-1 bg-dark-600 rounded text-xs font-medium text-gray-300">{m}</span>
              ))}
            </div>
            <p className="text-xs text-gray-500">© 2026 Catchy Shop. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
