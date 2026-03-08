import { useState, useMemo } from 'react';
import { mockProducts } from '../data/mockData';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const demoOrders = [
  { id: 'CS7X9K2M', customer: 'Rahul M.', email: 'rahul@gmail.com', total: 2847, status: 'delivered', date: '2026-02-28', items: 2 },
  { id: 'CSAB3F7N', customer: 'Priya S.', email: 'priya@gmail.com', total: 1499, status: 'shipped', date: '2026-03-05', items: 1 },
  { id: 'CSDF9H2K', customer: 'Amit K.', email: 'amit@gmail.com', total: 4299, status: 'confirmed', date: '2026-03-06', items: 3 },
  { id: 'CSJK8L4P', customer: 'Neha R.', email: 'neha@gmail.com', total: 899, status: 'packed', date: '2026-03-07', items: 1 },
  { id: 'CSMN2Q5T', customer: 'Vikram S.', email: 'vikram@gmail.com', total: 5698, status: 'confirmed', date: '2026-03-07', items: 4 },
];

const demoUsers = [
  { id: '1', name: 'Rahul M.', email: 'rahul@gmail.com', orders: 5, joined: '2025-10-15', active: true },
  { id: '2', name: 'Priya S.', email: 'priya@gmail.com', orders: 3, joined: '2025-11-20', active: true },
  { id: '3', name: 'Amit K.', email: 'amit@gmail.com', orders: 8, joined: '2025-08-05', active: true },
  { id: '4', name: 'Neha R.', email: 'neha@gmail.com', orders: 2, joined: '2026-01-10', active: false },
];

export default function AdminDashboard() {
  const { user } = useSelector((s: RootState) => s.auth);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  const stats = useMemo(() => ({
    totalSales: 156890,
    ordersToday: 12,
    totalOrders: 234,
    newUsers: 45,
    totalProducts: mockProducts.length,
    revenue: 1568900,
  }), []);

  const lowStock = mockProducts.filter(p => p.totalStock < 20).slice(0, 5);

  // Category sales data for chart
  const categorySales = useMemo(() => {
    const cats: Record<string, number> = {};
    mockProducts.forEach(p => { cats[p.category] = (cats[p.category] || 0) + p.price; });
    return Object.entries(cats).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, []);
  const maxCatSales = Math.max(...categorySales.map(c => c[1]));

  if (user?.role !== 'admin') {
    return <div className="text-center py-20"><h2 className="text-xl font-bold text-dark-700 mb-4">⛔ Admin Access Only</h2><p className="text-gray-400 mb-6">Login with admin credentials to access this panel.</p><Link to="/login" className="btn-primary">Login as Admin</Link><p className="text-xs text-gray-300 mt-3">Demo: admin@catchyshop.com / admin123</p></div>;
  }

  const tabs = [
    { key: 'dashboard', label: '📊 Dashboard' },
    { key: 'products', label: '📦 Products' },
    { key: 'orders', label: '🛒 Orders' },
    { key: 'users', label: '👥 Users' },
    { key: 'coupons', label: '🏷️ Coupons' },
    { key: 'banners', label: '🖼️ Banners' },
  ];

  return (
    <div className="page-enter min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-dark-700">Admin Panel</h1>
            <p className="text-sm text-gray-400">Welcome back, {user?.name}</p>
          </div>
          <Link to="/" className="text-sm text-primary-500 font-semibold hover:underline">← Back to Store</Link>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="hidden lg:block w-52 flex-shrink-0">
            <div className="card p-2 sticky top-24 space-y-1">
              {tabs.map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.key ? 'bg-primary-50 text-primary-500' : 'text-gray-600 hover:bg-gray-50'}`}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile tab selection */}
          <div className="lg:hidden w-full">
            <select value={activeTab} onChange={e => setActiveTab(e.target.value)} className="w-full input-field mb-4">
              {tabs.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
            </select>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <div>
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Total Revenue', value: `₹${(stats.revenue / 100).toLocaleString()}`, color: 'from-primary-500 to-pink-500', icon: '💰' },
                    { label: 'Orders Today', value: stats.ordersToday, color: 'from-blue-500 to-indigo-600', icon: '📦' },
                    { label: 'Total Orders', value: stats.totalOrders, color: 'from-green-500 to-emerald-600', icon: '🛒' },
                    { label: 'New Users', value: stats.newUsers, color: 'from-amber-500 to-orange-600', icon: '👥' },
                  ].map(s => (
                    <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 text-white`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{s.icon}</span>
                        <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">↑ 12%</span>
                      </div>
                      <p className="text-2xl font-bold">{s.value}</p>
                      <p className="text-sm opacity-80">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Weekly Sales Bar Chart */}
                  <div className="card p-5">
                    <h3 className="font-bold text-dark-700 mb-4">Weekly Sales</h3>
                    <div className="flex items-end gap-3 h-40">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                        const height = [45, 60, 35, 80, 55, 90, 70][i];
                        return (
                          <div key={day} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-[10px] text-gray-400 font-medium">₹{(height * 100)}</span>
                            <div className="w-full bg-gradient-to-t from-primary-500 to-primary-300 rounded-t-lg transition-all hover:opacity-80" style={{ height: `${height}%` }} />
                            <span className="text-xs text-gray-400">{day}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category Sales */}
                  <div className="card p-5">
                    <h3 className="font-bold text-dark-700 mb-4">Sales by Category</h3>
                    <div className="space-y-3">
                      {categorySales.map(([cat, total]) => (
                        <div key={cat}>
                          <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">{cat}</span><span className="font-medium">₹{total.toLocaleString()}</span></div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full" style={{ width: `${(total / maxCatSales) * 100}%` }} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Low Stock */}
                <div className="card p-5">
                  <h3 className="font-bold text-dark-700 mb-4">⚠️ Low Stock Alerts</h3>
                  <div className="space-y-2">
                    {lowStock.map(p => (
                      <div key={p._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                        <img src={p.images[0]} alt={p.title} className="w-10 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{p.title}</p><p className="text-xs text-gray-400">{p.brand}</p></div>
                        <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">{p.totalStock} left</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Products Management */}
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-dark-700">Products ({mockProducts.length})</h2>
                  <button className="btn-primary text-sm py-2 px-4">+ Add Product</button>
                </div>
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="bg-gray-50 border-b"><th className="px-4 py-3 text-left font-semibold">Product</th><th className="px-4 py-3 text-left font-semibold">Brand</th><th className="px-4 py-3 text-left font-semibold">Price</th><th className="px-4 py-3 text-left font-semibold">Stock</th><th className="px-4 py-3 text-left font-semibold">Status</th><th className="px-4 py-3 text-right font-semibold">Actions</th></tr></thead>
                      <tbody>
                        {mockProducts.slice(0, 15).map(p => (
                          <tr key={p._id} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3"><div className="flex items-center gap-3"><img src={p.images[0]} alt="" className="w-10 h-12 rounded-lg object-cover" /><div className="min-w-0"><p className="font-medium truncate max-w-[200px]">{p.title}</p><p className="text-xs text-gray-400">{p.category}</p></div></div></td>
                            <td className="px-4 py-3 text-gray-600">{p.brand}</td>
                            <td className="px-4 py-3"><span className="font-semibold">₹{p.price}</span><br /><span className="text-xs text-gray-400 line-through">₹{p.mrp}</span></td>
                            <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-1 rounded ${p.totalStock < 20 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>{p.totalStock}</span></td>
                            <td className="px-4 py-3"><span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">Active</span></td>
                            <td className="px-4 py-3 text-right"><button className="text-xs text-primary-500 hover:underline mr-3">Edit</button><button className="text-xs text-red-500 hover:underline">Delete</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Management */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-lg font-bold text-dark-700 mb-4">Orders</h2>
                <div className="flex gap-2 mb-4 overflow-x-auto">
                  {['All', 'Confirmed', 'Packed', 'Shipped', 'Delivered'].map(s => (
                    <button key={s} className="px-4 py-2 text-xs font-semibold rounded-full border hover:border-primary-500 hover:text-primary-500 transition-colors whitespace-nowrap">{s}</button>
                  ))}
                </div>
                <div className="card overflow-hidden">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-gray-50 border-b"><th className="px-4 py-3 text-left font-semibold">Order ID</th><th className="px-4 py-3 text-left font-semibold">Customer</th><th className="px-4 py-3 text-left font-semibold">Items</th><th className="px-4 py-3 text-left font-semibold">Total</th><th className="px-4 py-3 text-left font-semibold">Status</th><th className="px-4 py-3 text-left font-semibold">Date</th><th className="px-4 py-3 text-right font-semibold">Actions</th></tr></thead>
                    <tbody>
                      {demoOrders.map(o => (
                        <tr key={o.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-mono text-xs">{o.id}</td>
                          <td className="px-4 py-3"><p className="font-medium">{o.customer}</p><p className="text-xs text-gray-400">{o.email}</p></td>
                          <td className="px-4 py-3">{o.items}</td>
                          <td className="px-4 py-3 font-semibold">₹{o.total.toLocaleString()}</td>
                          <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${o.status === 'delivered' ? 'bg-green-100 text-green-700' : o.status === 'shipped' ? 'bg-blue-100 text-blue-700' : o.status === 'packed' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'}`}>{o.status}</span></td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{new Date(o.date).toLocaleDateString('en-IN')}</td>
                          <td className="px-4 py-3 text-right"><select className="text-xs border rounded px-2 py-1"><option>Update Status</option><option>Confirmed</option><option>Packed</option><option>Shipped</option><option>Delivered</option></select></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Users Management */}
            {activeTab === 'users' && (
              <div>
                <h2 className="text-lg font-bold text-dark-700 mb-4">Users</h2>
                <div className="card overflow-hidden">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-gray-50 border-b"><th className="px-4 py-3 text-left font-semibold">User</th><th className="px-4 py-3 text-left font-semibold">Orders</th><th className="px-4 py-3 text-left font-semibold">Joined</th><th className="px-4 py-3 text-left font-semibold">Status</th><th className="px-4 py-3 text-right font-semibold">Actions</th></tr></thead>
                    <tbody>
                      {demoUsers.map(u => (
                        <tr key={u.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3"><p className="font-medium">{u.name}</p><p className="text-xs text-gray-400">{u.email}</p></td>
                          <td className="px-4 py-3">{u.orders}</td>
                          <td className="px-4 py-3 text-xs text-gray-400">{new Date(u.joined).toLocaleDateString('en-IN')}</td>
                          <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-1 rounded-full ${u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.active ? 'Active' : 'Banned'}</span></td>
                          <td className="px-4 py-3 text-right"><button className="text-xs text-primary-500 hover:underline">{u.active ? 'Ban' : 'Unban'}</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Coupons Management */}
            {activeTab === 'coupons' && (
              <div>
                <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold text-dark-700">Coupons</h2><button className="btn-primary text-sm py-2 px-4">+ Create Coupon</button></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[{ code: 'WELCOME10', desc: '10% off first order', type: 'percentage', value: 10, minOrder: 499, used: 156, expiry: '2027-12-31' },
                    { code: 'FLAT200', desc: '₹200 off', type: 'flat', value: 200, minOrder: 999, used: 89, expiry: '2027-12-31' },
                    { code: 'MEGA30', desc: '30% off (max ₹800)', type: 'percentage', value: 30, minOrder: 1999, used: 45, expiry: '2027-12-31' },
                    { code: 'SUPER500', desc: '₹500 off', type: 'flat', value: 500, minOrder: 2499, used: 23, expiry: '2027-12-31' }
                  ].map(c => (
                    <div key={c.code} className="card p-4">
                      <div className="flex items-start justify-between mb-2"><span className="font-mono font-bold text-lg text-primary-500">{c.code}</span><span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span></div>
                      <p className="text-sm text-gray-600">{c.desc}</p>
                      <div className="flex gap-4 mt-3 text-xs text-gray-400">
                        <span>Used: {c.used}</span><span>Min: ₹{c.minOrder}</span><span>Exp: {c.expiry}</span>
                      </div>
                      <div className="flex gap-2 mt-3"><button className="text-xs text-primary-500 hover:underline">Edit</button><button className="text-xs text-red-500 hover:underline">Delete</button></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Banners Management */}
            {activeTab === 'banners' && (
              <div>
                <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold text-dark-700">Homepage Banners</h2><button className="btn-primary text-sm py-2 px-4">+ Add Banner</button></div>
                <div className="space-y-4">
                  {[{ title: 'Summer Sale', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400', active: true },
                    { title: 'New Collection', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400', active: true },
                    { title: 'Ethnic Wear', image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400', active: true },
                    { title: 'Sports Edit', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', active: false }
                  ].map((b, i) => (
                    <div key={i} className="card p-4 flex items-center gap-4">
                      <img src={b.image} alt={b.title} className="w-32 h-20 rounded-xl object-cover" />
                      <div className="flex-1"><p className="font-semibold">{b.title}</p><p className="text-xs text-gray-400">Position: {i + 1}</p></div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${b.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{b.active ? 'Active' : 'Inactive'}</span>
                      <div className="flex gap-2"><button className="text-xs text-primary-500 hover:underline">Edit</button><button className="text-xs text-red-500 hover:underline">Delete</button></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
