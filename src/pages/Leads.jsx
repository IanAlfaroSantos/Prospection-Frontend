import React, { useEffect, useMemo, useState } from 'react';
import { Card, Button, Modal } from '../components/UI';
import { Building2, Globe, Mail, Loader2, MapPin, Plus, Send, Users, Info, Trash2, AlertCircle, ExternalLink } from 'lucide-react';
import api from '../service/api';
import { toast } from 'react-hot-toast';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [composeModal, setComposeModal] = useState({ open: false, type: 'single', target: null });
  const [emailData, setEmailData] = useState({ subject: '', body: '' });
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', website: '', sector: '', country: '' });
  const [newContactEmail, setNewContactEmail] = useState('');
  const [addingContact, setAddingContact] = useState(false);

  const token = localStorage.getItem('token');

  const fetchLeads = async () => {
    try {
      const response = await api.get('/api/companies', { headers: { 'x-token': token } });
      setLeads(response.data || []);
    } catch {
      toast.error('Error al cargar los leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const openDetails = async (id) => {
    setDetailsLoading(true);
    try {
      const response = await api.get(`/api/companies/${id}`, { headers: { 'x-token': token } });
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
    if (!newContactEmail.trim()) return toast.error('Ingresa un correo');
    setAddingContact(true);
    try {
      const response = await api.post(`/api/companies/${selectedLead._id}/contacts`, { email: newContactEmail, type: 'General' }, { headers: { 'x-token': token } });
      if (response.data.success) {
        const nextContacts = response.data.duplicated ? selectedLead.contacts || [] : [...(selectedLead.contacts || []), response.data.contact];
        setSelectedLead({ ...selectedLead, contacts: nextContacts });
        setNewContactEmail('');
        await fetchLeads();
        toast.success(response.data.duplicated ? 'Ese contacto ya existe' : 'Contacto añadido');
      }
    } catch {
      toast.error('Error al guardar el contacto');
    } finally {
      setAddingContact(false);
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await api.delete(`/api/companies/contact/${id}`, { headers: { 'x-token': token } });
      setSelectedLead({ ...selectedLead, contacts: (selectedLead.contacts || []).filter((item) => item._id !== id) });
      await fetchLeads();
      toast.success('Contacto eliminado');
    } catch {
      toast.error('No se pudo eliminar');
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setSendingEmail(true);
    try {
      const url = composeModal.type === 'mass' ? '/api/companies/mass-email' : `/api/companies/${composeModal.target}/contact`;
      await api.post(url, emailData, { headers: { 'x-token': token } });
      toast.success('Mensaje enviado');
      setComposeModal({ open: false, type: 'single', target: null });
      setEmailData({ subject: '', body: '' });
    } catch {
      toast.error('Error al enviar el correo');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleCreateManual = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/companies', newLead, { headers: { 'x-token': token } });
      toast.success('Empresa agregada');
      setManualModalOpen(false);
      setNewLead({ name: '', website: '', sector: '', country: '' });
      await fetchLeads();
    } catch {
      toast.error('Error al crear la empresa');
    }
  };

  const stats = useMemo(() => ({ total: leads.length, withContacts: leads.filter((lead) => (lead.contactCount || 0) > 0).length }), [leads]);

  return (
    <div style={{ paddingBottom: '80px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.8rem)', fontWeight: '900', letterSpacing: '-0.06em' }}>Gestión de <span style={{ color: 'var(--accent)' }}>Leads</span></h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem' }}>Convierte oportunidades en clientes reales</p>
        </div>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <Button variant="cyan" onClick={() => setComposeModal({ open: true, type: 'mass', target: null })}><Users size={20} /> ENVÍO MASIVO</Button>
          <Button variant="success" onClick={() => setManualModalOpen(true)}><Plus size={20} /> NUEVA EMPRESA</Button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
        <Card hover={false}><div style={{ color: 'var(--text-secondary)', fontWeight: '700' }}>Leads registrados</div><div style={{ fontSize: '2rem', fontWeight: '900' }}>{stats.total}</div></Card>
        <Card hover={false}><div style={{ color: 'var(--text-secondary)', fontWeight: '700' }}>Con contactos</div><div style={{ fontSize: '2rem', fontWeight: '900' }}>{stats.withContacts}</div></Card>
      </div>

      {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '90px' }}><Loader2 className="animate-spin" size={60} color="var(--accent)" /></div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '26px' }}>
          {leads.map((lead) => (
            <Card key={lead._id} hover={false} style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
              <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ width: '66px', height: '66px', background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 12px 24px rgba(99,102,241,0.28)' }}>
                    <Building2 size={34} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '900', background: 'var(--bg-accent)', color: 'var(--text-primary)', padding: '7px 14px', borderRadius: '12px', border: '1px solid var(--border)' }}>{lead.source || 'Directo'}</span>
                    {(lead.contactCount || 0) === 0 && <span style={{ color: '#ff5d73', fontSize: '12px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle size={14} /> REQUIERE CONTACTOS</span>}
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '10px', lineHeight: 1.15 }}>{lead.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '15px' }}><MapPin size={18} color="var(--accent)" /> {lead.country || 'Global'} • {lead.sector || 'General'}</div>
                </div>
              </div>

              <div style={{ padding: '24px 28px 28px', backgroundColor: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <Button variant="cyan" onClick={() => handleWriteEmail(lead)} style={{ fontSize: '13px', padding: '12px' }}><Send size={16} /> REDACTAR CORREO</Button>
                <Button variant="warning" onClick={() => openDetails(lead._id)} style={{ fontSize: '13px', padding: '12px' }}><Info size={16} /> DETALLES</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={Boolean(selectedLead)} onClose={() => setSelectedLead(null)} title="PERFIL ESTRATÉGICO" maxWidth="1180px">
        {detailsLoading || !selectedLead ? <div style={{ textAlign: 'center', padding: '50px' }}><Loader2 className="animate-spin" size={44} color="var(--accent)" /></div> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 360px) minmax(0, 1fr)', gap: '26px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ width: '210px', height: '210px', borderRadius: '36px', background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 18px 40px rgba(99,102,241,0.25)' }}>
                <Building2 size={92} />
              </div>
              <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '900', lineHeight: 1.08 }}>{selectedLead.name}</h3>
              {selectedLead.website && (
                <a href={selectedLead.website} target="_blank" rel="noreferrer" className="link-wrap" style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', textDecoration: 'none', fontSize: '15px', fontWeight: '700' }}>
                  <Globe size={18} color="var(--accent)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span style={{ flex: 1 }}>{selectedLead.website}</span>
                  <ExternalLink size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                </a>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: '700' }}><MapPin size={18} color="var(--accent)" /> {selectedLead.country || 'Sin país'}</div>
              <Button variant="cyan" onClick={() => handleWriteEmail(selectedLead)} fullWidth><Send size={18} /> REDACTAR CORREO</Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', minWidth: 0 }}>
              <Card hover={false} style={{ padding: '28px' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', fontWeight: '900', marginBottom: '18px' }}><Users size={22} color="var(--accent)" /> CONTACTOS REGISTRADOS</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(selectedLead.contacts || []).length > 0 ? selectedLead.contacts.map((contact) => (
                    <div key={contact._id} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', alignItems: 'center', gap: '12px', padding: '16px 18px', borderRadius: '18px', backgroundColor: 'rgba(255,255,255,0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '14px', backgroundColor: 'rgba(109,40,217,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mail size={18} color="var(--accent)" /></div>
                        <span className="link-wrap" style={{ fontWeight: '800' }}>{contact.email}</span>
                      </div>
                      <Button variant="danger" onClick={() => handleDeleteContact(contact._id)} style={{ padding: '10px 12px', minWidth: 'unset' }}><Trash2 size={16} /></Button>
                    </div>
                  )) : <p style={{ color: 'var(--text-muted)', padding: '12px 0' }}>No hay contactos aún.</p>}
                </div>
              </Card>

              <Card hover={false} style={{ border: '1px dashed var(--border)', padding: '28px' }}>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '18px' }}>Añadir Nuevo Contacto</h4>
                <form onSubmit={handleAddContact} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '14px', alignItems: 'center' }}>
                  <input value={newContactEmail} onChange={(e) => setNewContactEmail(e.target.value)} placeholder="correo@ejemplo.com" style={{ minWidth: 0, height: '56px', fontSize: '16px' }} />
                  <Button type="submit" variant="secondary" disabled={addingContact} style={{ height: '56px', width: '56px', padding: 0, borderRadius: '16px' }}><Plus size={22} /></Button>
                </form>
              </Card>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={manualModalOpen} onClose={() => setManualModalOpen(false)} title="REGISTRAR NUEVA EMPRESA" maxWidth="760px">
        <form onSubmit={handleCreateManual} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontWeight: '800', color: 'var(--text-secondary)' }}>NOMBRE COMERCIAL
            <input required placeholder="Ej: Seguros Bolívar" style={{ padding: '18px' }} value={newLead.name} onChange={(e) => setNewLead({ ...newLead, name: e.target.value })} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontWeight: '800', color: 'var(--text-secondary)' }}>SITIO WEB OFICIAL
            <input placeholder="https://www.empresa.com" style={{ padding: '18px' }} value={newLead.website} onChange={(e) => setNewLead({ ...newLead, website: e.target.value })} />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontWeight: '800', color: 'var(--text-secondary)' }}>PAÍS
              <input required placeholder="Ej: Honduras" style={{ padding: '18px' }} value={newLead.country} onChange={(e) => setNewLead({ ...newLead, country: e.target.value })} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontWeight: '800', color: 'var(--text-secondary)' }}>SECTOR INDUSTRIAL
              <input required placeholder="Ej: Banca" style={{ padding: '18px' }} value={newLead.sector} onChange={(e) => setNewLead({ ...newLead, sector: e.target.value })} />
            </label>
          </div>
          <Button type="submit" variant="primary" fullWidth style={{ marginTop: '10px', minHeight: '56px' }}><Plus size={18} /> AGREGAR EMPRESA</Button>
        </form>
      </Modal>

      <Modal isOpen={composeModal.open} onClose={() => setComposeModal({ open: false, type: 'single', target: null })} title={composeModal.type === 'mass' ? 'ENVÍO MASIVO' : 'REDACTAR CORREO'} maxWidth="760px">
        <form onSubmit={handleSendEmail} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input required placeholder="Asunto del correo" value={emailData.subject} onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })} style={{ padding: '18px' }} />
          <textarea required placeholder="Escribe el mensaje..." value={emailData.body} onChange={(e) => setEmailData({ ...emailData, body: e.target.value })} rows={9} style={{ resize: 'vertical', padding: '18px' }} />
          <Button type="submit" variant="cyan" disabled={sendingEmail} fullWidth>{sendingEmail ? <Loader2 className="animate-spin" size={18} /> : <><Send size={18} /> ENVIAR CORREO</>}</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Leads;
