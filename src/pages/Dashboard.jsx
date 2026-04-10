import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../components/UI';
import { Users, Building2, Send, MessageSquare, MapPin, Loader2, Sparkles } from 'lucide-react';
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
        const response = await api.get('/api/companies/stats', { headers: { 'x-token': token } });
        setStats((prev) => ({
          ...prev,
          totalCompanies: response.data.totalCompanies,
          totalContacts: response.data.totalContacts,
          statsByCountry: response.data.statsByCountry || []
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = useMemo(() => [
    { label: 'Empresas Encontradas', value: stats.totalCompanies, icon: <Building2 size={24} />, color: '#3b82f6' },
    { label: 'Contactos Extraídos', value: stats.totalContacts, icon: <Users size={24} />, color: '#8b5cf6' },
    { label: 'Campañas Enviadas', value: stats.campaignsSent, icon: <Send size={24} />, color: '#10b981' },
    { label: 'Respuestas Recibidas', value: stats.responses, icon: <MessageSquare size={24} />, color: '#f59e0b' }
  ], [stats]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><Loader2 className="animate-spin" size={48} color="var(--accent)" /></div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '900', marginBottom: '6px' }}>Dashboard Comercial</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Resumen de prospección en Centroamérica</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {cards.map((item) => (
          <Card key={item.label} hover={false} style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{ width: '58px', height: '58px', borderRadius: '18px', backgroundColor: `${item.color}20`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</div>
            <div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '600' }}>{item.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: '900' }}>{item.value}</div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)', gap: '20px' }}>
        <Card hover={false} style={{ minHeight: '380px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '900' }}>Actividad reciente</h3>
            <Sparkles color="#38bdf8" />
          </div>
          <div style={{ flex: 1, borderRadius: '24px', border: '1px dashed var(--border)', background: 'linear-gradient(180deg, rgba(56,189,248,0.06), transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '32px' }}>
            <div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px' }}>Tu panel ya está listo</h4>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '520px' }}>Cuando realices nuevas búsquedas y campañas, aquí se irán reflejando las empresas, contactos y movimientos recientes.</p>
            </div>
          </div>
        </Card>

        <Card hover={false} style={{ minHeight: '380px' }}>
          <h3 style={{ fontSize: '1.6rem', fontWeight: '900', marginBottom: '20px' }}>Distribución por país</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {stats.statsByCountry.length > 0 ? stats.statsByCountry.map((item) => (
              <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                <MapPin size={18} color="#8b5cf6" />
                <span style={{ flex: 1, fontWeight: '700' }}>{item._id || 'Sin país'}</span>
                <span style={{ fontWeight: '900' }}>{item.count}</span>
              </div>
            )) : <p style={{ color: 'var(--text-muted)' }}>Sin datos geográficos aún.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
