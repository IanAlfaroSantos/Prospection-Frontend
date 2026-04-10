import React, { useState } from 'react';
import { Card, Button, Modal } from '../components/UI';
import { User, Building, Mail, Save, Shield, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const Profile = () => {
    const { user, login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        lastName: user?.lastName || '',
        username: user?.username || '',
        phone: user?.phone || '',
        organization: user?.organization || '',
        email: user?.email || '',
        profileImage: user?.profileImage || user?.image || '',
        companyLogo: user?.companyLogo || ''
    });
    
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });
    const [passwordLoading, setPasswordLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setFormData({ ...formData, profileImage: reader.result });
            reader.readAsDataURL(file);
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setFormData({ ...formData, companyLogo: reader.result });
            reader.readAsDataURL(file);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put('https://prospection-backend-production-fce5.up.railway.app/api/auth/change-password', passwordData, {
                headers: { 'x-token': token }
            });
            toast.success("Contraseña actualizada con éxito");
            setIsPasswordModalOpen(false);
            setPasswordData({ oldPassword: '', newPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || "Error al actualizar contraseña");
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('https://prospection-backend-production-fce5.up.railway.app/api/auth/profile', formData, {
                headers: { 'x-token': token }
            });
            login(response.data, token);
            toast.success("¡Perfil actualizado con éxito!");
        } catch (error) {
            toast.error("Error al actualizar el perfil");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-0.06em' }}>Configuración de <span style={{ color: 'var(--accent)' }}>Cuenta</span></h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>Gestiona tu identidad y el branding de tu plataforma</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
                <Card style={{ padding: '40px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <User size={22} color="var(--accent)" /> DATOS PERSONALES
                        </h3>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--bg-accent)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {formData.profileImage ? (
                                    <img src={formData.profileImage} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <User size={40} color="var(--text-muted)" />
                                )}
                            </div>
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: '900', color: 'var(--accent)', cursor: 'pointer', padding: '8px 16px', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px' }}>
                                    SUBIR FOTO
                                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                                </label>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>JPG, PNG o GIF. Máx 2MB.</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '12px', fontWeight: '900', color: 'var(--text-muted)' }}>NOMBRE</label>
                            <input 
                                required 
                                style={{ padding: '16px', fontSize: '16px' }} 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '12px', fontWeight: '900', color: 'var(--text-muted)' }}>APELLIDO</label>
                            <input 
                                required 
                                style={{ padding: '16px', fontSize: '16px' }} 
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '12px', fontWeight: '900', color: 'var(--text-muted)' }}>NOMBRE DE USUARIO</label>
                            <input 
                                required 
                                style={{ padding: '16px', fontSize: '16px' }} 
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '12px', fontWeight: '900', color: 'var(--text-muted)' }}>TELÉFONO</label>
                            <input 
                                required 
                                style={{ padding: '16px', fontSize: '16px' }} 
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '12px', fontWeight: '900', color: 'var(--text-muted)' }}>CORREO ELECTRÓNICO (SOLO LECTURA)</label>
                            <div style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '14px', border: '1px solid var(--border)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Mail size={18} /> {formData.email}
                            </div>
                        </div>

                        <h3 style={{ fontSize: '20px', fontWeight: '900', marginTop: '20px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Shield size={22} color="var(--accent)" /> BRANDING (MARCA BLANCA)
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '12px', fontWeight: '900', color: 'var(--text-muted)' }}>NOMBRE DE TU ORGANIZACIÓN / MARCA</label>
                            <div style={{ position: 'relative' }}>
                                <Building style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--accent)' }} size={20} />
                                <input 
                                    required 
                                    style={{ width: '100%', paddingLeft: '50px', paddingRight: '20px', height: '54px' }} 
                                    value={formData.organization}
                                    onChange={(e) => setFormData({...formData, organization: e.target.value})}
                                />
                            </div>
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '5px' }}>Este nombre aparecerá en el sidebar y en los correos enviados.</p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '16px', backgroundColor: 'var(--bg-accent)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {formData.companyLogo ? (
                                    <img src={formData.companyLogo} alt="Logo de Empresa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <Building size={40} color="var(--text-muted)" />
                                )}
                            </div>
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: '900', color: 'var(--accent)', cursor: 'pointer', padding: '8px 16px', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px' }}>
                                    SUBIR LOGO
                                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoChange} />
                                </label>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>Tu logo personalizado para la plataforma.</p>
                            </div>
                        </div>

                        <Button disabled={loading} style={{ marginTop: '20px' }}>
                            {loading ? 'GUARDANDO...' : <><Save size={20} /> GUARDAR CAMBIOS</>}
                        </Button>
                    </form>
                </Card>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <Card style={{ backgroundColor: 'rgba(99, 102, 241, 0.05)', border: 'none' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '20px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '20px' }}>
                            <Shield size={32} />
                        </div>
                        <h4 style={{ fontSize: '18px', fontWeight: '900', marginBottom: '10px' }}>Seguridad de Cuenta</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>Tu sesión está protegida con encriptación JWT de nivel bancario.</p>
                        <Button variant="primary" fullWidth onClick={() => setIsPasswordModalOpen(true)} type="button">
                            <Key size={18} /> CAMBIAR CONTRASEÑA
                        </Button>
                    </Card>
                </div>
            </div>

            <Modal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} title="CAMBIAR CONTRASEÑA">
                <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '900', color: 'var(--text-muted)' }}>CONTRASEÑA ACTUAL</label>
                        <input 
                            type="password"
                            required 
                            placeholder="*************"
                            style={{ padding: '16px', fontSize: '16px' }} 
                            value={passwordData.oldPassword}
                            onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '900', color: 'var(--text-muted)' }}>NUEVA CONTRASEÑA</label>
                        <input 
                            type="password"
                            required 
                            placeholder="Mín. 6 caracteres"
                            style={{ padding: '16px', fontSize: '16px' }} 
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        />
                    </div>
                    <Button disabled={passwordLoading} style={{ marginTop: '10px' }} fullWidth>
                        {passwordLoading ? 'ACTUALIZANDO...' : 'ACTUALIZAR CONTRASEÑA'}
                    </Button>
                </form>
            </Modal>
        </div>
    );
};

export default Profile;
