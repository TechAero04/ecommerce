const API_BASE_URL = 'http://localhost:5000/api';

export const apiClient = {
  // Check backend server status
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return res.ok;
    } catch {
      return false;
    }
  },

  // Fetch Products Catalog from SQLite DB
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.maxPrice) query.append('maxPrice', params.maxPrice);
    if (params.sortBy) query.append('sortBy', params.sortBy);

    const res = await fetch(`${API_BASE_URL}/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  // Fetch Product Details
  async getProductById(id) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  },

  // Fetch Categories List
  async getCategories() {
    const res = await fetch(`${API_BASE_URL}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  // User Auth APIs
  async login(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  async register(userData) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  // Orders API
  async getOrders() {
    const res = await fetch(`${API_BASE_URL}/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  async createOrder(orderPayload) {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Order placement failed');
    return data;
  },

  // Coupon Validation API
  async validateCoupon(code, cartSubtotal) {
    const res = await fetch(`${API_BASE_URL}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, cartSubtotal })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Coupon validation failed');
    return data;
  },

  // Support Ticket API
  async submitTicket(ticketData) {
    const res = await fetch(`${API_BASE_URL}/support/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ticket submission failed');
    return data;
  },

  // User Profile & Address APIs
  async getProfile() {
    const res = await fetch(`${API_BASE_URL}/user/profile`);
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  async addAddress(addressData) {
    const res = await fetch(`${API_BASE_URL}/user/addresses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addressData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error('Failed to save address');
    return data;
  },

  // ==================================================================
  // Admin Dashboard API Client Methods (Milestone 3 Deliverables)
  // ==================================================================
  async adminLogin(username, password) {
    const res = await fetch(`${API_BASE_URL}/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Admin authentication failed');
    return data;
  },

  async getAdminStats() {
    const res = await fetch(`${API_BASE_URL}/admin/stats`);
    if (!res.ok) throw new Error('Failed to fetch admin statistics');
    return res.json();
  },

  async createProduct(productData) {
    const res = await fetch(`${API_BASE_URL}/admin/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create product');
    return data;
  },

  async updateProduct(id, productData) {
    const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update product');
    return data;
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete product');
    return data;
  },

  async updateProductStock(id, stock) {
    const res = await fetch(`${API_BASE_URL}/admin/products/${id}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update stock');
    return data;
  },

  async getAdminOrders() {
    const res = await fetch(`${API_BASE_URL}/admin/orders`);
    if (!res.ok) throw new Error('Failed to fetch admin orders');
    return res.json();
  },

  async updateOrderStatus(id, statusData) {
    const res = await fetch(`${API_BASE_URL}/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(statusData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update order status');
    return data;
  },

  async getAdminUsers() {
    const res = await fetch(`${API_BASE_URL}/admin/users`);
    if (!res.ok) throw new Error('Failed to fetch admin users');
    return res.json();
  },

  async updateUserPoints(id, points) {
    const res = await fetch(`${API_BASE_URL}/admin/users/${id}/points`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update user reward points');
    return data;
  },

  async createCategory(categoryData) {
    const res = await fetch(`${API_BASE_URL}/admin/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create category');
    return data;
  },

  async deleteCategory(id) {
    const res = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete category');
    return data;
  },

  async getAdminCoupons() {
    const res = await fetch(`${API_BASE_URL}/admin/coupons`);
    if (!res.ok) throw new Error('Failed to fetch coupons');
    return res.json();
  },

  async createCoupon(couponData) {
    const res = await fetch(`${API_BASE_URL}/admin/coupons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(couponData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create coupon');
    return data;
  },

  async deleteCoupon(code) {
    const res = await fetch(`${API_BASE_URL}/admin/coupons/${code}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete coupon');
    return data;
  },

  async getAdminTickets() {
    const res = await fetch(`${API_BASE_URL}/admin/tickets`);
    if (!res.ok) throw new Error('Failed to fetch support tickets');
    return res.json();
  },

  async updateTicketStatus(id, status) {
    const res = await fetch(`${API_BASE_URL}/admin/tickets/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update ticket status');
    return data;
  },

  async getAdminReviews() {
    const res = await fetch(`${API_BASE_URL}/admin/reviews`);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return res.json();
  },

  async deleteReview(id) {
    const res = await fetch(`${API_BASE_URL}/admin/reviews/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete review');
    return data;
  }
};
