import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logout, updateProfile as updateProfileState, addAddress as addAddressState, removeAddress as removeAddressState, setAddresses } from '../store/authSlice';
import { showToast } from '../store/uiSlice';
import axiosInstance from '../utils/axiosInstance';

const demoOrders = [
  { id: 'CS7X9K2M', date: '2026-02-28', total: 2847, status: 'delivered', items: [{ title: 'Nike Classic Crew Neck T-Shirt', size: 'M', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100', price: 899 }, { title: 'Levi\'s Slim Fit Jeans', size: 'L', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=100', price: 1948 }], timeline: [{ status: 'confirmed', date: '2026-02-28', desc: 'Order Confirmed' }, { status: 'packed', date: '2026-03-01', desc: 'Order Packed' }, { status: 'shipped', date: '2026-03-02', desc: 'Shipped via Delhivery' }, { status: 'delivered', date: '2026-03-05', desc: 'Delivered' }] },
  { id: 'CSAB3F7N', date: '2026-03-05', total: 1499, status: 'shipped', items: [{ title: 'Zara Floral Maxi Dress', size: 'S', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100', price: 1499 }], timeline: [{ status: 'confirmed', date: '2026-03-05', desc: 'Order Confirmed' }, { status: 'packed', date: '2026-03-06', desc: 'Order Packed' }, { status: 'shipped', date: '2026-03-07', desc: 'In Transit' }] },
];

export default function Profile() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { user, addresses } = useSelector((s: RootState) => s.auth);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'orders');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({ name: '', mobile: '', pincode: '', address: '', city: '', state: '', landmark: '', isDefault: false });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  // Fetch true profile data if user exists
  useEffect(() => {
    if (user) {
      axiosInstance.get('/user/profile').then(res => {
        dispatch(updateProfileState(res.data.user));
        if (res.data.user.addresses) {
          dispatch(setAddresses(res.data.user.addresses));
        }
      }).catch(err => console.error(err));
    }
  }, [user?.id, dispatch]);

  if (!user) return <div className="text-center py-20"><h2 className="text-xl font-bold">Please login to view your profile</h2><Link to="/login" className="btn-primary mt-4 inline-block">Login</Link></div>;

  const handleUpdateProfile = async () => {
    try {
      const res = await axiosInstance.put('/user/profile', { name: profileForm.name, phone: profileForm.phone });
      dispatch(updateProfileState(res.data.user));
      setEditingProfile(false);
      dispatch(showToast({ message: 'Profile updated!', type: 'success' }));
    } catch (err: any) {
      dispatch(showToast({ message: err.response?.data?.error || 'Update failed', type: 'error' }));
    }
  };

  const handleAddAddress = async () => {
    try {
      const res = await axiosInstance.post('/user/addresses', addressForm);
      dispatch(setAddresses(res.data.addresses));
      setShowAddressForm(false);
      dispatch(showToast({ message: 'Address added!', type: 'success' }));
      setAddressForm({ name: '', mobile: '', pincode: '', address: '', city: '', state: '', landmark: '', isDefault: false });
    } catch (err: any) {
      dispatch(showToast({ message: err.response?.data?.error || 'Failed to add address', type: 'error' }));
    }
  };

  const handleRemoveAddress = async (id: string) => {
    try {
      const res = await axiosInstance.delete(`/user/addresses/${id}`);
      dispatch(setAddresses(res.data.addresses));
      dispatch(showToast({ message: 'Address removed', type: 'info' }));
    } catch (err: any) {
      dispatch(showToast({ message: err.response?.data?.error || 'Failed to remove address', type: 'error' }));
    }
  };

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      dispatch(showToast({ message: 'Passwords do not match', type: 'error' }));
      return;
    }
    try {
      await axiosInstance.put('/user/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      dispatch(showToast({ message: 'Password changed!', type: 'success' }));
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      dispatch(showToast({ message: err.response?.data?.error || 'Failed to change password', type: 'error' }));
    }
  };

  const handleDeactivate = async () => {
    if (window.confirm('Are you sure you want to deactivate your account?')) {
      try {
        await axiosInstance.delete('/user/deactivate');
        dispatch(logout());
        dispatch(showToast({ message: 'Account deactivated', type: 'info' }));
      } catch (err) {
        dispatch(showToast({ message: 'Failed to deactivate', type: 'error' }));
      }
    }
  };

  const tabs = [
    { key: 'orders', label: '📦 Orders', icon: '📦' },
    { key: 'addresses', label: '📍 Addresses', icon: '📍' },
    { key: 'coupons', label: '🏷️ Coupons', icon: '🏷️' },
    { key: 'settings', label: '⚙️ Settings', icon: '⚙️' },
  ];

  return (
    <div className="page-enter max-w-6xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="card p-6 mb-6 flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">{user.name[0]}</div>
        <div className="flex-1"><h1 className="text-xl font-display font-bold text-dark-700">{user.name}</h1><p className="text-sm text-gray-400">{user.email}</p></div>
        <button onClick={() => { dispatch(logout()); dispatch(showToast({ message: 'Logged out', type: 'info' })); }} className="btn-secondary text-sm py-2 px-4">Logout</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-2 space-y-1">
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.key ? 'bg-primary-50 text-primary-500' : 'text-gray-600 hover:bg-gray-50'}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-dark-700">My Orders</h2>
              {demoOrders.map(order => (
                <div key={order.id} className="card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div><span className="text-xs font-mono text-gray-400">Order #{order.id}</span><span className="mx-2 text-gray-300">·</span><span className="text-xs text-gray-400">{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{order.status}</span>
                  </div>
                  {order.items.map((item, i) => (
                    <div key={i} className="flex gap-3 mb-3"><img src={item.img} alt={item.title} className="w-14 h-16 rounded-lg object-cover" /><div><p className="text-sm font-medium">{item.title}</p><p className="text-xs text-gray-400">Size: {item.size} · ₹{item.price.toLocaleString()}</p></div></div>
                  ))}
                  {/* Timeline */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-0">
                      {order.timeline.map((t, i) => (
                        <div key={i} className="flex-1 relative">
                          <div className="flex items-center"><div className={`w-3 h-3 rounded-full z-10 ${i <= order.timeline.length - 1 ? 'bg-green-500' : 'bg-gray-300'}`} />{i < order.timeline.length - 1 && <div className={`flex-1 h-0.5 ${i < order.timeline.length - 1 ? 'bg-green-500' : 'bg-gray-200'}`} />}</div>
                          <p className="text-[10px] text-gray-500 mt-1">{t.desc}</p>
                          <p className="text-[9px] text-gray-300">{new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t flex justify-between items-center"><span className="font-bold">₹{order.total.toLocaleString()}</span></div>
                </div>
              ))}
            </div>
          )}

          {/* Addresses */}
          {activeTab === 'addresses' && (
            <div>
              <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold text-dark-700">My Addresses</h2><button onClick={() => setShowAddressForm(true)} className="btn-primary text-sm py-2 px-4">+ Add New</button></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr, i) => (
                  <div key={i} className={`card p-4 relative ${addr.isDefault ? 'ring-2 ring-primary-500' : ''}`}>
                    {addr.isDefault && <span className="absolute top-2 right-2 text-xs font-bold text-primary-500">DEFAULT</span>}
                    <p className="font-semibold">{addr.name}</p>
                    <p className="text-sm text-gray-500 mt-1">{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-sm text-gray-400 mt-1">📱 {addr.mobile}</p>
                    <div className="flex gap-3 mt-3"><button onClick={() => { handleRemoveAddress(addr._id || String(i)); }} className="text-xs text-red-500 hover:underline">Remove</button></div>
                  </div>
                ))}
                {addresses.length === 0 && <p className="text-gray-400 col-span-2">No addresses saved. Add one to get started!</p>}
              </div>
              {showAddressForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowAddressForm(false)}>
                  <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-scale-in" onClick={e => e.stopPropagation()}>
                    <h3 className="text-lg font-bold mb-4">Add Address</h3>
                    <div className="space-y-3">
                      <input placeholder="Full Name" className="input-field" value={addressForm.name} onChange={e => setAddressForm({...addressForm, name: e.target.value})} />
                      <input placeholder="Mobile" className="input-field" value={addressForm.mobile} onChange={e => setAddressForm({...addressForm, mobile: e.target.value})} />
                      <input placeholder="Pincode" className="input-field" value={addressForm.pincode} onChange={e => setAddressForm({...addressForm, pincode: e.target.value})} />
                      <textarea placeholder="Address" className="input-field" value={addressForm.address} onChange={e => setAddressForm({...addressForm, address: e.target.value})} />
                      <div className="grid grid-cols-2 gap-3">
                        <input placeholder="City" className="input-field" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} />
                        <input placeholder="State" className="input-field" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} />
                      </div>
                      <input placeholder="Landmark (optional)" className="input-field" value={addressForm.landmark} onChange={e => setAddressForm({...addressForm, landmark: e.target.value})} />
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={addressForm.isDefault} onChange={e => setAddressForm({...addressForm, isDefault: e.target.checked})} /> Make default</label>
                      <button onClick={handleAddAddress} className="btn-primary w-full">Save Address</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Coupons */}
          {activeTab === 'coupons' && (
            <div>
              <h2 className="text-lg font-bold text-dark-700 mb-4">My Coupons</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[{ code: 'WELCOME10', desc: '10% off on first order', min: 499 }, { code: 'FLAT200', desc: '₹200 off on orders above ₹999', min: 999 }, { code: 'MEGA30', desc: '30% off (max ₹800) on orders above ₹1999', min: 1999 }, { code: 'SUPER500', desc: '₹500 off on orders above ₹2499', min: 2499 }].map(c => (
                  <div key={c.code} className="card p-4 flex items-center gap-4 border-l-4 border-primary-500">
                    <div className="flex-1"><p className="font-mono font-bold text-primary-500 text-lg">{c.code}</p><p className="text-sm text-gray-500 mt-1">{c.desc}</p><p className="text-xs text-gray-300 mt-1">Min. order: ₹{c.min}</p></div>
                    <button onClick={() => { navigator.clipboard?.writeText(c.code); dispatch(showToast({ message: 'Coupon code copied!', type: 'success' })); }} className="text-xs font-bold text-primary-500 border border-primary-500 px-3 py-1.5 rounded-lg hover:bg-primary-50">COPY</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-lg font-bold text-dark-700 mb-4">Account Settings</h2>
              <div className="card p-6">
                <div className="space-y-4">
                  <div><label className="text-sm font-medium text-dark-700 block mb-1">Name</label>
                    <input className="input-field" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} disabled={!editingProfile} /></div>
                  <div><label className="text-sm font-medium text-dark-700 block mb-1">Email</label>
                    <input className="input-field" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} disabled={!editingProfile} /></div>
                  <div><label className="text-sm font-medium text-dark-700 block mb-1">Phone</label>
                    <input className="input-field" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} disabled={!editingProfile} /></div>
                  {editingProfile ? (
                    <div className="flex gap-3">
                      <button onClick={handleUpdateProfile} className="btn-primary py-2 px-6">Save</button>
                      <button onClick={() => setEditingProfile(false)} className="btn-secondary py-2 px-6">Cancel</button>
                    </div>
                  ) : (<button onClick={() => setEditingProfile(true)} className="btn-secondary py-2 px-6">Edit Profile</button>)}
                </div>
                <div className="mt-8 pt-6 border-t"><h3 className="font-bold text-dark-700 mb-3">Change Password</h3>
                  <div className="space-y-3 max-w-sm">
                    <input type="password" placeholder="Current Password" value={passwords.currentPassword} onChange={e => setPasswords({...passwords, currentPassword: e.target.value})} className="input-field" />
                    <input type="password" placeholder="New Password" value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} className="input-field" />
                    <input type="password" placeholder="Confirm New Password" value={passwords.confirmPassword} onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})} className="input-field" />
                    <button onClick={handleChangePassword} className="btn-primary py-2 px-6">Update Password</button>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t">
                  <h3 className="font-bold text-red-600 mb-2">Danger Zone</h3>
                  <p className="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                  <button onClick={handleDeactivate} className="btn-secondary text-red-600 border-red-200 hover:bg-red-50 py-2 px-6">Deactivate Account</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
