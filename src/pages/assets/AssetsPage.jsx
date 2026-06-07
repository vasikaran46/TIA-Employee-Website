import { useState, useEffect } from 'react';
import { Package, Plus, Monitor, Smartphone, Keyboard, Laptop, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import * as ds from '../../services/dataService';

const TYPE_ICONS = { Laptop: Laptop, Monitor: Monitor, Phone: Smartphone, Keyboard: Keyboard, Chair: Package };

export default function AssetsPage() {
  const [activeTab, setActiveTab] = useState('my-assets');
  const [allAssets, setAllAssets] = useState([]);

  useEffect(() => { ds.getAssets().then(a => setAllAssets(a)); }, []);

  return (
    <div className="page animate-fadeIn">
      <div className="page-header">
        <div><h1 className="page-title">Assets</h1><p className="page-subtitle">Track assigned equipment and manage asset requests</p></div>
        <button className="btn btn-primary"><Plus size={16} /> Request Asset</button>
      </div>

      <div className="tabs" style={{ marginBottom: '24px' }}>
        {['my-assets', 'all-assets', 'requests'].map(tab => (
          <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </button>
        ))}
      </div>

      {activeTab === 'my-assets' && (
        <div className="page-grid grid-cols-3" style={{ gap: '16px' }}>
          {allAssets.filter(a => a.assignedTo === 'Ananya Patel').map(asset => {
            const Icon = TYPE_ICONS[asset.type] || Package;
            return (
              <div key={asset.id} className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(79,70,229,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={22} style={{ color: 'var(--color-primary-light)' }} />
                  </div>
                  <span className="badge badge-success" style={{ fontSize: '10px' }}>{asset.condition}</span>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{asset.name}</h4>
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>{asset.type} · {asset.serialNumber}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Assigned: {asset.assignedDate}</div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'all-assets' && (
        <div className="card">
          <div className="data-table-container">
            <table className="data-table">
              <thead><tr><th>Asset</th><th>Type</th><th>Serial No.</th><th>Assigned To</th><th>Condition</th><th>Status</th></tr></thead>
              <tbody>
                {allAssets.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{a.name}</td>
                    <td><span className="chip">{a.type}</span></td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{a.serialNumber}</td>
                    <td>{a.assignedTo || <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>}</td>
                    <td><span className="badge badge-success">{a.condition}</span></td>
                    <td><span className={`badge ${a.status === 'assigned' ? 'badge-primary' : 'badge-success'}`}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="empty-state">
          <div className="empty-state-icon"><Package size={32} /></div>
          <div className="empty-state-title">No Pending Requests</div>
          <div className="empty-state-text">Your asset requests will appear here</div>
        </div>
      )}
    </div>
  );
}




