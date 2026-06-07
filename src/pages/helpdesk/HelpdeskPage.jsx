import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Headphones, Plus, AlertCircle, CheckCircle, Clock, X, Send, MessageSquare } from 'lucide-react';
import * as ds from '../../services/dataService';

const PRIORITY_COLORS = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' };
const STATUS_COLORS = { open: '#ef4444', 'in-progress': '#f59e0b', resolved: '#22c55e' };

export default function HelpdeskPage() {
  const { addToast } = useApp();
  const [tickets, setTickets] = useState([]);

  useEffect(() => { ds.getTickets().then(t => setTickets(t)); }, []);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [newTicket, setNewTicket] = useState({ subject: '', category: 'IT Support', priority: 'medium', description: '' });

  const filtered = activeFilter === 'all' ? tickets : tickets.filter(t => t.status === activeFilter);

  const handleCreate = () => {
    if (!newTicket.subject || !newTicket.description) { addToast('Fill required fields', 'error'); return; }
    setTickets([{ ...newTicket, id: `TKT${String(tickets.length + 1).padStart(3, '0')}`, status: 'open', createdBy: 'Current User', assignedTo: 'Unassigned', createdAt: new Date().toISOString().split('T')[0] }, ...tickets]);
    setShowCreateModal(false);
    setNewTicket({ subject: '', category: 'IT Support', priority: 'medium', description: '' });
    addToast('Ticket created!', 'success');
  };

  return (
    <div className="page animate-fadeIn">
      <div className="page-header">
        <div><h1 className="page-title">Help Desk</h1><p className="page-subtitle">Submit and track support tickets</p></div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}><Plus size={16} /> New Ticket</button>
      </div>

      <div className="page-grid grid-cols-3" style={{ marginBottom: '24px' }}>
        {[
          { label: 'Open', value: tickets.filter(t => t.status === 'open').length, icon: AlertCircle, color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
          { label: 'In Progress', value: tickets.filter(t => t.status === 'in-progress').length, icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
          { label: 'Resolved', value: tickets.filter(t => t.status === 'resolved').length, icon: CheckCircle, color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="stats-card" style={{ cursor: 'pointer' }} onClick={() => setActiveFilter(s.label.toLowerCase().replace(' ', '-'))}>
              <div className="stats-icon" style={{ background: s.bg }}><Icon size={22} style={{ color: s.color }} /></div>
              <div className="stats-value">{s.value}</div>
              <div className="stats-label">{s.label} Tickets</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {['all', 'open', 'in-progress', 'resolved'].map(f => (
          <button key={f} className={`btn btn-sm ${activeFilter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveFilter(f)}>
            {f === 'all' ? 'All' : f.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="data-table-container">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Subject</th><th>Category</th><th>Priority</th><th>Status</th><th>Created</th><th>Assigned To</th></tr></thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 500, color: 'var(--color-primary-light)' }}>{t.id}</td>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{t.subject}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }} className="truncate">{t.description}</div>
                  </td>
                  <td><span className="chip">{t.category}</span></td>
                  <td><span className="badge" style={{ background: `${PRIORITY_COLORS[t.priority]}18`, color: PRIORITY_COLORS[t.priority] }}>{t.priority}</span></td>
                  <td><span className="badge" style={{ background: `${STATUS_COLORS[t.status]}18`, color: STATUS_COLORS[t.status] }}>{t.status}</span></td>
                  <td>{t.createdAt}</td>
                  <td>{t.assignedTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3 className="modal-title">Create Support Ticket</h3><button className="modal-close" onClick={() => setShowCreateModal(false)}><X size={18} /></button></div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group"><label className="form-label">Subject *</label><input className="form-input" placeholder="Brief description..." value={newTicket.subject} onChange={e => setNewTicket(p => ({ ...p, subject: e.target.value }))} /></div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Category</label><select className="form-select" value={newTicket.category} onChange={e => setNewTicket(p => ({ ...p, category: e.target.value }))}><option>IT Support</option><option>HR Support</option></select></div>
                  <div className="form-group"><label className="form-label">Priority</label><select className="form-select" value={newTicket.priority} onChange={e => setNewTicket(p => ({ ...p, priority: e.target.value }))}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
                </div>
                <div className="form-group"><label className="form-label">Description *</label><textarea className="form-input form-textarea" placeholder="Describe your issue..." value={newTicket.description} onChange={e => setNewTicket(p => ({ ...p, description: e.target.value }))} /></div>
              </div>
            </div>
            <div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button><button className="btn btn-primary" onClick={handleCreate}><Send size={14} /> Submit Ticket</button></div>
          </div>
        </div>
      )}
    </div>
  );
}


