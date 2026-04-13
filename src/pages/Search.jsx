import React, { useMemo, useState } from 'react';
import { Card, Button } from '../components/UI';
import { Search as SearchIcon, Globe, MapPin, Building2, Loader2, ChevronDown, ExternalLink, CheckCircle2 } from 'lucide-react';
import api from '../service/api.jsx';
import { toast } from 'react-hot-toast';

const dropdownStyle = {
  position: 'absolute',
  top: 'calc(100% + 10px)',
  left: 0,
  right: 0,
  backgroundColor: 'var(--bg-secondary)',
  border: '1px solid var(--border)',
  borderRadius: '16px',
  zIndex: 100,
  boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
  overflow: 'hidden'
};

const fieldStyle = {
  width: '100%',
  paddingLeft: '55px',
  paddingRight: '48px',
  height: '60px',
  fontSize: '16px',
  cursor: 'pointer',
  fontWeight: '700'
};

const Search = () => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('Guatemala');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [prospectedIds, setProspectedIds] = useState(new Set());
  const [showQueryDropdown, setShowQueryDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const commonSectors = ['Tecnología', 'Aseguradoras', 'Servicios Financieros', 'Educación', 'Salud', 'Logística', 'Industria'];
  const centralAmericaCountries = ['Guatemala', 'Belice', 'El Salvador', 'Honduras', 'Nicaragua', 'Costa Rica', 'Panamá'];

  const filteredSectors = useMemo(() => {
    if (!query) return commonSectors;
    return commonSectors.filter((s) => s.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return toast.error('Selecciona un tipo de empresa');
    setLoading(true);
    try {
      const response = await api.post('/api/search/start', { query, location, maxResults: 10 });
      setResults(response.data.results || []);
      if (!response.data.results?.length) toast('No se encontraron resultados con esa búsqueda.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error interno en el buscador. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleProspect = async (company) => {
    try {
      const response = await api.post('/api/companies', {
        name: company.title,
        website: company.link,
        sector: query,
        country: location || 'Desconocido',
        source: company.source || 'DuckDuckGo'
      });
      if (response.data.success) {
        toast.success(`¡${company.title} añadido a tus leads!`);
        setProspectedIds((prev) => new Set([...prev, company.link]));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al prospectar');
    }
  };

  return (
    <div className='page-scroll' style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' }}>
      <header style={{ marginBottom: '50px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '900', letterSpacing: '-0.06em', marginBottom: '15px' }}>
          Buscador de <span style={{ color: 'var(--accent)' }}>Oportunidades</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '20px' }}>Encuentra empresas ideales para tus servicios en segundos</p>
      </header>

      <Card style={{ marginBottom: '40px', padding: '40px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 300px' }}>
            <Building2 style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--accent)' }} size={24} />
            <ChevronDown style={{ position: 'absolute', right: '16px', top: '18px', color: 'var(--text-primary)' }} size={22} />
            <input
              placeholder='¿Qué tipo de empresa buscas?'
              readOnly
              style={fieldStyle}
              value={query}
              onClick={() => setShowQueryDropdown((v) => !v)}
              onBlur={() => setTimeout(() => setShowQueryDropdown(false), 150)}
            />
            {showQueryDropdown && (
              <div style={dropdownStyle}>
                {filteredSectors.map((sector) => (
                  <div
                    key={sector}
                    onMouseDown={() => {
                      setQuery(sector);
                      setShowQueryDropdown(false);
                    }}
                    style={{ padding: '16px 20px', cursor: 'pointer', fontWeight: '700' }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-accent)')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {sector}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ position: 'relative', flex: '1 1 250px' }}>
            <MapPin style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--accent)' }} size={24} />
            <ChevronDown style={{ position: 'absolute', right: '16px', top: '18px', color: 'var(--text-primary)' }} size={22} />
            <input
              placeholder='Ubicación (Centroamérica)'
              readOnly
              style={fieldStyle}
              value={location}
              onClick={() => setShowLocationDropdown((v) => !v)}
              onBlur={() => setTimeout(() => setShowLocationDropdown(false), 150)}
            />
            {showLocationDropdown && (
              <div style={dropdownStyle}>
                {centralAmericaCountries.map((country) => (
                  <div
                    key={country}
                    onMouseDown={() => {
                      setLocation(country);
                      setShowLocationDropdown(false);
                    }}
                    style={{ padding: '16px 20px', cursor: 'pointer', fontWeight: '700' }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-accent)')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {country}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type='submit' variant='cyan' disabled={loading} style={{ flex: '0 0 220px', height: '60px' }}>
            {loading ? <Loader2 className='animate-spin' size={24} /> : <><SearchIcon size={24} /> BUSCAR AHORA</>}
          </Button>
        </form>
      </Card>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Loader2 className='animate-spin' size={60} color='var(--accent)' style={{ margin: '0 auto 20px' }} />
          <p style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>Analizando el mercado y filtrando resultados...</p>
        </div>
      ) : results.length ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          {results.map((company, index) => (
            <Card key={`${company.link}-${index}`} hover={false} style={{ padding: 0, display: 'flex', overflow: 'hidden' }}>
              <div style={{ padding: '28px', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)', lineHeight: 1.2 }}>{company.title}</h3>
                  <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--accent)', backgroundColor: 'var(--accent-light)', padding: '6px 14px', borderRadius: '12px', whiteSpace: 'nowrap' }}>RANKING #{index + 1}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '18px', lineHeight: '1.6' }}>{company.snippet}</p>
                <a href={company.link} target='_blank' rel='noreferrer' style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '700', textDecoration: 'none', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                  <Globe size={16} color='var(--accent)' /> {company.link}
                  <ExternalLink size={14} />
                </a>
              </div>
              <div style={{ width: '220px', padding: '28px', background: 'rgba(255,255,255,0.03)', borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Button variant={prospectedIds.has(company.link) ? 'success' : 'secondary'} onClick={() => handleProspect(company)} disabled={prospectedIds.has(company.link)} fullWidth>
                  {prospectedIds.has(company.link) ? <><CheckCircle2 size={18} /> AÑADIDA</> : 'AÑADIR A LEADS'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card hover={false} style={{ padding: '60px', textAlign: 'center', borderStyle: 'dashed' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>No se encontraron resultados con esa búsqueda. Probá otro sector o país.</p>
        </Card>
      )}
    </div>
  );
};

export default Search;
