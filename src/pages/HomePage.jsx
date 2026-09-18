import React from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS, CATEGORIES, MOCK_REVIEWS } from '../data/mockData';
import { 
  ArrowRight, 
  Sparkles, 
  ShoppingBag, 
  Star, 
  Eye, 
  Heart, 
  ShieldCheck, 
  Award, 
  Users, 
  Flame 
} from 'lucide-react';

export const HomePage = () => {
  const { navigateTo, addToCart, setQuickViewProduct, toggleWishlist, wishlist, setSelectedCategory } = useShop();

  const trendingProducts = PRODUCTS.filter(p => p.isTrending);

  return (
    <div style={{ background: 'var(--bg-main)' }}>
      
      {/* Hero Section */}
      <section style={{
        background: 'var(--gradient-hero)',
        color: 'white',
        padding: '5rem 0 6rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Background Blur Glows */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '10%',
          width: '400px',
          height: '400px',
          background: 'rgba(245, 158, 11, 0.2)',
          borderRadius: '50%',
          filter: 'blur(80px)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '5%',
          width: '350px',
          height: '350px',
          background: 'rgba(99, 102, 241, 0.25)',
          borderRadius: '50%',
          filter: 'blur(70px)'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', alignItems: 'center' }} className="hero-grid">
            
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                marginBottom: '1.5rem',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>
                <Sparkles size={16} color="#F59E0B" />
                <span>Velmora Festive Grand Launch 2026</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                color: 'white',
                marginBottom: '1.25rem',
                letterSpacing: '-1px'
              }}>
                Authentic Crafts & <span style={{
                  background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Modern Innovations</span>
              </h1>

              <p style={{
                fontSize: '1.1rem',
                color: 'var(--text-light)',
                marginBottom: '2.5rem',
                lineHeight: 1.6,
                maxWidth: '560px'
              }}>
                Discover handcrafted silk apparel, audiophile electronics, Sheesham woodwork, and organic spices directly from verified master creators.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button onClick={() => navigateTo('shop')} className="btn btn-accent btn-lg">
                  Explore Shop Collections <ArrowRight size={20} />
                </button>
                <button onClick={() => navigateTo('support')} className="btn btn-secondary btn-lg" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
                  Learn Our Story
                </button>
              </div>

              {/* Key Trust Metrics */}
              <div style={{ display: 'flex', gap: '2.5rem', marginTop: '3.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                <div>
                  <h3 style={{ color: '#F59E0B', fontSize: '1.8rem', fontWeight: 800 }}>500+</h3>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>Master Creators</p>
                </div>
                <div>
                  <h3 style={{ color: '#10B981', fontSize: '1.8rem', fontWeight: 800 }}>100k+</h3>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>Happy Customers</p>
                </div>
                <div>
                  <h3 style={{ color: '#818CF8', fontSize: '1.8rem', fontWeight: 800 }}>4.9 ★</h3>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>Average Rating</p>
                </div>
              </div>
            </div>

            {/* Featured Product Hero Card */}
            <div style={{ position: 'relative' }}>
              <div className="glass-card" style={{
                padding: '1.5rem',
                background: 'rgba(255, 255, 255, 0.08)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                transform: 'rotate(1deg)'
              }}>
                <img 
                  src={PRODUCTS[0].image} 
                  alt={PRODUCTS[0].name}
                  style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }} 
                />
                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                  <span className="badge badge-trending">Spotlight Creation</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F59E0B' }}>₹{PRODUCTS[0].price.toLocaleString()}</span>
                </div>
                <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '0.5rem' }}>{PRODUCTS[0].name}</h3>
                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  Hand-woven raw silk kurta crafted by Banaras weavers.
                </p>
                <button onClick={() => navigateTo('product-detail', PRODUCTS[0].id)} className="btn btn-primary btn-full">
                  Quick View Spotlight
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="flex-between" style={{ marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Explore Curated Collections</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Tailored handcrafted items for every lifestyle</p>
            </div>
            <button onClick={() => navigateTo('shop')} className="btn btn-secondary btn-sm">
              View All <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid-cols-4">
            {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
              <div
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); navigateTo('shop'); }}
                style={{
                  background: 'var(--bg-surface)',
                  padding: '1.75rem 1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all var(--transition-normal)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}>
                  <ShoppingBag size={26} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.3rem' }}>{cat.name}</h3>
                <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Explore Items →</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products Grid */}
      <section style={{ padding: '3rem 0 5rem', background: '#F1F5F9' }}>
        <div className="container">
          <div className="flex-between" style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: '#FEE2E2', padding: '0.5rem', borderRadius: '50%', color: '#EF4444' }}>
                <Flame size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Trending Products</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Most loved creations by our community</p>
              </div>
            </div>
            <button onClick={() => navigateTo('shop')} className="btn btn-secondary">
              See Full Shop Catalog
            </button>
          </div>

          <div className="grid-cols-4">
            {trendingProducts.map((p) => {
              const isWish = wishlist.includes(p.id);
              return (
                <div 
                  key={p.id}
                  style={{
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-color)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    transition: 'var(--transition-normal)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-lg)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
                >
                  {/* Badges & Wishlist Trigger */}
                  <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2, display: 'flex', gap: '0.4rem' }}>
                    {p.discount && <span className="badge badge-discount">{p.discount}</span>}
                    {p.isNew && <span className="badge badge-new">New</span>}
                  </div>

                  <button
                    onClick={() => toggleWishlist(p.id)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      zIndex: 2,
                      background: 'white',
                      borderRadius: '50%',
                      padding: '8px',
                      boxShadow: 'var(--shadow-md)',
                      color: isWish ? 'var(--color-danger)' : 'var(--text-muted)'
                    }}
                  >
                    <Heart size={16} fill={isWish ? "currentColor" : "none"} />
                  </button>

                  {/* Image Container with Quick View Overlay */}
                  <div style={{ position: 'relative', overflow: 'hidden', height: '220px', background: 'var(--bg-main)', cursor: 'pointer' }} onClick={() => navigateTo('product-detail', p.id)}>
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>

                  {/* Details Container */}
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.4rem' }}>
                        <Star size={14} fill="#F59E0B" color="#F59E0B" />
                        <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{p.rating}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({p.reviewCount})</span>
                      </div>

                      <h3 
                        onClick={() => navigateTo('product-detail', p.id)}
                        style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', cursor: 'pointer', lineHeight: 1.3 }}
                      >
                        {p.name}
                      </h3>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                          ₹{p.price.toLocaleString()}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                          ₹{p.originalPrice.toLocaleString()}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => addToCart(p)} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                          <ShoppingBag size={14} /> Add to Cart
                        </button>
                        <button onClick={() => setQuickViewProduct(p)} className="btn btn-secondary btn-sm" title="Quick View">
                          <Eye size={16} />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Heritage Craftsmanship Story Section */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-dark)', color: 'white' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }} className="story-grid">
            <div style={{ position: 'relative' }}>
              <img 
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80" 
                alt="Artisan at work" 
                style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)' }} 
              />
              <div style={{
                position: 'absolute',
                bottom: '-20px',
                right: '-20px',
                background: 'var(--gradient-brand)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-md)',
                color: 'white',
                maxWidth: '220px',
                boxShadow: 'var(--shadow-lg)'
              }} className="mobile-hide">
                <Award size={32} style={{ marginBottom: '0.5rem' }} />
                <h4 style={{ color: 'white', fontSize: '1rem' }}>100% Verified Origin</h4>
                <p style={{ fontSize: '0.75rem', opacity: 0.9 }}>Supporting 500+ weaving & craft families</p>
              </div>
            </div>

            <div>
              <span className="badge badge-trending" style={{ marginBottom: '1rem' }}>Empowerment & Design</span>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'white', marginBottom: '1.25rem', lineHeight: 1.2 }}>
                Empowering Master Weavers & Modern Innovators
              </h2>
              <p style={{ color: 'var(--text-light)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                At Velmora, every product carries a soul. We eliminate middlemen to connect traditional weavers from Varanasi, wood artisans from Rajasthan, and tech pioneers directly to modern homes worldwide.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <ShieldCheck size={22} color="#10B981" />
                  <span style={{ fontSize: '0.95rem' }}>Direct Fair-Trade Compensation for all Creators</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <ShieldCheck size={22} color="#10B981" />
                  <span style={{ fontSize: '0.95rem' }}>Eco-friendly Organic Cotton, Silk & Reclaimed Materials</span>
                </div>
              </div>

              <button onClick={() => navigateTo('shop')} className="btn btn-accent btn-lg">
                Shop Ethical Creations
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem' }}>
            <span className="badge badge-new" style={{ marginBottom: '0.5rem' }}>Customer Love</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Loved by 100,000+ Shoppers</h2>
            <p style={{ color: 'var(--text-muted)' }}>Real feedback from verified buyers</p>
          </div>

          <div className="grid-cols-3">
            {MOCK_REVIEWS.map((rev) => (
              <div 
                key={rev.id}
                style={{
                  background: 'white',
                  padding: '1.75rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', color: '#F59E0B', marginBottom: '0.85rem' }}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#F59E0B" />
                    ))}
                  </div>
                  <p style={{ fontSize: '0.925rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '1.5rem', italic: 'true' }}>
                    "{rev.comment}"
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <img 
                    src={rev.avatar} 
                    alt={rev.author} 
                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} 
                  />
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{rev.author}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-emerald)', fontWeight: 600 }}>Verified Buyer • {rev.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid, .story-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </div>
  );
};
