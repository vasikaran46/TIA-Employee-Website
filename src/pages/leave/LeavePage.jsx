import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { CalendarDays, Plus, CheckCircle, XCircle, Clock, Calendar, X, Send } from 'lucide-react';
import * as ds from '../../services/dataService';

export default function LeavePage() {
  const { user, isAdmin, isHR, isManager } = useAuth();
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState('balance');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveTypesData, setLeaveTypesData] = useState([]);
  const [holidaysData, setHolidaysData] = useState([]);
  const [formData, setFormData] = useState({ type: '', from: '', to: '', reason: '' });

  useEffect(() => {
    Promise.all([
      ds.getLeaveRequests(user?.id),
      ds.getLeaveTypes(),
      ds.getHolidays(),
    ]).then(([lr, lt, hol]) => {
      setLeaveRequests(lr);
      setLeaveTypesData(lt);
      setHolidaysData(hol);
    });
  }, [user?.id]);

  const handleApply = () => {
    if (!formData.type || !formData.from || !formData.to || !formData.reason) {
      addToast('Please fill all fields', 'error');
      return;
    }
    const newRequest = {
      id: `LV${String(leaveRequests.length + 1).padStart(3, '0')}`,
      employee: 'Current User',
      ...formData,
      days: Math.ceil((new Date(formData.to) - new Date(formData.from)) / (1000 * 60 * 60 * 24)) + 1,
      status: 'pending',
      appliedOn: new Date().toISOString().split('T')[0],
    };
    setLeaveRequests([newRequest, ...leaveRequests]);
    setShowApplyModal(false);
    setFormData({ type: '', from: '', to: '', reason: '' });
    addToast('Leave application submitted!', 'success');
  };

  const handleApprove = (id) => {
    setLeaveRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    addToast('Leave approved!', 'success');
  };

  const handleReject = (id) => {
    setLeaveRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    addToast('Leave rejected', 'error');
  };

  return (
    <div className="page animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Leave Management</h1>
          <p className="page-subtitle">Apply for leave and track your balance</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowApplyModal(true)}>
          <Plus size={16} /> Apply Leave
        </button>
      </div>

      {/* Leave Balance Cards */}
      <div className="page-grid grid-cols-3" style={{ marginBottom: '24px' }}>
        {leaveTypesData.slice(0, 6).map((leave, i) => {
          const remaining = leave.total - leave.used;
          const pct = (remaining / leave.total) * 100;
          return (
            <div key={i} className="stats-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div className="stats-label" style={{ marginTop: 0, marginBottom: '4px' }}>{leave.type}</div>
                  <div className="stats-value" style={{ fontSize: '24px' }}>{remaining}<span style={{ fontSize: '14px', color: 'var(--text-tertiary)', fontWeight: 400 }}>/{leave.total}</span></div>
                </div>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: `${leave.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CalendarDays size={20} style={{ color: leave.color }} />
                </div>
              </div>
              <div className="progress-bar progress-sm">
                <div className="progress-fill" style={{ width: `${pct}%`, background: leave.color }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                <span>{leave.used} used</span>
                <span>{remaining} remaining</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: '24px' }}>
        {['balance', 'history', 'holidays', ...(isAdmin || isHR || isManager ? ['approvals'] : [])].map(tab => (
          <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'history' && (
        <div className="card">
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr><th>ID</th><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th><th>Applied On</th></tr>
              </thead>
              <tbody>
                {leaveRequests.map(req => (
                  <tr key={req.id}>
                    <td style={{ fontWeight: 500 }}>{req.id}</td>
                    <td>{req.type}</td>
                    <td>{new Date(req.from).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                    <td>{new Date(req.to).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                    <td>{req.days}</td>
                    <td style={{ maxWidth: '200px' }} className="truncate">{req.reason}</td>
                    <td>
                      <span className={`badge ${req.status === 'approved' ? 'badge-success' : req.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </span>
                    </td>
                    <td>{req.appliedOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'balance' && (
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '16px' }}>Leave Balance Details</h3>
          <div className="data-table-container">
            <table className="data-table">
              <thead><tr><th>Leave Type</th><th>Total</th><th>Used</th><th>Remaining</th><th>Usage</th></tr></thead>
              <tbody>
                {leaveTypesData.map((leave, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{leave.type}</td>
                    <td>{leave.total}</td>
                    <td>{leave.used || 0}</td>
                    <td style={{ fontWeight: 600, color: 'var(--color-success)' }}>{leave.total - (leave.used || 0)}</td>
                    <td style={{ width: '150px' }}>
                      <div className="progress-bar progress-sm">
                        <div className="progress-fill" style={{ width: `${((leave.used || 0) / leave.total) * 100}%`, background: leave.color }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'holidays' && (
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '16px' }}>Holiday Calendar 2026</h3>
          <div className="data-table-container">
            <table className="data-table">
              <thead><tr><th>Date</th><th>Day</th><th>Holiday</th><th>Type</th></tr></thead>
              <tbody>
                {holidaysData.map((h, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{new Date(h.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</td>
                    <td>{new Date(h.date).toLocaleDateString('en-US', { weekday: 'long' })}</td>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{h.name}</td>
                    <td><span className={`badge ${h.type === 'national' ? 'badge-danger' : h.type === 'public' ? 'badge-primary' : 'badge-neutral'}`}>{h.type}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'approvals' && (
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '16px' }}>Pending Approvals</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {leaveRequests.filter(r => r.status === 'pending').map(req => (
              <div key={req.id} style={{
                padding: '16px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{req.employee}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                    {req.type} · {req.days} day(s) · {req.from} to {req.to}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>Reason: {req.reason}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-success btn-sm" onClick={() => handleApprove(req.id)}><CheckCircle size={14} /> Approve</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleReject(req.id)}><XCircle size={14} /> Reject</button>
                </div>
              </div>
            ))}
            {leaveRequests.filter(r => r.status === 'pending').length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon"><CheckCircle size={32} /></div>
                <div className="empty-state-title">All caught up!</div>
                <div className="empty-state-text">No pending leave approvals</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Apply for Leave</h3>
              <button className="modal-close" onClick={() => setShowApplyModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Leave Type <span className="required">*</span></label>
                  <select className="form-select" value={formData.type} onChange={(e) => setFormData(p => ({ ...p, type: e.target.value }))}>
                    <option value="">Select leave type</option>
                    {leaveTypesData.map(l => <option key={l.type} value={l.type}>{l.type} ({l.total - (l.used || 0)} remaining)</option>)}
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">From Date <span className="required">*</span></label>
                    <input type="date" className="form-input" value={formData.from} onChange={(e) => setFormData(p => ({ ...p, from: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">To Date <span className="required">*</span></label>
                    <input type="date" className="form-input" value={formData.to} onChange={(e) => setFormData(p => ({ ...p, to: e.target.value }))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Reason <span className="required">*</span></label>
                  <textarea className="form-input form-textarea" placeholder="Enter reason for leave..." value={formData.reason} onChange={(e) => setFormData(p => ({ ...p, reason: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowApplyModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleApply}><Send size={14} /> Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
