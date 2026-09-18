import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Download, 
  RotateCcw, 
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const OrdersPage = () => {
  const { orders, navigateTo, addToCart, showToast } = useShop();

  const [activeOrderModal, setActiveOrderModal] = useState(null);

  const handleReorder = (items) => {
    items.forEach(item => {
      // Find full product match or mock add
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        colors: [{ name: item.color || 'Standard' }],
        sizes: [item.size || 'Standard']
      }, item.quantity);
    });
    showToast('Added items from previous order to cart!', 'success');
  };

  const handleDownloadInvoice = (orderId) => {
    showToast(`Downloading TAX Invoice for ${orderId}...`, 'info');
  };

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '80vh', padding: '2.5rem 0 5rem' }}>
      <div className="container">
        
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigateTo('home')}>Home</span>
          <ChevronRight size={14} />
          <span style={{ cursor: 'pointer' }} onClick={() => navigateTo('dashboard')}>Dashboard</span>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Order History</span>
        </div>

        <div className="flex-between" style={{ marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Order History & Package Tracking</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Track shipments live, download GST invoices, and manage returns
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {orders.map(order => (
            <div 
              key={order.id}
              style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
                overflow: 'hidden'
              }}
            >
              {/* Card Header */}
              <div style={{
                background: 'var(--bg-main)',
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order Placed</span>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{order.date}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Amount</span>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-primary)' }}>₹{order.total.toLocaleString()}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ship To</span>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{order.shippingAddress.split(',')[0]}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={() => handleDownloadInvoice(order.id)} className="btn btn-secondary btn-sm">
                    <Download size={14} /> Tax Invoice
                  </button>
                  <button onClick={() => setActiveOrderModal(order)} className="btn btn-primary btn-sm">
                    <Truck size={14} /> Live Track
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      display: 'inline-block',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: order.status === 'Delivered' ? '#10B981' : '#F59E0B'
                    }} />
                    <span style={{ fontWeight: 800, fontSize: '1.05rem', color: order.status === 'Delivered' ? '#065F46' : '#92400E' }}>
                      Status: {order.status}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(Ref: {order.trackingNumber})</span>
                  </div>
                </div>

                {/* Progress Steps */}
                <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', textAlign: 'center', fontSize: '0.775rem', fontWeight: 700 }}>
                    <div style={{ color: order.statusStep >= 1 ? 'var(--color-primary)' : 'var(--text-light)' }}>1. Order Confirmed</div>
                    <div style={{ color: order.statusStep >= 2 ? 'var(--color-primary)' : 'var(--text-light)' }}>2. Packed at Warehouse</div>
                    <div style={{ color: order.statusStep >= 3 ? 'var(--color-primary)' : 'var(--text-light)' }}>3. In Transit (Courier)</div>
                    <div style={{ color: order.statusStep >= 4 ? 'var(--color-emerald)' : 'var(--text-light)' }}>4. Delivered</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                      <img src={item.image} alt={item.name} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{item.name}</h4>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Qty: {item.quantity} | Color: {item.color || 'Default'} | Size: {item.size || 'Standard'}
                        </div>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '1.25rem', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button onClick={() => handleReorder(order.items)} className="btn btn-secondary btn-sm">
                    <RotateCcw size={14} /> Reorder All Items
                  </button>
                  <button onClick={() => navigateTo('support')} className="btn btn-secondary btn-sm">
                    Need Help with Order?
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Live Tracking Modal */}
      {activeOrderModal && (
        <div className="modal-overlay" onClick={() => setActiveOrderModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem', maxWidth: '580px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Live Package Tracking ({activeOrderModal.id})
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Carrier: BlueDart Express • Tracking AWB: <strong>{activeOrderModal.trackingNumber}</strong>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderLeft: '3px solid var(--color-primary)', paddingLeft: '1.25rem', margin: '1.5rem 0 2rem' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)' }}>Out for Delivery</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Expected Today by 7:00 PM • Courier Executive: Ramesh Kumar (+91 99887 66554)</div>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Arrived at Destination Hub (Bengaluru South)</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2026-09-17, 04:30 AM</div>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Dispatched from Main Warehouse (Delhi NCR)</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>2026-09-16, 02:15 PM</div>
              </div>
            </div>

            <button onClick={() => setActiveOrderModal(null)} className="btn btn-primary btn-full">
              Close Tracking Window
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
