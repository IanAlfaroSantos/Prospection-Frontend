import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Button } from '../components/UI';
import { User, Mail, Lock, Building, Loader2 } from 'lucide-react';
import api from '../service/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        organization: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/api/auth/register', formData);
            login(response.data.user, response.data.token);
            toast.success("¡Registro exitoso!");
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error en el registro");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)', padding: '20px' }}>
            <Card style={{ width: '100%', maxWidth: '500px', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '10px', color: 'var(--text-primary)' }}>Crear Cuenta</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Configura tu plataforma de prospección</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <User style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} size={20} />
                            <input 
                                required 
                                placeholder="Nombre" 
                                style={{ width: '100%', paddingLeft: '45px' }} 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <input 
                                required 
                                placeholder="Apellido" 
                                style={{ width: '100%', paddingLeft: '15px' }} 
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            />
                        </div>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <User style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} size={20} />
                        <input 
                            required 
                            placeholder="Nombre de Usuario" 
                            style={{ width: '100%', paddingLeft: '45px' }} 
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Building style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--accent)' }} size={20} />
                        <input 
                            required 
                            placeholder="Nombre de tu Empresa (Marca Blanca)" 
                            style={{ width: '100%', paddingLeft: '45px', border: '2px solid var(--accent-light)' }} 
                            value={formData.organization}
                            onChange={(e) => setFormData({...formData, organization: e.target.value})}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Mail style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} size={20} />
                        <input 
                            required 
                            type="email" 
                            placeholder="correo@ejemplo.com" 
                            style={{ width: '100%', paddingLeft: '45px' }} 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)', fontSize: '18px', fontWeight: 'bold' }}>#</span>
                        <input 
                            required 
                            type="tel"
                            placeholder="Número de Teléfono" 
                            style={{ width: '100%', paddingLeft: '45px' }} 
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} size={20} />
                        <input 
                            required 
                            type="password" 
                            placeholder="Contraseña" 
                            style={{ width: '100%', paddingLeft: '45px' }} 
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    <Button disabled={loading} style={{ marginTop: '15px', padding: '12px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Registrarse"}
                    </Button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '25px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    ¿Ya tienes cuenta? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: '700', textDecoration: 'none' }}>Inicia sesión</Link>
                </p>
            </Card>
        </div>
    );
};

export default Register;
