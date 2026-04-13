import React, { useState, useEffect } from 'react';
import { Card, Button } from '../components/UI';
import { Send, Plus, Clock, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import api from '../service/api';
import { toast } from 'react-hot-toast';

const Campaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const token = localStorage.getItem('token');
                // FETCH REAL DATA
                const response = await api.get('/api/campaigns', {
                    headers: { 'x-token': token }
                });
                setCampaigns(response.data);
            } catch (error) {
                console.error("Error fetching campaigns:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaigns();
    }, []);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <Loader2 className="animate-spin" size={48} color="var(--accent)" />
        </div>
    );

    return (
        <div className="campaigns-page">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Campañas de Correo</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Gestiona y monitorea tus envíos masivos</p>
                </div>
                <Button style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => toast.error("Función en desarrollo")}>
                    <Plus size={18} /> Nueva Campaña
                </Button>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {campaigns.length > 0 ? (
                    campaigns.map(campaign => (
                        <Card key={campaign._id} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ 
                                padding: '12px', 
                                backgroundColor: 'var(--bg-accent)', 
                                borderRadius: '10px',
                                color: 'var(--accent)'
                            }}>
                                <Send size={24} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{campaign.title}</h3>
                                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Asunto: {campaign.subject}</p>
                            </div>
                            <div style={{ textAlign: 'right', minWidth: '120px' }}>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>ESTADO</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '600' }}>
                                    {campaign.status === 'completado' ? <CheckCircle2 size={16} color="var(--success)" /> : <Clock size={16} color="var(--warning)" />}
                                    {campaign.status}
                                </div>
                            </div>
                            <div style={{ textAlign: 'right', minWidth: '100px' }}>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>ALCANCE</div>
                                <div style={{ fontWeight: '700' }}>{campaign.sentCount} / {campaign.targetCount}</div>
                            </div>
                            <Button variant="warning" onClick={() => toast.error("Función en desarrollo")}>Ver Detalles</Button>
                        </Card>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '100px 0', border: '2px dashed var(--border)', borderRadius: '15px', color: 'var(--text-muted)' }}>
                        <Send size={48} style={{ marginBottom: '20px', opacity: 0.3 }} />
                        <h3>No hay campañas activas</h3>
                        <p>Cuando crees una campaña de correo, aparecerá aquí.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Campaigns;
