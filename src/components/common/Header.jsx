import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  Menu, 
  X, 
  Sparkles, 
  PhoneCall, 
  HelpCircle, 
  ChevronDown,
  Package
} from 'lucide-react';
import { CATEGORIES } from '../../data/mockData';

export const Header = () => {
  const { 
    currentPage, 
    navigateTo, 
    cartCount, 
    wishlist, 
    user, 
    searchQuery, 
    setSearchQuery,
    setSelectedCategory,
    setIsCartOpen 
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('shop');
    }
  };

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    navigateTo('shop');
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--bg-surface)' }}>
      {/* Top Announcement Bar */}
      <div style={{
        background: 'var(--gradient-hero)',
        color: 'var(--text-white)',
        fontSize: '0.825rem',
        padding: '0.45rem 1rem',
        textAlign: 'center',
        fontWeight: 500,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div className="container flex-between" style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={14} color="#F59E0B" />
            <span>Festive Offer: Extra 10% OFF with code <strong>BHARAT10</strong> | Free Shipping over ₹1,999</span>
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }} className="mobile-hide">
            <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }} onClick={() => navigateTo('support')}>
              <PhoneCall size={13} /> 24/7 Helpline: 1800-BHARAT
            </span>
            <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }} onClick={() => navigateTo('support')}>
              <HelpCircle size={13} /> Track Order
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div style={{
        borderBottom: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)'
      }}>
        <div className="container flex-between" style={{ padding: '0.85rem 1.5rem' }}>
          
          {/* Brand Logo */}
          <div 
            onClick={() => navigateTo('home')} 
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'var(--gradient-brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: 'var(--shadow-md)'
            }}>
              <ShoppingBag size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1 }}>
                BHARAT<span style={{ color: 'var(--color-accent)' }}>.</span>
              </h1>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                Artisanal D2C Store
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <form 
            onSubmit={handleSearchSubmit}
            style={{ 
              flex: 1, 
              maxWidth: '480px', 
              margin: '0 2rem', 
              position: 'relative' 
            }}
            className="mobile-hide"
          >
            <input
              type="text"
              placeholder="Search handcrafted fashion, tech, home decor, organic spices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{
                paddingRight: '2.5rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.875rem',
                background: 'var(--bg-main)'
              }}
            />
            <button 
              type="submit" 
              style={{ 
                position: 'absolute', 
                right: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--color-primary)' 
              }}
            >
              <Search size={18} />
            </button>
          </form>

          {/* Right Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            
            {/* Nav Link Items */}
            <nav style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }} className="mobile-hide">
              <span 
                onClick={() => navigateTo('home')} 
                style={{ 
                  fontWeight: currentPage === 'home' ? 700 : 500, 
                  color: currentPage === 'home' ? 'var(--color-primary)' : 'var(--text-main)', 
                  cursor: 'pointer',
                  fontSize: '0.925rem' 
                }}
              >
                Home
              </span>
              <span 
                onClick={() => navigateTo('shop')} 
                style={{ 
                  fontWeight: currentPage === 'shop' ? 700 : 500, 
                  color: currentPage === 'shop' ? 'var(--color-primary)' : 'var(--text-main)', 
                  cursor: 'pointer',
                  fontSize: '0.925rem' 
                }}
              >
                Shop All
              </span>
            </nav>

            <div style={{ height: '24px', width: '1px', background: 'var(--border-color)' }} className="mobile-hide" />

            {/* User Profile / Dashboard */}
            <div 
              onClick={() => user ? navigateTo('dashboard') : navigateTo('auth')}
              style={{ 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                padding: '0.35rem 0.65rem',
                borderRadius: 'var(--radius-md)',
                transition: 'var(--transition-fast)'
              }}
              title={user ? 'User Dashboard' : 'Login / Signup'}
            >
              <div style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '50%', 
                background: 'var(--color-primary-light)', 
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}>
                {user ? user.name.charAt(0) : <User size={18} />}
              </div>
              <div className="mobile-hide" style={{ textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                  {user ? 'Welcome,' : 'Account'}
                </span>
                <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600 }}>
                  {user ? user.name.split(' ')[0] : 'Sign In'}
                </span>
              </div>
            </div>

            {/* Wishlist Button */}
            <div 
              onClick={() => navigateTo('shop')}
              style={{ cursor: 'pointer', position: 'relative', padding: '0.4rem' }}
              title="Wishlist"
            >
              <Heart size={22} color="var(--text-main)" />
              {wishlist.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  background: 'var(--color-danger)',
                  color: 'white',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {wishlist.length}
                </span>
              )}
            </div>

            {/* Cart Drawer Button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              style={{
                position: 'relative',
                background: 'var(--gradient-brand)',
                color: 'white',
                padding: '0.55rem 1rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 600,
                fontSize: '0.875rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <ShoppingBag size={18} />
              <span className="mobile-hide">Cart</span>
              <span style={{
                background: 'rgba(255, 255, 255, 0.25)',
                padding: '0.1rem 0.45rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem'
              }}>
                {cartCount}
              </span>
            </button>

            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              style={{ display: 'none' }}
              className="mobile-show-btn"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Category Sub-Bar */}
        <div style={{
          background: 'var(--bg-main)',
          borderTop: '1px solid var(--border-color)',
          padding: '0.5rem 0',
          overflowX: 'auto'
        }}>
          <div className="container" style={{ display: 'flex', gap: '1rem', whiteSpace: 'nowrap' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  padding: '0.3rem 0.8rem',
                  borderRadius: 'var(--radius-full)',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div style={{
          background: 'white',
          borderBottom: '1px solid var(--border-color)',
          padding: '1rem 1.5rem',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <form onSubmit={handleSearchSubmit} style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
            />
          </form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontWeight: 600 }}>
            <span onClick={() => { navigateTo('home'); setMobileMenuOpen(false); }}>🏠 Home</span>
            <span onClick={() => { navigateTo('shop'); setMobileMenuOpen(false); }}>🛍️ Shop Products</span>
            <span onClick={() => { navigateTo('cart'); setMobileMenuOpen(false); }}>🛒 View Cart ({cartCount})</span>
            <span onClick={() => { navigateTo('dashboard'); setMobileMenuOpen(false); }}>👤 User Dashboard</span>
            <span onClick={() => { navigateTo('orders'); setMobileMenuOpen(false); }}>📦 Order History</span>
            <span onClick={() => { navigateTo('profile'); setMobileMenuOpen(false); }}>⚙️ Account Settings</span>
            <span onClick={() => { navigateTo('support'); setMobileMenuOpen(false); }}>💬 Help & Support</span>
          </div>
        </div>
      )}

      {/* CSS Rule for Header Responsiveness */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-hide { display: none !important; }
          .mobile-show-btn { display: block !important; }
        }
      `}</style>
    </header>
  );
};
