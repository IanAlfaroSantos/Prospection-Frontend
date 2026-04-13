import React, { useMemo, useState } from 'react';
import { Card, Button } from '../components/UI';
import { Search as SearchIcon, Globe, MapPin, Building2, Loader2, ExternalLink, ChevronDown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../service/api';

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
        return commonSectors.filter((sector) => sector.toLowerCase().includes(query.toLowerCase()));
    }, [query]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query) {
            toast.error('Selecciona un tipo de empresa');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await api.post('/api/search/start', {
                query,
                location,
                maxResults: 8
            }, {
                headers: { 'x-token': token }
            });
            setResults(response.data.results || []);
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error en la búsqueda');
            setResults([]);
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
                country: location || 'Desconocido',
                source: company.source || 'DuckDuckGo'
            }, {
                headers: { 'x-token': token }
            });

            if (response.data.success) {
                toast.success(`¡${company.title} añadido a tus leads!`);
                setProspectedIds((prev) => new Set([...prev, company.link]));
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error al añadir a leads');
        }
    };

    const selectSector = (sector) => {
        setQuery(sector);
        setShowQueryDropdown(false);
    };

    const selectCountry = (country) => {
        setLocation(country);
        setShowLocationDropdown(false);
    };

    return (
        <div style={{ maxWidth: '1240px', margin: '0 auto', paddingBottom: '40px' }}>
            <header style={{ marginBottom: '50px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '48px', fontWeight: '900', letterSpacing: '-0.06em', marginBottom: '15px' }}>
                    Buscador de <span style={{ color: 'var(--accent)' }}>Oportunidades</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '20px' }}>Encuentra empresas ideales para tus servicios en segundos</p>
            </header>

            <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'minmax(280px,1fr) minmax(250px,0.9fr) auto', gap: '20px', alignItems: 'start', marginBottom: '40px' }}>
                <div style={{ position: 'relative' }}>
                    <button type="button" onClick={() => setShowQueryDropdown((v) => !v)} style={{ width: '100%', height: '66px', padding: '0 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-accent)', border: '1px solid var(--border)', borderRadius: '18px', color: 'var(--text-primary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '17px', fontWeight: '800' }}>
                            <Building2 size={22} color='var(--accent)' />
                            {query || '¿Qué tipo de empresa buscas?'}
                        </span>
                        <ChevronDown size={20} />
                    </button>
                    {showQueryDropdown && (
                        <div style={{ position: 'absolute', top: '76px', left: 0, right: 0, background: 'var(--bg-accent)', border: '1px solid var(--border)', borderRadius: '18px', zIndex: 30, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.35)' }}>
                            {filteredSectors.map((sector) => (
                                <button key={sector} type="button" onClick={() => selectSector(sector)} style={{ width: '100%', textAlign: 'left', padding: '16px 18px', color: 'var(--text-primary)', background: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.04)', fontWeight: '700' }}>
                                    {sector}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ position: 'relative' }}>
                    <button type="button" onClick={() => setShowLocationDropdown((v) => !v)} style={{ width: '100%', height: '66px', padding: '0 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-accent)', border: '1px solid var(--border)', borderRadius: '18px', color: 'var(--text-primary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '17px', fontWeight: '800' }}>
                            <MapPin size={22} color='var(--accent)' />
                            {location || 'Ubicación'}
                        </span>
                        <ChevronDown size={20} />
                    </button>
                    {showLocationDropdown && (
                        <div style={{ position: 'absolute', top: '76px', left: 0, right: 0, background: 'var(--bg-accent)', border: '1px solid var(--border)', borderRadius: '18px', zIndex: 30, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.35)' }}>
                            {centralAmericaCountries.map((country) => (
                                <button key={country} type="button" onClick={() => selectCountry(country)} style={{ width: '100%', textAlign: 'left', padding: '16px 18px', color: 'var(--text-primary)', background: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.04)', fontWeight: '700' }}>
                                    {country}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <Button type="submit" variant="cyan" disabled={loading} style={{ height: '66px', minWidth: '220px' }}>
                    {loading ? <Loader2 className="animate-spin" size={22} /> : <><SearchIcon size={22} /> BUSCAR AHORA</>}
                </Button>
            </form>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Loader2 className="animate-spin" size={60} color="var(--accent)" style={{ margin: '0 auto 20px' }} />
                    <p style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>Buscando empresas reales...</p>
                </div>
            ) : results.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                    {results.map((company, index) => (
                        <Card key={`${company.link}-${index}`} hover={false} style={{ padding: 0, display: 'grid', gridTemplateColumns: '1fr 220px', overflow: 'hidden' }}>
                            <div style={{ padding: '30px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', marginBottom: '14px' }}>
                                    <h3 style={{ fontSize: '28px', fontWeight: '900', lineHeight: '1.15' }}>{company.title}</h3>
                                    <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--accent)', backgroundColor: 'var(--accent-light)', padding: '7px 14px', borderRadius: '999px', whiteSpace: 'nowrap' }}>RANKING #{index + 1}</span>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '18px', fontSize: '18px' }}>{company.snippet}</p>
                                <a href={company.link} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: '700', textDecoration: 'none', wordBreak: 'break-all' }}>
                                    <Globe size={16} color='var(--accent)' /> {company.link} <ExternalLink size={14} />
                                </a>
                            </div>
                            <div style={{ borderLeft: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                                <Button variant="cyan" onClick={() => handleProspect(company)} disabled={prospectedIds.has(company.link)} style={{ width: '100%', minHeight: '72px' }}>
                                    {prospectedIds.has(company.link) ? 'YA EN LEADS' : 'AÑADIR A LEADS'}
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card hover={false} style={{ padding: '50px', textAlign: 'center', borderStyle: 'dashed' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>No se encontraron resultados con esa búsqueda. Probá otro sector o país.</p>
                </Card>
            )}
        </div>
    );
};

export default Search;
