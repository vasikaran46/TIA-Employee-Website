import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { FileText, Upload, Download, Search, FolderOpen, File, Filter, Eye, Trash2 } from 'lucide-react';
import * as ds from '../../services/dataService';

const CATEGORIES = ['All', 'Company Policy', 'IT Policy', 'Employment', 'Finance Policy'];

export default function DocumentsPage() {
  const { addToast } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const [allDocuments, setAllDocuments] = useState([]);

  useEffect(() => { ds.getDocuments().then(d => setAllDocuments(d)); }, []);

  const filtered = allDocuments.filter(d => {
    const matchCat = activeCategory === 'All' || d.category === activeCategory;
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="page animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Documents</h1>
          <p className="page-subtitle">Access company policies, employment documents, and uploads</p>
        </div>
        <button className="btn btn-primary" onClick={() => addToast('Upload feature ready!', 'info')}>
          <Upload size={16} /> Upload Document
        </button>
      </div>

      {/* Search & Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div className="search-container" style={{ flex: 1, minWidth: '250px' }}>
          <Search size={16} className="search-icon" />
          <input className="search-input" placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%' }} />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveCategory(cat)} style={{ fontSize: '12px' }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="page-grid grid-cols-2" style={{ gap: '16px' }}>
        {filtered.map(doc => (
          <div key={doc.id} className="glass-card" style={{ padding: '20px', display: 'flex', gap: '16px', cursor: 'pointer' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: 'rgba(79,70,229,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <FileText size={24} style={{ color: 'var(--color-primary-light)' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }} className="truncate">{doc.name}</h4>
              <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span>{doc.category}</span><span>·</span><span>{doc.size}</span><span>·</span><span>{doc.type.toUpperCase()}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>By {doc.uploadedBy}</span><span>·</span><span>{new Date(doc.uploadDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span>·</span><span>{doc.downloads} downloads</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button className="btn btn-ghost btn-icon" onClick={(e) => { e.stopPropagation(); addToast('Downloading...', 'info'); }}>
                <Download size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon"><FolderOpen size={32} /></div>
          <div className="empty-state-title">No documents found</div>
          <div className="empty-state-text">Try adjusting your search or filter criteria</div>
        </div>
      )}
    </div>
  );
}


