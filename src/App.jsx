import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Toast } from './components/common/Toast';
import { QuickViewModal } from './components/common/QuickViewModal';
import { ChatWidget } from './components/common/ChatWidget';
import { CartDrawer } from './components/cart/CartDrawer';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { OrdersPage } from './pages/OrdersPage';
import { ProfilePage } from './pages/ProfilePage';
import { SupportPage } from './pages/SupportPage';

const PageRenderer = () => {
  const { currentPage } = useShop();

  switch (currentPage) {
    case 'home':
      return <HomePage />;
    case 'shop':
      return <ShopPage />;
    case 'product-detail':
      return <ProductDetailPage />;
    case 'cart':
      return <CartPage />;
    case 'checkout':
      return <CheckoutPage />;
    case 'auth':
      return <AuthPage />;
    case 'dashboard':
      return <DashboardPage />;
    case 'orders':
      return <OrdersPage />;
    case 'profile':
      return <ProfilePage />;
    case 'support':
      return <SupportPage />;
    default:
      return <HomePage />;
  }
};

export default function App() {
  return (
    <ShopProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1 }}>
          <PageRenderer />
        </main>
        <Footer />

        {/* Global Drawers & Modals */}
        <CartDrawer />
        <QuickViewModal />
        <ChatWidget />
        <Toast />
      </div>
    </ShopProvider>
  );
}
