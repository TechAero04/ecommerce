import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Tag, 
  Ticket, 
  MessageSquare, 
  Star, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  AlertTriangle, 
  ArrowUpRight, 
  Award, 
  ChevronRight, 
  X, 
  Save, 
  Eye, 
  RefreshCw,
  SlidersHorizontal,
  ShieldCheck,
  Check,
  ArrowLeft
} from 'lucide-react';

export const AdminPage = () => {
  const { 
    productsList, 
    orders, 
    categoriesList, 
    couponsList, 
    ticketsList, 
    reviewsList,
    user,
    navigateTo,
    showToast,
    isBackendConnected,
    adminAddProduct,
    adminUpdateProduct,
    adminDeleteProduct,
    adminUpdateStock,
    adminUpdateOrderStatus,
    adminAddCategory,
    adminDeleteCategory,
    adminAddCoupon,
    adminDeleteCoupon,
    adminUpdateTicketStatus,
    adminDeleteReview,
    adminUpdateUserPoints
  } = useShop();

  const [activeTab, setActiveTab] = useState('overview');

  // Search & Filter States
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');

  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // New Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'fashion',
    price: '',
    originalPrice: '',
    stock: 15,
    sku: '',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    description: '',
    isTrending: false,
    isNew: true
  });

  // New Coupon Form State
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountPercent: 15,
    minSpend: 1500,
    description: ''
  });

  // New Category Form State
  const [categoryForm, setCategoryForm] = useState({
    id: '',
    name: '',
    icon: 'ShoppingBag'
  });

  // Metrics & Calculations
  const stats = useMemo(() => {
    const totalRevenue = orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const totalOrdersCount = orders.length;
    const processingOrders = orders.filter(o => o.status === 'Processing').length;
    const inTransitOrders = orders.filter(o => o.status === 'In Transit' || o.status === 'Shipped').length;
    const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
    const lowStockCount = productsList.filter(p => p.stock <= 10).length;
    const openTicketsCount = ticketsList.filter(t => t.status !== 'Resolved').length;

    // Category Sales breakdown
    const categoryCounts = {};
    productsList.forEach(p => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });

    return {
      totalRevenue,
      totalOrdersCount,
      processingOrders,
      inTransitOrders,
      deliveredOrders,
      lowStockCount,
      openTicketsCount,
      categoryCounts
    };
  }, [orders, productsList, ticketsList]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return productsList.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                          (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase()));
      const matchCategory = selectedProductCategory === 'all' || p.category === selectedProductCategory;
      return matchSearch && matchCategory;
    });
  }, [productsList, productSearch, selectedProductCategory]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
      const matchSearch = o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          (o.trackingNumber && o.trackingNumber.toLowerCase().includes(orderSearch.toLowerCase())) ||
                          (o.shippingAddress && o.shippingAddress.toLowerCase().includes(orderSearch.toLowerCase()));
      return matchStatus && matchSearch;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  // Handlers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'fashion',
      price: '',
      originalPrice: '',
      stock: 15,
      sku: `VEL-SKU-${Math.floor(100 + Math.random() * 900)}`,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      description: '',
      isTrending: false,
      isNew: true
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      stock: prod.stock,
      sku: prod.sku,
      image: prod.image,
      description: prod.description || '',
      isTrending: Boolean(prod.isTrending),
      isNew: Boolean(prod.isNew)
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      showToast('Please provide product name and price', 'danger');
      return;
    }

    if (editingProduct) {
      await adminUpdateProduct(editingProduct.id, {
        ...productForm,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice || productForm.price),
        stock: Number(productForm.stock)
      });
    } else {
      await adminAddProduct({
        ...productForm,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice || productForm.price),
        stock: Number(productForm.stock)
      });
    }
    setIsProductModalOpen(false);
  };

  const handleSaveCoupon = async (e) => {
    e.preventDefault();
    if (!couponForm.code || !couponForm.discountPercent) {
      showToast('Coupon code and discount % required', 'danger');
      return;
    }
    await adminAddCoupon({
      ...couponForm,
      code: couponForm.code.toUpperCase(),
      discountPercent: Number(couponForm.discountPercent),
      minSpend: Number(couponForm.minSpend)
    });
    setIsCouponModalOpen(false);
    setCouponForm({ code: '', discountPercent: 15, minSpend: 1500, description: '' });
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.id || !categoryForm.name) {
      showToast('Category ID and Name are required', 'danger');
      return;
    }
    await adminAddCategory(categoryForm);
    setIsCategoryModalOpen(false);
    setCategoryForm({ id: '', name: '', icon: 'ShoppingBag' });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F1F5F9', display: 'flex', flexDirection: 'column' }}>
      
      {/* Admin Top Navigation Bar */}
      <header style={{ 
        background: '#0F172A', 
        color: '#FFFFFF', 
        borderBottom: '1px solid #1E293B',
        position: 'sticky', 
        top: 0, 
        zIndex: 90,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}>
        <div style={{ 
          maxWidth: '1500px', 
          margin: '0 auto', 
          padding: '0.85rem 1.5rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          
          {/* Logo & Portal Identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #4F46E5 0%, #F59E0B 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 2px 8px rgba(79, 70, 229, 0.4)'
            }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
                  VELMORA<span style={{ color: '#F59E0B' }}>.</span>
                </span>
                <span style={{ 
                  background: 'rgba(245, 158, 11, 0.2)', 
                  color: '#F59E0B', 
                  fontSize: '0.7rem', 
                  padding: '0.15rem 0.5rem', 
                  borderRadius: '4px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Admin Suite
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                Milestone 3 Deliverable • Store & Operations Management
              </span>
            </div>
          </div>

          {/* Quick Metrics & Storefront Link */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: isBackendConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              padding: '0.35rem 0.75rem',
              borderRadius: '20px',
              border: `1px solid ${isBackendConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: isBackendConnected ? '#10B981' : '#F59E0B',
                display: 'inline-block'
              }} />
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                color: isBackendConnected ? '#34D399' : '#FBBF24' 
              }}>
                {isBackendConnected ? 'REST API & SQLite Connected (Port 5000)' : 'Client Data Mode (Synced)'}
              </span>
            </div>

            <button 
              onClick={() => navigateTo('home')}
              className="btn btn-sm"
              style={{ 
                background: '#1E293B', 
                color: '#F8FAFC', 
                border: '1px solid #334155',
                gap: '0.4rem',
                fontSize: '0.85rem'
              }}
            >
              <ArrowLeft size={16} /> Return to Storefront
            </button>

            {/* Admin User Avatar Pill */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.65rem',
              padding: '0.3rem 0.75rem',
              borderRadius: '20px',
              background: '#1E293B'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
                alt="Store Admin" 
                style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#F8FAFC' }}>
                  Bharat Lal
                </span>
                <span style={{ display: 'block', fontSize: '0.65rem', color: '#94A3B8' }}>
                  Super Admin
                </span>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Container with Sidebar + Content Area */}
      <div style={{ 
        maxWidth: '1500px', 
        width: '100%', 
        margin: '0 auto', 
        display: 'flex', 
        flex: 1,
        padding: '1.5rem',
        gap: '1.5rem',
        boxSizing: 'border-box'
      }}>
        
        {/* Navigation Sidebar */}
        <aside style={{ 
          width: '260px', 
          flexShrink: 0, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.5rem' 
        }}>
          <div style={{ 
            background: '#FFFFFF', 
            borderRadius: '16px', 
            padding: '1rem', 
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}>
            <span style={{ 
              fontSize: '0.7rem', 
              fontWeight: 700, 
              color: '#94A3B8', 
              textTransform: 'uppercase', 
              letterSpacing: '1px', 
              padding: '0.5rem 0.75rem', 
              display: 'block' 
            }}>
              Control Center
            </span>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              
              <button 
                onClick={() => setActiveTab('overview')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: activeTab === 'overview' ? '#4F46E5' : '#475569',
                  background: activeTab === 'overview' ? '#EEF2FF' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <LayoutDashboard size={18} />
                  <span>Overview</span>
                </div>
              </button>

              <button 
                onClick={() => setActiveTab('products')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: activeTab === 'products' ? '#4F46E5' : '#475569',
                  background: activeTab === 'products' ? '#EEF2FF' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Package size={18} />
                  <span>Products</span>
                </div>
                <span style={{ 
                  background: activeTab === 'products' ? '#4F46E5' : '#E2E8F0', 
                  color: activeTab === 'products' ? '#FFFFFF' : '#475569', 
                  fontSize: '0.7rem', 
                  padding: '0.15rem 0.5rem', 
                  borderRadius: '10px',
                  fontWeight: 700 
                }}>
                  {productsList.length}
                </span>
              </button>

              <button 
                onClick={() => setActiveTab('orders')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: activeTab === 'orders' ? '#4F46E5' : '#475569',
                  background: activeTab === 'orders' ? '#EEF2FF' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <ShoppingBag size={18} />
                  <span>Orders</span>
                </div>
                {stats.processingOrders > 0 && (
                  <span style={{ 
                    background: '#F59E0B', 
                    color: '#FFFFFF', 
                    fontSize: '0.7rem', 
                    padding: '0.15rem 0.5rem', 
                    borderRadius: '10px',
                    fontWeight: 700 
                  }}>
                    {stats.processingOrders} new
                  </span>
                )}
              </button>

              <button 
                onClick={() => setActiveTab('customers')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: activeTab === 'customers' ? '#4F46E5' : '#475569',
                  background: activeTab === 'customers' ? '#EEF2FF' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Users size={18} />
                  <span>Customers</span>
                </div>
              </button>

              <button 
                onClick={() => setActiveTab('categories')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: activeTab === 'categories' ? '#4F46E5' : '#475569',
                  background: activeTab === 'categories' ? '#EEF2FF' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Tag size={18} />
                  <span>Categories</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{categoriesList.length}</span>
              </button>

              <button 
                onClick={() => setActiveTab('coupons')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: activeTab === 'coupons' ? '#4F46E5' : '#475569',
                  background: activeTab === 'coupons' ? '#EEF2FF' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Ticket size={18} />
                  <span>Coupons</span>
                </div>
                <span style={{ 
                  background: '#10B981', 
                  color: '#FFFFFF', 
                  fontSize: '0.7rem', 
                  padding: '0.15rem 0.5rem', 
                  borderRadius: '10px',
                  fontWeight: 700 
                }}>
                  {couponsList.length}
                </span>
              </button>

              <button 
                onClick={() => setActiveTab('tickets')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: activeTab === 'tickets' ? '#4F46E5' : '#475569',
                  background: activeTab === 'tickets' ? '#EEF2FF' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <MessageSquare size={18} />
                  <span>Support Tickets</span>
                </div>
                {stats.openTicketsCount > 0 && (
                  <span style={{ 
                    background: '#EF4444', 
                    color: '#FFFFFF', 
                    fontSize: '0.7rem', 
                    padding: '0.15rem 0.5rem', 
                    borderRadius: '10px',
                    fontWeight: 700 
                  }}>
                    {stats.openTicketsCount}
                  </span>
                )}
              </button>

              <button 
                onClick={() => setActiveTab('reviews')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: activeTab === 'reviews' ? '#4F46E5' : '#475569',
                  background: activeTab === 'reviews' ? '#EEF2FF' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Star size={18} />
                  <span>Reviews</span>
                </div>
              </button>

            </nav>
          </div>

          {/* Quick Helper Card */}
          <div style={{ 
            background: 'linear-gradient(135deg, #1E1B4B 0%, #311042 100%)', 
            color: 'white', 
            borderRadius: '16px', 
            padding: '1.25rem',
            boxShadow: '0 4px 12px rgba(30, 27, 75, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Award size={18} color="#F59E0B" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Milestone 3 Done</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#CBD5E1', lineHeight: 1.4, marginBottom: '0.75rem' }}>
              Admin panel with live SQLite DB CRUD, order status updating, customer tracking & real-time inventory control.
            </p>
            <button 
              onClick={handleOpenAddProduct}
              className="btn btn-sm btn-accent" 
              style={{ width: '100%', fontSize: '0.8rem', padding: '0.5rem' }}
            >
              <Plus size={14} /> Quick Add Product
            </button>
          </div>

        </aside>

        {/* Content View Area */}
        <main style={{ flex: 1, minWidth: 0 }}>
          
          {/* ========================================================== */}
          {/* TAB 1: OVERVIEW & ANALYTICS                                */}
          {/* ========================================================== */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Header Title & Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>
                    Dashboard Overview
                  </h2>
                  <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
                    Real-time sales performance, active fulfillments, and catalog health.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button 
                    onClick={handleOpenAddProduct} 
                    className="btn btn-primary btn-sm"
                    style={{ gap: '0.4rem' }}
                  >
                    <Plus size={16} /> New Product
                  </button>
                  <button 
                    onClick={() => setIsCouponModalOpen(true)} 
                    className="btn btn-secondary btn-sm"
                    style={{ gap: '0.4rem' }}
                  >
                    <Ticket size={16} /> New Coupon
                  </button>
                </div>
              </div>

              {/* 4 Hero KPI Cards */}
              <div className="grid-cols-4">
                
                <div style={{ 
                  background: '#FFFFFF', 
                  borderRadius: '16px', 
                  padding: '1.5rem', 
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#64748B' }}>Total Revenue</span>
                    <div style={{ background: '#D1FAE5', color: '#059669', padding: '0.5rem', borderRadius: '10px' }}>
                      <TrendingUp size={20} />
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A' }}>
                    ₹{stats.totalRevenue.toLocaleString('en-IN')}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700 }}>+18.2%</span>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>vs last week</span>
                  </div>
                </div>

                <div style={{ 
                  background: '#FFFFFF', 
                  borderRadius: '16px', 
                  padding: '1.5rem', 
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#64748B' }}>Total Orders</span>
                    <div style={{ background: '#EEF2FF', color: '#4F46E5', padding: '0.5rem', borderRadius: '10px' }}>
                      <ShoppingBag size={20} />
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A' }}>
                    {stats.totalOrdersCount}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#4F46E5', fontWeight: 700 }}>
                      {stats.inTransitOrders} in transit
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>• {stats.processingOrders} new</span>
                  </div>
                </div>

                <div style={{ 
                  background: '#FFFFFF', 
                  borderRadius: '16px', 
                  padding: '1.5rem', 
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#64748B' }}>Store Products</span>
                    <div style={{ background: '#FEF3C7', color: '#D97706', padding: '0.5rem', borderRadius: '10px' }}>
                      <Package size={20} />
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A' }}>
                    {productsList.length}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem' }}>
                    {stats.lowStockCount > 0 ? (
                      <span style={{ fontSize: '0.75rem', color: '#EF4444', fontWeight: 700 }}>
                        {stats.lowStockCount} items low stock
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700 }}>
                        All stock healthy
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ 
                  background: '#FFFFFF', 
                  borderRadius: '16px', 
                  padding: '1.5rem', 
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#64748B' }}>VIP Customers</span>
                    <div style={{ background: '#F1F5F9', color: '#0F172A', padding: '0.5rem', borderRadius: '10px' }}>
                      <Users size={20} />
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A' }}>
                    {user ? '1' : '0'} Active
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 700 }}>
                      {user ? `${user.rewardPoints} Coins Minted` : '0'}
                    </span>
                  </div>
                </div>

              </div>

              {/* Analytics & Category Share Grid */}
              <div className="grid-cols-2">
                
                {/* Category Inventory Breakdown */}
                <div style={{ 
                  background: '#FFFFFF', 
                  borderRadius: '16px', 
                  padding: '1.5rem', 
                  border: '1px solid #E2E8F0' 
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Tag size={18} color="#4F46E5" /> Catalog Distribution by Category
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {categoriesList.filter(c => c.id !== 'all').map(cat => {
                      const count = stats.categoryCounts[cat.id] || 0;
                      const percentage = Math.round((count / Math.max(1, productsList.length)) * 100);
                      return (
                        <div key={cat.id}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                            <span style={{ fontWeight: 600, color: '#334155' }}>{cat.name}</span>
                            <span style={{ color: '#64748B' }}>{count} items ({percentage}%)</span>
                          </div>
                          <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ 
                              width: `${percentage}%`, 
                              height: '100%', 
                              background: 'linear-gradient(90deg, #4F46E5, #F59E0B)', 
                              borderRadius: '4px' 
                            }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Fulfillment Status Funnel */}
                <div style={{ 
                  background: '#FFFFFF', 
                  borderRadius: '16px', 
                  padding: '1.5rem', 
                  border: '1px solid #E2E8F0' 
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Truck size={18} color="#10B981" /> Order Fulfillment Status
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '0.85rem 1rem',
                      background: '#FEF3C7',
                      borderRadius: '10px',
                      border: '1px solid #FDE68A'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Clock size={20} color="#D97706" />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#92400E' }}>Processing</div>
                          <div style={{ fontSize: '0.75rem', color: '#B45309' }}>Orders queued for packaging</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#92400E' }}>
                        {stats.processingOrders}
                      </span>
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '0.85rem 1rem',
                      background: '#EEF2FF',
                      borderRadius: '10px',
                      border: '1px solid #C7D2FE'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Truck size={20} color="#4F46E5" />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#3730A3' }}>In Transit / Shipped</div>
                          <div style={{ fontSize: '0.75rem', color: '#4338CA' }}>Courier dispatch with live tracking</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#3730A3' }}>
                        {stats.inTransitOrders}
                      </span>
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '0.85rem 1rem',
                      background: '#D1FAE5',
                      borderRadius: '10px',
                      border: '1px solid #A7F3D0'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <CheckCircle2 size={20} color="#059669" />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#065F46' }}>Delivered Successfully</div>
                          <div style={{ fontSize: '0.75rem', color: '#047857' }}>Customer received package</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#065F46' }}>
                        {stats.deliveredOrders}
                      </span>
                    </div>

                  </div>
                </div>

              </div>

              {/* Recent Orders Overview Table */}
              <div style={{ 
                background: '#FFFFFF', 
                borderRadius: '16px', 
                padding: '1.5rem', 
                border: '1px solid #E2E8F0' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                    Recent Order Transactions
                  </h3>
                  <button onClick={() => setActiveTab('orders')} className="btn btn-secondary btn-sm">
                    View All Orders ({orders.length}) →
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                        <th style={{ padding: '0.75rem 1rem' }}>Order ID</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Date</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Total</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Payment</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(ord => (
                        <tr key={ord.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#4F46E5' }}>
                            {ord.id}
                          </td>
                          <td style={{ padding: '0.85rem 1rem', color: '#64748B' }}>
                            {ord.date}
                          </td>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>
                            ₹{ord.total.toLocaleString('en-IN')}
                          </td>
                          <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>
                            {ord.paymentMethod}
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <span style={{
                              padding: '0.25rem 0.65rem',
                              borderRadius: '20px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              background: ord.status === 'Delivered' ? '#D1FAE5' : ord.status === 'In Transit' ? '#EEF2FF' : '#FEF3C7',
                              color: ord.status === 'Delivered' ? '#065F46' : ord.status === 'In Transit' ? '#3730A3' : '#92400E'
                            }}>
                              {ord.status}
                            </span>
                          </td>
                          <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                            <button 
                              onClick={() => { setViewingOrder(ord); setIsOrderModalOpen(true); }}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 2: PRODUCTS CATALOG MANAGEMENT                         */}
          {/* ========================================================== */}
          {activeTab === 'products' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>
                    Products Inventory & Catalog
                  </h2>
                  <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
                    Manage store pricing, stock quantities, SKU codes, and merchandise items.
                  </p>
                </div>
                <button onClick={handleOpenAddProduct} className="btn btn-primary" style={{ gap: '0.4rem' }}>
                  <Plus size={18} /> Add New Product
                </button>
              </div>

              {/* Filters & Search Toolbar */}
              <div style={{ 
                background: '#FFFFFF', 
                borderRadius: '16px', 
                padding: '1rem', 
                border: '1px solid #E2E8F0',
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '280px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    <input 
                      type="text" 
                      placeholder="Search products by name or SKU..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="input-field"
                      style={{ paddingLeft: '2.5rem' }}
                    />
                  </div>
                  
                  <select 
                    value={selectedProductCategory} 
                    onChange={(e) => setSelectedProductCategory(e.target.value)}
                    className="input-field"
                    style={{ width: '200px' }}
                  >
                    <option value="all">All Categories</option>
                    {categoriesList.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
                  Showing {filteredProducts.length} of {productsList.length} products
                </div>
              </div>

              {/* Products Table */}
              <div style={{ 
                background: '#FFFFFF', 
                borderRadius: '16px', 
                border: '1px solid #E2E8F0',
                overflow: 'hidden'
              }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                        <th style={{ padding: '0.85rem 1rem' }}>Product</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Category</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Price (₹)</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Stock</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Badges</th>
                        <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map(prod => (
                        <tr key={prod.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                              <img 
                                src={prod.image} 
                                alt={prod.name} 
                                style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                              />
                              <div>
                                <span style={{ fontWeight: 700, color: '#0F172A', display: 'block' }}>
                                  {prod.name}
                                </span>
                                <span style={{ fontSize: '0.725rem', color: '#94A3B8' }}>
                                  SKU: {prod.sku || 'N/A'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <span style={{ 
                              background: '#F1F5F9', 
                              padding: '0.25rem 0.5rem', 
                              borderRadius: '6px', 
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              textTransform: 'capitalize'
                            }}>
                              {prod.category}
                            </span>
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <div style={{ fontWeight: 700 }}>₹{prod.price.toLocaleString('en-IN')}</div>
                            {prod.originalPrice > prod.price && (
                              <div style={{ fontSize: '0.725rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                                ₹{prod.originalPrice.toLocaleString('en-IN')}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <button 
                                onClick={() => adminUpdateStock(prod.id, prod.stock - 1)}
                                style={{ 
                                  width: '22px', 
                                  height: '22px', 
                                  borderRadius: '4px', 
                                  background: '#F1F5F9', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  fontSize: '0.9rem',
                                  fontWeight: 700
                                }}
                              >
                                -
                              </button>
                              <span style={{ 
                                fontWeight: 700, 
                                minWidth: '24px', 
                                textAlign: 'center',
                                color: prod.stock <= 5 ? '#EF4444' : prod.stock <= 10 ? '#F59E0B' : '#10B981'
                              }}>
                                {prod.stock}
                              </span>
                              <button 
                                onClick={() => adminUpdateStock(prod.id, prod.stock + 1)}
                                style={{ 
                                  width: '22px', 
                                  height: '22px', 
                                  borderRadius: '4px', 
                                  background: '#F1F5F9', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  fontSize: '0.9rem',
                                  fontWeight: 700
                                }}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                              {prod.isTrending && (
                                <span style={{ background: '#FEF3C7', color: '#D97706', fontSize: '0.65rem', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                                  Trending
                                </span>
                              )}
                              {prod.isNew && (
                                <span style={{ background: '#D1FAE5', color: '#059669', fontSize: '0.65rem', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                                  New
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                              <button 
                                onClick={() => { navigateTo('product-detail', prod.id); }}
                                title="View on Storefront"
                                style={{ padding: '0.4rem', color: '#64748B', borderRadius: '6px' }}
                              >
                                <ExternalLink size={16} />
                              </button>
                              <button 
                                onClick={() => handleOpenEditProduct(prod)}
                                title="Edit Product"
                                style={{ padding: '0.4rem', color: '#4F46E5', borderRadius: '6px' }}
                              >
                                <Edit3 size={16} />
                              </button>
                              <button 
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete ${prod.name}?`)) {
                                    adminDeleteProduct(prod.id);
                                  }
                                }}
                                title="Delete Product"
                                style={{ padding: '0.4rem', color: '#EF4444', borderRadius: '6px' }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 3: ORDERS & FULFILLMENT MANAGEMENT                     */}
          {/* ========================================================== */}
          {activeTab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>
                    Orders & Shipments Fulfillment
                  </h2>
                  <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
                    Process pending orders, update tracking numbers, and fulfill customer shipments.
                  </p>
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['all', 'Processing', 'In Transit', 'Delivered', 'Cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      background: orderStatusFilter === st ? '#4F46E5' : '#FFFFFF',
                      color: orderStatusFilter === st ? '#FFFFFF' : '#475569',
                      border: '1px solid #E2E8F0',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {st === 'all' ? 'All Orders' : st}
                  </button>
                ))}
              </div>

              {/* Orders Table */}
              <div style={{ 
                background: '#FFFFFF', 
                borderRadius: '16px', 
                border: '1px solid #E2E8F0',
                overflow: 'hidden'
              }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                        <th style={{ padding: '0.85rem 1rem' }}>Order Details</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Items Summary</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Total Amount</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Live Status Updater</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Tracking Number</th>
                        <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map(ord => (
                        <tr key={ord.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <span style={{ fontWeight: 800, color: '#4F46E5', display: 'block' }}>
                              {ord.id}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                              Placed: {ord.date}
                            </span>
                            <span style={{ fontSize: '0.725rem', color: '#94A3B8', display: 'block' }}>
                              {ord.paymentMethod}
                            </span>
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {ord.items && ord.items.slice(0, 2).map((item, idx) => (
                                <img 
                                  key={idx}
                                  src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80'} 
                                  alt="item" 
                                  style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }}
                                />
                              ))}
                              <span style={{ fontSize: '0.8rem', color: '#475569' }}>
                                {ord.items ? `${ord.items.length} item(s)` : '1 item'}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>
                            ₹{ord.total.toLocaleString('en-IN')}
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <select
                              value={ord.status}
                              onChange={(e) => adminUpdateOrderStatus(ord.id, e.target.value)}
                              style={{
                                padding: '0.35rem 0.65rem',
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                border: '1px solid #CBD5E1',
                                background: ord.status === 'Delivered' ? '#D1FAE5' : ord.status === 'In Transit' ? '#EEF2FF' : '#FEF3C7',
                                color: ord.status === 'Delivered' ? '#065F46' : ord.status === 'In Transit' ? '#3730A3' : '#92400E'
                              }}
                            >
                              <option value="Processing">Processing</option>
                              <option value="In Transit">In Transit</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <span style={{ 
                              fontFamily: 'monospace', 
                              fontSize: '0.75rem', 
                              background: '#F1F5F9', 
                              padding: '0.2rem 0.5rem', 
                              borderRadius: '4px',
                              color: '#334155' 
                            }}>
                              {ord.trackingNumber || 'VEL-TRK-PENDING'}
                            </span>
                          </td>
                          <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                            <button 
                              onClick={() => { setViewingOrder(ord); setIsOrderModalOpen(true); }}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                            >
                              Invoice & Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 4: CUSTOMERS & VIP DIRECTORY                           */}
          {/* ========================================================== */}
          {activeTab === 'customers' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>
                  Customer Directory & Loyalty
                </h2>
                <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
                  View registered shoppers, their address books, total lifetime spend, and loyalty points.
                </p>
              </div>

              {user ? (
                <div style={{ 
                  background: '#FFFFFF', 
                  borderRadius: '16px', 
                  padding: '1.5rem', 
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #F59E0B' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{user.name}</h3>
                          <span style={{ background: '#FEF3C7', color: '#D97706', fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                            VIP Tier
                          </span>
                        </div>
                        <p style={{ color: '#64748B', fontSize: '0.85rem' }}>{user.email} • {user.phone}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button 
                        onClick={() => adminUpdateUserPoints(user.id || 'usr-default-001', user.rewardPoints + 250)}
                        className="btn btn-sm btn-accent"
                      >
                        <Award size={16} /> Bonus +250 Coins
                      </button>
                    </div>
                  </div>

                  <div className="grid-cols-3" style={{ marginTop: '1.5rem' }}>
                    <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Total Orders</span>
                      <h4 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.25rem' }}>{orders.length} Orders</h4>
                    </div>
                    <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Lifetime Spend</span>
                      <h4 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.25rem', color: '#059669' }}>
                        ₹{stats.totalRevenue.toLocaleString('en-IN')}
                      </h4>
                    </div>
                    <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Velmora Coins Balance</span>
                      <h4 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.25rem', color: '#D97706' }}>
                        {user.rewardPoints} pts
                      </h4>
                    </div>
                  </div>

                  {/* Saved Addresses Preview */}
                  <div style={{ marginTop: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Saved Shipping Addresses ({user.addresses?.length || 0})</h4>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      {user.addresses?.map(a => (
                        <div key={a.id} style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0', flex: 1, minWidth: '260px' }}>
                          <span style={{ background: '#EEF2FF', color: '#4F46E5', fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                            {a.label}
                          </span>
                          <p style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.5rem' }}>{a.name}</p>
                          <p style={{ fontSize: '0.75rem', color: '#64748B' }}>{a.street}, {a.city}, {a.state} - {a.pincode}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '16px', textAlign: 'center' }}>
                  No customer records loaded.
                </div>
              )}
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 5: CATEGORIES TAXONOMY                                 */}
          {/* ========================================================== */}
          {activeTab === 'categories' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>
                    Store Categories Taxonomy
                  </h2>
                  <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
                    Organize your product catalog into searchable store collections.
                  </p>
                </div>
                <button onClick={() => setIsCategoryModalOpen(true)} className="btn btn-primary" style={{ gap: '0.4rem' }}>
                  <Plus size={18} /> New Category
                </button>
              </div>

              <div className="grid-cols-3">
                {categoriesList.filter(c => c.id !== 'all').map(cat => {
                  const count = productsList.filter(p => p.category === cat.id).length;
                  return (
                    <div key={cat.id} style={{ 
                      background: '#FFFFFF', 
                      borderRadius: '16px', 
                      padding: '1.5rem', 
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ background: '#EEF2FF', color: '#4F46E5', padding: '0.65rem', borderRadius: '10px' }}>
                          <Tag size={20} />
                        </div>
                        <button 
                          onClick={() => {
                            if (confirm(`Remove category "${cat.name}"?`)) {
                              adminDeleteCategory(cat.id);
                            }
                          }}
                          style={{ color: '#EF4444', padding: '0.35rem' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{cat.name}</h4>
                      <p style={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'monospace', marginTop: '0.2rem' }}>
                        ID: {cat.id}
                      </p>
                      <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Catalog Count:</span>
                        <span style={{ fontWeight: 700, color: '#4F46E5', fontSize: '0.9rem' }}>{count} Products</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 6: COUPONS & DISCOUNT ENGINE                           */}
          {/* ========================================================== */}
          {activeTab === 'coupons' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>
                    Coupons & Promotional Discounts
                  </h2>
                  <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
                    Create and manage promo codes with percentage discounts and minimum basket spend.
                  </p>
                </div>
                <button onClick={() => setIsCouponModalOpen(true)} className="btn btn-primary" style={{ gap: '0.4rem' }}>
                  <Plus size={18} /> New Promo Code
                </button>
              </div>

              <div className="grid-cols-2">
                {couponsList.map(c => (
                  <div key={c.code} style={{ 
                    background: '#FFFFFF', 
                    borderRadius: '16px', 
                    padding: '1.5rem', 
                    border: '1px solid #E2E8F0',
                    borderLeft: '4px solid #10B981',
                    position: 'relative'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Ticket size={20} color="#10B981" />
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '1px', color: '#0F172A' }}>
                          {c.code}
                        </span>
                      </div>
                      <button 
                        onClick={() => {
                          if (confirm(`Delete coupon ${c.code}?`)) {
                            adminDeleteCoupon(c.code);
                          }
                        }}
                        style={{ color: '#EF4444', padding: '0.35rem' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem' }}>
                      {c.description || 'Promotional coupon code'}
                    </p>

                    <div style={{ display: 'flex', gap: '1.5rem', background: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '10px' }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#94A3B8', display: 'block' }}>Discount</span>
                        <span style={{ fontSize: '1rem', fontWeight: 800, color: '#10B981' }}>{c.discountPercent}% OFF</span>
                      </div>
                      <div style={{ borderLeft: '1px solid #E2E8F0', paddingLeft: '1.5rem' }}>
                        <span style={{ fontSize: '0.7rem', color: '#94A3B8', display: 'block' }}>Min Spend</span>
                        <span style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>₹{c.minSpend.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 7: SUPPORT TICKETS DESK                                */}
          {/* ========================================================== */}
          {activeTab === 'tickets' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>
                  Support Inquiries & Customer Desk
                </h2>
                <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
                  Respond to buyer inquiries, help requests, and track ticket resolutions.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {ticketsList.map(t => (
                  <div key={t.id} style={{ 
                    background: '#FFFFFF', 
                    borderRadius: '16px', 
                    padding: '1.25rem 1.5rem', 
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div style={{ flex: 1, minWidth: '280px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                        <span style={{ fontWeight: 800, color: '#4F46E5', fontSize: '0.85rem' }}>{t.id}</span>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{t.subject}</h4>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.5rem' }}>
                        "{t.message}"
                      </p>
                      <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                        By {t.name} ({t.email}) • {t.created_at || 'Recent'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <select 
                        value={t.status}
                        onChange={(e) => adminUpdateTicketStatus(t.id, e.target.value)}
                        style={{
                          padding: '0.35rem 0.65rem',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          border: '1px solid #CBD5E1',
                          background: t.status === 'Resolved' ? '#D1FAE5' : t.status === 'In Progress' ? '#EEF2FF' : '#FEF3C7',
                          color: t.status === 'Resolved' ? '#065F46' : t.status === 'In Progress' ? '#3730A3' : '#92400E'
                        }}
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 8: CUSTOMER REVIEWS & MODERATION                       */}
          {/* ========================================================== */}
          {activeTab === 'reviews' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>
                  Product Reviews & Moderation
                </h2>
                <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
                  Audit buyer feedback, star ratings, and remove inappropriate content.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reviewsList.map(r => (
                  <div key={r.id} style={{ 
                    background: '#FFFFFF', 
                    borderRadius: '16px', 
                    padding: '1.25rem 1.5rem', 
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div style={{ flex: 1, minWidth: '280px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 700, color: '#0F172A' }}>{r.author}</span>
                        <span style={{ color: '#F59E0B', fontWeight: 700, fontSize: '0.85rem' }}>★ {r.rating}.0</span>
                        {r.verified && (
                          <span style={{ background: '#D1FAE5', color: '#059669', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.35rem' }}>
                        "{r.comment}"
                      </p>
                      <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                        Product: {r.productName || r.productId} • {r.date}
                      </span>
                    </div>

                    <button 
                      onClick={() => {
                        if (confirm('Delete this customer review?')) {
                          adminDeleteReview(r.id);
                        }
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#EF4444' }}
                    >
                      <Trash2 size={16} /> Delete Review
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ============================================================ */}
      {/* MODAL: ADD / EDIT PRODUCT                                     */}
      {/* ============================================================ */}
      {isProductModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '650px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative'
          }}>
            <button 
              onClick={() => setIsProductModalOpen(false)}
              style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', color: '#64748B' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              {editingProduct ? 'Edit Product Item' : 'Add New Store Product'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.5rem' }}>
              Product updates instantly reflect in the live catalog and customer storefront.
            </p>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Product Title *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Kashmiri Hand-Embroidered Pashmina Shawl"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="grid-cols-2">
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Category *
                  </label>
                  <select 
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="input-field"
                  >
                    {categoriesList.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    SKU Code *
                  </label>
                  <input 
                    type="text" 
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid-cols-3">
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Selling Price (₹) *
                  </label>
                  <input 
                    type="number" 
                    required
                    placeholder="2999"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Original / MRP (₹)
                  </label>
                  <input 
                    type="number" 
                    placeholder="4999"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Stock Units *
                  </label>
                  <input 
                    type="number" 
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Image URL
                </label>
                <input 
                  type="url" 
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Description
                </label>
                <textarea 
                  rows={3}
                  placeholder="Detailed product story, craftsmanship, dimensions, and specifications..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="input-field"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '2rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input 
                    type="checkbox" 
                    checked={productForm.isTrending}
                    onChange={(e) => setProductForm({ ...productForm, isTrending: e.target.checked })}
                  />
                  Mark as Trending
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input 
                    type="checkbox" 
                    checked={productForm.isNew}
                    onChange={(e) => setProductForm({ ...productForm, isNew: e.target.checked })}
                  />
                  Mark as New Arrival
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  type="button" 
                  onClick={() => setIsProductModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={18} /> {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: VIEW ORDER DETAILS & TAX INVOICE                      */}
      {/* ============================================================ */}
      {isOrderModalOpen && viewingOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '650px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative'
          }}>
            <button 
              onClick={() => setIsOrderModalOpen(false)}
              style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', color: '#64748B' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                Order #{viewingOrder.id}
              </h3>
              <span style={{
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                background: viewingOrder.status === 'Delivered' ? '#D1FAE5' : '#EEF2FF',
                color: viewingOrder.status === 'Delivered' ? '#065F46' : '#3730A3'
              }}>
                {viewingOrder.status}
              </span>
            </div>

            <p style={{ fontSize: '0.825rem', color: '#64748B', marginBottom: '1.5rem' }}>
              Placed on {viewingOrder.date} • Payment Method: {viewingOrder.paymentMethod}
            </p>

            {/* Shipping Address */}
            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Delivery Destination</span>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, marginTop: '0.25rem' }}>{viewingOrder.shippingAddress}</p>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.25rem' }}>Tracking: {viewingOrder.trackingNumber || 'Pending assignment'}</p>
            </div>

            {/* Line Items */}
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Order Line Items</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {viewingOrder.items && viewingOrder.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', border: '1px solid #F1F5F9', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img 
                      src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80'} 
                      alt={item.name} 
                      style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', display: 'block' }}>{item.name}</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Qty: {item.quantity || 1} • {item.color || item.size || 'Standard'}</span>
                    </div>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                    ₹{(item.price * (item.quantity || 1)).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '2px dashed #E2E8F0', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Total Order Value:</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669' }}>
                ₹{viewingOrder.total.toLocaleString('en-IN')}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button 
                onClick={() => setIsOrderModalOpen(false)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD PROMO COUPON                                      */}
      {/* ============================================================ */}
      {isCouponModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '480px',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative'
          }}>
            <button 
              onClick={() => setIsCouponModalOpen(false)}
              style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', color: '#64748B' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              Create New Promo Coupon
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.25rem' }}>
              Coupons can be applied at cart & checkout by shoppers.
            </p>

            <form onSubmit={handleSaveCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Coupon Code *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. DIWALI30"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  className="input-field"
                  style={{ textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}
                />
              </div>

              <div className="grid-cols-2">
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Discount Percentage (%) *
                  </label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    max="90"
                    placeholder="20"
                    value={couponForm.discountPercent}
                    onChange={(e) => setCouponForm({ ...couponForm, discountPercent: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Min Spend (₹)
                  </label>
                  <input 
                    type="number" 
                    placeholder="1000"
                    value={couponForm.minSpend}
                    onChange={(e) => setCouponForm({ ...couponForm, minSpend: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Description
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. 20% OFF on all artisanal fashion"
                  value={couponForm.description}
                  onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                  className="input-field"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsCouponModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD CATEGORY                                          */}
      {/* ============================================================ */}
      {isCategoryModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '450px',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative'
          }}>
            <button 
              onClick={() => setIsCategoryModalOpen(false)}
              style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', color: '#64748B' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              Add New Category
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.25rem' }}>
              Create a new category for your products catalog.
            </p>

            <form onSubmit={handleSaveCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Category ID (Slug) *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. jewelry"
                  value={categoryForm.id}
                  onChange={(e) => setCategoryForm({ ...categoryForm, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Category Display Name *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Heritage Jewelry"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="input-field"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
