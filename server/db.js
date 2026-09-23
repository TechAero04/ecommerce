import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'velmora.db');
const db = new DatabaseSync(dbPath);

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON;');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price INTEGER NOT NULL,
      originalPrice INTEGER NOT NULL,
      discount TEXT,
      rating REAL DEFAULT 5.0,
      reviewCount INTEGER DEFAULT 0,
      isNew INTEGER DEFAULT 0,
      isTrending INTEGER DEFAULT 0,
      stock INTEGER DEFAULT 10,
      sku TEXT UNIQUE NOT NULL,
      image TEXT NOT NULL,
      images_json TEXT NOT NULL,
      description TEXT NOT NULL,
      details_json TEXT NOT NULL,
      sizes_json TEXT NOT NULL,
      colors_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      avatar TEXT,
      memberSince TEXT,
      rewardPoints INTEGER DEFAULT 1000
    );

    CREATE TABLE IF NOT EXISTS addresses (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      label TEXT DEFAULT 'Home',
      isDefault INTEGER DEFAULT 0,
      name TEXT NOT NULL,
      street TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      pincode TEXT NOT NULL,
      phone TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      date TEXT NOT NULL,
      total INTEGER NOT NULL,
      status TEXT NOT NULL,
      statusStep INTEGER DEFAULT 1,
      paymentMethod TEXT NOT NULL,
      shippingAddress TEXT NOT NULL,
      trackingNumber TEXT NOT NULL,
      items_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      productId TEXT NOT NULL,
      author TEXT NOT NULL,
      avatar TEXT NOT NULL,
      rating INTEGER NOT NULL,
      date TEXT NOT NULL,
      verified INTEGER DEFAULT 1,
      comment TEXT NOT NULL,
      FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS coupons (
      code TEXT PRIMARY KEY,
      discountPercent INTEGER NOT NULL,
      minSpend INTEGER NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS support_tickets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'Open',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('Database tables initialized successfully in server/velmora.db');
}

export default db;
