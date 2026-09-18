import React from 'react';
import { useShop } from '../../context/ShopContext';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Sparkles, Plus, Minus } from 'lucide-react';

export const CartDrawer = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateQuantity, 
    cartSubtotal, 
    shippingFee, 
    cartTotal,
    navigateTo 
  } = useShop();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 1999;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    navigateTo('checkout');
  };

  const handleViewCartPage = () => {
    setIsCartOpen(false);
    navigateTo('cart');
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={() => setIsCartOpen(false)}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          background: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
          animation: 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-main)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={20} color="var(--color-primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Your Shopping Cart</h3>
            <span style={{ 
              background: 'var(--color-primary-light)', 
              color: 'var(--color-primary)', 
              fontSize: '0.75rem', 
              fontWeight: 800, 
              padding: '0.15rem 0.5rem', 
              borderRadius: 'var(--radius-full)' 
            }}>
              {cart.length} items
            </span>
          </div>
          <button onClick={() => setIsCartOpen(false)} style={{ padding: '0.4rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div style={{ padding: '0.85rem 1.5rem', background: '#F1F5F9', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>
            {amountNeededForFreeShipping > 0 ? (
              <span>Add <strong>₹{amountNeededForFreeShipping.toLocaleString()}</strong> more for <strong>FREE Delivery</strong></span>
            ) : (
              <span style={{ color: 'var(--color-emerald)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Sparkles size={14} /> You unlocked FREE Express Delivery!
              </span>
            )}
          </div>
          <div style={{ width: '100%', height: '6px', background: '#CBD5E1', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${freeShippingProgress}%`, 
              height: '100%', 
              background: freeShippingProgress >= 100 ? 'var(--color-emerald)' : 'var(--gradient-brand)',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {/* Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <div style={{ background: 'var(--color-primary-light)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--color-primary)' }}>
                <ShoppingBag size={32} />
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Your cart is empty</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Explore our authentic artisanal items and add something special!</p>
              <button onClick={() => { setIsCartOpen(false); navigateTo('shop'); }} className="btn btn-primary btn-sm">
                Explore Shop
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cart.map((item, index) => (
                <div 
                  key={index}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '0.85rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    background: 'white'
                  }}
                >
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    style={{ width: '75px', height: '75px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                  />
                  
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.3 }}>{item.product.name}</h4>
                        <button onClick={() => removeFromCart(index)} style={{ color: 'var(--text-light)' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        Color: {item.selectedColor} | Size: {item.selectedSize}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </span>

                      {/* Qty Counter */}
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                        <button onClick={() => updateQuantity(index, -1)} style={{ padding: '0.2rem 0.5rem' }}><Minus size={13} /></button>
                        <span style={{ padding: '0.2rem 0.5rem', fontSize: '0.825rem', fontWeight: 700 }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(index, 1)} style={{ padding: '0.2rem 0.5rem' }}><Plus size={13} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {cart.length > 0 && (
          <div style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-main)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>₹{cartSubtotal.toLocaleString()}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Estimated Shipping</span>
              <span style={{ fontWeight: 600, color: shippingFee === 0 ? 'var(--color-emerald)' : 'var(--text-main)' }}>
                {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', fontSize: '1.1rem', fontWeight: 800 }}>
              <span>Total Payable</span>
              <span style={{ color: 'var(--color-primary)' }}>₹{cartTotal.toLocaleString()}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button onClick={handleProceedCheckout} className="btn btn-primary btn-full">
                Proceed to Checkout <ArrowRight size={18} />
              </button>
              <button onClick={handleViewCartPage} className="btn btn-secondary btn-full btn-sm">
                View Full Cart Details
              </button>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
