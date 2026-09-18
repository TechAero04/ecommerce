# BHARAT — Premier D2C E-Commerce Platform (Milestone 1 Deliverable)

![BHARAT E-Commerce](https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80)

BHARAT is a state-of-the-art D2C (Direct-to-Consumer) marketplace celebrating authentic Indian heritage silk, Sheesham woodwork, audiophile technology, organic Kashmiri spices, and Ayurvedic wellness.

---

## 🌟 Features & Included Pages (10 Core Views)

- 🏠 **Homepage**: Hero slider banner, curated category grid, flash deals, artisan stories, customer reviews.
- 🛍️ **Product Listing / Shop Page**: Category filter sidebar, price range slider (₹1,000–₹10,000), sorting (Price, Rating, Popularity), grid vs list view.
- 🔍 **Product Details Page**: Multi-thumbnail gallery with zoom, variant swatches (Color & Size), stock indicator, tabbed specs & reviews.
- 🛒 **Cart Page & Slide-Out Drawer**: Item table, coupon discount application (`FESTIVE20`, `BHARAT10`), free delivery progress meter.
- 💳 **Express Checkout**: Multi-step shipping details, payment options (Instant UPI, Cards, NetBanking, COD), and order completion modal.
- 🔑 **Login / Signup Modal & Page**: Dual-tabbed authentication forms with password toggle and fast social logins.
- 📊 **User Dashboard**: Account metrics overview (Orders, Wishlist, BHARAT Coins, Addresses), recent activity feed.
- 📦 **Order History & Live Tracking**: Multi-step shipment tracking timeline, tax invoice generator, and re-order buttons.
- ⚙️ **Profile & Settings Page**: Personal information editor, saved address manager (Add/Edit/Delete).
- 💬 **Help Center & AI Chat**: Searchable FAQ accordion, support ticket submission form, and floating AI support chat assistant.

---

## 🛠️ Tech Stack & Architecture

- **Core**: React 18 + Vite
- **Styling System**: Custom Vanilla CSS Tokens (`src/index.css`) with Glassmorphism, Google Fonts (`Outfit` & `Plus Jakarta Sans`), and Responsive Breakpoints
- **Icons**: Lucide React (`lucide-react`)
- **State Management**: React Context (`src/context/ShopContext.jsx`) handling cart, wishlist, routing, authentication, and notifications

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/TechAero04/ecommerce.git
cd ecommerce
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 3. Build for Production
```bash
npm run build
```
