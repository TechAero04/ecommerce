import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { MOCK_USER } from '../data/mockData';
import { User, Lock, Mail, Phone, Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const AuthPage = () => {
  const { setUser, navigateTo, showToast } = useShop();

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('rajesh.m@bharat.in');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Rajesh Malhotra');

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setUser({
      ...MOCK_USER,
      name: authMode === 'signup' ? name : MOCK_USER.name,
      email: email
    });
    showToast(`Welcome ${authMode === 'signup' ? name : 'back'}! Logged in successfully.`, 'success');
    navigateTo('dashboard');
  };

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '80vh', padding: '4rem 0', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          padding: '2.5rem 2rem',
          boxShadow: 'var(--shadow-lg)'
        }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              background: 'var(--gradient-brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              margin: '0 auto 1rem',
              boxShadow: 'var(--shadow-md)'
            }}>
              <User size={28} />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
              {authMode === 'login' ? 'Welcome Back to BHARAT' : 'Create BHARAT Account'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              {authMode === 'login' ? 'Access your orders, wishlist & rewards' : 'Join India’s D2C Artisanal Marketplace'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-main)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.75rem'
          }}>
            <button
              onClick={() => setAuthMode('login')}
              style={{
                flex: 1,
                padding: '0.6rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.875rem',
                background: authMode === 'login' ? 'white' : 'transparent',
                color: authMode === 'login' ? 'var(--color-primary)' : 'var(--text-muted)',
                boxShadow: authMode === 'login' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('signup')}
              style={{
                flex: 1,
                padding: '0.6rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.875rem',
                background: authMode === 'signup' ? 'white' : 'transparent',
                color: authMode === 'signup' ? 'var(--color-primary)' : 'var(--text-muted)',
                boxShadow: authMode === 'signup' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleAuthSubmit}>
            {authMode === 'signup' && (
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    placeholder="e.g. Aarav Sharma"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>
            )}

            <div className="input-group">
              <label className="input-label">Email Address or Mobile Number</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="name@example.com"
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="input-group">
              <div className="flex-between" style={{ marginBottom: '0.3rem' }}>
                <label className="input-label" style={{ margin: 0 }}>Password</label>
                {authMode === 'login' && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer' }}>
                    Forgot?
                  </span>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                />
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-full" style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
              {authMode === 'login' ? 'Sign In to Account' : 'Create Account'} <ArrowRight size={18} />
            </button>
          </form>

          {/* Social Logins */}
          <div style={{ textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '1rem' }}>Or continue with fast login</span>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleAuthSubmit} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                Google
              </button>
              <button onClick={handleAuthSubmit} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                Phone OTP
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
