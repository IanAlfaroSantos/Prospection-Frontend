import React, { useMemo, useState } from 'react';
import { Card, Button, Modal } from '../components/UI';
import { User, Phone, Mail, Shield, Building2, Upload, Save, Key } from 'lucide-react';
import api from '../service/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    phone: user?.phone || '',
    email: user?.email || '',
    organization: user?.organization || 'Sencom',
    profileImage: user?.profileImage || '',
    companyLogo: user?.companyLogo || ''
  });
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });

  const previewUserImage = useMemo(() => formData.profileImage || '', [formData.profileImage]);
  const previewLogo = useMemo(() => formData.companyLogo || '', [formData.companyLogo]);

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleFile = async (event, field) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await toBase64(file);
      setFormData((prev) => ({ ...prev, [field]: base64 }));
    } catch {
      toast.error('No se pudo procesar la imagen');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await api.put('/api/auth/profile', formData, { headers: { 'x-token': token } });
      login(response.data, token);
      toast.success('Perfil actualizado');
    } catch {
      toast.error('No se pudo guardar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    try {
      const token = localStorage.getItem('token');
      await api.put('/api/auth/change-password', passwordData, { headers: { 'x-token': token } });
      setPasswordData({ oldPassword: '', newPassword: '' });
      setIsPasswordModalOpen(false);
      toast.success('Contraseña actualizada');
    } catch (error) {
      toast.error(error.response?.data?.msg || 'No se pudo cambiar la contraseña');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1320px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.3rem)', fontWeight: '900', marginBottom: '8px' }}>Perfil Estratégico</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>Administra tus datos personales, marca blanca y seguridad.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(280px, 0.8fr)', gap: '24px' }}>
        <Card hover={false}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontWeight: '900', color: 'var(--text-secondary)' }}>
                NOMBRE
                <div style={{ position: 'relative' }}>
                  <User style={{ position: 'absolute', left: '14px', top: '16px', color: 'var(--accent)' }} size={18} />
                  <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', paddingLeft: '44px', height: '52px' }} />
                </div>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontWeight: '900', color: 'var(--text-secondary)' }}>
                APELLIDO
                <input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} style={{ width: '100%', height: '52px' }} />
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontWeight: '900', color: 'var(--text-secondary)' }}>
                NOMBRE DE USUARIO
                <input value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} style={{ width: '100%', height: '52px' }} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontWeight: '900', color: 'var(--text-secondary)' }}>
                TELÉFONO
                <div style={{ position: 'relative' }}>
                  <Phone style={{ position: 'absolute', left: '14px', top: '16px', color: 'var(--accent)' }} size={18} />
                  <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={{ width: '100%', paddingLeft: '44px', height: '52px' }} />
                </div>
              </label>
            </div>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontWeight: '900', color: 'var(--text-secondary)' }}>
              CORREO ELECTRÓNICO (SOLO LECTURA)
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '14px', top: '16px', color: 'var(--accent)' }} size={18} />
                <input value={formData.email} readOnly style={{ width: '100%', paddingLeft: '44px', height: '52px', opacity: 0.88 }} />
              </div>
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingTop: '8px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.35rem', fontWeight: '900' }}><Shield size={22} color="var(--accent)" /> BRANDING (MARCA BLANCA)</h3>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontWeight: '900', color: 'var(--text-secondary)' }}>
                NOMBRE DE TU ORGANIZACIÓN / MARCA
                <div style={{ position: 'relative' }}>
                  <Building2 style={{ position: 'absolute', left: '14px', top: '16px', color: 'var(--accent)' }} size={18} />
                  <input value={formData.organization} onChange={(e) => setFormData({ ...formData, organization: e.target.value })} style={{ width: '100%', paddingLeft: '44px', height: '52px' }} />
                </div>
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                <Card hover={false} style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '90px', height: '90px', borderRadius: '22px', background: 'transparent', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {previewUserImage ? <img src={previewUserImage} alt="Foto" style={{ width: '100%', height: '100%', objectFit: 'contain', background: 'transparent' }} /> : <div style={{ width: '100%', height: '100%', borderRadius: '22px', background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><User size={34} /></div>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '900', marginBottom: '8px' }}>Foto de perfil</p>
                      <label style={{ display: 'inline-flex' }}>
                        <input type="file" accept="image/*" hidden onChange={(e) => handleFile(e, 'profileImage')} />
                        <Button type="button" variant="secondary"><Upload size={16} /> SUBIR FOTO</Button>
                      </label>
                    </div>
                  </div>
                </Card>

                <Card hover={false} style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '90px', height: '90px', borderRadius: '22px', background: 'transparent', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {previewLogo ? <img src={previewLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', background: 'transparent' }} /> : <div style={{ width: '100%', height: '100%', borderRadius: '22px', background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Building2 size={34} /></div>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '900', marginBottom: '8px' }}>Logo de la marca</p>
                      <label style={{ display: 'inline-flex' }}>
                        <input type="file" accept="image/*" hidden onChange={(e) => handleFile(e, 'companyLogo')} />
                        <Button type="button" variant="cyan"><Upload size={16} /> SUBIR LOGO</Button>
                      </label>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <Button variant="success" disabled={loading} style={{ marginTop: '6px', minHeight: '56px' }}>
              {loading ? 'GUARDANDO...' : <><Save size={18} /> GUARDAR CAMBIOS</>}
            </Button>
          </form>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Card hover={false} style={{ backgroundColor: 'rgba(99, 102, 241, 0.05)' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '18px' }}><Shield size={30} /></div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '8px' }}>Seguridad de Cuenta</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '18px' }}>Tu sesión y perfil se gestionan con autenticación y notificaciones de seguridad.</p>
            <Button variant="primary" fullWidth onClick={() => setIsPasswordModalOpen(true)} type="button"><Key size={18} /> CAMBIAR CONTRASEÑA</Button>
          </Card>
        </div>
      </div>

      <Modal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} title="CAMBIAR CONTRASEÑA">
        <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontWeight: '900', color: 'var(--text-secondary)' }}>
            CONTRASEÑA ACTUAL
            <input type="password" required placeholder="*************" style={{ padding: '16px', fontSize: '16px' }} value={passwordData.oldPassword} onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontWeight: '900', color: 'var(--text-secondary)' }}>
            NUEVA CONTRASEÑA
            <input type="password" required placeholder="Mín. 6 caracteres" style={{ padding: '16px', fontSize: '16px' }} value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
          </label>
          <Button variant="success" disabled={passwordLoading} style={{ marginTop: '6px' }} fullWidth>{passwordLoading ? 'ACTUALIZANDO...' : 'ACTUALIZAR CONTRASEÑA'}</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
