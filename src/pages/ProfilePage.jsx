import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Bell, 
  Lock, 
  Plus, 
  Trash2, 
  Check, 
  ChevronRight 
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, setUser, navigateTo, showToast } = useShop();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [newAddrModal, setNewAddrModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    label: 'Home',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });

  const handleProfileSave = (e) => {
    e.preventDefault();
    setUser({ ...user, ...formData });
    showToast('Profile information updated successfully!', 'success');
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    const created = {
      id: `addr-${Date.now()}`,
      isDefault: addresses.length === 0,
      name: formData.name,
      ...newAddr
    };
    setAddresses([...addresses, created]);
    setUser({ ...user, addresses: [...addresses, created] });
    setNewAddrModal(false);
    showToast('New address saved to address book!', 'success');
  };

  const handleDeleteAddress = (id) => {
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    setUser({ ...user, addresses: updated });
    showToast('Address deleted', 'info');
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
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Profile & Settings</span>
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Account Settings</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }} className="profile-grid">
          
          {/* Personal Info Form */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={20} color="var(--color-primary)" /> Personal Information
            </h3>

            <form onSubmit={handleProfileSave}>
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-full">
                Save Profile Changes
              </button>
            </form>
          </div>

          {/* Saved Addresses Book */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={20} color="var(--color-emerald)" /> Address Book
              </h3>
              <button onClick={() => setNewAddrModal(true)} className="btn btn-secondary btn-sm">
                <Plus size={14} /> Add New
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {addresses.map((addr) => (
                <div key={addr.id} style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-main)' }}>
                  <div className="flex-between" style={{ marginBottom: '0.4rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                      {addr.label} {addr.isDefault && <span className="badge badge-new" style={{ fontSize: '0.65rem' }}>Default</span>}
                    </div>
                    <button onClick={() => handleDeleteAddress(addr.id)} style={{ color: 'var(--color-danger)' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <span style={{ fontSize: '0.775rem', color: 'var(--text-light)', marginTop: '0.3rem', display: 'block' }}>Phone: {addr.phone}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Add Address Modal */}
      {newAddrModal && (
        <div className="modal-overlay" onClick={() => setNewAddrModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem', maxWidth: '500px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem' }}>Add Shipping Address</h3>
            <form onSubmit={handleAddAddress}>
              <div className="input-group">
                <label className="input-label">Address Tag (Home/Work)</label>
                <input
                  type="text"
                  required
                  value={newAddr.label}
                  onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Street Address</label>
                <input
                  type="text"
                  required
                  value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                  className="input-field"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-cols-2">
                <div className="input-group">
                  <label className="input-label">City</label>
                  <input
                    type="text"
                    required
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Pincode</label>
                  <input
                    type="text"
                    required
                    value={newAddr.pincode}
                    onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Phone</label>
                <input
                  type="tel"
                  required
                  value={newAddr.phone}
                  onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                  className="input-field"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Address</button>
                <button type="button" onClick={() => setNewAddrModal(false)} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 850px) {
          .profile-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
