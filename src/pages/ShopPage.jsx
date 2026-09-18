import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS, CATEGORIES } from '../data/mockData';
import { 
  Filter, 
  Grid, 
  List, 
  ShoppingBag, 
  Star, 
  Heart, 
  Eye, 
  Search, 
  X, 
  ChevronRight, 
  SlidersHorizontal 
} from 'lucide-react';

export const ShopPage = () => {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery, 
    addToCart, 
    setQuickViewProduct, 
    toggleWishlist, 
    wishlist, 
    navigateTo 
  } = useShop();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'low-high', 'high-low', 'rating'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter Logic
  let filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = p.price <= maxPrice;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  // Sorting Logic
  if (sortBy === 'low-high') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'high-low') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '80vh', padding: '2.5rem 0 5rem' }}>
      <div className="container">
        
        {/* Breadcrumb Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigateTo('home')}>Home</span>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Shop Products</span>
        </div>

        <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Explore All Products</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Showing {filteredProducts.length} handcrafted items
            </p>
          </div>

          <button 
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)} 
            className="btn btn-secondary mobile-show-btn"
            style={{ display: 'none' }}
          >
            <SlidersHorizontal size={18} /> Filters
          </button>
        </div>

        {/* Main Shop Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }} className="shop-layout-grid">
          
          {/* Filter Sidebar */}
          <aside style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            height: 'fit-content'
          }}>
            <div className="flex-between" style={{ marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                <Filter size={18} color="var(--color-primary)" /> Filters
              </div>
              {(selectedCategory !== 'all' || searchQuery || maxPrice < 10000) && (
                <button 
                  onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setMaxPrice(10000); }}
                  style={{ fontSize: '0.75rem', color: 'var(--color-danger)', fontWeight: 600 }}
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Category Filter List */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.85rem' }}>Categories</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      textAlign: 'left',
                      padding: '0.55rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem',
                      fontWeight: selectedCategory === cat.id ? 700 : 500,
                      background: selectedCategory === cat.id ? 'var(--color-primary-light)' : 'transparent',
                      color: selectedCategory === cat.id ? 'var(--color-primary)' : 'var(--text-main)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Max Price</h4>
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                  ₹{maxPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="10000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
              />
              <div className="flex-between" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                <span>₹1,000</span>
                <span>₹10,000</span>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div>
            
            {/* Top Toolbar */}
            <div style={{
              background: 'white',
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              {/* Search Bar */}
              <div style={{ position: 'relative', width: '280px' }}>
                <input
                  type="text"
                  placeholder="Search in results..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.45rem 2rem 0.45rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.85rem'
                  }}
                />
                <Search size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>

              {/* Controls (Sort + View Mode) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Sort by:</span>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      padding: '0.4rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.85rem',
                      background: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="featured">Featured Picks</option>
                    <option value="low-high">Price: Low to High</option>
                    <option value="high-low">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '0.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '2px' }}>
                  <button 
                    onClick={() => setViewMode('grid')}
                    style={{
                      padding: '0.35rem',
                      borderRadius: '4px',
                      background: viewMode === 'grid' ? 'var(--color-primary-light)' : 'transparent',
                      color: viewMode === 'grid' ? 'var(--color-primary)' : 'var(--text-muted)'
                    }}
                  >
                    <Grid size={16} />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    style={{
                      padding: '0.35rem',
                      borderRadius: '4px',
                      background: viewMode === 'list' ? 'var(--color-primary-light)' : 'transparent',
                      color: viewMode === 'list' ? 'var(--color-primary)' : 'var(--text-muted)'
                    }}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Product List / Grid */}
            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 1rem', background: 'white', borderRadius: 'var(--radius-lg)' }}>
                <Search size={48} color="var(--text-light)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No products match your criteria</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Try expanding your price range or clearing filters.</p>
                <button onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setMaxPrice(10000); }} className="btn btn-primary">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid-cols-3' : ''} style={{ display: viewMode === 'list' ? 'flex' : undefined, flexDirection: viewMode === 'list' ? 'column' : undefined, gap: '1.5rem' }}>
                {filteredProducts.map((p) => {
                  const isWish = wishlist.includes(p.id);

                  if (viewMode === 'list') {
                    return (
                      <div 
                        key={p.id}
                        style={{
                          background: 'white',
                          borderRadius: 'var(--radius-lg)',
                          border: '1px solid var(--border-color)',
                          padding: '1.25rem',
                          display: 'flex',
                          gap: '1.5rem',
                          alignItems: 'center'
                        }}
                      >
                        <img 
                          src={p.image} 
                          alt={p.name} 
                          style={{ width: '160px', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                          onClick={() => navigateTo('product-detail', p.id)}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
                            {p.discount && <span className="badge badge-discount">{p.discount}</span>}
                            {p.isTrending && <span className="badge badge-trending">Trending</span>}
                          </div>
                          <h3 onClick={() => navigateTo('product-detail', p.id)} style={{ fontSize: '1.15rem', fontWeight: 700, cursor: 'pointer', marginBottom: '0.4rem' }}>
                            {p.name}
                          </h3>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                            {p.description}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Star size={14} fill="#F59E0B" color="#F59E0B" />
                            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{p.rating}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({p.reviewCount} reviews)</span>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right', minWidth: '160px' }}>
                          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.2rem' }}>
                            ₹{p.price.toLocaleString()}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', textDecoration: 'line-through', marginBottom: '1rem' }}>
                            ₹{p.originalPrice.toLocaleString()}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <button onClick={() => addToCart(p)} className="btn btn-primary btn-sm">
                              <ShoppingBag size={14} /> Add to Cart
                            </button>
                            <button onClick={() => setQuickViewProduct(p)} className="btn btn-secondary btn-sm">
                              Quick View
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }

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
                      <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2, display: 'flex', gap: '0.4rem' }}>
                        {p.discount && <span className="badge badge-discount">{p.discount}</span>}
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

                      <div style={{ position: 'relative', overflow: 'hidden', height: '220px', background: 'var(--bg-main)', cursor: 'pointer' }} onClick={() => navigateTo('product-detail', p.id)}>
                        <img 
                          src={p.image} 
                          alt={p.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </div>

                      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.4rem' }}>
                            <Star size={14} fill="#F59E0B" color="#F59E0B" />
                            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{p.rating}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({p.reviewCount})</span>
                          </div>

                          <h3 
                            onClick={() => navigateTo('product-detail', p.id)}
                            style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', cursor: 'pointer', lineHeight: 1.3 }}
                          >
                            {p.name}
                          </h3>
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                              ₹{p.price.toLocaleString()}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                              ₹{p.originalPrice.toLocaleString()}
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => addToCart(p)} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                              <ShoppingBag size={14} /> Add
                            </button>
                            <button onClick={() => setQuickViewProduct(p)} className="btn btn-secondary btn-sm">
                              <Eye size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 850px) {
          .shop-layout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
