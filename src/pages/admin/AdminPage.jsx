import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Shield, Users, Building2, Settings, FileText, Activity, Lock, Database, Plus, Edit3, Trash2, Search, Eye, Check, X } from 'lucide-react';
import * as ds from '../../services/dataService';
import { ROLE_PERMISSIONS } from '../../contexts/AuthContext';

const TABS = ['users', 'departments', 'roles', 'audit', 'settings'];

export default function AdminPage() {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState('users');
  const [search, setSearch] = useState('');

  const [allEmployees, setAllEmployees] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);
  const [allAuditLogs, setAllAuditLogs] = useState([]);

  useEffect(() => {
    Promise.all([ds.getEmployees(), ds.getDepartments(), ds.getAuditLogs()]).then(([e, d, a]) => {
      setAllEmployees(e); setAllDepartments(d); setAllAuditLogs(a);
    });
  }, []);

  const filteredEmployees = allEmployees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Panel</h1>
          <p className="page-subtitle">System administration and configuration</p>
        </div>
      </div>

      {/* Stats */}
      <div className="page-grid grid-cols-4" style={{ marginBottom: '24px' }}>
        {[
          { label: 'Total Employees', value: allEmployees.length, icon: Users, color: '#4f46e5', bg: 'rgba(79,70,229,0.12)' },
          { label: 'Departments', value: allDepartments.length, icon: Building2, color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
          { label: 'Active Roles', value: 4, icon: Shield, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
          { label: 'Audit Events', value: allAuditLogs.length, icon: Activity, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
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

      <div className="tabs" style={{ marginBottom: '24px' }}>
        {TABS.map(tab => (
          <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'users' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div className="search-container">
              <Search size={16} className="search-icon" />
              <input className="search-input" placeholder="Search employees..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '300px' }} />
            </div>
            <button className="btn btn-primary" onClick={() => addToast('Add user form ready!', 'info')}><Plus size={16} /> Add Employee</button>
          </div>
          <div className="data-table-container">
            <table className="data-table">
              <thead><tr><th>Employee</th><th>Email</th><th>Department</th><th>Designation</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredEmployees.map(emp => (
                  <tr key={emp.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="avatar avatar-sm">{emp.name.split(' ').map(n => n[0]).join('')}</div>
                        <div>
                          <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{emp.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{emp.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>{emp.email}</td>
                    <td><span className="chip">{emp.department}</span></td>
                    <td>{emp.designation}</td>
                    <td><span className={`badge ${emp.status === 'active' ? 'badge-success' : 'badge-warning'}`}>{emp.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button className="btn btn-ghost btn-icon btn-sm"><Eye size={14} /></button>
                        <button className="btn btn-ghost btn-icon btn-sm"><Edit3 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'departments' && (
        <div className="page-grid grid-cols-4" style={{ gap: '16px' }}>
          {allDepartments.map(dept => (
            <div key={dept.id} className="glass-card" style={{ padding: '20px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: `${dept.color}18`, marginBottom: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Building2 size={22} style={{ color: dept.color }} />
              </div>
              <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{dept.name}</h4>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '2px' }}>Head: {dept.head}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{dept.employeeCount} members</div>
              <div style={{ display: 'flex', gap: '4px', marginTop: '12px' }}>
                <button className="btn btn-ghost btn-sm" style={{ fontSize: '11px' }}><Edit3 size={12} /> Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '16px' }}>Role Permissions Matrix</h3>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Module</th>
                  {Object.keys(ROLE_PERMISSIONS).map(role => (
                    <th key={role} style={{ textAlign: 'center', textTransform: 'capitalize' }}>{role}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {['dashboard', 'profile', 'attendance', 'leave', 'payroll', 'tasks', 'documents', 'performance', 'recruitment', 'analytics', 'admin'].map(module => (
                  <tr key={module}>
                    <td style={{ fontWeight: 500, textTransform: 'capitalize' }}>{module}</td>
                    {Object.entries(ROLE_PERMISSIONS).map(([role, perms]) => (
                      <td key={role} style={{ textAlign: 'center' }}>
                        {perms.includes(module) ? (
                          <Check size={16} style={{ color: 'var(--color-success)' }} />
                        ) : (
                          <X size={16} style={{ color: 'var(--text-muted)' }} />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '16px' }}>Audit Logs</h3>
          <div className="data-table-container">
            <table className="data-table">
              <thead><tr><th>Timestamp</th><th>Action</th><th>User</th><th>Details</th><th>IP Address</th></tr></thead>
              <tbody>
                {allAuditLogs.map(log => (
                  <tr key={log.id}>
                    <td style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                      {new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}{' '}
                      {new Date(log.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td><span className="badge badge-primary">{log.action}</span></td>
                    <td style={{ fontWeight: 500 }}>{log.user}</td>
                    <td style={{ maxWidth: '300px' }} className="truncate">{log.details}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '20px' }}>Organization Settings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>
            <div className="form-group">
              <label className="form-label">Organization Name</label>
              <input className="form-input" defaultValue="TIA Software Solutions" />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" defaultValue="London, United Kingdom" />
            </div>
            <div className="form-group">
              <label className="form-label">Work Hours</label>
              <div className="form-row">
                <input className="form-input" defaultValue="09:00" type="time" />
                <input className="form-input" defaultValue="18:00" type="time" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Financial Year</label>
              <select className="form-select" defaultValue="apr-mar">
                <option value="apr-mar">April - March</option>
                <option value="jan-dec">January - December</option>
              </select>
            </div>
            <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => addToast('Settings saved!', 'success')}>
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}







