import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Search, Users, LogOut, Sun, Moon, Building, User, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
        { icon: <Search size={20} />, label: 'Prospección', path: '/search' }, // Corregido el path a /search
        { icon: <Users size={20} />, label: 'Mis Leads', path: '/leads' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside style={{
            width: '280px',
            backgroundColor: 'var(--bg-secondary)',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            padding: '30px 20px',
            borderRight: '1px solid var(--border)',
            position: 'sticky',
            top: 0
        }}>
            {/* BRANDING DINÁMICO (MARCA BLANCA) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '45px', padding: '0 10px' }}>
                <div style={{ width: '40px', height: '40px', background: user?.companyLogo ? 'transparent' : 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', overflow: 'hidden', padding: user?.companyLogo ? '0' : '4px' }}>
                    {user?.companyLogo ? (
                        <img src={user.companyLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                        <Building size={24} />
                    )}
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '-0.03em' }}>
                    {user?.organization || 'Mi Empresa'}
                </h2>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {menuItems.map((item) => (
                    <NavLink 
                        key={item.path} 
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            padding: '14px 18px',
                            textDecoration: 'none',
                            color: isActive ? 'white' : 'var(--text-secondary)',
                            backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                            borderRadius: '16px',
                            fontWeight: isActive ? '900' : '700',
                            fontSize: '15px',
                            boxShadow: isActive ? '0 8px 15px -4px rgba(99, 102, 241, 0.4)' : 'none',
                            transition: 'all 0.2s ease'
                        })}
                    >
                        {item.icon}
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <button 
                    onClick={toggleTheme}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        padding: '14px',
                        background: 'rgba(255,255,255,0.05)',
                        color: 'var(--text-primary)',
                        width: '100%',
                        borderRadius: '16px',
                        fontSize: '14px',
                        fontWeight: '900',
                        cursor: 'pointer',
                        border: '1px solid var(--border)',
                        transition: 'background-color 0.2s',
                    }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    {theme === 'dark' ? 'MODO CLARO' : 'MODO OSCURO'}
                </button>

                <div style={{ padding: '5px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid var(--border)' }}>
                    <NavLink 
                        to="/profile"
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            textDecoration: 'none',
                            borderRadius: '16px',
                            backgroundColor: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                            color: 'var(--text-primary)',
                            border: isActive ? '1px solid var(--accent)' : '1px solid transparent'
                        })}
                    >
                        <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', overflow: 'hidden' }}>
                            {user?.profileImage || user?.image ? (
                                <img src={user.profileImage || user.image} alt="Usuario" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <User size={20} />
                            )}
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <p style={{ fontWeight: '900', fontSize: '14px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.name} {user?.lastName || ''}</p>
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '800' }}>MI PERFIL</p>
                        </div>
                        <Settings size={18} style={{ color: 'var(--text-muted)' }} />
                    </NavLink>
                    
                    <button 
                        onClick={handleLogout} 
                        style={{ 
                            width: '100%',
                            marginTop: '5px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            color: '#ff4757', 
                            background: 'none', 
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: '800',
                            fontSize: '13px'
                        }}
                    >
                        <LogOut size={18} /> CERRAR SESIÓN
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
