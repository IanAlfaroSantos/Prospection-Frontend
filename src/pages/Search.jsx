import React, { useMemo, useState } from 'react';
import { Card, Button } from '../components/UI';
import { Search as SearchIcon, Globe, MapPin, Building2, Loader2, ChevronDown, ExternalLink, Phone, MessageCircle, Mail } from 'lucide-react';
import api from '../service/api.jsx';
import { toast } from 'react-hot-toast';

const Search = () => {
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('Guatemala');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
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
        if (!query.trim()) return toast.error('Escribe o elegí una categoría');
        setLoading(true);
        try {
            const response = await api.post('/api/search/start', {
                category: query.trim(),
                country: location,
                maxResults: 10
            });
            setResults(response.data.results || []);
            if (!response.data.results?.length) toast('No se encontraron empresas reales con esa búsqueda.');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error en la búsqueda');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1320px', margin: '0 auto', height: '100%', overflowY: 'auto', paddingBottom: '48px' }}>
            <header style={{ marginBottom: '42px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '48px', fontWeight: '900', letterSpacing: '-0.06em', marginBottom: '12px' }}>
                    Buscador de <span style={{ color: 'var(--accent)' }}>Oportunidades</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '20px' }}>Encuentra empresas reales y útiles para prospección comercial</p>
            </header>

            <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr auto', gap: '20px', alignItems: 'center', marginBottom: '34px' }}>
                <div style={{ position: 'relative' }}>
                    <div style={{ width: '100%', minHeight: '68px', borderRadius: '18px', background: 'var(--bg-accent)', border: '1px solid var(--border)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px 0 16px', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, flex: 1 }}>
                            <Building2 size={22} color="var(--accent)" />
                            <input
                                value={query}
                                onChange={(e) => { setQuery(e.target.value); setShowQueryDropdown(true); }}
                                onFocus={() => setShowQueryDropdown(true)}
                                placeholder="¿Qué tipo de empresa buscas?"
                                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '16px', fontWeight: '800' }}
                            />
                        </div>
                        <button type="button" onClick={() => setShowQueryDropdown((v) => !v)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
                            <ChevronDown size={20} />
                        </button>
                    </div>
                    {showQueryDropdown && (
                        <div style={{ position: 'absolute', top: 'calc(100% + 10px)', left: 0, right: 0, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '18px', overflow: 'hidden', zIndex: 20, boxShadow: '0 22px 40px rgba(0,0,0,.35)' }}>
                            {filteredSectors.map((sector) => (
                                <button key={sector} type="button" onMouseDown={() => { setQuery(sector); setShowQueryDropdown(false); }} style={{ width: '100%', textAlign: 'left', padding: '16px 18px', color: 'var(--text-primary)', background: 'transparent', borderBottom: '1px solid var(--border)', fontWeight: '700' }}>
                                    {sector}
                                </button>
                            ))}
                            {query.trim() && !commonSectors.some((sector) => sector.toLowerCase() === query.trim().toLowerCase()) && (
                                <button type="button" onMouseDown={() => setShowQueryDropdown(false)} style={{ width: '100%', textAlign: 'left', padding: '16px 18px', color: 'var(--accent)', background: 'rgba(99,102,241,0.08)', border: 'none', fontWeight: '800' }}>
                                    Buscar con categoría personalizada: {query.trim()}
                                </button>
                            )}
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
                        <Card key={`${company._id || company.website || company.link}-${index}`} hover={false} style={{ padding: '28px', minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
                                    <h3 style={{ fontSize: '28px', fontWeight: '900', lineHeight: '1.1', flex: 1 }}>{company.title}</h3>
                                    <span style={{ flexShrink: 0, height: '32px', padding: '0 14px', display: 'inline-flex', alignItems: 'center', borderRadius: '999px', background: 'var(--accent-light)', color: 'var(--accent)', fontWeight: '900', fontSize: '12px' }}>REAL #{index + 1}</span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-secondary)', fontSize: '16px' }}>
                                    {(company.fullAddress || company.country) && (
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                            <MapPin size={17} color="var(--accent)" style={{ marginTop: '3px', flexShrink: 0 }} />
                                            <span>{company.fullAddress || company.country}</span>
                                        </div>
                                    )}
                                    {company.phone && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Phone size={17} color="var(--accent)" />
                                            <span>{company.phone}{company.extension ? ` Ext. ${company.extension}` : ''}</span>
                                        </div>
                                    )}
                                    {company.whatsapp && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <MessageCircle size={17} color="var(--accent)" />
                                            <span>{company.whatsapp}</span>
                                        </div>
                                    )}
                                    {company.email && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', wordBreak: 'break-all' }}>
                                            <Mail size={17} color="var(--accent)" />
                                            <span>{company.email}</span>
                                        </div>
                                    )}
                                    <div style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
                                        {(company.category || query)}{company.subcategory ? ` • ${company.subcategory}` : ''} • {company.country}
                                    </div>
                                </div>
                            </div>

                            {company.website && (
                                <a href={company.website} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', textDecoration: 'none', wordBreak: 'break-all', marginTop: '18px' }}>
                                    <Globe size={16} color="var(--accent)" /> {company.website} <ExternalLink size={15} />
                                </a>
                            )}
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
