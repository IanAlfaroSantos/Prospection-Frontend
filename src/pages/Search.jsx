import React, { useState } from 'react';
import { Card, Button } from '../components/UI';
import { Search as SearchIcon, Globe, MapPin, Building2, Loader2, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Search = () => {
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [prospectedIds, setProspectedIds] = useState(new Set());
    
    const [showQueryDropdown, setShowQueryDropdown] = useState(false);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);

    const commonSectors = ["Tecnología", "Bienes Raíces", "Agencias de Seguros", "Servicios Financieros", "Educación", "Salud y Medicina", "E-commerce"];
    const centralAmericaCountries = ["Guatemala", "Belice", "El Salvador", "Honduras", "Nicaragua", "Costa Rica", "Panamá"];

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('https://prospection-backend-production-fce5.up.railway.app/api/search/start', {
                query,
                location
            }, {
                headers: { 'x-token': token }
            });
            setResults(response.data.results || []);
        } catch (error) {
            toast.error("Error en la búsqueda");
        } finally {
            setLoading(false);
        }
    };

    const handleProspect = async (company) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('https://prospection-backend-production-fce5.up.railway.app/api/companies', {
                name: company.title,
                website: company.link,
                sector: query,
                country: location || 'Desconocido',
                source: 'Google Search'
            }, {
                headers: { 'x-token': token }
            });
            
            if (response.data.success) {
                toast.success(`¡${company.title} añadido a tus leads!`);
                setProspectedIds(prev => new Set([...prev, company.link]));
            }
        } catch (error) {
            toast.error("Error al prospectar");
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ marginBottom: '50px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '48px', fontWeight: '900', letterSpacing: '-0.06em', marginBottom: '15px' }}>
                    Buscador de <span style={{ color: 'var(--accent)' }}>Oportunidades</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '20px' }}>Encuentra empresas ideales para tus servicios en segundos</p>
            </header>

            <Card style={{ marginBottom: '50px', padding: '40px' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: '1 1 300px' }}>
                        <Building2 style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--accent)' }} size={24} />
                        <input 
                            placeholder="¿Qué tipo de empresa buscas?" 
                            style={{ width: '100%', paddingLeft: '55px', height: '60px', fontSize: '16px' }} 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setShowQueryDropdown(true)}
                            onBlur={() => setTimeout(() => setShowQueryDropdown(false), 200)}
                        />
                        {showQueryDropdown && (
                            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '16px', marginTop: '10px', zIndex: 100, boxShadow: '0 20px 40px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
                                {commonSectors.filter(s => s.toLowerCase().includes(query.toLowerCase())).map(sector => (
                                    <div key={sector} onMouseDown={() => { setQuery(sector); setShowQueryDropdown(false); }} style={{ padding: '16px 20px', cursor: 'pointer', borderBottom: '1px solid var(--border)', transition: 'background-color 0.2s', fontWeight: '600' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--bg-accent)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        {sector}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div style={{ position: 'relative', flex: '1 1 200px' }}>
                        <MapPin style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--accent)' }} size={24} />
                        <input 
                            placeholder="Ubicación (Centroamérica)" 
                            readOnly={true}
                            style={{ width: '100%', paddingLeft: '55px', height: '60px', fontSize: '16px', cursor: 'pointer' }} 
                            value={location}
                            onClick={() => setShowLocationDropdown(true)}
                            onBlur={() => setTimeout(() => setShowLocationDropdown(false), 200)}
                        />
                        {showLocationDropdown && (
                            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '16px', marginTop: '10px', zIndex: 100, boxShadow: '0 20px 40px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
                                {centralAmericaCountries.map(country => (
                                    <div key={country} onMouseDown={() => { setLocation(country); setShowLocationDropdown(false); }} style={{ padding: '16px 20px', cursor: 'pointer', borderBottom: '1px solid var(--border)', transition: 'background-color 0.2s', fontWeight: '600' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--bg-accent)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        {country}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <Button type="submit" variant="primary" disabled={loading} style={{ flex: '1 1 150px', height: '60px', padding: '0 40px' }}>
                        {loading ? <Loader2 className="animate-spin" size={24} /> : <><SearchIcon size={24} /> BUSCAR AHORA</>}
                    </Button>
                </form>
            </Card>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Loader2 className="animate-spin" size={60} color="var(--accent)" style={{ margin: '0 auto 20px' }} />
                    <p style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>Analizando el mercado y filtrando resultados...</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '25px' }}>
                    {results.map((company, index) => (
                        <Card key={index} style={{ padding: '0', display: 'flex', overflow: 'hidden' }}>
                            <div style={{ padding: '30px', flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                    <h3 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-primary)' }}>{company.title}</h3>
                                    <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--accent)', backgroundColor: 'var(--accent-light)', padding: '6px 14px', borderRadius: '12px' }}>RANKING #{index + 1}</span>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.6' }}>{company.snippet}</p>
                                <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Globe size={16} color="var(--accent)" /> {company.link}</span>
                                </div>
                            </div>
                            <div style={{ width: '220px', backgroundColor: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px', borderLeft: '1px solid var(--border)' }}>
                                {prospectedIds.has(company.link) ? (
                                    <div style={{ color: 'var(--success)', textAlign: 'center' }}>
                                        <CheckCircle2 size={40} style={{ margin: '0 auto 10px' }} />
                                        <p style={{ fontWeight: '900', fontSize: '13px' }}>YA PROSPECTADO</p>
                                    </div>
                                ) : (
                                    <Button variant="primary" onClick={() => handleProspect(company)}>
                                        <Send size={18} /> PROSPECTAR
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ))}
                    {!loading && results.length === 0 && query && (
                        <div style={{ textAlign: 'center', padding: '80px', border: '2px dashed var(--border)', borderRadius: '32px' }}>
                            <p style={{ fontSize: '18px', color: 'var(--text-muted)' }}>No se encontraron más resultados para esta búsqueda. ¡Prueba con otro sector!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;
