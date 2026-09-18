import React from 'react';
import { useShop } from '../../context/ShopContext';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, Headphones, Mail, Heart } from 'lucide-react';

export const Footer = () => {
  const { navigateTo, showToast } = useShop();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    showToast('Subscribed to BHARAT VIP Newsletter!', 'success');
  };

  return (
    <footer style={{ background: 'var(--bg-dark)', color: 'var(--text-white)', marginTop: '4rem', paddingTop: '4rem' }}>
      
      {/* Trust Highlights Section */}
      <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '3rem' }}>
        <div className="container grid-cols-4">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '0.85rem', borderRadius: '12px', color: '#F59E0B' }}>
              <Truck size={28} />
            </div>
            <div>
              <h4 style={{ color: 'white', fontSize: '1rem' }}>Express Shipping</h4>
              <p style={{ color: 'var(--text-light)', fontSize: '0.825rem' }}>Free on orders above ₹1,999</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '0.85rem', borderRadius: '12px', color: '#10B981' }}>
              <ShieldCheck size={28} />
            </div>
            <div>
              <h4 style={{ color: 'white', fontSize: '1rem' }}>100% Authentic</h4>
              <p style={{ color: 'var(--text-light)', fontSize: '0.825rem' }}>Directly from verified artisans</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '0.85rem', borderRadius: '12px', color: '#6366F1' }}>
              <RefreshCw size={28} />
            </div>
            <div>
              <h4 style={{ color: 'white', fontSize: '1rem' }}>Easy 7-Day Returns</h4>
              <p style={{ color: 'var(--text-light)', fontSize: '0.825rem' }}>Hassle-free refund policy</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '0.85rem', borderRadius: '12px', color: '#EC4899' }}>
              <Headphones size={28} />
            </div>
            <div>
              <h4 style={{ color: 'white', fontSize: '1rem' }}>24/7 Helpline</h4>
              <p style={{ color: 'var(--text-light)', fontSize: '0.825rem' }}>Instant chat & phone support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="container" style={{ padding: '3.5rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.2fr', gap: '3rem' }} className="footer-grid">
          
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'var(--gradient-brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <ShoppingBag size={22} />
              </div>
              <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800 }}>BHARAT<span style={{ color: 'var(--color-accent)' }}>.</span></h2>
            </div>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              India’s premier D2C marketplace celebrating authentic heritage craftsmanship, modern technology, and sustainable lifestyle products.
            </p>
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              {['Instagram', 'Twitter', 'Facebook', 'LinkedIn'].map((platform, idx) => (
                <span key={idx} style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: 'white',
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                  {platform}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '1.2rem' }}>Shop Collections</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
              <li style={{ cursor: 'pointer' }} onClick={() => navigateTo('shop')}>Artisanal Fashion</li>
              <li style={{ cursor: 'pointer' }} onClick={() => navigateTo('shop')}>Smart Audio & Tech</li>
              <li style={{ cursor: 'pointer' }} onClick={() => navigateTo('shop')}>Sheesham Decor</li>
              <li style={{ cursor: 'pointer' }} onClick={() => navigateTo('shop')}>Ayurvedic Wellness</li>
              <li style={{ cursor: 'pointer' }} onClick={() => navigateTo('shop')}>Organic Kashmiri Spices</li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '1.2rem' }}>Customer Care</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
              <li style={{ cursor: 'pointer' }} onClick={() => navigateTo('orders')}>Track Order Status</li>
              <li style={{ cursor: 'pointer' }} onClick={() => navigateTo('support')}>Returns & Exchanges</li>
              <li style={{ cursor: 'pointer' }} onClick={() => navigateTo('support')}>Shipping Policy</li>
              <li style={{ cursor: 'pointer' }} onClick={() => navigateTo('support')}>FAQ & Help Center</li>
              <li style={{ cursor: 'pointer' }} onClick={() => navigateTo('profile')}>Manage Account</li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div>
            <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '1rem' }}>Join BHARAT Club</h4>
            <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Subscribe to get exclusive drops, artisan stories & ₹500 off your first purchase.
            </p>
            <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
              <button type="submit" className="btn btn-accent" style={{ width: '100%', fontSize: '0.9rem' }}>
                <Mail size={16} /> Subscribe & Save
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Copyright Bar */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.5rem 0', background: '#090D16' }}>
        <div className="container flex-between" style={{ fontSize: '0.825rem', color: 'var(--text-light)' }}>
          <p>© 2026 BHARAT D2C Commerce Ltd. Built with <Heart size={14} color="#EF4444" style={{ display: 'inline', verticalAlign: 'middle' }} /> for India.</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span>UPI / Cards / NetBanking / COD Supported</span>
            <span>•</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigateTo('support')}>Privacy Policy</span>
            <span>•</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigateTo('support')}>Terms of Service</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 550px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
};
