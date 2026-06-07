import { useState, useEffect } from 'react';
import { Users, Briefcase, Plus, MapPin, Clock, DollarSign, Eye, UserPlus, Filter } from 'lucide-react';
import * as ds from '../../services/dataService';

const STAGES = [
  { id: 'screening', label: 'Screening', color: '#6b7280' },
  { id: 'technical-interview', label: 'Technical', color: '#3b82f6' },
  { id: 'hr-interview', label: 'HR Interview', color: '#f59e0b' },
  { id: 'offer', label: 'Offer', color: '#22c55e' },
  { id: 'rejected', label: 'Rejected', color: '#ef4444' },
];

export default function RecruitmentPage() {
  const [activeTab, setActiveTab] = useState('openings');
  const [jobOpenings, setJobOpenings] = useState([]);
  const [allCandidates, setAllCandidates] = useState([]);

  useEffect(() => {
    Promise.all([ds.getJobOpenings(), ds.getCandidates()]).then(([j, c]) => { setJobOpenings(j); setAllCandidates(c); });
  }, []);

  return (
    <div className="page animate-fadeIn">
      <div className="page-header">
        <div><h1 className="page-title">Recruitment</h1><p className="page-subtitle">Manage job openings, candidates, and hiring pipeline</p></div>
        <button className="btn btn-primary"><Plus size={16} /> Post New Job</button>
      </div>

      <div className="tabs" style={{ marginBottom: '24px' }}>
        {['openings', 'candidates', 'pipeline'].map(tab => (
          <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'openings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {jobOpenings.map(job => (
            <div key={job.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 600 }}>{job.title}</h4>
                  <span className={`badge ${job.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>{job.status}</span>
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-tertiary)', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Briefcase size={12} /> {job.department}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {job.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><DollarSign size={12} /> {job.salary}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {job.type}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-primary-light)' }}>{job.applicants}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Applicants</div>
                </div>
                <button className="btn btn-secondary btn-sm"><Eye size={14} /> View</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'candidates' && (
        <div className="card">
          <div className="data-table-container">
            <table className="data-table">
              <thead><tr><th>Candidate</th><th>Position</th><th>Stage</th><th>Rating</th><th>Applied</th><th>Actions</th></tr></thead>
              <tbody>
                {allCandidates.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="avatar avatar-sm">{c.name.split(' ').map(n => n[0]).join('')}</div>
                        <div>
                          <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{c.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{c.job}</td>
                    <td>
                      <span className="badge" style={{
                        background: `${STAGES.find(s => s.id === c.stage)?.color || '#6b7280'}18`,
                        color: STAGES.find(s => s.id === c.stage)?.color || '#6b7280',
                      }}>
                        {STAGES.find(s => s.id === c.stage)?.label || c.stage}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontWeight: 600 }}>{c.rating}</span>
                        <span style={{ color: '#f59e0b' }}>★</span>
                      </div>
                    </td>
                    <td>{new Date(c.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                    <td><button className="btn btn-ghost btn-sm"><Eye size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'pipeline' && (
        <div className="kanban-board">
          {STAGES.filter(s => s.id !== 'rejected').map(stage => {
            const stageCandidates = allCandidates.filter(c => c.stage === stage.id);
            return (
              <div key={stage.id} className="kanban-column">
                <div className="kanban-column-header">
                  <div className="kanban-column-title">
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: stage.color }} />
                    {stage.label}
                  </div>
                  <span className="kanban-column-count">{stageCandidates.length}</span>
                </div>
                <div className="kanban-cards">
                  {stageCandidates.map(c => (
                    <div key={c.id} className="kanban-card">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <div className="avatar avatar-sm">{c.name.split(' ').map(n => n[0]).join('')}</div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600 }}>{c.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{c.job}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                        <span>Rating: {c.rating} ★</span>
                        <span>{new Date(c.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}





