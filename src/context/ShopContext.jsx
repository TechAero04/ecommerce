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
        placeOrder,
        quickViewProduct,
        setQuickViewProduct,
        activeOrderSuccess,
        setActiveOrderSuccess,
        isBackendConnected,
        toast,
        showToast
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
