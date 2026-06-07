import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Receipt, Plus, Download, DollarSign, CheckCircle, Clock, XCircle, X, Send, Upload } from 'lucide-react';
import * as ds from '../../services/dataService';

const CAT_COLORS = { Travel: '#4f46e5', Meals: '#22c55e', Software: '#ac40f2', Training: '#3b82f6', Office: '#f59e0b' };

export default function ExpensesPage() {
  const { user } = useAuth();
  const { addToast } = useApp();
  const [expenses, setExpenses] = useState([]);

  useEffect(() => { ds.getExpenses(user?.id).then(e => setExpenses(e)); }, []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpense, setNewExpense] = useState({ title: '', category: 'Travel', amount: '', date: '' });

  const totalExpenses = expenses.reduce((a, b) => a + b.amount, 0);
  const approved = expenses.filter(e => e.status === 'approved').reduce((a, b) => a + b.amount, 0);
  const pending = expenses.filter(e => e.status === 'pending').reduce((a, b) => a + b.amount, 0);

  const handleAdd = () => {
    if (!newExpense.title || !newExpense.amount) { addToast('Fill required fields', 'error'); return; }
    setExpenses([{ ...newExpense, id: `EXP${String(expenses.length + 1).padStart(3, '0')}`, amount: parseFloat(newExpense.amount), status: 'pending', receipt: false }, ...expenses]);
    setShowAddModal(false);
    setNewExpense({ title: '', category: 'Travel', amount: '', date: '' });
    addToast('Expense submitted!', 'success');
  };

  return (
    <div className="page animate-fadeIn">
      <div className="page-header">
        <div><h1 className="page-title">Expenses</h1><p className="page-subtitle">Submit expenses and track reimbursements</p></div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={() => addToast('Report exported!', 'success')}><Download size={16} /> Export</button>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}><Plus size={16} /> New Expense</button>
        </div>
      </div>

      <div className="page-grid grid-cols-3" style={{ marginBottom: '24px' }}>
        {[
          { label: 'Total Expenses', value: `₹${totalExpenses.toLocaleString('en-IN')}`, icon: DollarSign, color: '#4f46e5', bg: 'rgba(79,70,229,0.12)' },
          { label: 'Approved', value: `₹${approved.toLocaleString('en-IN')}`, icon: CheckCircle, color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
          { label: 'Pending', value: `₹${pending.toLocaleString('en-IN')}`, icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="stats-card">
              <div className="stats-icon" style={{ background: s.bg }}><Icon size={22} style={{ color: s.color }} /></div>
              <div className="stats-value" style={{ fontSize: '22px' }}>{s.value}</div>
              <div className="stats-label">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="data-table-container">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Description</th><th>Category</th><th>Amount</th><th>Date</th><th>Receipt</th><th>Status</th></tr></thead>
            <tbody>
              {expenses.map(exp => (
                <tr key={exp.id}>
                  <td style={{ fontWeight: 500 }}>{exp.id}</td>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{exp.title}</td>
                  <td><span className="badge" style={{ background: `${CAT_COLORS[exp.category] || '#6b7280'}18`, color: CAT_COLORS[exp.category] || '#6b7280' }}>{exp.category}</span></td>
                  <td style={{ fontWeight: 600 }}>₹{exp.amount.toLocaleString('en-IN')}</td>
                  <td>{exp.date}</td>
                  <td>{exp.receipt ? <CheckCircle size={16} style={{ color: 'var(--color-success)' }} /> : <XCircle size={16} style={{ color: 'var(--text-muted)' }} />}</td>
                  <td><span className={`badge ${exp.status === 'approved' ? 'badge-success' : exp.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>{exp.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3 className="modal-title">Submit Expense</h3><button className="modal-close" onClick={() => setShowAddModal(false)}><X size={18} /></button></div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group"><label className="form-label">Title *</label><input className="form-input" placeholder="Expense description" value={newExpense.title} onChange={e => setNewExpense(p => ({ ...p, title: e.target.value }))} /></div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Category</label><select className="form-select" value={newExpense.category} onChange={e => setNewExpense(p => ({ ...p, category: e.target.value }))}>{Object.keys(CAT_COLORS).map(c => <option key={c}>{c}</option>)}</select></div>
                  <div className="form-group"><label className="form-label">Amount (₹) *</label><input type="number" className="form-input" placeholder="0" value={newExpense.amount} onChange={e => setNewExpense(p => ({ ...p, amount: e.target.value }))} /></div>
                </div>
                <div className="form-group"><label className="form-label">Date</label><input type="date" className="form-input" value={newExpense.date} onChange={e => setNewExpense(p => ({ ...p, date: e.target.value }))} /></div>
                <div style={{ padding: '24px', border: '2px dashed var(--border-color)', borderRadius: '12px', textAlign: 'center', cursor: 'pointer' }}>
                  <Upload size={24} style={{ color: 'var(--text-tertiary)', marginBottom: '8px' }} />
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Upload Receipt</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PDF, JPG, PNG up to 5MB</div>
                </div>
              </div>
            </div>
            <div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button><button className="btn btn-primary" onClick={handleAdd}><Send size={14} /> Submit</button></div>
          </div>
        </div>
      )}
    </div>
  );
}



