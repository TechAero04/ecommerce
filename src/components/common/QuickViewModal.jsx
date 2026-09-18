import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { X, Star, ShoppingBag, ShieldCheck, Heart } from 'lucide-react';

export const QuickViewModal = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, navigateTo, toggleWishlist, wishlist } = useShop();
  
  if (!quickViewProduct) return null;

  const [selectedColor, setSelectedColor] = useState(quickViewProduct.colors[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(quickViewProduct.sizes[0] || '');
  const [qty, setQty] = useState(1);

  const isWishlisted = wishlist.includes(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, qty, selectedColor, selectedSize);
    setQuickViewProduct(null);
  };

  const handleViewFullDetails = () => {
    navigateTo('product-detail', quickViewProduct.id);
    setQuickViewProduct(null);
  };

  return (
    <div className="modal-overlay" onClick={() => setQuickViewProduct(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', padding: '0' }}>
        
        {/* Close Button */}
        <button 
          onClick={() => setQuickViewProduct(null)} 
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            background: 'white',
            borderRadius: '50%',
            padding: '6px',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }} className="modal-grid">
          {/* Image */}
          <div style={{ background: 'var(--bg-main)', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src={quickViewProduct.image} 
              alt={quickViewProduct.name}
              style={{ width: '100%', maxHeight: '380px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} 
            />
          </div>

          {/* Details */}
          <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                {quickViewProduct.isTrending && <span className="badge badge-trending">Trending</span>}
                {quickViewProduct.discount && <span className="badge badge-discount">{quickViewProduct.discount}</span>}
              </div>

              <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{quickViewProduct.name}</h2>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', color: '#F59E0B' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill={i < Math.floor(quickViewProduct.rating) ? "#F59E0B" : "none"} />
                  ))}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{quickViewProduct.rating}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({quickViewProduct.reviewCount} reviews)</span>
              </div>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                  ₹{quickViewProduct.price.toLocaleString()}
                </span>
                <span style={{ fontSize: '1.1rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                  ₹{quickViewProduct.originalPrice.toLocaleString()}
                </span>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                {quickViewProduct.description}
              </p>

              {/* Color Options */}
              {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <label className="input-label" style={{ fontSize: '0.8rem' }}>Color: <strong>{selectedColor}</strong></label>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem' }}>
                    {quickViewProduct.colors.map(c => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: c.hex,
                          border: selectedColor === c.name ? '3px solid var(--color-primary)' : '2px solid white',
                          boxShadow: '0 0 0 1px #ccc'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="input-label" style={{ fontSize: '0.8rem' }}>Size</label>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem' }}>
                    {quickViewProduct.sizes.map(s => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        style={{
                          padding: '0.3rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1.5px solid',
                          borderColor: selectedSize === s ? 'var(--color-primary)' : 'var(--border-color)',
                          background: selectedSize === s ? 'var(--color-primary-light)' : 'white',
                          color: selectedSize === s ? 'var(--color-primary)' : 'var(--text-main)',
                          fontSize: '0.8rem',
                          fontWeight: 600
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <button onClick={handleAddToCart} className="btn btn-primary" style={{ flex: 1 }}>
                  <ShoppingBag size={18} /> Add to Cart
                </button>
                <button 
                  onClick={() => toggleWishlist(quickViewProduct.id)} 
                  className="btn btn-secondary"
                  style={{ color: isWishlisted ? 'var(--color-danger)' : 'var(--text-main)' }}
                >
                  <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
              </div>

              <button 
                onClick={handleViewFullDetails}
                style={{ width: '100%', textDecoration: 'underline', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}
              >
                View Full Specifications & Reviews →
              </button>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 650px) {
          .modal-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
