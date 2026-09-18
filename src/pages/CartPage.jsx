import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { MOCK_COUPONS } from '../data/mockData';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Tag, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight 
} from 'lucide-react';

export const CartPage = () => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    cartSubtotal, 
    shippingFee, 
    taxAmount, 
    cartTotal,
    navigateTo, 
    showToast 
  } = useShop();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const found = MOCK_COUPONS.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());

    if (found) {
      if (cartSubtotal >= found.minSpend) {
        setAppliedCoupon(found);
        showToast(`Applied ${found.code}! You saved ${found.discountPercent}%`, 'success');
      } else {
        showToast(`Minimum order of ₹${found.minSpend} required for this coupon`, 'warning');
      }
    } else {
      showToast('Invalid coupon code. Try FESTIVE20', 'warning');
    }
  };

  const discountAmount = appliedCoupon ? Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100) : 0;
  const finalPayableTotal = Math.max(0, cartTotal - discountAmount);

  const freeShippingThreshold = 1999;
  const amountForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '80vh', padding: '2.5rem 0 5rem' }}>
      <div className="container">
        
        {/* Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigateTo('home')}>Home</span>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Shopping Cart</span>
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Your Shopping Cart</h1>

        {cart.length === 0 ? (
          <div style={{ background: 'white', padding: '4rem 2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
            <div style={{ background: 'var(--color-primary-light)', width: '80px', height: '80px', borderRadius: '50%', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <ShoppingBag size={38} />
            </div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Your Cart is Empty</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Looks like you haven't added any items to your shopping cart yet.</p>
            <button onClick={() => navigateTo('shop')} className="btn btn-primary btn-lg">
              Explore Collections Now
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem' }} className="cart-grid">
            
            {/* Left Items Column */}
            <div>
              {/* Free Shipping Alert Box */}
              <div style={{
                background: amountForFreeShipping === 0 ? '#D1FAE5' : '#FEF3C7',
                border: '1px solid',
                borderColor: amountForFreeShipping === 0 ? '#10B981' : '#F59E0B',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.9rem',
                fontWeight: 600
              }}>
                <Sparkles size={20} color={amountForFreeShipping === 0 ? '#10B981' : '#D97706'} />
                {amountForFreeShipping === 0 ? (
                  <span style={{ color: '#065F46' }}>Congratulations! Your order qualifies for FREE Express Shipping.</span>
                ) : (
                  <span style={{ color: '#92400E' }}>Add <strong>₹{amountForFreeShipping.toLocaleString()}</strong> more worth of products for FREE Express Delivery!</span>
                )}
              </div>

              {/* Items Table / Card Container */}
              <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="flex-between" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Items ({cart.length})</h3>
                  <button onClick={clearCart} style={{ fontSize: '0.8rem', color: 'var(--color-danger)', fontWeight: 600 }}>
                    Clear All
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {cart.map((item, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        display: 'flex', 
                        gap: '1.25rem', 
                        alignItems: 'center',
                        paddingBottom: idx < cart.length - 1 ? '1.25rem' : 0,
                        borderBottom: idx < cart.length - 1 ? '1px solid var(--border-color)' : 'none'
                      }}
                    >
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                        onClick={() => navigateTo('product-detail', item.product.id)}
                      />

                      <div style={{ flex: 1 }}>
                        <h4 
                          onClick={() => navigateTo('product-detail', item.product.id)}
                          style={{ fontSize: '1rem', fontWeight: 700, cursor: 'pointer', marginBottom: '0.2rem' }}
                        >
                          {item.product.name}
                        </h4>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                          Color: {item.selectedColor} | Size: {item.selectedSize}
                        </div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                          ₹{item.product.price.toLocaleString()}
                        </div>
                      </div>

                      {/* Quantity Selector */}
                      <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                        <button onClick={() => updateQuantity(idx, -1)} style={{ padding: '0.4rem 0.75rem' }}><Minus size={14} /></button>
                        <span style={{ padding: '0 0.5rem', fontWeight: 700, fontSize: '0.9rem' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(idx, 1)} style={{ padding: '0.4rem 0.75rem' }}><Plus size={14} /></button>
                      </div>

                      <div style={{ minWidth: '90px', textAlign: 'right' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                          ₹{(item.product.price * item.quantity).toLocaleString()}
                        </div>
                        <button onClick={() => removeFromCart(idx)} style={{ color: 'var(--text-light)', marginTop: '0.4rem' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={() => navigateTo('shop')} className="btn btn-secondary">
                ← Continue Shopping
              </button>
            </div>

            {/* Right Summary Column */}
            <div>
              {/* Promo Code Box */}
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Tag size={16} color="var(--color-primary)" /> Apply Discount Coupon
                </h4>
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Enter promo code (e.g. FESTIVE20)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="input-field"
                    style={{ textTransform: 'uppercase', fontSize: '0.85rem' }}
                  />
                  <button type="submit" className="btn btn-secondary btn-sm">Apply</button>
                </form>
                {appliedCoupon && (
                  <div style={{ marginTop: '0.75rem', color: 'var(--color-emerald)', fontSize: '0.8rem', fontWeight: 700 }}>
                    ✓ Applied {appliedCoupon.code} (-{appliedCoupon.discountPercent}%)
                  </div>
                )}
              </div>

              {/* Price Calculation Card */}
              <div style={{ background: 'white', padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                  Order Summary
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                  <div className="flex-between">
                    <span style={{ color: 'var(--text-muted)' }}>Bag Subtotal</span>
                    <span style={{ fontWeight: 600 }}>₹{cartSubtotal.toLocaleString()}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex-between" style={{ color: 'var(--color-emerald)' }}>
                      <span>Coupon Discount ({appliedCoupon.code})</span>
                      <span style={{ fontWeight: 700 }}>-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex-between">
                    <span style={{ color: 'var(--text-muted)' }}>Shipping Charge</span>
                    <span style={{ fontWeight: 600, color: shippingFee === 0 ? 'var(--color-emerald)' : 'var(--text-main)' }}>
                      {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                    </span>
                  </div>

                  <div className="flex-between">
                    <span style={{ color: 'var(--text-muted)' }}>GST & Tax (5%)</span>
                    <span style={{ fontWeight: 600 }}>₹{taxAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex-between" style={{ borderTop: '2px dashed var(--border-color)', paddingTop: '1rem', marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 800 }}>
                  <span>Total Amount</span>
                  <span style={{ color: 'var(--color-primary)' }}>₹{finalPayableTotal.toLocaleString()}</span>
                </div>

                <button onClick={() => navigateTo('checkout')} className="btn btn-primary btn-lg btn-full" style={{ marginBottom: '1rem' }}>
                  Proceed to Checkout <ArrowRight size={20} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                  <ShieldCheck size={16} color="var(--color-emerald)" /> 256-Bit SSL Encrypted Secure Checkout
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      <style>{`
        @media (max-width: 850px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
