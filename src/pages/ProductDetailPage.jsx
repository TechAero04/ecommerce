import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS, MOCK_REVIEWS } from '../data/mockData';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Share2, 
  ChevronRight, 
  Plus, 
  Minus, 
  Check, 
  Award,
  MessageCircle
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { 
    selectedProductId, 
    addToCart, 
    navigateTo, 
    toggleWishlist, 
    wishlist,
    setQuickViewProduct
  } = useShop();

  const product = PRODUCTS.find(p => p.id === selectedProductId) || PRODUCTS[0];

  const [activeImage, setActiveImage] = useState(product.images ? product.images[0] : product.image);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '');
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs', 'reviews', 'shipping'

  const isWish = wishlist.includes(product.id);

  const handleBuyNow = () => {
    addToCart(product, qty, selectedColor, selectedSize);
    navigateTo('checkout');
  };

  const relatedProducts = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <div style={{ background: 'var(--bg-main)', padding: '2rem 0 5rem' }}>
      <div className="container">
        
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigateTo('home')}>Home</span>
          <ChevronRight size={14} />
          <span style={{ cursor: 'pointer' }} onClick={() => navigateTo('shop')}>Shop</span>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* Main Product Hero Layout */}
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '3rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3.5rem' }} className="pdp-grid">
            
            {/* Gallery Column */}
            <div>
              <div style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: 'var(--bg-main)',
                marginBottom: '1rem',
                border: '1px solid var(--border-color)'
              }}>
                <img 
                  src={activeImage} 
                  alt={product.name}
                  style={{ width: '100%', height: '440px', objectFit: 'cover' }} 
                />
                {product.discount && (
                  <span className="badge badge-discount" style={{ position: 'absolute', top: '16px', left: '16px' }}>
                    {product.discount}
                  </span>
                )}
              </div>

              {/* Thumbnail Selector */}
              {product.images && product.images.length > 1 && (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        border: activeImage === img ? '2.5px solid var(--color-primary)' : '1px solid var(--border-color)',
                        opacity: activeImage === img ? 1 : 0.7
                      }}
                    >
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Column */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      SKU: {product.sku}
                    </span>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.2rem', marginBottom: '0.75rem', lineHeight: 1.25 }}>
                      {product.name}
                    </h1>
                  </div>

                  <button 
                    onClick={() => toggleWishlist(product.id)}
                    style={{
                      background: 'var(--bg-main)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '50%',
                      padding: '10px',
                      color: isWish ? 'var(--color-danger)' : 'var(--text-muted)'
                    }}
                  >
                    <Heart size={20} fill={isWish ? "currentColor" : "none"} />
                  </button>
                </div>

                {/* Rating & Stock */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#FEF3C7', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
                    <Star size={15} fill="#F59E0B" color="#F59E0B" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#D97706' }}>{product.rating}</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({product.reviewCount} customer reviews)</span>
                  <span style={{ fontSize: '0.85rem', color: product.stock < 10 ? 'var(--color-danger)' : 'var(--color-emerald)', fontWeight: 700 }}>
                    ● In Stock ({product.stock} units left)
                  </span>
                </div>

                {/* Price Display */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.5rem', background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '1.2rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-emerald)' }}>
                    You Save ₹{(product.originalPrice - product.price).toLocaleString()}
                  </span>
                </div>

                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  {product.description}
                </p>

                {/* Color Swatches */}
                {product.colors && product.colors.length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label className="input-label" style={{ marginBottom: '0.5rem' }}>
                      Selected Color: <strong style={{ color: 'var(--color-primary)' }}>{selectedColor}</strong>
                    </label>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      {product.colors.map(c => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c.name)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.4rem 0.85rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1.5px solid',
                            borderColor: selectedColor === c.name ? 'var(--color-primary)' : 'var(--border-color)',
                            background: selectedColor === c.name ? 'var(--color-primary-light)' : 'white'
                          }}
                        >
                          <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: c.hex, display: 'inline-block' }} />
                          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                {product.sizes && product.sizes.length > 0 && (
                  <div style={{ marginBottom: '1.75rem' }}>
                    <label className="input-label" style={{ marginBottom: '0.5rem' }}>Select Size</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {product.sizes.map(s => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          style={{
                            padding: '0.5rem 1.25rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1.5px solid',
                            borderColor: selectedSize === s ? 'var(--color-primary)' : 'var(--border-color)',
                            background: selectedSize === s ? 'var(--color-primary)' : 'white',
                            color: selectedSize === s ? 'white' : 'var(--text-main)',
                            fontWeight: 700,
                            fontSize: '0.9rem'
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity & Action Buttons */}
              <div>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                  {/* Quantity */}
                  <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.3rem' }}>
                    <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ padding: '0.5rem 0.85rem' }}><Minus size={16} /></button>
                    <span style={{ padding: '0 0.85rem', fontWeight: 800, fontSize: '1.1rem' }}>{qty}</span>
                    <button onClick={() => setQty(qty + 1)} style={{ padding: '0.5rem 0.85rem' }}><Plus size={16} /></button>
                  </div>

                  <button 
                    onClick={() => addToCart(product, qty, selectedColor, selectedSize)} 
                    className="btn btn-primary btn-lg" 
                    style={{ flex: 1 }}
                  >
                    <ShoppingBag size={20} /> Add to Shopping Cart
                  </button>
                </div>

                <button onClick={handleBuyNow} className="btn btn-accent btn-lg btn-full" style={{ marginBottom: '1.5rem' }}>
                  Buy Now with Express Delivery ⚡
                </button>

                {/* Assurance Badges */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                    <Truck size={18} color="var(--color-primary)" /> Free Delivery over ₹1,999
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                    <RotateCcw size={18} color="var(--color-emerald)" /> 7-Day Replacement
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                    <ShieldCheck size={18} color="#F59E0B" /> 100% Genuine Certified
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Tabbed Product Details */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '2rem', marginBottom: '4rem' }}>
          <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '2rem' }}>
            {['specs', 'reviews', 'shipping'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: activeTab === tab ? 'var(--color-primary)' : 'var(--text-muted)',
                  borderBottom: activeTab === tab ? '3px solid var(--color-primary)' : 'none',
                  paddingBottom: '0.75rem'
                }}
              >
                {tab === 'specs' ? 'Specifications & Details' : tab === 'reviews' ? `Customer Reviews (${product.reviewCount})` : 'Shipping & Returns'}
              </button>
            ))}
          </div>

          {activeTab === 'specs' && (
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Key Highlights</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {product.details ? (
                  product.details.map((detail, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                      <Check size={18} color="var(--color-emerald)" /> {detail}
                    </li>
                  ))
                ) : (
                  <li style={{ fontSize: '0.95rem' }}>Crafted with 100% premium grade materials certified by Velmora standards.</li>
                )}
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ textAlign: 'center', background: 'var(--color-primary-light)', padding: '1.5rem 2rem', borderRadius: 'var(--radius-md)' }}>
                  <h2 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>{product.rating}</h2>
                  <div style={{ display: 'flex', color: '#F59E0B', justifyContent: 'center', margin: '0.4rem 0' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="#F59E0B" />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Based on {product.reviewCount} ratings</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {MOCK_REVIEWS.map(r => (
                  <div key={r.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                    <div className="flex-between" style={{ marginBottom: '0.3rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{r.author}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.date}</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div style={{ lineHeight: 1.7, fontSize: '0.95rem', color: 'var(--text-main)' }}>
              <p><strong>Shipping Options:</strong> Standard Delivery (2-4 Days across Metro Cities), Express 24hr Delivery available for select pincodes.</p>
              <p><strong>Return Guarantee:</strong> If you are not satisfied with your purchase, you may initiate a return or exchange within 7 days of delivery.</p>
            </div>
          )}
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1.5rem' }}>You Might Also Like</h2>
            <div className="grid-cols-3">
              {relatedProducts.map(p => (
                <div key={p.id} style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '1.25rem', cursor: 'pointer' }} onClick={() => navigateTo('product-detail', p.id)}>
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }} />
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>{p.name}</h3>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary)' }}>₹{p.price.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <style>{`
        @media (max-width: 850px) {
          .pdp-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
