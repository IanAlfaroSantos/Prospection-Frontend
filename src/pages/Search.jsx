import React, { useState } from 'react';
import { Card, Button } from '../components/UI';
import { Building2, Globe, Loader2, MapPin, Search as SearchIcon, Send, CheckCircle2, ExternalLink } from 'lucide-react';
import api from '../service/api';
import { toast } from 'react-hot-toast';

const commonSectors = ['Tecnología', 'Aseguradoras', 'Servicios Financieros', 'Educación', 'Salud', 'Logística', 'Industria'];
const centralAmericaCountries = ['Guatemala', 'Belice', 'El Salvador', 'Honduras', 'Nicaragua', 'Costa Rica', 'Panamá'];

const Search = () => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('Guatemala');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prospectedIds, setProspectedIds] = useState(new Set());

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return toast.error('Ingresa un sector o categoría');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/api/search/start', { query, location }, { headers: { 'x-token': token } });
      setResults(response.data.results || []);
      toast.success('Búsqueda completada');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error en la búsqueda');
    } finally {
      setLoading(false);
    }
  };

  const handleProspect = async (company) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/api/companies', {
        name: company.title,
        website: company.link,
        sector: query,
        country: location,
        source: 'DuckDuckGo'
      }, { headers: { 'x-token': token } });

      if (response.data.success) {
        setProspectedIds((prev) => new Set([...prev, company.link]));
        toast.success(`${company.title} guardada en leads`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar la empresa');
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <header style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: '900', marginBottom: '10px' }}>Buscador de <span style={{ color: 'var(--accent)' }}>Oportunidades</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Encuentra empresas ideales para tus servicios en segundos</p>
      </header>

      <Card hover={false} style={{ padding: '28px' }}>
        <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(220px, .9fr) auto', gap: '18px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Building2 style={{ position: 'absolute', left: '16px', top: '18px', color: 'var(--accent)' }} size={22} />
            <input list="sector-options" placeholder="¿Qué tipo de empresa buscas?" style={{ width: '100%', paddingLeft: '50px', height: '58px', fontSize: '16px' }} value={query} onChange={(e) => setQuery(e.target.value)} />
            <datalist id="sector-options">
              {commonSectors.map((sector) => <option key={sector} value={sector} />)}
            </datalist>
          </div>

          <div style={{ position: 'relative' }}>
            <MapPin style={{ position: 'absolute', left: '16px', top: '18px', color: 'var(--accent)' }} size={22} />
            <select value={location} onChange={(e) => setLocation(e.target.value)} style={{ width: '100%', paddingLeft: '50px', height: '58px', fontSize: '16px', appearance: 'none' }}>
              {centralAmericaCountries.map((country) => <option key={country} value={country}>{country}</option>)}
            </select>
          </div>

          <Button type="submit" variant="secondary" disabled={loading} style={{ minHeight: '58px', minWidth: '190px' }}>
            {loading ? <Loader2 className="animate-spin" size={22} /> : <><SearchIcon size={22} /> BUSCAR AHORA</>}
          </Button>
        </form>
      </Card>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <Loader2 className="animate-spin" size={58} color="var(--accent)" style={{ margin: '0 auto 16px' }} />
          <p style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>Buscando resultados públicos en la web...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {results.map((company, index) => (
            <Card key={`${company.link}-${index}`} hover={false} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ width: '58px', height: '58px', borderRadius: '18px', background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Building2 size={28} /></div>
                <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--accent)', backgroundColor: 'var(--accent-light)', padding: '8px 12px', borderRadius: '12px', height: 'fit-content' }}>RANKING #{index + 1}</span>
              </div>

              <div>
                <h3 style={{ fontSize: '1.55rem', fontWeight: '900', lineHeight: 1.2, marginBottom: '10px' }}>{company.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.55, minHeight: '54px' }}>{company.snippet || 'Sin descripción disponible.'}</p>
              </div>

              <a href={company.link} target="_blank" rel="noreferrer" className="link-wrap" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', textDecoration: 'none', fontWeight: '700' }}>
                <Globe size={18} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ flex: 1 }}>{company.link}</span>
                <ExternalLink size={16} style={{ flexShrink: 0 }} />
              </a>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginTop: 'auto' }}>
                {prospectedIds.has(company.link) ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', borderRadius: '16px', padding: '14px', backgroundColor: 'rgba(22, 163, 74, 0.14)', color: 'var(--success)', fontWeight: '900' }}>
                    <CheckCircle2 size={20} /> YA GUARDADA
                  </div>
                ) : (
                  <Button variant="secondary" onClick={() => handleProspect(company)} fullWidth>
                    <Send size={18} /> GUARDAR EN LEADS
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <Card hover={false} style={{ textAlign: 'center', padding: '48px', border: '2px dashed var(--border)' }}>
          <p style={{ fontSize: '18px', color: 'var(--text-muted)' }}>No se encontraron resultados con esa búsqueda. Probá otro sector o país.</p>
        </Card>
      )}
    </div>
  );
};

export default Search;
