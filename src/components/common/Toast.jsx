import React from 'react';
import { useShop } from '../../context/ShopContext';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export const Toast = () => {
  const { toast } = useShop();

  if (!toast.show) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'info': return <Info size={20} color="#3B82F6" />;
      case 'warning': return <AlertTriangle size={20} color="#F59E0B" />;
      default: return <CheckCircle2 size={20} color="#10B981" />;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 2000,
      background: 'var(--bg-dark)',
      color: 'white',
      padding: '0.85rem 1.25rem',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-xl)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      fontSize: '0.9rem',
      fontWeight: 500,
      animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      borderLeft: toast.type === 'info' ? '4px solid #3B82F6' : toast.type === 'warning' ? '4px solid #F59E0B' : '4px solid #10B981'
    }}>
      {getIcon()}
      <span>{toast.message}</span>
    </div>
  );
};
