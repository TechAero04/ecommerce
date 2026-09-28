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

    // ------------------------------------------------------------------
    // 10. Admin Stats & Analytics API
    // ------------------------------------------------------------------
    if (pathname === '/api/admin/stats' && method === 'GET') {
      const totalRevenueRow = db.prepare("SELECT COALESCE(SUM(total), 0) AS totalRevenue FROM orders WHERE status != 'Cancelled'").get();
      const totalOrdersRow = db.prepare("SELECT COUNT(*) AS totalOrders FROM orders").get();
      const totalProductsRow = db.prepare("SELECT COUNT(*) AS totalProducts FROM products").get();
      const totalUsersRow = db.prepare("SELECT COUNT(*) AS totalUsers FROM users").get();
      const lowStockRow = db.prepare("SELECT COUNT(*) AS lowStockCount FROM products WHERE stock <= 10").get();
      const openTicketsRow = db.prepare("SELECT COUNT(*) AS openTicketsCount FROM support_tickets WHERE status != 'Resolved'").get();

      const categoryBreakdown = db.prepare(`
        SELECT category, COUNT(*) as productCount, AVG(price) as avgPrice
        FROM products
        GROUP BY category
      `).all();

      const ordersByStatus = db.prepare(`
        SELECT status, COUNT(*) as count, COALESCE(SUM(total), 0) as totalValue
        FROM orders
        GROUP BY status
      `).all();

      const recentOrders = db.prepare("SELECT * FROM orders ORDER BY created_at DESC LIMIT 5").all().map(o => ({
        ...o,
        items: JSON.parse(o.items_json || '[]')
      }));

      return sendJSON(res, {
        totalRevenue: totalRevenueRow.totalRevenue,
        totalOrders: totalOrdersRow.totalOrders,
        totalProducts: totalProductsRow.totalProducts,
        totalUsers: totalUsersRow.totalUsers,
        lowStockCount: lowStockRow.lowStockCount,
        openTicketsCount: openTicketsRow.openTicketsCount,
        categoryBreakdown,
        ordersByStatus,
        recentOrders
      });
    }

    // ------------------------------------------------------------------
    // 11. Admin Products API (CRUD)
    // ------------------------------------------------------------------
    if (pathname === '/api/admin/products' && method === 'POST') {
      const body = await getRequestBody(req);
      const id = body.id || `prod-${Date.now()}`;
      let sku = body.sku || `VEL-${(body.category || 'GEN').substring(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

      // Check if SKU exists, append random suffix if needed
      const existingSku = db.prepare('SELECT id FROM products WHERE sku = ?').get(sku);
      if (existingSku && existingSku.id !== id) {
        sku = `${sku}-${Math.floor(10 + Math.random() * 90)}`;
      }

      const stmt = db.prepare(`
        INSERT OR REPLACE INTO products (
          id, name, category, price, originalPrice, discount, rating, reviewCount,
          isNew, isTrending, stock, sku, image, images_json, description,
          details_json, sizes_json, colors_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        id,
        body.name,
        body.category || 'fashion',
        Number(body.price),
        Number(body.originalPrice || body.price),
        body.discount || null,
        Number(body.rating || 5.0),
        Number(body.reviewCount || 0),
        body.isNew ? 1 : 0,
        body.isTrending ? 1 : 0,
        Number(body.stock || 10),
        sku,
        body.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        JSON.stringify(body.images || [body.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80']),
        body.description || '',
        JSON.stringify(body.details || []),
        JSON.stringify(body.sizes || ['Standard']),
        JSON.stringify(body.colors || [])
      );

      const created = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
      return sendJSON(res, {
        ...created,
        isNew: Boolean(created.isNew),
        isTrending: Boolean(created.isTrending),
        images: JSON.parse(created.images_json || '[]'),
        details: JSON.parse(created.details_json || '[]'),
        sizes: JSON.parse(created.sizes_json || '[]'),
        colors: JSON.parse(created.colors_json || '[]')
      }, 201);
    }

    if (pathname.startsWith('/api/admin/products/') && method === 'PUT') {
      const id = pathname.replace('/api/admin/products/', '');
      const body = await getRequestBody(req);

      const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
      if (!existing) {
        return sendJSON(res, { error: 'Product not found' }, 404);
      }

      const stmt = db.prepare(`
        UPDATE products SET
          name = COALESCE(?, name),
          category = COALESCE(?, category),
          price = COALESCE(?, price),
          originalPrice = COALESCE(?, originalPrice),
          discount = COALESCE(?, discount),
          isNew = COALESCE(?, isNew),
          isTrending = COALESCE(?, isTrending),
          stock = COALESCE(?, stock),
          sku = COALESCE(?, sku),
          image = COALESCE(?, image),
          description = COALESCE(?, description)
        WHERE id = ?
      `);

      stmt.run(
        body.name !== undefined ? body.name : null,
        body.category !== undefined ? body.category : null,
        body.price !== undefined ? Number(body.price) : null,
        body.originalPrice !== undefined ? Number(body.originalPrice) : null,
        body.discount !== undefined ? body.discount : null,
        body.isNew !== undefined ? (body.isNew ? 1 : 0) : null,
        body.isTrending !== undefined ? (body.isTrending ? 1 : 0) : null,
        body.stock !== undefined ? Number(body.stock) : null,
        body.sku !== undefined ? body.sku : null,
        body.image !== undefined ? body.image : null,
        body.description !== undefined ? body.description : null,
        id
      );

      const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
      return sendJSON(res, {
        ...updated,
        isNew: Boolean(updated.isNew),
        isTrending: Boolean(updated.isTrending),
        images: JSON.parse(updated.images_json || '[]'),
        details: JSON.parse(updated.details_json || '[]'),
        sizes: JSON.parse(updated.sizes_json || '[]'),
        colors: JSON.parse(updated.colors_json || '[]')
      });
    }

    if (pathname.startsWith('/api/admin/products/') && method === 'DELETE') {
      const id = pathname.replace('/api/admin/products/', '');
      const stmt = db.prepare('DELETE FROM products WHERE id = ?');
      const info = stmt.run(id);

      if (info.changes === 0) {
        return sendJSON(res, { error: 'Product not found' }, 404);
      }
      return sendJSON(res, { success: true, message: `Product ${id} deleted successfully` });
    }

    if (pathname.startsWith('/api/admin/products/') && pathname.endsWith('/stock') && method === 'PATCH') {
      const id = pathname.replace('/api/admin/products/', '').replace('/stock', '');
      const body = await getRequestBody(req);
      const newStock = Number(body.stock);

      const stmt = db.prepare('UPDATE products SET stock = ? WHERE id = ?');
      stmt.run(newStock, id);

      return sendJSON(res, { success: true, id, stock: newStock });
    }

    // ------------------------------------------------------------------
    // 12. Admin Orders API
    // ------------------------------------------------------------------
    if (pathname === '/api/admin/orders' && method === 'GET') {
      const stmt = db.prepare(`
        SELECT orders.*, users.name as customerName, users.email as customerEmail
        FROM orders
        LEFT JOIN users ON orders.userId = users.id
        ORDER BY orders.created_at DESC
      `);
      const rows = stmt.all();

      const orders = rows.map(o => ({
        ...o,
        items: JSON.parse(o.items_json || '[]')
      }));

      return sendJSON(res, orders);
    }

    if (pathname.startsWith('/api/admin/orders/') && pathname.endsWith('/status') && method === 'PUT') {
      const id = pathname.replace('/api/admin/orders/', '').replace('/status', '');
      const body = await getRequestBody(req);
      const { status, statusStep, trackingNumber } = body;

      const stmt = db.prepare(`
        UPDATE orders SET
          status = COALESCE(?, status),
          statusStep = COALESCE(?, statusStep),
          trackingNumber = COALESCE(?, trackingNumber)
        WHERE id = ?
      `);

      stmt.run(
        status !== undefined ? status : null,
        statusStep !== undefined ? Number(statusStep) : null,
        trackingNumber !== undefined ? trackingNumber : null,
        id
      );

      const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
      if (!updated) return sendJSON(res, { error: 'Order not found' }, 404);

      return sendJSON(res, {
        ...updated,
        items: JSON.parse(updated.items_json || '[]')
      });
    }

    // ------------------------------------------------------------------
    // 13. Admin Users / Customers API
    // ------------------------------------------------------------------
    if (pathname === '/api/admin/users' && method === 'GET') {
      const stmt = db.prepare(`
        SELECT 
          users.*,
          COUNT(DISTINCT orders.id) as totalOrders,
          COALESCE(SUM(orders.total), 0) as totalSpent,
          COUNT(DISTINCT addresses.id) as addressCount
        FROM users
        LEFT JOIN orders ON users.id = orders.userId
        LEFT JOIN addresses ON users.id = addresses.userId
        GROUP BY users.id
      `);
      const users = stmt.all();
      return sendJSON(res, users);
    }

    if (pathname.startsWith('/api/admin/users/') && pathname.endsWith('/points') && method === 'PUT') {
      const id = pathname.replace('/api/admin/users/', '').replace('/points', '');
      const body = await getRequestBody(req);
      const points = Number(body.points);

      const stmt = db.prepare('UPDATE users SET rewardPoints = ? WHERE id = ?');
      stmt.run(points, id);

      return sendJSON(res, { success: true, id, rewardPoints: points });
    }

    // ------------------------------------------------------------------
    // 14. Admin Categories API
    // ------------------------------------------------------------------
    if (pathname === '/api/admin/categories' && method === 'POST') {
      const body = await getRequestBody(req);
      const { id, name, icon } = body;

      const stmt = db.prepare('INSERT OR REPLACE INTO categories (id, name, icon) VALUES (?, ?, ?)');
      stmt.run(id, name, icon || 'ShoppingBag');

      return sendJSON(res, { success: true, category: { id, name, icon: icon || 'ShoppingBag' } }, 201);
    }

    if (pathname.startsWith('/api/admin/categories/') && method === 'DELETE') {
      const id = pathname.replace('/api/admin/categories/', '');
      const stmt = db.prepare('DELETE FROM categories WHERE id = ?');
      stmt.run(id);

      return sendJSON(res, { success: true, message: `Category ${id} removed` });
    }

    // ------------------------------------------------------------------
    // 15. Admin Coupons API
    // ------------------------------------------------------------------
    if (pathname === '/api/admin/coupons' && method === 'GET') {
      const stmt = db.prepare('SELECT * FROM coupons');
      return sendJSON(res, stmt.all());
    }

    if (pathname === '/api/admin/coupons' && method === 'POST') {
      const body = await getRequestBody(req);
      const { code, discountPercent, minSpend, description } = body;

      const stmt = db.prepare('INSERT OR REPLACE INTO coupons (code, discountPercent, minSpend, description) VALUES (?, ?, ?, ?)');
      stmt.run(code.toUpperCase(), Number(discountPercent), Number(minSpend || 0), description || '');

      return sendJSON(res, { success: true, coupon: { code: code.toUpperCase(), discountPercent, minSpend, description } }, 201);
    }

    if (pathname.startsWith('/api/admin/coupons/') && method === 'DELETE') {
      const code = pathname.replace('/api/admin/coupons/', '');
      const stmt = db.prepare('DELETE FROM coupons WHERE UPPER(code) = UPPER(?)');
      stmt.run(code);

      return sendJSON(res, { success: true, message: `Coupon ${code} removed` });
    }

    // ------------------------------------------------------------------
    // 16. Admin Support Tickets API
    // ------------------------------------------------------------------
    if (pathname === '/api/admin/tickets' && method === 'GET') {
      const stmt = db.prepare('SELECT * FROM support_tickets ORDER BY created_at DESC');
      return sendJSON(res, stmt.all());
    }

    if (pathname.startsWith('/api/admin/tickets/') && pathname.endsWith('/status') && method === 'PUT') {
      const id = pathname.replace('/api/admin/tickets/', '').replace('/status', '');
      const body = await getRequestBody(req);
      const { status } = body;

      const stmt = db.prepare('UPDATE support_tickets SET status = ? WHERE id = ?');
      stmt.run(status, id);

      return sendJSON(res, { success: true, id, status });
    }

    // ------------------------------------------------------------------
    // 17. Admin Reviews Moderation API
    // ------------------------------------------------------------------
    if (pathname === '/api/admin/reviews' && method === 'GET') {
      const stmt = db.prepare(`
        SELECT reviews.*, products.name as productName, products.image as productImage
        FROM reviews
        LEFT JOIN products ON reviews.productId = products.id
        ORDER BY reviews.id DESC
      `);
      return sendJSON(res, stmt.all());
    }

    if (pathname.startsWith('/api/admin/reviews/') && method === 'DELETE') {
      const id = pathname.replace('/api/admin/reviews/', '');
      const stmt = db.prepare('DELETE FROM reviews WHERE id = ?');
      stmt.run(id);

      return sendJSON(res, { success: true, message: `Review ${id} deleted` });
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
