import React, { useEffect, useState, useRef } from 'react';
import { useShop } from '../context/ShopContext';

export const ServerError500 = () => {
  const { navigateTo, setIs500Active } = useShop();
  const [clickCount, setClickCount] = useState(0);
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [secretPass, setSecretPass] = useState('');
  const [secretError, setSecretError] = useState('');
  const clickTimerRef = useRef(null);

  // Set real browser title & console error like authentic server failure
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '500 Internal Server Error';

    // Output authentic red error in browser DevTools
    console.error('Failed to load resource: the server responded with a status of 500 (Internal Server Error)');
    console.error('GET / 500 (Internal Server Error)');
    console.warn('[HTTP/1.1 500 Internal Server Error] The server encountered an internal error or misconfiguration and was unable to complete your request.');

    // Keyboard shortcut handlers:
    // Ctrl + Shift + A -> Jump straight to Admin portal
    // Ctrl + Shift + U -> Unlock and view live storefront
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        navigateTo('admin');
      } else if (e.ctrlKey && e.shiftKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        if (setIs500Active) setIs500Active(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.title = originalTitle;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigateTo, setIs500Active]);

  // Triple click on "500" number opens secret developer unlock prompt
  const handle500Click = () => {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    if (nextCount >= 3) {
      setClickCount(0);
      setShowSecretModal(true);
    } else {
      clickTimerRef.current = setTimeout(() => {
        setClickCount(0);
      }, 1200);
    }
  };

  const handleUnlockStore = (e) => {
    e.preventDefault();
    if (secretPass === 'admin123' || secretPass === 'velmora' || secretPass === 'admin') {
      if (setIs500Active) setIs500Active(false);
      setShowSecretModal(false);
    } else {
      setSecretError('Invalid secret key');
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: '#ffffff',
        width: '100vw',
        height: '100vh',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        boxSizing: 'border-box',
        overflow: 'auto',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}
    >
      {/* Exact Bordered Box Matching Provided Reference */}
      <div 
        style={{
          width: '100%',
          maxWidth: '733px',
          minHeight: '403px',
          border: '1px solid #707070',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 32px',
          boxSizing: 'border-box',
          textAlign: 'center',
          userSelect: 'none'
        }}
      >
        <h1 
          style={{
            fontSize: '32px',
            fontWeight: 500,
            color: '#212121',
            margin: '0 0 24px 0',
            letterSpacing: '-0.3px',
            lineHeight: 1.2
          }}
        >
          Internal Server Error
        </h1>

        <div 
          onClick={handle500Click}
          title=""
          style={{
            fontSize: '84px',
            fontWeight: 700,
            color: '#242424',
            lineHeight: 1,
            margin: '0 0 38px 0',
            cursor: 'default',
            letterSpacing: '-1px'
          }}
        >
          500
        </div>

        <p 
          style={{
            fontSize: '15.5px',
            fontWeight: 400,
            color: '#222222',
            lineHeight: 1.45,
            maxWidth: '520px',
            margin: 0
          }}
        >
          The server encountered an internal error or misconfiguration<br />
          and was unable to complete your request
        </p>
      </div>

      {/* Secret Developer Unlock Overlay (Only triggered by 3x click on '500') */}
      {showSecretModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000000
          }}
          onClick={() => setShowSecretModal(false)}
        >
          <div 
            style={{
              background: '#ffffff',
              padding: '24px 28px',
              borderRadius: '8px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              width: '90%',
              maxWidth: '380px',
              textAlign: 'left'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 8px 0', color: '#111827' }}>
              Developer Bypass Controls
            </h3>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 16px 0' }}>
              Choose action or enter admin password to unlock live storefront:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              <button 
                type="button"
                onClick={() => {
                  setShowSecretModal(false);
                  navigateTo('admin');
                }}
                style={{
                  padding: '10px 14px',
                  background: '#4F46E5',
                  color: '#ffffff',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '13.5px',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                🔐 Go to Admin Panel
              </button>

              <button 
                type="button"
                onClick={() => {
                  if (setIs500Active) setIs500Active(false);
                  setShowSecretModal(false);
                }}
                style={{
                  padding: '10px 14px',
                  background: '#F3F4F6',
                  color: '#374151',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '13.5px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: '1px solid #E5E7EB'
                }}
              >
                👁️ View Live Storefront
              </button>
            </div>

            <form onSubmit={handleUnlockStore}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="password"
                  placeholder="Master password..."
                  value={secretPass}
                  onChange={(e) => {
                    setSecretPass(e.target.value);
                    setSecretError('');
                  }}
                  autoFocus
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                <button 
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    background: '#111827',
                    color: '#ffffff',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Unlock
                </button>
              </div>
              {secretError && (
                <p style={{ color: '#EF4444', fontSize: '12px', margin: '6px 0 0 0' }}>{secretError}</p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
