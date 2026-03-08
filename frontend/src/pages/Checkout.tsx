import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { clearCart } from '../store/cartSlice';
import { showToast } from '../store/uiSlice';

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, coupon } = useSelector((s: RootState) => s.cart);
  const { user, addresses } = useSelector((s: RootState) => s.auth);
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [newAddress, setNewAddress] = useState({ name: '', mobile: '', pincode: '', address: '', city: '', state: '', landmark: '' });
  const [showNewAddr, setShowNewAddr] = useState(false);

  const mrpTotal = items.reduce((s, i) => s + i.product.mrp * i.quantity, 0);
  const priceTotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const totalDiscount = mrpTotal - priceTotal;
  const deliveryCharge = priceTotal >= 499 ? 0 : 49;
  const couponDiscount = coupon?.discount || 0;
  const totalAmount = priceTotal + deliveryCharge - couponDiscount;

  const handlePlaceOrder = () => {
    if (!paymentMethod) { dispatch(showToast({ message: 'Please select a payment method', type: 'warning' })); return; }
    setProcessing(true);
    setTimeout(() => {
      const oid = 'CS' + Date.now().toString(36).toUpperCase();
      setOrderId(oid);
      setOrderPlaced(true);
      dispatch(clearCart());
      setProcessing(false);
    }, 2000);
  };

  if (items.length === 0 && !orderPlaced) {
    return <div className="text-center py-20"><h2 className="text-xl font-bold mb-4">Your bag is empty</h2><Link to="/products" className="btn-primary">Continue Shopping</Link></div>;
  }

  if (orderPlaced) {
    return (
      <div className="page-enter max-w-lg mx-auto px-4 py-20 text-center">
        <div className="animate-bounce-in">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"><svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg></div>
          <h1 className="text-3xl font-display font-bold text-dark-700 mb-2">Order Placed! 🎉</h1>
          <p className="text-gray-500 mb-2">Your order has been confirmed</p>
          <p className="text-sm font-mono text-primary-500 mb-6">Order ID: {orderId}</p>
          <div className="card p-4 text-left text-sm mb-6">
            <div className="flex justify-between mb-1"><span className="text-gray-500">Total</span><span className="font-bold">₹{totalAmount.toLocaleString()}</span></div>
            <div className="flex justify-between mb-1"><span className="text-gray-500">Payment</span><span className="capitalize">{paymentMethod}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Estimated Delivery</span><span>{new Date(Date.now() + 5 * 86400000).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span></div>
          </div>
          <div className="flex gap-3 justify-center">
            <Link to="/profile?tab=orders" className="btn-primary">Track Order</Link>
            <Link to="/products" className="btn-secondary">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  const steps = [{ num: 1, label: 'Address' }, { num: 2, label: 'Summary' }, { num: 3, label: 'Payment' }];

  return (
    <div className="page-enter max-w-5xl mx-auto px-4 py-6">
      {/* Steps indicator */}
      <div className="flex items-center justify-center gap-0 mb-8">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center">
            <button onClick={() => setStep(s.num)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${step >= s.num ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
              <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs">{step > s.num ? '✓' : s.num}</span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < steps.length - 1 && <div className={`w-12 h-0.5 mx-1 ${step > s.num ? 'bg-primary-500' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Step 1: Address */}
          {step === 1 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-dark-700 mb-4">Select Delivery Address</h2>
              {addresses.length > 0 ? (
                <div className="space-y-3">
                  {addresses.map((addr, i) => (
                    <label key={i} className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedAddress === i ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="address" checked={selectedAddress === i} onChange={() => setSelectedAddress(i)} className="mt-1 text-primary-500" />
                      <div><p className="font-semibold">{addr.name}</p><p className="text-sm text-gray-500">{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p><p className="text-sm text-gray-400 mt-1">📱 {addr.mobile}</p></div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 mb-4">No saved addresses. Please add one below.</p>
              )}
              <button onClick={() => setShowNewAddr(!showNewAddr)} className="text-sm text-primary-500 font-semibold mt-4 hover:underline">+ Add New Address</button>
              {showNewAddr && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-3 animate-fade-in">
                  <div className="grid grid-cols-2 gap-3"><input placeholder="Name" className="input-field" value={newAddress.name} onChange={e => setNewAddress({...newAddress,name:e.target.value})} /><input placeholder="Mobile" className="input-field" value={newAddress.mobile} onChange={e => setNewAddress({...newAddress,mobile:e.target.value})} /></div>
                  <input placeholder="Pincode" className="input-field" value={newAddress.pincode} onChange={e => setNewAddress({...newAddress,pincode:e.target.value})} />
                  <textarea placeholder="Full Address" className="input-field" value={newAddress.address} onChange={e => setNewAddress({...newAddress,address:e.target.value})} />
                  <div className="grid grid-cols-2 gap-3"><input placeholder="City" className="input-field" value={newAddress.city} onChange={e => setNewAddress({...newAddress,city:e.target.value})} /><input placeholder="State" className="input-field" value={newAddress.state} onChange={e => setNewAddress({...newAddress,state:e.target.value})} /></div>
                  <button onClick={() => { dispatch({ type: 'auth/addAddress', payload: { ...newAddress, _id: 'a_' + Date.now(), isDefault: addresses.length === 0 } }); setShowNewAddr(false); dispatch(showToast({ message: 'Address added!', type: 'success' })); }} className="btn-primary text-sm py-2 px-6">Save</button>
                </div>
              )}
              <div className="mt-6 flex justify-end"><button onClick={() => { if (addresses.length === 0 && !showNewAddr) { dispatch(showToast({ message: 'Please add an address', type: 'warning' })); return; } setStep(2); }} className="btn-primary px-8">Continue →</button></div>
            </div>
          )}

          {/* Step 2: Order Summary */}
          {step === 2 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-dark-700 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                    <img src={item.product.images[0]} alt={item.product.title} className="w-16 h-20 rounded-lg object-cover" />
                    <div className="flex-1"><p className="text-sm font-medium">{item.product.title}</p><p className="text-xs text-gray-400">Size: {item.size} · Qty: {item.quantity}</p><p className="text-sm font-bold mt-1">₹{(item.product.price * item.quantity).toLocaleString()}</p></div>
                  </div>
                ))}
              </div>
              {addresses[selectedAddress] && (
                <div className="p-3 bg-gray-50 rounded-xl mb-4"><p className="text-xs font-bold text-gray-400 mb-1">DELIVERING TO</p><p className="text-sm font-medium">{addresses[selectedAddress].name} — {addresses[selectedAddress].address}, {addresses[selectedAddress].city}</p></div>
              )}
              <div className="flex justify-between mt-6"><button onClick={() => setStep(1)} className="btn-secondary px-8">← Back</button><button onClick={() => setStep(3)} className="btn-primary px-8">Continue →</button></div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-dark-700 mb-4">Payment Method</h2>
              <div className="space-y-3">
                {[
                  { key: 'upi', label: 'UPI (GPay, PhonePe, Paytm)', icon: '📱' },
                  { key: 'card', label: 'Credit / Debit Card', icon: '💳' },
                  { key: 'netbanking', label: 'Net Banking', icon: '🏦' },
                  { key: 'cod', label: 'Cash on Delivery', icon: '💵' },
                  { key: 'emi', label: 'EMI Options', icon: '📊' },
                  { key: 'wallet', label: 'Store Credits / Wallet', icon: '👛' },
                ].map(pm => (
                  <div key={pm.key}>
                    <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === pm.key ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="payment" checked={paymentMethod === pm.key} onChange={() => setPaymentMethod(pm.key)} className="text-primary-500" />
                      <span className="text-xl">{pm.icon}</span>
                      <span className="font-medium text-sm">{pm.label}</span>
                    </label>
                    {/* Card Details */}
                    {paymentMethod === 'card' && pm.key === 'card' && (
                      <div className="mt-3 p-4 bg-gray-50 rounded-xl space-y-3 animate-fade-in">
                        <input placeholder="Card Number" maxLength={19} value={cardDetails.number} onChange={e => setCardDetails({...cardDetails,number: e.target.value.replace(/\D/g,'').replace(/(\d{4})/g,'$1 ').trim()})} className="input-field font-mono" />
                        <div className="grid grid-cols-2 gap-3"><input placeholder="MM/YY" maxLength={5} value={cardDetails.expiry} onChange={e => setCardDetails({...cardDetails,expiry:e.target.value})} className="input-field" /><input placeholder="CVV" maxLength={4} type="password" value={cardDetails.cvv} onChange={e => setCardDetails({...cardDetails,cvv:e.target.value})} className="input-field" /></div>
                        <input placeholder="Cardholder Name" value={cardDetails.name} onChange={e => setCardDetails({...cardDetails,name:e.target.value})} className="input-field" />
                      </div>
                    )}
                    {/* UPI Details */}
                    {paymentMethod === 'upi' && pm.key === 'upi' && (
                      <div className="mt-3 p-4 bg-gray-50 rounded-xl animate-fade-in">
                        <input placeholder="Enter UPI ID (eg: name@upi)" value={upiId} onChange={e => setUpiId(e.target.value)} className="input-field" />
                        <div className="flex gap-2 mt-3">{['GPay','PhonePe','Paytm'].map(a => <button key={a} onClick={() => setUpiId(`user@${a.toLowerCase()}`)} className="px-3 py-1.5 text-xs border rounded-lg hover:border-primary-400">{a}</button>)}</div>
                      </div>
                    )}
                    {/* Net Banking */}
                    {paymentMethod === 'netbanking' && pm.key === 'netbanking' && (
                      <div className="mt-3 p-4 bg-gray-50 rounded-xl animate-fade-in">
                        <select className="input-field"><option>Select Bank</option>{['HDFC','ICICI','SBI','Axis','Kotak','Yes Bank'].map(b => <option key={b}>{b}</option>)}</select>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(2)} className="btn-secondary px-8">← Back</button>
                <button onClick={handlePlaceOrder} disabled={processing} className="btn-primary px-8 disabled:opacity-50">
                  {processing ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</span> : `PAY ₹${totalAmount.toLocaleString()}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Price Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-24">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Price Details ({items.length} items)</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Total MRP</span><span>₹{mrpTotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{totalDiscount.toLocaleString()}</span></div>
              {couponDiscount > 0 && <div className="flex justify-between text-green-600"><span>Coupon</span><span>-₹{couponDiscount.toLocaleString()}</span></div>}
              <div className="flex justify-between"><span className="text-gray-600">Delivery</span><span className={deliveryCharge === 0 ? 'text-green-600' : ''}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span></div>
              <div className="border-t pt-2.5 flex justify-between font-bold text-base text-dark-700"><span>Total</span><span>₹{totalAmount.toLocaleString()}</span></div>
            </div>
            <p className="text-xs text-green-600 mt-3 font-medium text-center">🔒 Your transaction is secure</p>
          </div>
        </div>
      </div>
    </div>
  );
}
