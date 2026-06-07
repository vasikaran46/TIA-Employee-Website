import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Clock, LogIn, LogOut, CheckCircle, AlertCircle, Calendar, TrendingUp, Download, ChevronLeft, ChevronRight, Timer } from 'lucide-react';
import * as ds from '../../services/dataService';

export default function AttendancePage() {
  const { user } = useAuth();
  const { addToast } = useApp();
  const [records, setRecords] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ds.getAttendanceRecords(user?.id).then(data => { setRecords(data); setLoading(false); });
  }, [user?.id]);

  const todayRecord = records[records.length - 1];
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);

  const totalPresent = records.filter(r => r.status === 'present' || r.status === 'late').length;
  const totalLate = records.filter(r => r.isLate).length;
  const avgHours = records.filter(r => r.workedHours).reduce((a, b) => a + b.workedHours, 0) / (records.filter(r => r.workedHours).length || 1);


  const handleCheckIn = () => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setCheckedIn(true);
    setCheckInTime(time);
    addToast(`Checked in at ${time}! Have a great day!`, 'success');
  };

  const handleCheckOut = () => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setCheckedOut(true);
    setCheckOutTime(time);
    addToast(`Checked out at ${time}! See you tomorrow!`, 'success');
  };

  const stats = [
    { label: 'Present Days', value: totalPresent, icon: CheckCircle, color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
    { label: 'Late Arrivals', value: totalLate, icon: AlertCircle, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    { label: 'Avg. Hours/Day', value: avgHours.toFixed(1), icon: Timer, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    { label: 'Attendance Rate', value: `${((totalPresent / (records.length || 1)) * 100).toFixed(1)}%`, icon: TrendingUp, color: '#4f46e5', bg: 'rgba(79,70,229,0.12)' },
  ];

  return (
    <div className="page animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Attendance</h1>
          <p className="page-subtitle">Track your daily attendance and working hours</p>
        </div>
        <button className="btn btn-secondary" onClick={() => addToast('Report exported!', 'success')}>
          <Download size={16} /> Export
        </button>
      </div>

      {/* Check-in/out Card */}
      <div className="glass-card-static" style={{
        padding: '24px', marginBottom: '24px',
        background: 'var(--gradient-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
              Today — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </h3>
            <div style={{ display: 'flex', gap: '24px', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <LogIn size={14} style={{ color: 'var(--color-success)' }} />
                Check-in: <strong style={{ color: 'var(--text-primary)' }}>{checkInTime || '—'}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <LogOut size={14} style={{ color: 'var(--color-danger)' }} />
                Check-out: <strong style={{ color: 'var(--text-primary)' }}>{checkOutTime || '—'}</strong>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {!checkedIn ? (
              <button className="btn btn-primary" onClick={handleCheckIn}>
                <LogIn size={16} /> Check In
              </button>
            ) : !checkedOut ? (
              <button className="btn btn-danger" onClick={handleCheckOut}>
                <LogOut size={16} /> Check Out
              </button>
            ) : (
              <div className="badge badge-success" style={{ padding: '8px 16px', fontSize: '13px' }}>
                <CheckCircle size={16} /> Day Complete
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="page-grid grid-cols-4" style={{ marginBottom: '24px' }}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="stats-card">
              <div className="stats-icon" style={{ background: stat.bg }}>
                <Icon size={22} style={{ color: stat.color }} />
              </div>
              <div className="stats-value">{stat.value}</div>
              <div className="stats-label">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Attendance History */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Attendance History</h3>
        </div>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Working Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.slice().reverse().map((record) => (
                <tr key={record.id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                    {new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <LogIn size={14} style={{ color: 'var(--color-success)' }} />
                      {record.checkIn}
                    </span>
                  </td>
                  <td>
                    {record.checkOut ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <LogOut size={14} style={{ color: 'var(--color-danger)' }} />
                        {record.checkOut}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-tertiary)' }}>—</span>
                    )}
                  </td>
                  <td>{record.workedHours ? `${record.workedHours}h` : '—'}</td>
                  <td>
                    <span className={`badge ${
                      record.status === 'present' ? 'badge-success' :
                      record.status === 'late' ? 'badge-warning' :
                      record.status === 'checked-in' ? 'badge-primary' :
                      'badge-neutral'
                    }`}>
                      {record.status === 'checked-in' ? 'Active' : record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
