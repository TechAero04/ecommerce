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
import { AdminPage } from './pages/AdminPage';
import { ServerError500 } from './pages/ServerError500';

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
    case 'admin':
      return <AdminPage />;
    default:
      return <HomePage />;
  }
};

const MainLayout = () => {
  const { currentPage, is500Active } = useShop();

  if (currentPage === 'admin') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AdminPage />
        <Toast />
      </div>
    );
  }

  // Realistic 500 Internal Server Error Page for Home Page
  if (currentPage === 'home' && is500Active) {
    return <ServerError500 />;
  }

  return (
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
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainLayout />
    </ShopProvider>
  );
}
