import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Card = ({ children, className = '', hover = true, ...props }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={hover ? { y: -8, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' } : {}}
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
};

export const Button = ({ children, variant = 'primary', className = '', fullWidth = false, ...props }) => {
    const variants = {
        primary: {
            backgroundColor: '#6366f1',
            backgroundImage: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            color: 'white',
            boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.5)',
            border: 'none'
        },
        secondary: {
            backgroundColor: '#3b82f6',
            backgroundImage: 'linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)',
            color: 'white',
            boxShadow: '0 10px 20px -5px rgba(59, 130, 246, 0.5)',
            border: 'none'
        },
        danger: {
            backgroundColor: '#f43f5e',
            backgroundImage: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)',
            color: 'white',
            boxShadow: '0 10px 20px -5px rgba(244, 63, 94, 0.5)',
            border: 'none'
        },
        success: {
            backgroundColor: '#10b981',
            backgroundImage: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
            color: 'white',
            boxShadow: '0 10px 20px -5px rgba(16, 185, 129, 0.5)',
            border: 'none'
        },
        cyan: {
            backgroundColor: '#06b6d4',
            backgroundImage: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
            color: 'white',
            boxShadow: '0 10px 20px -5px rgba(6, 182, 212, 0.5)',
            border: 'none'
        },
        warning: {
            backgroundColor: '#fbbf24', // Vibrant Gold
            backgroundImage: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            color: '#000', // Better contrast
            boxShadow: '0 10px 20px -5px rgba(251, 191, 36, 0.5)',
            border: 'none'
        },
        ghost: {
            backgroundColor: 'rgba(255,255,255,0.05)',
            backgroundImage: 'none',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            backdropFilter: 'blur(10px)'
        }
    };
    
    const style = variants[variant] || variants.primary;
    
    return (
        <motion.button 
            whileHover={{ scale: 1.03, filter: 'brightness(1.2)', y: -2 }}
            whileTap={{ scale: 0.97 }}
            className={`button ${className}`}
            style={{
                padding: '14px 28px',
                fontSize: '15px',
                fontWeight: '900',
                borderRadius: '18px',
                width: fullWidth ? '100%' : 'auto',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                cursor: props.disabled ? 'not-allowed' : 'pointer',
                opacity: props.disabled ? 0.6 : 1,
                ...style,
                ...props.style
            }}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export const Modal = ({ isOpen, onClose, title, children, maxWidth = '600px' }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(2, 4, 10, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000,
                    backdropFilter: 'blur(20px)',
                    padding: '20px'
                }} onClick={onClose}>
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderRadius: '32px',
                            width: '100%',
                            maxWidth: maxWidth,
                            padding: '40px',
                            position: 'relative',
                            boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 1)',
                            border: '1px solid var(--border)',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
                            <h3 style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '-0.04em', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{title}</h3>
                            <button onClick={onClose} style={{ 
                                background: 'rgba(255,255,255,0.05)', 
                                border: '1px solid var(--border)',
                                borderRadius: '14px',
                                width: '40px', height: '40px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer',
                                color: 'var(--text-primary)',
                                fontSize: '20px',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                e.currentTarget.style.color = '#ff4757';
                                e.currentTarget.style.borderColor = 'rgba(255, 71, 87, 0.3)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                e.currentTarget.style.color = 'var(--text-primary)';
                                e.currentTarget.style.borderColor = 'var(--border)';
                            }}
                            >&times;</button>
                        </div>
                        <div className="custom-scrollbar" style={{ 
                            maxHeight: '75vh', 
                            overflowY: 'auto', 
                            overflowX: 'hidden',
                            paddingRight: '10px'
                        }}>
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
