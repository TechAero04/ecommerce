import db, { initDatabase } from './db.js';
import { CATEGORIES, PRODUCTS, MOCK_USER, MOCK_REVIEWS, MOCK_ORDERS, MOCK_COUPONS } from '../src/data/mockData.js';

export function seedData() {
  initDatabase();

  // Seed Categories
  const insertCat = db.prepare('INSERT OR REPLACE INTO categories (id, name, icon) VALUES (?, ?, ?)');
  CATEGORIES.forEach(c => insertCat.run(c.id, c.name, c.icon));

  // Seed Products
  const insertProd = db.prepare(`
    INSERT OR REPLACE INTO products (
      id, name, category, price, originalPrice, discount, rating, reviewCount, 
      isNew, isTrending, stock, sku, image, images_json, description, 
      details_json, sizes_json, colors_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  PRODUCTS.forEach(p => {
    insertProd.run(
      p.id,
      p.name,
      p.category,
      p.price,
      p.originalPrice,
      p.discount || null,
      p.rating,
      p.reviewCount,
      p.isNew ? 1 : 0,
      p.isTrending ? 1 : 0,
      p.stock,
      p.sku,
      p.image,
      JSON.stringify(p.images || [p.image]),
      p.description,
      JSON.stringify(p.details || []),
      JSON.stringify(p.sizes || []),
      JSON.stringify(p.colors || [])
    );
  });

  // Seed Default User
  const insertUser = db.prepare(`
    INSERT OR REPLACE INTO users (id, name, email, password, phone, avatar, memberSince, rewardPoints)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const userId = 'usr-default-001';
  insertUser.run(
    userId,
    MOCK_USER.name,
    MOCK_USER.email,
    'password123', // Demo password
    MOCK_USER.phone,
    MOCK_USER.avatar,
    MOCK_USER.memberSince,
    MOCK_USER.rewardPoints
  );

  // Seed Addresses
  const insertAddr = db.prepare(`
    INSERT OR REPLACE INTO addresses (id, userId, label, isDefault, name, street, city, state, pincode, phone)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  MOCK_USER.addresses.forEach(a => {
    insertAddr.run(a.id, userId, a.label, a.isDefault ? 1 : 0, a.name, a.street, a.city, a.state, a.pincode, a.phone);
  });

  // Seed Coupons
  const insertCoupon = db.prepare(`
    INSERT OR REPLACE INTO coupons (code, discountPercent, minSpend, description)
    VALUES (?, ?, ?, ?)
  `);
  MOCK_COUPONS.forEach(c => insertCoupon.run(c.code, c.discountPercent, c.minSpend, c.description));

  // Seed Reviews
  const insertReview = db.prepare(`
    INSERT OR REPLACE INTO reviews (id, productId, author, avatar, rating, date, verified, comment)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  MOCK_REVIEWS.forEach((r, idx) => {
    insertReview.run(r.id, 'prod-1', r.author, r.avatar, r.rating, r.date, r.verified ? 1 : 0, r.comment);
  });

  // Seed Orders
  const insertOrder = db.prepare(`
    INSERT OR REPLACE INTO orders (id, userId, date, total, status, statusStep, paymentMethod, shippingAddress, trackingNumber, items_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  MOCK_ORDERS.forEach(o => {
    insertOrder.run(
      o.id,
      userId,
      o.date,
      o.total,
      o.status,
      o.statusStep,
      o.paymentMethod,
      o.shippingAddress,
      o.trackingNumber,
      JSON.stringify(o.items)
    );
  });

  console.log('✅ SQLite Database velmora.db seeded with products, categories, users, orders & coupons!');
}

// Run direct execution if called from command line
seedData();
