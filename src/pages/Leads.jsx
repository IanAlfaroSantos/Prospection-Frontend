import React, { useEffect, useMemo, useState } from 'react';
import { Card, Button, Modal } from '../components/UI';
import { Building2, Mail, Loader2, MapPin, Plus, Send, Info, Trash2, AlertCircle, ExternalLink } from 'lucide-react';
import api from '../service/api.jsx';
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
  const [newLead, setNewLead] = useState({ name: '', website: '', sector: '', country: '', contacts: [] });
  const [newContactEmail, setNewContactEmail] = useState('');
  const [addingContact, setAddingContact] = useState(false);

  const fetchLeads = async () => {
    try {
      const response = await api.get('/api/companies');
      setLeads(response.data);
    } catch {
      toast.error('Error al cargar los leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const companiesWithoutContacts = useMemo(() => leads.filter((l) => (l.contactCount || 0) === 0), [leads]);

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
      const url = composeModal.type === 'mass' ? '/api/companies/mass-email' : `/api/companies/${composeModal.target}/contact`;
      await api.post(url, emailData);
      toast.success('¡Mensaje enviado!');
      setComposeModal({ open: false, type: 'single', target: null });
      setEmailData({ subject: '', body: '' });
    } catch {
      toast.error('Error al enviar');
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
      setNewLead({ name: '', website: '', sector: '', country: '', contacts: [] });
      fetchLeads();
    } catch {
      toast.error('Error al crear la empresa');
    }
  };

  return (
    <div className='page-scroll' style={{ paddingBottom: '80px' }}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: '48px', fontWeight: '900', letterSpacing: '-0.06em' }}>Gestión de <span style={{ color: 'var(--accent)' }}>Leads</span></h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '20px', fontWeight: '500' }}>Convierte oportunidades en clientes reales</p>
        </div>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <Button variant='cyan' onClick={() => setComposeModal({ open: true, type: 'mass', target: null })}><Send size={20} /> ENVÍO MASIVO</Button>
          <Button variant='success' onClick={() => setManualModalOpen(true)}><Plus size={20} /> NUEVA EMPRESA</Button>
        </div>
      </header>

      <div className='leads-summary'>
        <Card hover={false}><div><p style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>Leads registrados</p><h2 style={{ fontSize: '54px', fontWeight: 900 }}>{leads.length}</h2></div></Card>
        <Card hover={false}><div><p style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>Con contactos</p><h2 style={{ fontSize: '54px', fontWeight: 900 }}>{leads.filter((l) => (l.contactCount || 0) > 0).length}</h2></div></Card>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><Loader2 className='animate-spin' size={64} color='var(--accent)' /></div>
      ) : (
        <div className='leads-grid'>
          {leads.map((lead) => (
            <Card key={lead._id} hover={false} className='lead-card' style={{ padding: 0 }}>
              <div style={{ padding: '28px 28px 20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ width: '70px', height: '70px', background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Building2 size={36} /></div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '900', background: 'var(--bg-accent)', color: 'var(--text-primary)', padding: '7px 14px', borderRadius: '12px' }}>{lead.source || 'Directo'}</span>
                    {(lead.contactCount || 0) === 0 && <span style={{ color: '#ff4757', fontSize: '12px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle size={14} /> REQUIERE CONTACTOS</span>}
                  </div>
                </div>
                <div style={{ minHeight: '120px' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '12px', lineHeight: '1.15', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{lead.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '15px' }}><MapPin size={18} color='var(--accent)' /> {lead.country || 'Global'} • {lead.sector}</div>
                </div>
                <div style={{ marginTop: 'auto', paddingTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <Button variant='cyan' onClick={() => handleWriteEmail(lead)} style={{ fontSize: '13px', padding: '12px' }}><Send size={16} /> REDACTAR CORREO</Button>
                  <Button variant='warning' onClick={() => openDetails(lead._id)} style={{ fontSize: '13px', padding: '12px' }}><Info size={16} /> DETALLES</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={!!selectedLead} onClose={() => setSelectedLead(null)} title='PERFIL ESTRATÉGICO' maxWidth='1250px'>
        {detailsLoading || !selectedLead ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><Loader2 className='animate-spin' size={48} color='var(--accent)' /></div>
        ) : (
          <div className='lead-detail-layout'>
            <div style={{ minWidth: 0 }}>
              <div style={{ width: '190px', height: '190px', background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)', borderRadius: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '28px' }}><Building2 size={92} /></div>
              <h2 style={{ fontSize: '32px', fontWeight: '900', lineHeight: 1.08, marginBottom: '18px' }}>{selectedLead.name}</h2>
              {!!selectedLead.website && <a className='detail-link' href={selectedLead.website} target='_blank' rel='noreferrer'><ExternalLink size={18} color='var(--accent)' /> {selectedLead.website}</a>}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '18px', marginBottom: '28px' }}><MapPin size={20} color='var(--accent)' /> {selectedLead.country}</div>
              <Button variant='cyan' fullWidth onClick={() => handleWriteEmail(selectedLead)}><Send size={22} /> REDACTAR CORREO</Button>
            </div>
            <div style={{ display: 'grid', gap: '26px', minWidth: 0 }}>
              <div style={{ padding: '28px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '28px' }}>
                <h3 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '22px' }}>CONTACTOS REGISTRADOS</h3>
                <div style={{ display: 'grid', gap: '14px' }}>
                  {!selectedLead.contacts?.length ? <p style={{ color: 'var(--text-muted)', fontSize: '18px', textAlign: 'center', padding: '26px 0' }}>No hay contactos aún.</p> : selectedLead.contacts.map((c) => (
                    <div key={c._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '18px', borderRadius: '20px', background: 'var(--bg-accent)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                        <div style={{ padding: '10px', backgroundColor: 'var(--accent-light)', borderRadius: '12px' }}><Mail size={18} style={{ color: 'var(--accent)' }} /></div>
                        <strong style={{ fontSize: '18px', color: 'var(--text-primary)', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{c.email}</strong>
                      </div>
                      <Button variant='danger' style={{ padding: '10px 12px', borderRadius: '12px', flexShrink: 0 }} onClick={() => handleDeleteContact(c._id)}><Trash2 size={18} /></Button>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: '28px', border: '2px dashed var(--border)', borderRadius: '28px', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                <h4 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '20px' }}>Añadir Nuevo Contacto</h4>
                <form onSubmit={handleAddContact} style={{ display: 'flex', gap: '16px', alignItems: 'stretch' }}>
                  <input placeholder='correo@ejemplo.com' type='email' required style={{ flex: 1, padding: '18px', fontSize: '16px', borderRadius: '18px' }} value={newContactEmail} onChange={(e) => setNewContactEmail(e.target.value)} />
                  <Button type='submit' variant='secondary' style={{ borderRadius: '18px', padding: '18px', minWidth: '72px' }} disabled={addingContact}><Plus size={28} /></Button>
                </form>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={composeModal.open} onClose={() => setComposeModal({ ...composeModal, open: false })} title='REDACTAR MENSAJE' maxWidth='850px'>
        <form onSubmit={handleSendEmail} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {composeModal.type === 'mass' && companiesWithoutContacts.length > 0 && (
            <div style={{ padding: '30px', backgroundColor: 'rgba(244, 63, 94, 0.1)', borderRadius: '28px', border: '1px solid #f43f5e' }}>
              <div style={{ display: 'flex', gap: '15px', color: '#f43f5e', fontWeight: '900', marginBottom: '15px', fontSize: '18px' }}><AlertCircle size={26} /> PANEL DE EXCLUSIÓN CRÍTICA</div>
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '20px' }}>El sistema omitirá a las siguientes <strong>{companiesWithoutContacts.length} empresas</strong> por falta de contactos:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>{companiesWithoutContacts.map((l) => <span key={l._id} style={{ fontSize: '13px', backgroundColor: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', padding: '8px 16px', borderRadius: '12px', fontWeight: '700' }}>{l.name}</span>)}</div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-muted)' }}>ASUNTO ESTRATÉGICO</label>
            <input required placeholder='Escribe un asunto que atraiga la atención...' style={{ width: '100%', padding: '22px', fontSize: '17px', fontWeight: '800' }} value={emailData.subject} onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-muted)' }}>CUERPO DEL MENSAJE</label>
            <textarea required placeholder='Redacta tu propuesta de valor aquí...' style={{ width: '100%', height: '350px', padding: '30px', borderRadius: '28px', fontSize: '18px', lineHeight: '1.6', resize: 'none' }} value={emailData.body} onChange={(e) => setEmailData({ ...emailData, body: e.target.value })} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', marginTop: '10px' }}>
            <Button variant='danger' type='button' onClick={() => setComposeModal({ ...composeModal, open: false })}>CANCELAR</Button>
            <Button variant='cyan' disabled={sendingEmail} style={{ minWidth: '250px' }}>{sendingEmail ? <Loader2 className='animate-spin' size={26} /> : <Send size={26} />} {sendingEmail ? 'ENVIANDO...' : 'ENVIAR AHORA'}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={manualModalOpen} onClose={() => setManualModalOpen(false)} title='REGISTRAR NUEVA EMPRESA'>
        <form onSubmit={handleCreateManual} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '12px', fontWeight: '900', color: 'var(--text-muted)' }}>NOMBRE COMERCIAL</label>
            <input placeholder='Ej: Seguros Bolívar' required style={{ padding: '18px' }} value={newLead.name} onChange={(e) => setNewLead({ ...newLead, name: e.target.value })} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '12px', fontWeight: '900', color: 'var(--text-muted)' }}>SITIO WEB OFICIAL</label>
            <input placeholder='https://www.empresa.com' required style={{ padding: '18px' }} value={newLead.website} onChange={(e) => setNewLead({ ...newLead, website: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}><label style={{ fontSize: '12px', fontWeight: '900', color: 'var(--text-muted)' }}>PAÍS</label><input placeholder='Ej: Honduras' required style={{ padding: '18px' }} value={newLead.country} onChange={(e) => setNewLead({ ...newLead, country: e.target.value })} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}><label style={{ fontSize: '12px', fontWeight: '900', color: 'var(--text-muted)' }}>SECTOR INDUSTRIAL</label><input placeholder='Ej: Banca' required style={{ padding: '18px' }} value={newLead.sector} onChange={(e) => setNewLead({ ...newLead, sector: e.target.value })} /></div>
          </div>
          <Button type='submit' variant='success' fullWidth style={{ marginTop: '10px' }}>AGREGAR EMPRESA</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Leads;
