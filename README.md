# Velmora — Premier D2C E-Commerce Platform (Milestone 1, 2 & 3 Completed)

![Velmora E-Commerce](https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80)

Velmora is a state-of-the-art D2C (Direct-to-Consumer) marketplace celebrating authentic handcrafted fashion, Sheesham woodwork, audiophile technology, organic Kashmiri spices, and Ayurvedic wellness.

---

## 🌟 Milestones Deliverables

### Milestone 1: UI & Frontend Development (10 Core Storefront Views)
- 🏠 **Homepage**: Hero slider banner, curated category grid, flash deals, artisan stories, customer reviews.
- 🛍️ **Product Listing / Shop Page**: Category filter sidebar, price range slider (₹1,000–₹10,000), sorting (Price, Rating, Popularity), grid vs list view.
- 🔍 **Product Details Page**: Multi-thumbnail gallery with zoom, variant swatches (Color & Size), stock indicator, tabbed specs & reviews.
- 🛒 **Cart Page & Slide-Out Drawer**: Item table, coupon discount application (`FESTIVE20`, `VELMORA10`), free delivery progress meter.
- 💳 **Express Checkout**: Multi-step shipping details, payment options (Instant UPI, Cards, NetBanking, COD), and order completion modal.
- 🔑 **Login / Signup Modal & Page**: Dual-tabbed authentication forms with password toggle and fast social logins.
- 📊 **User Dashboard**: Account metrics overview (Orders, Wishlist, Velmora Coins, Addresses), recent activity feed.
- 📦 **Order History & Live Tracking**: Multi-step shipment tracking timeline, tax invoice generator, and re-order buttons.
- ⚙️ **Profile & Settings Page**: Personal information editor, saved address manager (Add/Edit/Delete).
- 💬 **Help Center & AI Chat**: Searchable FAQ accordion, support ticket submission form, and floating AI support chat assistant.

### Milestone 2: Backend REST API & SQLite Database Engine
- **Engine**: Node.js HTTP REST Engine with native SQLite (`node:sqlite` DatabaseSync)
- **Database File**: `server/velmora.db` (Normalized schemas for products, categories, users, addresses, orders, reviews, coupons, support tickets)
- **Seed Script**: `npm run seed` to reset and initialize test database.
- **Health Check**: `GET http://localhost:5000/api/health`

### Milestone 3: Executive Admin Dashboard (Active Deliverable)
- 📊 **Dashboard Overview**: Real-time sales KPI metrics (Total Revenue, Total Orders, Active Catalog Items, VIP Shoppers), category sales distribution, and order status fulfillment funnel.
- 🛍️ **Product Catalog Management (CRUD)**: Search & filter catalog by category and stock, Add New Product modal with SKU and pricing, Edit product, Delete product with confirmation, and quick inline stock adjusters (+ / -).
- 📦 **Order Fulfillment & Shipment Tracking**: Live order list, interactive status selector (Processing, In Transit, Delivered, Cancelled) that immediately syncs with the customer tracking timeline, tracking number editor, and detailed Tax Invoice & line item drawer.
- 👥 **Customer & VIP Directory**: Customer spend tracking, address book inspector, and Velmora Coin loyalty reward bonus awarder (+250 points).
- 🏷️ **Categories Taxonomy**: View and manage product categories with active product count counters and create category modal.
- 🎟️ **Coupons & Discount Engine**: View active promo coupons (`VELMORA10`, `FESTIVE20`), create custom promo codes with discount percentage and minimum spend criteria.
- 🎧 **Support Desk**: Manage buyer inquiries, prioritize tickets, and update resolution status (Open, In Progress, Resolved).
- ⭐ **Reviews Moderation**: Inspect buyer feedback, star ratings, and remove spam reviews.
- ⚡ **Seamless Storefront / Admin Toggling**: Direct access buttons from header bar, navbar, and back to storefront.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19 + Vite 6
- **Backend**: Node.js 22 + SQLite Database (`node:sqlite`)
- **Styling System**: Custom Vanilla CSS Tokens (`src/index.css`) with Glassmorphism, Google Fonts (`Outfit` & `Plus Jakarta Sans`), and Responsive Breakpoints
- **Icons**: Lucide React (`lucide-react`)
- **State Management**: React Context (`src/context/ShopContext.jsx`) with live REST API sync and offline resilience

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Backend REST API Engine
```bash
npm run server
```
Server runs live at: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 3. Start Frontend Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.
Click **"Admin Portal"** in the top navigation bar to access the Admin Suite.

### 4. Build for Production
```bash
npm run build
```
