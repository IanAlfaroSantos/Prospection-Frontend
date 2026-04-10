import React, { useState } from 'react';
import { Card, Button } from '../components/UI';
import { Mail, Key, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: Code & New Password
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3000/api/auth/forgot-password', { email });
            if (response.data.success) {
                toast.success("Código enviado a tu correo");
                setStep(2);
            }
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al enviar el código");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (code.length !== 6) return toast.error("El código debe ser de 6 dígitos");
        
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3000/api/auth/reset-password', { 
                email, 
                code, 
                newPassword 
            });
            if (response.data.success) {
                toast.success("Contraseña restablecida correctamente");
                navigate('/login');
            }
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al restablecer contraseña");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            height: '100vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            backgroundColor: 'var(--bg-primary)'
        }}>
            <Card style={{ width: '100%', maxWidth: '450px', padding: '40px' }}>
                <Link to="/login" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    color: 'var(--text-muted)', 
                    textDecoration: 'none', 
                    fontSize: '14px',
                    marginBottom: '30px'
                }}>
                    <ArrowLeft size={16} /> Volver al login
                </Link>

                <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '10px' }}>
                    {step === 1 ? 'Recuperar Cuenta' : 'Verificar Código'}
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
                    {step === 1 
                        ? 'Ingresa tu correo registrado para recibir un código de recuperación.' 
                        : `Hemos enviado un código a ${email}. Revisa tu bandeja de entrada.`}
                </p>

                {step === 1 ? (
                    <form onSubmit={handleSendCode}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>Correo Electrónico</label>
                            <div style={{ position: 'relative' }}>
                                <Mail style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} size={20} />
                                <input 
                                    type="email"
                                    required
                                    style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                                    placeholder="ejemplo@correo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <Button disabled={loading} type="submit" style={{ width: '100%', padding: '15px' }}>
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Enviar Código'}
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>Código de 6 dígitos</label>
                            <div style={{ position: 'relative' }}>
                                <ShieldCheck style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} size={20} />
                                <input 
                                    required
                                    maxLength="6"
                                    style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', letterSpacing: '8px', fontWeight: '800', fontSize: '20px' }}
                                    placeholder="000000"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>Nueva Contraseña</label>
                            <div style={{ position: 'relative' }}>
                                <Key style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} size={20} />
                                <input 
                                    type="password"
                                    required
                                    style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button disabled={loading} type="submit" style={{ width: '100%', padding: '15px' }}>
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Restablecer Contraseña'}
                        </Button>
                        
                        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
                            El código expira en 15 minutos. ¿No recibiste nada? 
                            <span onClick={() => setStep(1)} style={{ color: 'var(--accent)', cursor: 'pointer', marginLeft: '5px', fontWeight: '600' }}>Reenviar</span>
                        </p>
                    </form>
                )}
            </Card>
        </div>
    );
};

export default ForgotPassword;
