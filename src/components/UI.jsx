import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Card = ({ children, className = '', hover = true, ...props }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.985 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={hover ? { y: -6, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.45)' } : {}}
    className={`card ${className}`}
    style={{
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '28px',
      padding: '24px',
      border: '1px solid var(--border)',
      boxShadow: 'var(--card-shadow)',
      position: 'relative',
      overflow: 'hidden',
      ...props.style
    }}
    {...props}
  >
    {children}
  </motion.div>
);

export const Button = ({ children, variant = 'primary', className = '', fullWidth = false, ...props }) => {
  const variants = {
    primary: {
      backgroundColor: '#3749c9',
      backgroundImage: 'linear-gradient(135deg, #3749c9 0%, #6d28d9 100%)',
      color: '#fff',
      boxShadow: '0 12px 24px -8px rgba(55, 73, 201, 0.5)',
      border: 'none'
    },
    secondary: {
      backgroundColor: '#2563eb',
      backgroundImage: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
      color: '#fff',
      boxShadow: '0 12px 24px -8px rgba(37, 99, 235, 0.45)',
      border: 'none'
    },
    cyan: {
      backgroundColor: '#24a1de',
      backgroundImage: 'linear-gradient(135deg, #229ED9 0%, #38bdf8 100%)',
      color: '#fff',
      boxShadow: '0 12px 24px -8px rgba(34, 158, 217, 0.5)',
      border: 'none'
    },
    success: {
      backgroundColor: '#15803d',
      backgroundImage: 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)',
      color: '#fff',
      boxShadow: '0 12px 24px -8px rgba(21, 128, 61, 0.45)',
      border: 'none'
    },
    warning: {
      backgroundColor: '#ca8a04',
      backgroundImage: 'linear-gradient(135deg, #eab308 0%, #f59e0b 100%)',
      color: '#101828',
      boxShadow: '0 12px 24px -8px rgba(234, 179, 8, 0.45)',
      border: 'none'
    },
    danger: {
      backgroundColor: '#dc2626',
      backgroundImage: 'linear-gradient(135deg, #dc2626 0%, #f43f5e 100%)',
      color: '#fff',
      boxShadow: '0 12px 24px -8px rgba(220, 38, 38, 0.45)',
      border: 'none'
    },
    ghost: {
      backgroundColor: 'rgba(255,255,255,0.05)',
      backgroundImage: 'none',
      color: 'var(--text-primary)',
      border: '1px solid var(--border)',
      backdropFilter: 'blur(10px)',
      boxShadow: 'none'
    }
  };

  const style = variants[variant] || variants.primary;

  return (
    <motion.button
      whileHover={{ scale: 1.02, filter: 'brightness(1.05)', y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`button ${className}`}
      style={{
        padding: '14px 24px',
        fontSize: '15px',
        fontWeight: '900',
        borderRadius: '18px',
        width: fullWidth ? '100%' : 'auto',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        letterSpacing: '0.02em',
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? 0.65 : 1,
        ...style,
        ...props.style
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export const Modal = ({ isOpen, onClose, title, children, maxWidth = '600px' }) => (
  <AnimatePresence>
    {isOpen && (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(2, 4, 10, 0.88)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          backdropFilter: 'blur(20px)',
          padding: '20px'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '32px',
            width: '100%',
            maxWidth,
            padding: '32px',
            position: 'relative',
            boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 1)',
            border: '1px solid var(--border)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <h3 style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '-0.04em' }}>{title}</h3>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                width: '42px',
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
                fontSize: '22px'
              }}
            >
              &times;
            </button>
          </div>
          <div className="custom-scrollbar" style={{ maxHeight: '75vh', overflowY: 'auto', overflowX: 'hidden', paddingRight: '8px' }}>
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
