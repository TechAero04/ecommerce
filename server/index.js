import http from 'node:http';
import { URL } from 'node:url';
import db, { initDatabase } from './db.js';

initDatabase();

const PORT = 5000;

// CORS headers helper
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// JSON response helper
function sendJSON(res, data, statusCode = 200) {
  setCorsHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// Request Body Parser helper
function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const reqUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = reqUrl.pathname;
  const method = req.method;

  try {
    // ------------------------------------------------------------------
    // 1. Health & Status
    // ------------------------------------------------------------------
    if (pathname === '/api/health' && method === 'GET') {
      return sendJSON(res, { status: 'ok', server: 'Velmora Node.js SQLite API Engine v2.0' });
    }

    // ------------------------------------------------------------------
    // 2. Categories API
    // ------------------------------------------------------------------
    if (pathname === '/api/categories' && method === 'GET') {
      const stmt = db.prepare('SELECT * FROM categories');
      const categories = stmt.all();
      return sendJSON(res, categories);
    }

    // ------------------------------------------------------------------
    // 3. Products API (Filtering & Catalog)
    // ------------------------------------------------------------------
    if (pathname === '/api/products' && method === 'GET') {
      const category = reqUrl.searchParams.get('category');
      const search = reqUrl.searchParams.get('search');
      const maxPrice = reqUrl.searchParams.get('maxPrice');
      const sortBy = reqUrl.searchParams.get('sortBy');

      let query = 'SELECT * FROM products WHERE 1=1';
      const params = [];

      if (category && category !== 'all') {
        query += ' AND category = ?';
        params.push(category);
      }

      if (search) {
        query += ' AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ?)';
        params.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`);
      }

      if (maxPrice) {
        query += ' AND price <= ?';
        params.push(Number(maxPrice));
      }

      if (sortBy === 'low-high') {
        query += ' ORDER BY price ASC';
      } else if (sortBy === 'high-low') {
        query += ' ORDER BY price DESC';
      } else if (sortBy === 'rating') {
        query += ' ORDER BY rating DESC';
      } else {
        query += ' ORDER BY isTrending DESC, rating DESC';
      }

      const stmt = db.prepare(query);
      const rows = stmt.all(...params);

      // Deserialize JSON fields
      const products = rows.map(p => ({
        ...p,
        isNew: Boolean(p.isNew),
        isTrending: Boolean(p.isTrending),
        images: JSON.parse(p.images_json || '[]'),
        details: JSON.parse(p.details_json || '[]'),
        sizes: JSON.parse(p.sizes_json || '[]'),
        colors: JSON.parse(p.colors_json || '[]')
      }));

      return sendJSON(res, products);
    }

    // ------------------------------------------------------------------
    // 4. Product Detail by ID
    // ------------------------------------------------------------------
    if (pathname.startsWith('/api/products/') && method === 'GET') {
      const productId = pathname.replace('/api/products/', '');
      const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
      const p = stmt.get(productId);

      if (!p) {
        return sendJSON(res, { error: 'Product not found' }, 404);
      }

      const product = {
        ...p,
        isNew: Boolean(p.isNew),
        isTrending: Boolean(p.isTrending),
        images: JSON.parse(p.images_json || '[]'),
        details: JSON.parse(p.details_json || '[]'),
        sizes: JSON.parse(p.sizes_json || '[]'),
        colors: JSON.parse(p.colors_json || '[]')
      };

      return sendJSON(res, product);
    }

    // ------------------------------------------------------------------
    // 5. Auth API (Login & Register)
    // ------------------------------------------------------------------
    if (pathname === '/api/auth/login' && method === 'POST') {
      const body = await getRequestBody(req);
      const { email, password } = body;

      const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
      const user = stmt.get(email);

      if (!user) {
        return sendJSON(res, { error: 'Invalid email or password' }, 401);
      }

      // Fetch user addresses
      const addrStmt = db.prepare('SELECT * FROM addresses WHERE userId = ?');
      const addresses = addrStmt.all(user.id).map(a => ({ ...a, isDefault: Boolean(a.isDefault) }));

      return sendJSON(res, {
        token: `token-${Date.now()}`,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          memberSince: user.memberSince,
          rewardPoints: user.rewardPoints,
          addresses: addresses
        }
      });
    }

    if (pathname === '/api/auth/register' && method === 'POST') {
      const body = await getRequestBody(req);
      const { name, email, password, phone } = body;

      const userId = `usr-${Date.now()}`;
      const memberSince = 'September 2026';
      const avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';

      const stmt = db.prepare(`
        INSERT INTO users (id, name, email, password, phone, avatar, memberSince, rewardPoints)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1000)
      `);

      stmt.run(userId, name, email, password, phone || '+91 98765 43210', avatar, memberSince);

      return sendJSON(res, {
        token: `token-${Date.now()}`,
        user: {
          id: userId,
          name,
          email,
          phone: phone || '+91 98765 43210',
          avatar,
          memberSince,
          rewardPoints: 1000,
          addresses: []
        }
      });
    }

    // ------------------------------------------------------------------
    // 6. User Profile & Addresses
    // ------------------------------------------------------------------
    if (pathname === '/api/user/profile' && method === 'GET') {
      const stmt = db.prepare('SELECT * FROM users LIMIT 1');
      const user = stmt.get();

      if (!user) return sendJSON(res, { error: 'No user found' }, 404);

      const addrStmt = db.prepare('SELECT * FROM addresses WHERE userId = ?');
      const addresses = addrStmt.all(user.id).map(a => ({ ...a, isDefault: Boolean(a.isDefault) }));

      return sendJSON(res, {
        ...user,
        addresses
      });
    }

    if (pathname === '/api/user/addresses' && method === 'POST') {
      const body = await getRequestBody(req);
      const { userId, label, name, street, city, state, pincode, phone } = body;

      const addrId = `addr-${Date.now()}`;
      const stmt = db.prepare(`
        INSERT INTO addresses (id, userId, label, isDefault, name, street, city, state, pincode, phone)
        VALUES (?, ?, ?, 0, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(addrId, userId || 'usr-default-001', label || 'Home', name, street, city, state, pincode, phone);

      return sendJSON(res, { success: true, id: addrId });
    }

    // ------------------------------------------------------------------
    // 7. Orders API (Create & List Orders)
    // ------------------------------------------------------------------
    if (pathname === '/api/orders' && method === 'GET') {
      const stmt = db.prepare('SELECT * FROM orders ORDER BY created_at DESC');
      const rows = stmt.all();

      const orders = rows.map(o => ({
        ...o,
        items: JSON.parse(o.items_json || '[]')
      }));

      return sendJSON(res, orders);
    }

    if (pathname === '/api/orders' && method === 'POST') {
      const body = await getRequestBody(req);
      const { userId, items, total, paymentMethod, shippingAddress } = body;

      const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
      const date = new Date().toISOString().split('T')[0];
      const trackingNumber = `VEL-TRK${Math.floor(100000 + Math.random() * 900000)}`;

      const stmt = db.prepare(`
        INSERT INTO orders (id, userId, date, total, status, statusStep, paymentMethod, shippingAddress, trackingNumber, items_json)
        VALUES (?, ?, ?, ?, 'Processing', 1, ?, ?, ?, ?)
      `);

      stmt.run(
        orderId,
        userId || 'usr-default-001',
        date,
        total,
        paymentMethod,
        shippingAddress,
        trackingNumber,
        JSON.stringify(items || [])
      );

      const newOrder = {
        id: orderId,
        userId: userId || 'usr-default-001',
        date,
        total,
        status: 'Processing',
        statusStep: 1,
        paymentMethod,
        shippingAddress,
        trackingNumber,
        items
      };

      return sendJSON(res, newOrder, 201);
    }

    // ------------------------------------------------------------------
    // 8. Coupon Validation API
    // ------------------------------------------------------------------
    if (pathname === '/api/coupons/validate' && method === 'POST') {
      const body = await getRequestBody(req);
      const { code, cartSubtotal } = body;

      const stmt = db.prepare('SELECT * FROM coupons WHERE UPPER(code) = UPPER(?)');
      const coupon = stmt.get(code || '');

      if (!coupon) {
        return sendJSON(res, { valid: false, message: 'Invalid promo coupon code.' }, 404);
      }

      if (cartSubtotal < coupon.minSpend) {
        return sendJSON(res, {
          valid: false,
          message: `Minimum subtotal of ₹${coupon.minSpend} required for code ${coupon.code}`
        }, 400);
      }

      return sendJSON(res, { valid: true, coupon });
    }

    // ------------------------------------------------------------------
    // 9. Support Tickets API
    // ------------------------------------------------------------------
    if (pathname === '/api/support/tickets' && method === 'POST') {
      const body = await getRequestBody(req);
      const { name, email, subject, message } = body;

      const ticketId = `TKT-${Math.floor(10000 + Math.random() * 90000)}`;
      const stmt = db.prepare(`
        INSERT INTO support_tickets (id, name, email, subject, message)
        VALUES (?, ?, ?, ?, ?)
      `);

      stmt.run(ticketId, name, email, subject, message);

      return sendJSON(res, { success: true, ticketId }, 201);
    }

    // Route Not Found
    return sendJSON(res, { error: 'Route not found' }, 404);

  } catch (err) {
    console.error('API Error:', err);
    return sendJSON(res, { error: 'Internal Server Error', details: err.message }, 500);
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Velmora Node.js REST API Server running live at http://localhost:${PORT}/api/health`);
});
