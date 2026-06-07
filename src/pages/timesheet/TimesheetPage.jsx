import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Timer, Plus, Send, Clock, Calendar, CheckCircle, X } from 'lucide-react';
import * as ds from '../../services/dataService';

export default function TimesheetPage() {
  const { user } = useAuth();
  const { addToast } = useApp();
  const [entries, setEntries] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    Promise.all([ds.getTimesheetEntries(user?.id), ds.getProjects()]).then(([e, p]) => { setEntries(e); setProjects(p); });
  }, []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntry, setNewEntry] = useState({ date: '', project: '', task: '', hours: '', notes: '' });

  const totalHours = entries.reduce((a, b) => a + b.hours, 0);
  const todayHours = entries.filter(e => e.date === new Date().toISOString().split('T')[0]).reduce((a, b) => a + b.hours, 0);
  const weekDays = [...new Set(entries.map(e => e.date))];

  const handleAdd = () => {
    if (!newEntry.date || !newEntry.project || !newEntry.hours) { addToast('Fill required fields', 'error'); return; }
    setEntries([...entries, { ...newEntry, hours: parseFloat(newEntry.hours) }]);
    setShowAddModal(false);
    setNewEntry({ date: '', project: '', task: '', hours: '', notes: '' });
    addToast('Time entry added!', 'success');
  };

  return (
    <div className="page animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Timesheet</h1>
          <p className="page-subtitle">Log your daily work hours and submit timesheets</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={() => addToast('Timesheet submitted for approval!', 'success')}>
            <Send size={16} /> Submit Week
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} /> Log Time
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="page-grid grid-cols-4" style={{ marginBottom: '24px' }}>
        {[
          { label: 'Today', value: `${todayHours}h`, icon: Clock, color: '#4f46e5', bg: 'rgba(79,70,229,0.12)' },
          { label: 'This Week', value: `${totalHours}h`, icon: Timer, color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
          { label: 'Working Days', value: weekDays.length, icon: Calendar, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
          { label: 'Avg Hours/Day', value: `${(totalHours / (weekDays.length || 1)).toFixed(1)}h`, icon: CheckCircle, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="stats-card">
              <div className="stats-icon" style={{ background: s.bg }}><Icon size={22} style={{ color: s.color }} /></div>
              <div className="stats-value">{s.value}</div>
              <div className="stats-label">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Timesheet Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Time Entries</h3>
        </div>
        <div className="data-table-container">
          <table className="data-table">
            <thead><tr><th>Date</th><th>Project</th><th>Task</th><th>Hours</th><th>Notes</th></tr></thead>
            <tbody>
              {entries.slice().reverse().map((entry, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                    {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </td>
                  <td><span className="chip chip-primary">{entry.project}</span></td>
                  <td>{entry.task}</td>
                  <td><span style={{ fontWeight: 600, color: 'var(--color-primary-light)' }}>{entry.hours}h</span></td>
                  <td style={{ color: 'var(--text-tertiary)', maxWidth: '250px' }} className="truncate">{entry.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3 className="modal-title">Log Time</h3><button className="modal-close" onClick={() => setShowAddModal(false)}><X size={18} /></button></div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Date *</label><input type="date" className="form-input" value={newEntry.date} onChange={e => setNewEntry(p => ({ ...p, date: e.target.value }))} /></div>
                  <div className="form-group"><label className="form-label">Hours *</label><input type="number" className="form-input" placeholder="0" min="0.5" max="24" step="0.5" value={newEntry.hours} onChange={e => setNewEntry(p => ({ ...p, hours: e.target.value }))} /></div>
                </div>
                <div className="form-group"><label className="form-label">Project *</label><select className="form-select" value={newEntry.project} onChange={e => setNewEntry(p => ({ ...p, project: e.target.value }))}><option value="">Select</option>{projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}</select></div>
                <div className="form-group"><label className="form-label">Task</label><input className="form-input" placeholder="What did you work on?" value={newEntry.task} onChange={e => setNewEntry(p => ({ ...p, task: e.target.value }))} /></div>
                <div className="form-group"><label className="form-label">Notes</label><textarea className="form-input form-textarea" placeholder="Additional notes..." value={newEntry.notes} onChange={e => setNewEntry(p => ({ ...p, notes: e.target.value }))} /></div>
              </div>
            </div>
            <div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button><button className="btn btn-primary" onClick={handleAdd}><Plus size={14} /> Add Entry</button></div>
          </div>
        </div>
      )}
    </div>
  );
}




