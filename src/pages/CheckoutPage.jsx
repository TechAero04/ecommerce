import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  QrCode, 
  Banknote, 
  Building2, 
  CheckCircle2, 
  ChevronRight, 
  Lock, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const CheckoutPage = () => {
  const { 
    cart, 
    cartTotal, 
    user, 
    placeOrder, 
    activeOrderSuccess, 
    setActiveOrderSuccess,
    navigateTo 
  } = useShop();

  // Saved Address or New Input
  const defaultAddr = user?.addresses[0] || {};
  const [shippingForm, setShippingForm] = useState({
    name: defaultAddr.name || 'Rajesh Malhotra',
    phone: defaultAddr.phone || '+91 98765 43210',
    address: defaultAddr.street || '402 Sunrise Towers, Indiranagar',
    city: defaultAddr.city || 'Bengaluru',
    state: defaultAddr.state || 'Karnataka',
    pincode: defaultAddr.pincode || '560038'
  });

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'card', 'netbanking', 'cod'
  const [upiId, setUpiId] = useState('rajesh@okicici');

  const handleInputChange = (e) => {
    setShippingForm({ ...shippingForm, [e.target.name]: e.target.value });
  };

  const handlePlaceOrderSubmit = (e) => {
    e.preventDefault();
    placeOrder(shippingForm, paymentMethod === 'upi' ? `UPI (${upiId})` : paymentMethod.toUpperCase());
  };

  if (cart.length === 0 && !activeOrderSuccess) {
    return (
      <div style={{ background: 'var(--bg-main)', minHeight: '80vh', padding: '4rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '500px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No Items to Checkout</h2>
          <button onClick={() => navigateTo('shop')} className="btn btn-primary">
            Return to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '80vh', padding: '2.5rem 0 5rem' }}>
      <div className="container">
        
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigateTo('home')}>Home</span>
          <ChevronRight size={14} />
          <span style={{ cursor: 'pointer' }} onClick={() => navigateTo('cart')}>Cart</span>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Secure Checkout</span>
        </div>

        <div className="flex-between" style={{ marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Express Checkout</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Fast & 256-Bit Encrypted Payment</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-emerald)', fontWeight: 700, fontSize: '0.875rem' }}>
            <Lock size={16} /> SSL Encrypted
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem' }} className="checkout-grid">
          
          {/* Main Checkout Form Column */}
          <form onSubmit={handlePlaceOrderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Step 1: Shipping Address */}
            <div style={{ background: 'white', padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>1</span>
                Delivery Address
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-cols-2">
                <div className="input-group">
                  <label className="input-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={shippingForm.name}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Mobile Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={shippingForm.phone}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Street Address & Landmark *</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={shippingForm.address}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }} className="grid-cols-3">
                <div className="input-group">
                  <label className="input-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={shippingForm.city}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">State *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={shippingForm.state}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={shippingForm.pincode}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Options */}
            <div style={{ background: 'white', padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>2</span>
                Payment Options
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                
                {/* UPI Option */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid',
                  borderColor: paymentMethod === 'upi' ? 'var(--color-primary)' : 'var(--border-color)',
                  background: paymentMethod === 'upi' ? 'var(--color-primary-light)' : 'white',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    style={{ accentColor: 'var(--color-primary)' }}
                  />
                  <QrCode size={22} color="var(--color-primary)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Instant UPI (GPay, PhonePe, Paytm, BHIM)</div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Zero transaction fee & instant confirmation</div>
                  </div>
                </label>

                {paymentMethod === 'upi' && (
                  <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: 'var(--radius-md)', marginLeft: '2rem' }}>
                    <label className="input-label" style={{ fontSize: '0.8rem' }}>Enter VPA / UPI ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@upi"
                      className="input-field"
                      style={{ maxWidth: '300px' }}
                    />
                  </div>
                )}

                {/* Credit / Debit Card Option */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid',
                  borderColor: paymentMethod === 'card' ? 'var(--color-primary)' : 'var(--border-color)',
                  background: paymentMethod === 'card' ? 'var(--color-primary-light)' : 'white',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    style={{ accentColor: 'var(--color-primary)' }}
                  />
                  <CreditCard size={22} color="var(--color-primary)" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Credit / Debit Card (Visa, MasterCard, RuPay)</div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>All major Indian bank cards accepted</div>
                  </div>
                </label>

                {/* NetBanking */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid',
                  borderColor: paymentMethod === 'netbanking' ? 'var(--color-primary)' : 'var(--border-color)',
                  background: paymentMethod === 'netbanking' ? 'var(--color-primary-light)' : 'white',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="payment"
                    value="netbanking"
                    checked={paymentMethod === 'netbanking'}
                    onChange={() => setPaymentMethod('netbanking')}
                    style={{ accentColor: 'var(--color-primary)' }}
                  />
                  <Building2 size={22} color="var(--color-primary)" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Net Banking (50+ Banks)</div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>HDFC, SBI, ICICI, Axis, Kotak</div>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid',
                  borderColor: paymentMethod === 'cod' ? 'var(--color-primary)' : 'var(--border-color)',
                  background: paymentMethod === 'cod' ? 'var(--color-primary-light)' : 'white',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    style={{ accentColor: 'var(--color-primary)' }}
                  />
                  <Banknote size={22} color="var(--color-emerald)" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Cash on Delivery (COD)</div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Pay cash at your doorstep</div>
                  </div>
                </label>

              </div>

              <button type="submit" className="btn btn-accent btn-lg btn-full">
                Pay & Complete Order (₹{cartTotal.toLocaleString()}) <ArrowRight size={20} />
              </button>
            </div>

          </form>

          {/* Right Order Summary Column */}
          <div>
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                Order Summary ({cart.length} items)
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem', maxHeight: '280px', overflowY: 'auto' }}>
                {cart.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <img src={item.product.image} alt={item.product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                    <div style={{ flex: 1, fontSize: '0.85rem' }}>
                      <div style={{ fontWeight: 700, lineHeight: 1.2 }}>{item.product.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Qty: {item.quantity} | {item.selectedColor}</div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>₹{(item.product.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                <div className="flex-between">
                  <span style={{ color: 'var(--text-muted)' }}>Total Payable</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>₹{cartTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Order Completion Success Modal */}
      {activeOrderSuccess && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '2.5rem', textAlign: 'center', maxWidth: '520px' }}>
            <div style={{ background: '#D1FAE5', width: '80px', height: '80px', borderRadius: '50%', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <CheckCircle2 size={46} />
            </div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Order Placed Successfully!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Thank you for supporting authentic Indian craftsmanship. Your tracking reference is <strong>{activeOrderSuccess.trackingNumber}</strong>.
            </p>

            <div style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'left', marginBottom: '1.75rem', fontSize: '0.875rem' }}>
              <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Order ID:</span>
                <span style={{ fontWeight: 700 }}>{activeOrderSuccess.id}</span>
              </div>
              <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Paid via:</span>
                <span style={{ fontWeight: 700 }}>{activeOrderSuccess.paymentMethod}</span>
              </div>
              <div className="flex-between">
                <span style={{ color: 'var(--text-muted)' }}>Total Paid:</span>
                <span style={{ fontWeight: 800, color: 'var(--color-primary)' }}>₹{activeOrderSuccess.total.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => { setActiveOrderSuccess(null); navigateTo('orders'); }} 
                className="btn btn-primary" 
                style={{ flex: 1 }}
              >
                View Order Tracking
              </button>
              <button 
                onClick={() => { setActiveOrderSuccess(null); navigateTo('home'); }} 
                className="btn btn-secondary" 
                style={{ flex: 1 }}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 850px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
