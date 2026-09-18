import React from 'react';
import { useShop } from '../context/ShopContext';
import { 
  Package, 
  Heart, 
  Award, 
  MapPin, 
  ShoppingBag, 
  Clock, 
  ArrowRight, 
  User, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, orders, wishlist, navigateTo } = useShop();

  if (!user) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center' }}>
        <button onClick={() => navigateTo('auth')} className="btn btn-primary">Please Sign In</button>
      </div>
    );
  }

  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered').length;

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '80vh', padding: '2.5rem 0 5rem' }}>
      <div className="container">
        
        {/* Welcome Header */}
        <div style={{
          background: 'var(--gradient-hero)',
          color: 'white',
          padding: '2.5rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <img 
              src={user.avatar} 
              alt={user.name} 
              style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #F59E0B' }} 
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h1 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 800 }}>Namaste, {user.name}!</h1>
                <span className="badge badge-trending">VIP Member</span>
              </div>
              <p style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>
                {user.email} • Member since {user.memberSince}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => navigateTo('orders')} className="btn btn-accent btn-sm">
              <Package size={16} /> Manage Orders
            </button>
            <button onClick={() => navigateTo('profile')} className="btn btn-secondary btn-sm" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
              Settings
            </button>
          </div>
        </div>

        {/* Account Metrics Grid */}
        <div className="grid-cols-4" style={{ marginBottom: '2.5rem' }}>
          
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Orders</span>
              <div style={{ background: 'var(--color-primary-light)', padding: '0.5rem', borderRadius: '8px', color: 'var(--color-primary)' }}>
                <Package size={20} />
              </div>
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{orders.length}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-emerald)', fontWeight: 600 }}>{activeOrdersCount} order in transit</span>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Saved Wishlist</span>
              <div style={{ background: '#FEE2E2', padding: '0.5rem', borderRadius: '8px', color: 'var(--color-danger)' }}>
                <Heart size={20} />
              </div>
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{wishlist.length}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }} onClick={() => navigateTo('shop')} style={{ cursor: 'pointer', color: 'var(--color-primary)' }}>
              View saved items →
            </span>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Velmora Coins</span>
              <div style={{ background: '#FEF3C7', padding: '0.5rem', borderRadius: '8px', color: '#D97706' }}>
                <Award size={20} />
              </div>
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{user.rewardPoints} pts</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-emerald)', fontWeight: 600 }}>Worth ₹{Math.round(user.rewardPoints / 10)} cash discount</span>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Saved Addresses</span>
              <div style={{ background: '#D1FAE5', padding: '0.5rem', borderRadius: '8px', color: 'var(--color-emerald)' }}>
                <MapPin size={20} />
              </div>
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{user.addresses.length}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigateTo('profile')}>
              Manage Address Book
            </span>
          </div>

        </div>

        {/* Recent Orders Overview Section */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '2rem', marginBottom: '2.5rem' }}>
          <div className="flex-between" style={{ marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} color="var(--color-primary)" /> Recent Order Activity
            </h3>
            <button onClick={() => navigateTo('orders')} className="btn btn-secondary btn-sm">
              View All Orders ({orders.length}) →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.slice(0, 2).map(order => (
              <div 
                key={order.id} 
                style={{ 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-md)', 
                  padding: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem' }}>{order.id}</span>
                    <span className="badge badge-trending" style={{ background: order.status === 'Delivered' ? '#D1FAE5' : '#FEF3C7', color: order.status === 'Delivered' ? '#065F46' : '#92400E' }}>
                      {order.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Placed on {order.date} • {order.items.length} item(s) • Paid via {order.paymentMethod}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                    ₹{order.total.toLocaleString()}
                  </div>
                  <button onClick={() => navigateTo('orders')} className="btn btn-primary btn-sm">
                    Track Package
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
