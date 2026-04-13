import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Search, FolderKanban, LogOut, Sun, Moon, Building, User, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../service/api.jsx';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [categories, setCategories] = useState(['Todos']);
    const [openCompaniesMenu, setOpenCompaniesMenu] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/api/companies/categories');
                const dynamicCategories = response.data?.categories || [];
                setCategories(['Todos', ...dynamicCategories.filter((item) => item && item !== 'Todos')]);
            } catch {
                setCategories(['Todos']);
            }
        };
        fetchCategories();
    }, [location.pathname]);

    const isCompaniesSectionActive = useMemo(() => location.pathname.startsWith('/leads'), [location.pathname]);

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
        { icon: <Search size={20} />, label: 'Prospección', path: '/search' }
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
            top: 0,
            overflow: 'hidden'
        }}>
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

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', minHeight: 0, overflowY: 'auto', paddingRight: '4px' }}>
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                        type="button"
                        onClick={() => setOpenCompaniesMenu((prev) => !prev)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '14px',
                            padding: '14px 18px',
                            textDecoration: 'none',
                            color: isCompaniesSectionActive ? 'white' : 'var(--text-secondary)',
                            backgroundColor: isCompaniesSectionActive ? 'var(--accent)' : 'transparent',
                            borderRadius: '16px',
                            fontWeight: isCompaniesSectionActive ? '900' : '700',
                            fontSize: '15px',
                            boxShadow: isCompaniesSectionActive ? '0 8px 15px -4px rgba(99, 102, 241, 0.4)' : 'none',
                            transition: 'all 0.2s ease',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <FolderKanban size={20} />
                            Empresas
                        </span>
                        <ChevronDown size={18} style={{ transform: openCompaniesMenu ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .2s ease' }} />
                    </button>

                    {openCompaniesMenu && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '14px' }}>
                            {categories.map((category) => {
                                const path = category === 'Todos' ? '/leads?category=Todos' : `/leads?category=${encodeURIComponent(category)}`;
                                const isActive = location.pathname.startsWith('/leads') && new URLSearchParams(location.search).get('category') === category || (location.pathname.startsWith('/leads') && category === 'Todos' && !new URLSearchParams(location.search).get('category'));
                                return (
                                    <NavLink
                                        key={category}
                                        to={path}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            padding: '10px 14px',
                                            borderRadius: '14px',
                                            textDecoration: 'none',
                                            color: isActive ? 'white' : 'var(--text-muted)',
                                            background: isActive ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                                            fontWeight: isActive ? '800' : '700',
                                            fontSize: '13px',
                                            border: isActive ? '1px solid rgba(99, 102, 241, 0.35)' : '1px solid transparent'
                                        }}
                                    >
                                        <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: isActive ? '#fff' : 'var(--accent)' }} />
                                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{category}</span>
                                    </NavLink>
                                );
                            })}
                        </div>
                    )}
                </div>
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
                        transition: 'background-color 0.2s'
                    }}
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
                        <div style={{ width: '40px', height: '40px', background: (user?.profileImage || user?.image) ? 'transparent' : 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', overflow: 'hidden' }}>
                            {user?.profileImage || user?.image ? (
                                <img src={user.profileImage || user.image} alt="Usuario" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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
