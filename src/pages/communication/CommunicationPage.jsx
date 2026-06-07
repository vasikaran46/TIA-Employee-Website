import { useState, useEffect } from 'react';
import { MessageSquare, Megaphone, Users, Building2, Send, Pin, Search, Phone, Mail } from 'lucide-react';
import * as ds from '../../services/dataService';

export default function CommunicationPage() {
  const [activeTab, setActiveTab] = useState('announcements');
  const [search, setSearch] = useState('');

  const [allAnnouncements, setAllAnnouncements] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);

  useEffect(() => {
    Promise.all([ds.getAnnouncements(), ds.getEmployees(), ds.getDepartments()]).then(([a, e, d]) => {
      setAllAnnouncements(a); setAllEmployees(e); setAllDepartments(d);
    });
  }, []);

  const filteredEmployees = allEmployees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.department.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page animate-fadeIn">
      <div className="page-header">
        <div><h1 className="page-title">Communication</h1><p className="page-subtitle">Company announcements, directory, and internal messaging</p></div>
      </div>
      <div className="tabs" style={{ marginBottom: '24px' }}>
        {['announcements', 'directory', 'departments', 'messages'].map(tab => (
          <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'announcements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {allAnnouncements.map(ann => (
            <div key={ann.id} className="card" style={{ position: 'relative' }}>
              {ann.pinned && <div style={{ position: 'absolute', top: '16px', right: '16px' }}><Pin size={14} style={{ color: 'var(--color-warning)' }} /></div>}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                <span className={`badge ${ann.priority === 'high' ? 'badge-danger' : ann.priority === 'medium' ? 'badge-warning' : 'badge-neutral'}`}>{ann.priority}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{ann.department}</span>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', fontFamily: 'var(--font-display)' }}>{ann.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>{ann.content}</p>
              <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                <span>By {ann.author}</span><span>·</span>
                <span>{new Date(ann.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'directory' && (
        <div>
          <div className="search-container" style={{ marginBottom: '20px' }}>
            <Search size={16} className="search-icon" />
            <input className="search-input" placeholder="Search employees..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', maxWidth: '400px' }} />
          </div>
          <div className="page-grid grid-cols-3" style={{ gap: '16px' }}>
            {filteredEmployees.map(emp => (
              <div key={emp.id} className="glass-card" style={{ padding: '20px', display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div className="avatar avatar-lg" style={{ fontSize: '16px' }}>{emp.name.split(' ').map(n => n[0]).join('')}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '2px' }}>{emp.name}</h4>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '6px' }}>{emp.designation}</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span className="chip" style={{ fontSize: '10px' }}><Building2 size={10} /> {emp.department}</span>
                    <span className={`badge ${emp.status === 'active' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '10px' }}>{emp.status}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button className="btn btn-ghost btn-icon btn-sm"><Mail size={14} /></button>
                  <button className="btn btn-ghost btn-icon btn-sm"><Phone size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'departments' && (
        <div className="page-grid grid-cols-4" style={{ gap: '16px' }}>
          {allDepartments.map(dept => (
            <div key={dept.id} className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: `${dept.color}18`, margin: '0 auto 12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Building2 size={24} style={{ color: dept.color }} />
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{dept.name}</h4>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '2px' }}>Head: {dept.head}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{dept.employeeCount} employees</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="empty-state" style={{ padding: '40px' }}>
              <div className="empty-state-icon"><MessageSquare size={32} /></div>
              <div className="empty-state-title">Internal Messaging</div>
              <div className="empty-state-text">Start a conversation with your teammates. Select an employee from the directory to begin.</div>
              <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => setActiveTab('directory')}>
                <Users size={14} /> Browse Directory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




