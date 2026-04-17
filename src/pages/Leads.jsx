import React, { useEffect, useMemo, useState } from 'react';
import { Card, Button, Modal } from '../components/UI';
import { Building2, Globe, Mail, Loader2, MapPin, Plus, Send, Users, Info, Trash2, AlertCircle, Phone, MessageCircle } from 'lucide-react';
import api from '../service/api.jsx';
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';

const Leads = () => {
    const [searchParams] = useSearchParams();
    const selectedCategory = searchParams.get('category') || 'Todos';
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [sendingEmail, setSendingEmail] = useState(false);
    const [composeModal, setComposeModal] = useState({ open: false, type: 'single', target: null });
    const [emailData, setEmailData] = useState({ subject: '', body: '' });
    const [manualModalOpen, setManualModalOpen] = useState(false);
    const [newLead, setNewLead] = useState({ name: '', website: '', sector: '', country: '', address: '', contacts: [] });
    const [newContactEmail, setNewContactEmail] = useState('');
    const [addingContact, setAddingContact] = useState(false);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const query = selectedCategory !== 'Todos' ? `?category=${encodeURIComponent(selectedCategory)}` : '';
            const response = await api.get(`/api/companies${query}`);
            setLeads(response.data);
        } catch {
            toast.error('Error al cargar las empresas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, [selectedCategory]);

    const openDetails = async (id) => {
        setDetailsLoading(true);
        try {
            const response = await api.get(`/api/companies/${id}`);
            setSelectedLead(response.data);
        } catch {
            toast.error('Error al obtener detalles');
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleWriteEmail = (lead) => {
        const hasContacts = (lead.contactCount > 0) || (lead.contacts && lead.contacts.length > 0);
        if (!hasContacts) {
            toast.error(`La empresa "${lead.name}" no tiene contactos registrados.`);
            openDetails(lead._id || lead.id);
            return;
        }
        setComposeModal({ open: true, type: 'single', target: lead._id || lead.id });
    };

    const handleAddContact = async (e) => {
        e.preventDefault();
        if (!newContactEmail) return toast.error('Ingresa un correo');
        setAddingContact(true);
        try {
            const response = await api.post(`/api/companies/${selectedLead._id}/contacts`, { email: newContactEmail, type: 'General' });
            if (response.data.success) {
                toast.success('¡Contacto añadido!');
                setSelectedLead({ ...selectedLead, contacts: [...(selectedLead.contacts || []), response.data.contact] });
                setNewContactEmail('');
                fetchLeads();
            }
        } catch {
            toast.error('Error al guardar el contacto');
        } finally {
            setAddingContact(false);
        }
    };

    const handleDeleteContact = async (id) => {
        if (!id) return;
        try {
            await api.delete(`/api/companies/contact/${id}`);
            setSelectedLead({ ...selectedLead, contacts: (selectedLead.contacts || []).filter((c) => c._id !== id) });
            toast.success('Eliminado');
            fetchLeads();
        } catch {
            toast.error('No se pudo eliminar');
        }
    };

    const handleSendEmail = async (e) => {
        e.preventDefault();
        setSendingEmail(true);
        try {
            const url = composeModal.type === 'mass'
                ? '/api/companies/mass-email'
                : `/api/companies/${composeModal.target}/contact`;
            const payload = composeModal.type === 'mass'
                ? { ...emailData, category: selectedCategory }
                : emailData;
            await api.post(url, payload);
            toast.success('¡Mensaje enviado!');
            setComposeModal({ open: false, type: 'single', target: null });
            setEmailData({ subject: '', body: '' });
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error al enviar');
        } finally {
            setSendingEmail(false);
        }
    };

    const handleCreateManual = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/companies', newLead);
            toast.success('Empresa añadida');
            setManualModalOpen(false);
            fetchLeads();
            setNewLead({ name: '', website: '', sector: '', country: '', address: '', contacts: [] });
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error al crear la empresa');
        }
    };

    const companiesWithoutContacts = useMemo(() => leads.filter((l) => (l.contactCount || 0) === 0), [leads]);
    const titleSuffix = selectedCategory === 'Todos' ? 'Empresas' : selectedCategory;

    return (
        <div style={{ paddingBottom: '80px', height: '100%', overflowY: 'auto' }}>
            <header style={{ marginBottom: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '48px', fontWeight: '900', letterSpacing: '-0.06em' }}>Gestión de <span style={{ color: 'var(--accent)' }}>{titleSuffix}</span></h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '20px', fontWeight: '500' }}>
                        {selectedCategory === 'Todos' ? 'Administra todas las empresas registradas' : `Empresas filtradas por categoría: ${selectedCategory}`}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <Button variant="cyan" onClick={() => setComposeModal({ open: true, type: 'mass', target: null })}>
                        <Users size={20} /> CORREO MASIVO
                    </Button>
                    <Button variant="success" onClick={() => setManualModalOpen(true)}>
                        <Plus size={20} /> NUEVA EMPRESA
                    </Button>
                </div>
            </header>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
                    <Loader2 className="animate-spin" size={64} color="var(--accent)" />
                </div>
            ) : leads.length === 0 ? (
                <div style={{ border: '1px dashed var(--border)', borderRadius: '22px', padding: '60px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No hay empresas registradas en esta categoría.
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '28px' }}>
                    {leads.map((lead) => (
                        <Card key={lead._id} style={{ display: 'flex', flexDirection: 'column', padding: '0', minHeight: '360px' }}>
                            <div style={{ padding: '35px', flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
                                    <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)' }}>
                                        <Building2 size={34} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: '900', background: 'var(--bg-accent)', color: 'var(--text-primary)', padding: '6px 14px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                            {lead.source || 'Directo'}
                                        </span>
                                        {(lead.contactCount || 0) === 0 && (
                                            <span style={{ color: '#ff4757', fontSize: '12px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <AlertCircle size={14} /> REQUIERE CONTACTOS
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <h3 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '12px', lineHeight: '1.2' }}>{lead.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '15px', marginBottom: '10px' }}>
                                    <MapPin size={18} color="var(--accent)" /> {(lead.fullAddress || lead.address || lead.country || 'Ubicación no disponible')} • {lead.sector}
                                </div>
                                {lead.website && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '14px', wordBreak: 'break-all' }}>
                                        <Globe size={16} color="var(--accent)" />
                                        <a href={lead.website} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{lead.website}</a>
                                    </div>
                                )}
                            </div>
                            <div style={{ padding: '30px', backgroundColor: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <Button variant="cyan" onClick={() => handleWriteEmail(lead)} style={{ fontSize: '13px', padding: '12px' }}>
                                    <Send size={16} /> REDACTAR CORREO
                                </Button>
                                <Button variant="warning" onClick={() => openDetails(lead._id)} style={{ fontSize: '13px', padding: '12px' }}>
                                    {detailsLoading && selectedLead?._id === lead._id ? <Loader2 className="animate-spin" size={16} /> : <Info size={16} />}
                                    {detailsLoading && selectedLead?._id === lead._id ? '' : 'DETALLES'}
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <Modal isOpen={!!selectedLead} onClose={() => setSelectedLead(null)} title="PERFIL ESTRATÉGICO" maxWidth="1000px">
                {selectedLead && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 2fr', gap: '40px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: '150px', height: '150px', background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)', borderRadius: '40px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
                                <Building2 size={80} />
                            </div>
                            <h2 style={{ fontSize: '30px', fontWeight: '900', marginBottom: '20px', lineHeight: '1.2' }}>{selectedLead.name}</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', marginBottom: '40px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '16px' }}>
                                    <Globe size={20} color="var(--accent)" /> <a href={selectedLead.website} target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', wordBreak: 'break-all' }}>{selectedLead.website}</a>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '16px' }}>
                                    <MapPin size={20} color="var(--accent)" /> {selectedLead.fullAddress || selectedLead.address || selectedLead.country}
                                </div>
                                {selectedLead.landline && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '16px' }}>
                                        <Phone size={20} color="var(--accent)" /> {selectedLead.landline}
                                    </div>
                                )}
                                {selectedLead.phone && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '16px' }}>
                                        <Phone size={20} color="var(--accent)" /> {selectedLead.phone}
                                    </div>
                                )}
                                {selectedLead.whatsapp && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '16px' }}>
                                        <MessageCircle size={20} color="var(--accent)" /> {selectedLead.whatsapp}
                                    </div>
                                )}
                                {selectedLead.email && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '16px', wordBreak: 'break-all' }}>
                                        <Mail size={20} color="var(--accent)" /> {selectedLead.email}
                                    </div>
                                )}
                                {selectedLead.extension && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '16px' }}>
                                        <Phone size={20} color="var(--accent)" /> Ext. {selectedLead.extension}
                                    </div>
                                )}
                            </div>
                            <Button variant="cyan" fullWidth onClick={() => handleWriteEmail(selectedLead)}>
                                <Send size={24} /> REDACTAR CORREO
                            </Button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                            <div style={{ padding: '35px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '32px', border: '1px solid var(--border)' }}>
                                <h3 style={{ marginBottom: '30px', fontWeight: '900', fontSize: '22px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <Users size={28} color="var(--accent)" /> CONTACTOS REGISTRADOS
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                    {(!selectedLead.contacts || selectedLead.contacts.length === 0) ? (
                                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No hay contactos aún.</p>
                                    ) : (
                                        selectedLead.contacts.map((c, idx) => (
                                            <div key={idx} style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px', overflow: 'hidden' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div style={{ padding: '8px', backgroundColor: 'var(--accent-light)', borderRadius: '10px' }}>
                                                            <Mail size={16} style={{ color: 'var(--accent)' }} />
                                                        </div>
                                                        <strong style={{ fontSize: '15px', color: 'var(--text-primary)', wordBreak: 'break-all' }}>{c.email}</strong>
                                                    </div>
                                                    <Button variant="danger" style={{ padding: '8px 12px', borderRadius: '10px' }} onClick={() => handleDeleteContact(c._id)}>
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                            <div style={{ padding: '35px', border: '2px dashed var(--border)', borderRadius: '32px', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                                <h4 style={{ fontSize: '18px', fontWeight: '900', marginBottom: '25px' }}>Añadir Nuevo Contacto</h4>
                                <form onSubmit={handleAddContact} style={{ display: 'flex', gap: '20px' }}>
                                    <input placeholder="correo@ejemplo.com" type="email" required style={{ flex: 1, padding: '18px', fontSize: '16px', borderRadius: '18px' }} value={newContactEmail} onChange={(e) => setNewContactEmail(e.target.value)} />
                                    <Button type="submit" variant="cyan" style={{ borderRadius: '18px', padding: '18px' }}>
                                        {addingContact ? <Loader2 className="animate-spin" size={20} /> : <Plus size={28} />}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal isOpen={composeModal.open} onClose={() => setComposeModal({ ...composeModal, open: false })} title="REDACTAR MENSAJE" maxWidth="850px">
                <form onSubmit={handleSendEmail} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {composeModal.type === 'mass' && companiesWithoutContacts.length > 0 && (
                        <div style={{ padding: '30px', backgroundColor: 'rgba(244, 63, 94, 0.1)', borderRadius: '28px', border: '1px solid #f43f5e' }}>
                            <div style={{ display: 'flex', gap: '15px', color: '#f43f5e', fontWeight: '900', marginBottom: '15px', fontSize: '18px' }}>
                                <AlertCircle size={26} /> PANEL DE EXCLUSIÓN CRÍTICA
                            </div>
                            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                                El sistema omitirá a las siguientes <strong>{companiesWithoutContacts.length} empresas</strong> por falta de contactos.
                            </p>
                        </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-muted)' }}>ASUNTO ESTRATÉGICO</label>
                        <input required placeholder="Escribe un asunto que atraiga la atención..." style={{ width: '100%', padding: '22px', fontSize: '17px', fontWeight: '800' }} value={emailData.subject} onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-muted)' }}>CUERPO DEL MENSAJE</label>
                        <textarea required placeholder="Redacta tu propuesta de valor aquí..." style={{ width: '100%', height: '350px', padding: '30px', borderRadius: '28px', fontSize: '18px', lineHeight: '1.6', resize: 'none' }} value={emailData.body} onChange={(e) => setEmailData({ ...emailData, body: e.target.value })} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', marginTop: '10px' }}>
                        <Button variant="danger" type="button" onClick={() => setComposeModal({ ...composeModal, open: false })}>CANCELAR</Button>
                        <Button disabled={sendingEmail} style={{ minWidth: '250px' }}>
                            {sendingEmail ? <Loader2 className="animate-spin" size={26} /> : <Send size={26} />}
                            {sendingEmail ? 'ENVIANDO...' : 'ENVIAR AHORA'}
                        </Button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={manualModalOpen} onClose={() => setManualModalOpen(false)} title="REGISTRAR NUEVA EMPRESA">
                <form onSubmit={handleCreateManual} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '900', color: 'var(--text-muted)' }}>NOMBRE COMERCIAL</label>
                        <input placeholder="Ej: Seguros Bolívar" required style={{ padding: '18px' }} value={newLead.name} onChange={(e) => setNewLead({ ...newLead, name: e.target.value })} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '900', color: 'var(--text-muted)' }}>SITIO WEB OFICIAL</label>
                        <input placeholder="https://www.empresa.com" required style={{ padding: '18px' }} value={newLead.website} onChange={(e) => setNewLead({ ...newLead, website: e.target.value })} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label style={{ fontSize: '12px', fontWeight: '900', color: 'var(--text-muted)' }}>PAÍS</label>
                            <input placeholder="Ej: Honduras" required style={{ padding: '18px' }} value={newLead.country} onChange={(e) => setNewLead({ ...newLead, country: e.target.value })} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label style={{ fontSize: '12px', fontWeight: '900', color: 'var(--text-muted)' }}>SECTOR INDUSTRIAL</label>
                            <input placeholder="Ej: Banca" required style={{ padding: '18px' }} value={newLead.sector} onChange={(e) => setNewLead({ ...newLead, sector: e.target.value })} />
                        </div>
                    </div>
                    <Button type="submit" variant="success" fullWidth style={{ marginTop: '10px' }}>AGREGAR EMPRESA</Button>
                </form>
            </Modal>
        </div>
    );
};

export default Leads;
