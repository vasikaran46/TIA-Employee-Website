import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { DollarSign, Download, FileText, TrendingUp, CreditCard, Receipt, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import * as ds from '../../services/dataService';

export default function PayrollPage() {
  const { user } = useAuth();
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState('current');
  const [showBreakdown, setShowBreakdown] = useState(true);
  const [payrollData, setPayrollData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ds.getPayrollData(user?.id).then(data => { setPayrollData(data); setLoading(false); });
  }, [user?.id]);

  if (!payrollData) return <div className="page animate-fadeIn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}><div style={{ color: 'var(--text-tertiary)' }}>Loading...</div></div>;

  const { currentMonth, history, reimbursements } = payrollData;

  const earningsItems = [
    { label: 'Basic Salary', amount: currentMonth.basic },
    { label: 'House Rent Allowance', amount: currentMonth.hra },
    { label: 'Dearness Allowance', amount: currentMonth.da },
    { label: 'Special Allowance', amount: currentMonth.specialAllowance },
    { label: 'Transport Allowance', amount: currentMonth.transportAllowance },
    { label: 'Medical Allowance', amount: currentMonth.medicalAllowance },
  ];
  const deductionItems = [
    { label: 'Provident Fund', amount: currentMonth.pf },
    { label: 'Professional Tax', amount: currentMonth.professionalTax },
    { label: 'Income Tax', amount: currentMonth.incomeTax },
    { label: 'Health Insurance', amount: currentMonth.insurance },
  ];

  const formatCurrency = (amt) => `₹${amt.toLocaleString('en-IN')}`;

  return (
    <div className="page animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Payroll & Salary</h1>
          <p className="page-subtitle">View salary slips, tax documents, and reimbursements</p>
        </div>
        <button className="btn btn-primary" onClick={() => addToast('Salary slip downloaded!', 'success')}>
          <Download size={16} /> Download Payslip
        </button>
      </div>

      {/* Stats */}
      <div className="page-grid grid-cols-4" style={{ marginBottom: '24px' }}>
        {[
          { label: 'Net Salary', value: formatCurrency(currentMonth.netSalary), icon: DollarSign, color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
          { label: 'Gross Salary', value: formatCurrency(currentMonth.grossSalary), icon: TrendingUp, color: '#4f46e5', bg: 'rgba(79,70,229,0.12)' },
          { label: 'Total Deductions', value: formatCurrency(currentMonth.totalDeductions), icon: CreditCard, color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
          { label: 'YTD Earnings', value: formatCurrency(currentMonth.netSalary * 6), icon: Building2, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="stats-card">
              <div className="stats-icon" style={{ background: stat.bg }}>
                <Icon size={22} style={{ color: stat.color }} />
              </div>
              <div className="stats-value" style={{ fontSize: '22px' }}>{stat.value}</div>
              <div className="stats-label">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: '24px' }}>
        {['current', 'history', 'reimbursements', 'tax'].map(tab => (
          <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'current' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Earnings */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title" style={{ color: 'var(--color-success)' }}>Earnings</h3>
              <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-success)' }}>{formatCurrency(currentMonth.grossSalary)}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {earningsItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Deductions */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title" style={{ color: 'var(--color-danger)' }}>Deductions</h3>
              <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-danger)' }}>{formatCurrency(currentMonth.totalDeductions)}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {deductionItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-danger)' }}>-{formatCurrency(item.amount)}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: '15px' }}>Net Salary</span>
                <span style={{ fontWeight: 800, fontSize: '18px', color: 'var(--color-success)' }}>{formatCurrency(currentMonth.netSalary)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="card">
          <div className="data-table-container">
            <table className="data-table">
              <thead><tr><th>Month</th><th>Gross</th><th>Deductions</th><th>Net</th><th>Status</th><th>Paid On</th><th>Action</th></tr></thead>
              <tbody>
                {history.map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{row.month}</td>
                    <td>{formatCurrency(row.gross)}</td>
                    <td style={{ color: 'var(--color-danger)' }}>-{formatCurrency(row.deductions)}</td>
                    <td style={{ fontWeight: 600, color: 'var(--color-success)' }}>{formatCurrency(row.net)}</td>
                    <td><span className="badge badge-success">Paid</span></td>
                    <td>{row.paidOn}</td>
                    <td><button className="btn btn-ghost btn-sm" onClick={() => addToast('Downloading...', 'info')}><Download size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'reimbursements' && (
        <div className="card">
          <div className="data-table-container">
            <table className="data-table">
              <thead><tr><th>ID</th><th>Type</th><th>Description</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {reimbursements.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 500 }}>{r.id}</td>
                    <td>{r.type}</td>
                    <td>{r.description}</td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(r.amount)}</td>
                    <td>{r.date}</td>
                    <td><span className={`badge ${r.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'tax' && (
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '16px' }}>Tax Documents</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['Form 16 - FY 2025-26', 'Form 16 - FY 2024-25', 'Tax Computation Sheet 2026', 'Investment Declaration FY 2026-27'].map((doc, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={18} style={{ color: 'var(--color-primary-light)' }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{doc}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>PDF Document</div>
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => addToast('Downloading...', 'info')}>
                  <Download size={14} /> Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .page > div:nth-of-type(4) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
