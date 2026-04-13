
import React, { useMemo, useState } from 'react';
import { Card, Button } from '../components/UI';
import { Search as SearchIcon, Globe, MapPin, Building2, Loader2, Plus, ChevronDown, ExternalLink } from 'lucide-react';
import api from '../service/api.jsx';
import { toast } from 'react-hot-toast';

const Search = () => {
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('Guatemala');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [saving, setSaving] = useState(new Set());
    const [showQueryDropdown, setShowQueryDropdown] = useState(false);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);

    const commonSectors = ['Tecnología', 'Aseguradoras', 'Servicios Financieros', 'Educación', 'Salud', 'Logística', 'Industria'];
    const centralAmericaCountries = ['Guatemala', 'Belice', 'El Salvador', 'Honduras', 'Nicaragua', 'Costa Rica', 'Panamá'];

    const filteredSectors = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return commonSectors;
        return commonSectors.filter((s) => s.toLowerCase().includes(q));
    }, [query]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return toast.error('Elegí un tipo de empresa');
        setLoading(true);
        try {
            const response = await api.post('/api/search/start', {
                category: query,
                country: location,
                maxResults: 10
            });
            setResults(response.data.results || []);
            if (!response.data.results?.length) toast('No se encontraron resultados con esa búsqueda.');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error en la búsqueda');
        } finally {
            setLoading(false);
        }
    };

    const handleProspect = async (company) => {
        const key = company.link || company.title;
        setSaving((prev) => new Set(prev).add(key));
        try {
            await api.post('/api/companies', {
                name: company.title,
                website: company.link,
                sector: query,
                country: location,
                source: company.source || 'DuckDuckGo'
            });
            toast.success(`${company.title} añadido a leads`);
        } catch (error) {
            toast.error(error?.response?.data?.message || 'No se pudo añadir');
        } finally {
            setSaving((prev) => {
                const next = new Set(prev);
                next.delete(key);
                return next;
            });
        }
    };

    return (
        <div style={{ maxWidth: '1320px', margin: '0 auto', height: '100%', overflowY: 'auto', paddingBottom: '48px' }}>
            <header style={{ marginBottom: '42px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '48px', fontWeight: '900', letterSpacing: '-0.06em', marginBottom: '12px' }}>
                    Buscador de <span style={{ color: 'var(--accent)' }}>Oportunidades</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '20px' }}>Encuentra empresas ideales para tus servicios en segundos</p>
            </header>

            <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr auto', gap: '20px', alignItems: 'center', marginBottom: '34px' }}>
                <div style={{ position: 'relative' }}>
                    <button type="button" onClick={() => setShowQueryDropdown((v) => !v)} style={{ width: '100%', height: '68px', borderRadius: '18px', background: 'var(--bg-accent)', border: '1px solid var(--border)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px 0 16px', fontSize: '16px', fontWeight: '800' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                            <Building2 size={22} color="var(--accent)" />
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{query || '¿Qué tipo de empresa buscas?'}</span>
                        </span>
                        <ChevronDown size={20} />
                    </button>
                    {showQueryDropdown && (
                        <div style={{ position: 'absolute', top: 'calc(100% + 10px)', left: 0, right: 0, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '18px', overflow: 'hidden', zIndex: 20, boxShadow: '0 22px 40px rgba(0,0,0,.35)' }}>
                            {filteredSectors.map((sector) => (
                                <button key={sector} type="button" onMouseDown={() => { setQuery(sector); setShowQueryDropdown(false); }} style={{ width: '100%', textAlign: 'left', padding: '16px 18px', color: 'var(--text-primary)', background: 'transparent', borderBottom: '1px solid var(--border)', fontWeight: '700' }}>
                                    {sector}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ position: 'relative' }}>
                    <button type="button" onClick={() => setShowLocationDropdown((v) => !v)} style={{ width: '100%', height: '68px', borderRadius: '18px', background: 'var(--bg-accent)', border: '1px solid var(--border)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px 0 16px', fontSize: '16px', fontWeight: '800' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                            <MapPin size={22} color="var(--accent)" />
                            <span>{location}</span>
                        </span>
                        <ChevronDown size={20} />
                    </button>
                    {showLocationDropdown && (
                        <div style={{ position: 'absolute', top: 'calc(100% + 10px)', left: 0, right: 0, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '18px', overflow: 'hidden', zIndex: 20, boxShadow: '0 22px 40px rgba(0,0,0,.35)' }}>
                            {centralAmericaCountries.map((country) => (
                                <button key={country} type="button" onMouseDown={() => { setLocation(country); setShowLocationDropdown(false); }} style={{ width: '100%', textAlign: 'left', padding: '16px 18px', color: 'var(--text-primary)', background: 'transparent', borderBottom: '1px solid var(--border)', fontWeight: '700' }}>
                                    {country}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <Button type="submit" variant="cyan" style={{ height: '68px', minWidth: '220px' }} disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" size={22} /> : <><SearchIcon size={22} /> BUSCAR AHORA</>}
                </Button>
            </form>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}><Loader2 className="animate-spin" size={54} color="var(--accent)" /></div>
            ) : results.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '24px' }}>
                    {results.map((company, index) => (
                        <Card key={`${company.link}-${index}`} hover={false} style={{ padding: '28px', minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
                                    <h3 style={{ fontSize: '30px', fontWeight: '900', lineHeight: '1.1', flex: 1 }}>{company.title}</h3>
                                    <span style={{ flexShrink: 0, height: '32px', padding: '0 14px', display: 'inline-flex', alignItems: 'center', borderRadius: '999px', background: 'var(--accent-light)', color: 'var(--accent)', fontWeight: '900', fontSize: '12px' }}>RESULTADO #{index + 1}</span>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '14px', fontSize: '18px' }}>{company.snippet || query}</p>
                                <a href={company.link} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', textDecoration: 'none', wordBreak: 'break-all' }}>
                                    <Globe size={16} color="var(--accent)" /> {company.link} <ExternalLink size={15} />
                                </a>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div style={{ border: '1px dashed var(--border)', borderRadius: '22px', padding: '60px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No se encontraron resultados con esa búsqueda. Probá otro sector o país.
                </div>
            )}
        </div>
    );
};

export default Search;
