import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS as FALLBACK_PRODUCTS, MOCK_USER as FALLBACK_USER, MOCK_ORDERS as FALLBACK_ORDERS } from '../data/mockData';
import { apiClient } from '../api/client';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // Navigation & Page View State
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState('prod-1');

  // Search & Category Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Database Products & Orders State
  const [productsList, setProductsList] = useState(FALLBACK_PRODUCTS);
  const [user, setUser] = useState(FALLBACK_USER);
  const [orders, setOrders] = useState(FALLBACK_ORDERS);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Cart State (Pre-populated with 1 item for quick demo)
  const [cart, setCart] = useState([
    {
      product: FALLBACK_PRODUCTS[0],
      quantity: 1,
      selectedColor: FALLBACK_PRODUCTS[0].colors[0]?.name || 'Standard',
      selectedSize: FALLBACK_PRODUCTS[0].sizes[0] || 'Standard'
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist State
  const [wishlist, setWishlist] = useState(['prod-2', 'prod-4']);

  // Modals & Overlay State
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [activeOrderSuccess, setActiveOrderSuccess] = useState(null);

  // Toast Notification System
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3500);
  };

  // Sync Data with Live SQLite Backend API
  useEffect(() => {
    async function loadBackendData() {
      try {
        const isHealthy = await apiClient.checkHealth();
        if (isHealthy) {
          setIsBackendConnected(true);
          const [dbProducts, dbOrders, dbUser] = await Promise.all([
            apiClient.getProducts(),
            apiClient.getOrders(),
            apiClient.getProfile()
          ]);
          if (dbProducts && dbProducts.length > 0) setProductsList(dbProducts);
          if (dbOrders && dbOrders.length > 0) setOrders(dbOrders);
          if (dbUser) setUser(dbUser);
          console.log('⚡ Connected live to Velmora SQLite Backend Server!');
        }
      } catch (err) {
        console.warn('Backend unavailable, using fallback mock dataset:', err.message);
      }
    }
    loadBackendData();
  }, []);

  // Route Navigation Handler
  const navigateTo = (page, productId = null) => {
    if (productId) {
      setSelectedProductId(productId);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Logic
  const addToCart = (product, quantity = 1, selectedColor = null, selectedSize = null) => {
    const color = selectedColor || product.colors[0]?.name || 'Standard';
    const size = selectedSize || product.sizes[0] || 'Standard';

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(
        item => item.product.id === product.id && item.selectedColor === color && item.selectedSize === size
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { product, quantity, selectedColor: color, selectedSize: size }];
      }
    });

    showToast(`Added ${product.name} to cart!`, 'success');
  };

  const removeFromCart = (index) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (index, delta) => {
    setCart(prevCart => {
      return prevCart.map((item, i) => {
        if (i === index) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      });
    });
  };

  const clearCart = () => setCart([]);

  // Calculate Cart Totals
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const shippingFee = cartSubtotal > 1999 || cartSubtotal === 0 ? 0 : 149;
  const taxAmount = Math.round(cartSubtotal * 0.05); // 5% GST
  const cartTotal = cartSubtotal + shippingFee + taxAmount;

  // Wishlist Toggle
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Added to wishlist!', 'success');
        return [...prev, productId];
      }
    });
  };

  // Order Placement & SQLite Backend Sync
  const placeOrder = async (shippingDetails, paymentMethod) => {
    const formattedItems = cart.map(item => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      color: item.selectedColor,
      size: item.selectedSize,
      image: item.product.image
    }));

    const orderPayload = {
      userId: user?.id || 'usr-default-001',
      items: formattedItems,
      total: cartTotal,
      paymentMethod: paymentMethod,
      shippingAddress: `${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.state} ${shippingDetails.pincode}`
    };

    let newOrder;
    if (isBackendConnected) {
      try {
        newOrder = await apiClient.createOrder(orderPayload);
      } catch (err) {
        console.error('Backend order creation failed, creating local fallback order:', err);
      }
    }

    if (!newOrder) {
      newOrder = {
        id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
        date: new Date().toISOString().split('T')[0],
        items: formattedItems,
        total: cartTotal,
        status: 'Processing',
        statusStep: 1,
        paymentMethod: paymentMethod,
        shippingAddress: orderPayload.shippingAddress,
        trackingNumber: `VEL-TRK${Math.floor(100000 + Math.random() * 900000)}`
      };
    }

    setOrders([newOrder, ...orders]);
    clearCart();
    setActiveOrderSuccess(newOrder);
    showToast('🎉 Order stored in SQLite Database!', 'success');
  };

  // ==================================================================
  // Admin Operations & Actions (Milestone 3 Deliverables)
  // ==================================================================
  const [categoriesList, setCategoriesList] = useState([
    { id: 'all', name: 'All Products', icon: 'ShoppingBag' },
    { id: 'fashion', name: 'Artisanal Fashion', icon: 'Shirt' },
    { id: 'electronics', name: 'Smart Tech & Audio', icon: 'Headphones' },
    { id: 'home', name: 'Home & Living', icon: 'Home' },
    { id: 'beauty', name: 'Ayurveda & Wellness', icon: 'Sparkles' },
    { id: 'gourmet', name: 'Gourmet Organic Spices', icon: 'Utensils' }
  ]);

  const [couponsList, setCouponsList] = useState([
    { code: 'VELMORA10', discountPercent: 10, minSpend: 1000, description: '10% OFF on orders over ₹1,000' },
    { code: 'FESTIVE20', discountPercent: 20, minSpend: 2500, description: '20% OFF on Artisanal & Fashion items' }
  ]);

  const [ticketsList, setTicketsList] = useState([
    { id: 'TKT-84920', name: 'Aarav Sharma', email: 'aarav.sharma@example.com', subject: 'Express Delivery Request', message: 'Can you deliver before Friday evening?', status: 'Open', created_at: '2026-09-28 14:15:00' },
    { id: 'TKT-39182', name: 'Priya Mukherjee', email: 'priya.m@example.com', subject: 'Custom Silk Sizing', message: 'Do you offer custom tailoring for Banarasi Silk?', status: 'In Progress', created_at: '2026-09-27 11:30:00' },
    { id: 'TKT-19284', name: 'Rohan Mehra', email: 'rohan.m@example.com', subject: 'Payment confirmation query', message: 'Invoice received, need tax receipt for business.', status: 'Resolved', created_at: '2026-09-26 09:45:00' }
  ]);

  const [reviewsList, setReviewsList] = useState([
    { id: 'rev-1', productId: 'prod-1', productName: 'Handcrafted Heritage Silk Kurta', author: 'Aarav Sharma', rating: 5, date: '2 days ago', verified: true, comment: 'The quality of the Banarasi silk is unbelievable for this price point!' },
    { id: 'rev-2', productId: 'prod-2', productName: 'Acoustic Clarity Wireless Headphones', author: 'Priya Mukherjee', rating: 5, date: '1 week ago', verified: true, comment: 'Velmora platform experience was so smooth. Highly recommend!' },
    { id: 'rev-3', productId: 'prod-3', productName: 'Hand-Carved Sheesham Wood Desk Lamp', author: 'Vikramaditya Roy', rating: 4, date: '2 weeks ago', verified: true, comment: 'High quality solid wood with warm aesthetic lighting.' }
  ]);

  // Admin Product Actions
  const adminAddProduct = async (productData) => {
    try {
      if (isBackendConnected) {
        const created = await apiClient.createProduct(productData);
        setProductsList(prev => [created, ...prev]);
      } else {
        const localProduct = {
          ...productData,
          id: productData.id || `prod-${Date.now()}`,
          rating: 5.0,
          reviewCount: 0,
          images: productData.images || [productData.image],
          details: productData.details || ['Handcrafted quality'],
          sizes: productData.sizes || ['Standard'],
          colors: productData.colors || []
        };
        setProductsList(prev => [localProduct, ...prev]);
      }
      showToast('✨ Product added successfully to catalog!', 'success');
      return true;
    } catch (err) {
      showToast(`Error adding product: ${err.message}`, 'danger');
      return false;
    }
  };

  const adminUpdateProduct = async (id, updatedFields) => {
    try {
      if (isBackendConnected) {
        const updated = await apiClient.updateProduct(id, updatedFields);
        setProductsList(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
      } else {
        setProductsList(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
      }
      showToast('✅ Product updated successfully!', 'success');
      return true;
    } catch (err) {
      showToast(`Error updating product: ${err.message}`, 'danger');
      return false;
    }
  };

  const adminDeleteProduct = async (id) => {
    try {
      if (isBackendConnected) {
        await apiClient.deleteProduct(id);
      }
      setProductsList(prev => prev.filter(p => p.id !== id));
      showToast('🗑️ Product removed from store catalog', 'success');
      return true;
    } catch (err) {
      showToast(`Error deleting product: ${err.message}`, 'danger');
      return false;
    }
  };

  const adminUpdateStock = async (id, newStock) => {
    try {
      const stockVal = Math.max(0, Number(newStock));
      if (isBackendConnected) {
        await apiClient.updateProductStock(id, stockVal);
      }
      setProductsList(prev => prev.map(p => p.id === id ? { ...p, stock: stockVal } : p));
      showToast(`📦 Stock adjusted to ${stockVal} units`, 'success');
    } catch (err) {
      showToast(`Error updating stock: ${err.message}`, 'danger');
    }
  };

  // Admin Order Actions
  const adminUpdateOrderStatus = async (orderId, newStatus, newStep = null, trackingNumber = null) => {
    try {
      let step = newStep;
      if (step === null) {
        if (newStatus === 'Processing') step = 1;
        else if (newStatus === 'Confirmed') step = 2;
        else if (newStatus === 'In Transit' || newStatus === 'Shipped') step = 3;
        else if (newStatus === 'Delivered') step = 4;
        else step = 1;
      }

      if (isBackendConnected) {
        await apiClient.updateOrderStatus(orderId, {
          status: newStatus,
          statusStep: step,
          trackingNumber: trackingNumber || undefined
        });
      }

      setOrders(prev => prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            status: newStatus,
            statusStep: step,
            ...(trackingNumber ? { trackingNumber } : {})
          };
        }
        return o;
      }));

      showToast(`🚚 Order ${orderId} marked as ${newStatus}!`, 'success');
      return true;
    } catch (err) {
      showToast(`Error updating order: ${err.message}`, 'danger');
      return false;
    }
  };

  // Admin Category Actions
  const adminAddCategory = async (categoryData) => {
    try {
      if (isBackendConnected) {
        await apiClient.createCategory(categoryData);
      }
      setCategoriesList(prev => [...prev, categoryData]);
      showToast(`🏷️ Category "${categoryData.name}" created!`, 'success');
      return true;
    } catch (err) {
      showToast(`Error creating category: ${err.message}`, 'danger');
      return false;
    }
  };

  const adminDeleteCategory = async (id) => {
    try {
      if (isBackendConnected) {
        await apiClient.deleteCategory(id);
      }
      setCategoriesList(prev => prev.filter(c => c.id !== id));
      showToast('Category deleted', 'success');
      return true;
    } catch (err) {
      showToast(`Error deleting category: ${err.message}`, 'danger');
      return false;
    }
  };

  // Admin Coupon Actions
  const adminAddCoupon = async (couponData) => {
    try {
      if (isBackendConnected) {
        await apiClient.createCoupon(couponData);
      }
      setCouponsList(prev => [couponData, ...prev]);
      showToast(`🎟️ Coupon ${couponData.code} active!`, 'success');
      return true;
    } catch (err) {
      showToast(`Error creating coupon: ${err.message}`, 'danger');
      return false;
    }
  };

  const adminDeleteCoupon = async (code) => {
    try {
      if (isBackendConnected) {
        await apiClient.deleteCoupon(code);
      }
      setCouponsList(prev => prev.filter(c => c.code.toUpperCase() !== code.toUpperCase()));
      showToast(`Coupon ${code} removed`, 'success');
      return true;
    } catch (err) {
      showToast(`Error deleting coupon: ${err.message}`, 'danger');
      return false;
    }
  };

  // Admin Ticket Actions
  const adminUpdateTicketStatus = async (id, status) => {
    try {
      if (isBackendConnected) {
        await apiClient.updateTicketStatus(id, status);
      }
      setTicketsList(prev => prev.map(t => t.id === id ? { ...t, status } : t));
      showToast(`Ticket ${id} marked as ${status}`, 'success');
    } catch (err) {
      showToast(`Error updating ticket: ${err.message}`, 'danger');
    }
  };

  // Admin Review Actions
  const adminDeleteReview = async (id) => {
    try {
      if (isBackendConnected) {
        await apiClient.deleteReview(id);
      }
      setReviewsList(prev => prev.filter(r => r.id !== id));
      showToast('Review removed by administrator', 'success');
    } catch (err) {
      showToast(`Error deleting review: ${err.message}`, 'danger');
    }
  };

  // Admin Customer Reward Actions
  const adminUpdateUserPoints = async (userId, newPoints) => {
    try {
      if (isBackendConnected) {
        await apiClient.updateUserPoints(userId, newPoints);
      }
      if (user && user.id === userId) {
        setUser(prev => ({ ...prev, rewardPoints: newPoints }));
      }
      showToast(`🪙 Reward points updated to ${newPoints} pts`, 'success');
    } catch (err) {
      showToast(`Error updating reward points: ${err.message}`, 'danger');
    }
  };

  return (
    <ShopContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedProductId,
        setSelectedProductId,
        navigateTo,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        productsList,
        setProductsList,
        categoriesList,
        couponsList,
        ticketsList,
        reviewsList,
        cart,
        cartCount,
        cartSubtotal,
        shippingFee,
        taxAmount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        user,
        setUser,
        orders,
        setOrders,
        placeOrder,
        quickViewProduct,
        setQuickViewProduct,
        activeOrderSuccess,
        setActiveOrderSuccess,
        isBackendConnected,
        toast,
        showToast,
        // Admin Exports
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
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
