import React, { useState, useEffect } from 'react';
import { Card } from '../components/UI';
import { Users, Building2, Send, MessageSquare, TrendingUp, MapPin, Loader2 } from 'lucide-react';
import api from '../service/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalCompanies: 0,
        totalContacts: 0,
        campaignsSent: 0,
        responses: 0,
        statsByCountry: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await api.get('/api/companies/stats', {
                    headers: { 'x-token': token }
                });
                setStats(prev => ({
                    ...prev,
                    totalCompanies: response.data.totalCompanies,
                    totalContacts: response.data.totalContacts,
                    statsByCountry: response.data.statsByCountry
                }));
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Empresas Encontradas', value: stats.totalCompanies, icon: <Building2 className="text-blue-500" />, color: '#3b82f6' },
        { label: 'Contactos Extraídos', value: stats.totalContacts, icon: <Users className="text-purple-500" />, color: '#a855f7' },
        { label: 'Campañas Enviadas', value: stats.campaignsSent, icon: <Send className="text-green-500" />, color: '#10b981' },
        { label: 'Respuestas Recibidas', value: stats.responses, icon: <MessageSquare className="text-orange-500" />, color: '#f59e0b' },
    ];

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <Loader2 className="animate-spin" size={48} color="var(--accent)" />
        </div>
    );

    return (
        <div className="dashboard">
            <header style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Dashboard Comercial</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Resumen de prospección en Centroamérica</p>
            </header>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
                gap: '20px',
                marginBottom: '40px' 
            }}>
                {statCards.map((stat, i) => (
                    <Card key={i} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ 
                            width: '50px', 
                            height: '50px', 
                            borderRadius: '12px', 
                            backgroundColor: `${stat.color}20`, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            color: stat.color
                        }}>
                            {stat.icon}
                        </div>
                        <div>
                            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500' }}>{stat.label}</p>
                            <h3 style={{ fontSize: '24px', fontWeight: '800' }}>{stat.value.toLocaleString()}</h3>
                        </div>
                    </Card>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Actividad de Prospección Reciente</h3>
                        <TrendingUp size={18} color="var(--success)" />
                    </div>
                    <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        El sistema está listo para monitorizar tus nuevas búsquedas.
                    </div>
                </Card>

                <Card>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Distribución por País</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {stats.statsByCountry.length > 0 ? (
                            stats.statsByCountry.map(item => (
                                <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <MapPin size={16} color="var(--text-muted)" />
                                    <span style={{ flex: 1, fontSize: '14px' }}>{item._id}</span>
                                    <span style={{ fontWeight: '700' }}>{item.count}</span>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Sin datos geográficos aún.</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
