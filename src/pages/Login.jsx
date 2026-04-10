import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Button } from '../components/UI';
import { Mail, Lock, Loader2, Building } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', formData);
            login(response.data.user, response.data.token);
            toast.success("¡Bienvenido de nuevo!");
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error en el inicio de sesión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)', padding: '20px' }}>
            <Card style={{ width: '100%', maxWidth: '420px', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                    <div style={{ width: '60px', height: '60px', background: 'var(--accent)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', margin: '0 auto 20px' }}>
                        <Building size={32} />
                    </div>
                    <h1 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '10px', color: 'var(--text-primary)' }}>Iniciar Sesión</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Plataforma de Prospección Estratégica</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ position: 'relative' }}>
                        <Mail style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} size={20} />
                        <input 
                            required 
                            type="text" 
                            placeholder="Correo electrónico o Usuario" 
                            style={{ width: '100%', paddingLeft: '45px' }} 
                            value={formData.identifier}
                            onChange={(e) => setFormData({...formData, identifier: e.target.value})}
                        />
                    </div>

                    <div>
                        <div style={{ position: 'relative' }}>
                            <Lock style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} size={20} />
                            <input 
                                required 
                                type="password" 
                                placeholder="Tu contraseña" 
                                style={{ width: '100%', paddingLeft: '45px' }} 
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>
                        <div style={{ textAlign: 'right', marginTop: '8px' }}>
                            <Link to="/forgot-password" style={{ color: 'var(--accent)', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
                    </div>

                    <Button disabled={loading} style={{ marginTop: '10px' }}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Iniciar Sesión"}
                    </Button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '25px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    ¿No tienes cuenta? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: '700', textDecoration: 'none' }}>Regístrate aquí</Link>
                </p>
            </Card>
        </div>
    );
};

export default Login;
