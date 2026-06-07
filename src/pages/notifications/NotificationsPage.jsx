import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Filter, Trash2, Settings, Clock, CheckCircle, AlertCircle, FileText, Megaphone, Star, CreditCard, Headphones } from 'lucide-react';
import * as ds from '../../services/dataService';

const TYPE_ICONS = { approval: CheckCircle, task: FileText, reminder: Clock, system: Settings, announcement: Megaphone };
const TYPE_COLORS = { approval: '#22c55e', task: '#4f46e5', reminder: '#f59e0b', system: '#3b82f6', announcement: '#ac40f2' };

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => { ds.getNotifications().then(n => setNotifications(n)); }, []);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;
  const filtered = filter === 'all' ? notifications : filter === 'unread' ? notifications.filter(n => !n.read) : notifications.filter(n => n.type === filter);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const toggleRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));

  const getTimeAgo = (ts) => {
    const diff = Date.now() - new Date(ts).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="page animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-secondary" onClick={markAllRead}><CheckCheck size={16} /> Mark All Read</button>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['all', 'unread', 'approval', 'task', 'system', 'announcement'].map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.map(notif => {
          const Icon = TYPE_ICONS[notif.type] || Bell;
          const color = TYPE_COLORS[notif.type] || '#6b7280';
          return (
            <div key={notif.id} className="card" style={{
              padding: '16px 20px', cursor: 'pointer',
              background: notif.read ? 'var(--glass-bg)' : 'rgba(79,70,229,0.06)',
              borderLeft: notif.read ? 'none' : `3px solid ${color}`,
            }}
              onClick={() => toggleRead(notif.id)}
            >
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: notif.read ? 500 : 700, color: 'var(--text-primary)' }}>{notif.title}</h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', marginLeft: '12px' }}>{getTimeAgo(notif.timestamp)}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{notif.message}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                    <span className="badge" style={{ background: `${color}18`, color, fontSize: '10px' }}>{notif.type}</span>
                    {!notif.read && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }} />}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon"><Bell size={32} /></div>
          <div className="empty-state-title">No notifications</div>
          <div className="empty-state-text">You're all caught up!</div>
        </div>
      )}
    </div>
  );
}


