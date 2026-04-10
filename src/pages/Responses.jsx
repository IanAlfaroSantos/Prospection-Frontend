import React, { useState, useEffect } from 'react';
import { Card, Button } from '../components/UI';
import { MessageSquare, ExternalLink, Loader2, UserPlus, Filter } from 'lucide-react';
import api from '../service/api';
import { toast } from 'react-hot-toast';

const Responses = () => {
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResponses = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await api.get('/api/responses', {
                    headers: { 'x-token': token }
                });
                setResponses(response.data);
            } catch (error) {
                console.error("Error fetching responses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchResponses();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'interesado': return { bg: '#22c55e20', text: '#22c55e' };
            case 'pide info': return { bg: '#3b82f620', text: '#3b82f6' };
            case 'dnd': return { bg: '#ef444420', text: '#ef4444' };
            default: return { bg: 'var(--bg-accent)', text: 'var(--text-muted)' };
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <Loader2 className="animate-spin" size={48} color="var(--accent)" />
        </div>
    );

    return (
        <div className="responses-page">
            <header style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Gestión de Respuestas</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Clasificación automática y asignación de leads</p>
            </header>

            <Card style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: 'var(--bg-accent)', borderBottom: '1px solid var(--border)' }}>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '15px 20px', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Contacto / Empresa</th>
                            <th style={{ textAlign: 'left', padding: '15px 20px', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Clasificación</th>
                            <th style={{ textAlign: 'left', padding: '15px 20px', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fecha</th>
                            <th style={{ textAlign: 'left', padding: '15px 20px', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Asignado a</th>
                            <th style={{ textAlign: 'center', padding: '15px 20px', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {responses.length > 0 ? (
                            responses.map((resp) => {
                                const colors = getStatusColor(resp.classification);
                                return (
                                    <tr key={resp._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '15px 20px' }}>
                                            <div style={{ fontWeight: '700' }}>{resp.email}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{resp.company}</div>
                                        </td>
                                        <td style={{ padding: '15px 20px' }}>
                                            <span style={{ 
                                                padding: '4px 12px', 
                                                borderRadius: '20px', 
                                                fontSize: '12px', 
                                                fontWeight: '700',
                                                backgroundColor: colors.bg,
                                                color: colors.text,
                                                textTransform: 'capitalize'
                                            }}>
                                                {resp.classification}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px 20px', fontSize: '14px', color: 'var(--text-muted)' }}>
                                            {new Date(resp.createdAt).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '15px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                                                <UserPlus size={16} /> {resp.assignedTo || 'Sin asignar'}
                                            </div>
                                        </td>
                                        <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                                            <Button variant="cyan" style={{ padding: '8px' }} onClick={() => toast.error("Función en desarrollo")}>
                                                <ExternalLink size={16} />
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ padding: '100px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    <MessageSquare size={48} style={{ marginBottom: '20px', opacity: 0.2 }} />
                                    <h3>Aún no hay respuestas registradas</h3>
                                    <p>Las respuestas de tus campañas aparecerán aquí cuando sean detectadas.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default Responses;
