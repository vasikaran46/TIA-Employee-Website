import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import {
  Clock, CalendarDays, ListTodo, CheckCircle, TrendingUp, TrendingDown,
  ArrowRight, Megaphone, Pin, AlertCircle, Users, DollarSign,
  FileText, Headphones, BarChart3, UserPlus, Calendar, Bell,
  ChevronRight, Briefcase, Target, Award, Zap, Loader
} from 'lucide-react';
import * as ds from '../../services/dataService';

export default function DashboardPage() {
  const { user, isAdmin, isHR, isManager } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  useEffect(() => {
    async function loadData() {
      const [ann, lt, hol, t, n, lr, att] = await Promise.all([
        ds.getAnnouncements(),
        ds.getLeaveTypes(),
        ds.getHolidays(),
        ds.getTasks(),
        ds.getNotifications(user?.id),
        ds.getLeaveRequests(user?.id),
        ds.getAttendanceRecords(user?.id),
      ]);
      setAnnouncements(ann);
      setLeaveTypes(lt);
      setHolidays(hol);
      setTasks(t);
      setNotifications(n);
      setLeaveRequests(lr);
      setAttendanceRecords(att);
      setLoading(false);
    }
    loadData();
  }, [user?.id]);

  const currentDate = new Date();
  const hours = currentDate.getHours();
  const greeting = hours < 12 ? 'Good Morning' : hours < 17 ? 'Good Afternoon' : 'Good Evening';

  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);

  const pendingLeaves = leaveRequests.filter(l => l.status === 'pending').length;
  const pendingTasks = tasks.filter(t => t.status === 'todo' || t.status === 'in-progress').length;
  const totalLeaveBalance = leaveTypes.reduce((a, b) => a + (b.total - (b.used || 0)), 0);

  const upcomingHolidays = holidays.filter(h => new Date(h.date) > currentDate).slice(0, 3);
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const statsCards = [
    { label: 'Attendance Rate', value: '96.5%', trend: '+2.1%', trendDir: 'up', icon: Clock, color: '#4f46e5', bg: 'rgba(79,70,229,0.12)' },
    { label: 'Leave Balance', value: totalLeaveBalance, trend: `${leaveTypes[0] ? leaveTypes[0].total - (leaveTypes[0].used || 0) : 0} casual left`, trendDir: 'stable', icon: CalendarDays, color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
    { label: 'Pending Tasks', value: pendingTasks, trend: '3 due this week', trendDir: 'up', icon: ListTodo, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    { label: 'Pending Approvals', value: pendingLeaves, trend: 'Needs attention', trendDir: 'up', icon: CheckCircle, color: '#ac40f2', bg: 'rgba(172,64,242,0.12)' },
  ];

  const quickActions = [
    { label: 'Apply Leave', icon: CalendarDays, path: '/leave', color: '#4f46e5' },
    { label: 'Submit Timesheet', icon: Clock, path: '/timesheet', color: '#22c55e' },
    { label: 'View Payslip', icon: DollarSign, path: '/payroll', color: '#f59e0b' },
    { label: 'Raise Ticket', icon: Headphones, path: '/helpdesk', color: '#ef4444' },
    { label: 'My Documents', icon: FileText, path: '/documents', color: '#3b82f6' },
    { label: 'View Calendar', icon: Calendar, path: '/calendar', color: '#ec4899' },
  ];

  const handleCheckIn = async () => {
    await ds.checkIn(user?.id);
    setCheckedIn(true);
    addToast('Checked in successfully! Have a great day! 🎉', 'success');
  };

  const handleCheckOut = async () => {
    await ds.checkOut(user?.id);
    setCheckedOut(true);
    addToast('Checked out successfully! See you tomorrow! 👋', 'success');
  };

  if (loading) {
    return (
      <div className="page animate-fadeIn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader size={32} className="spin" style={{ color: 'var(--color-primary-light)', marginBottom: '12px' }} />
          <div style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page animate-fadeIn">
      {/* Welcome Banner */}
      <div style={{
        background: 'var(--gradient-primary)',
        borderRadius: 'var(--radius-2xl)',
        padding: '28px 32px',
        marginBottom: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-30%', right: '-5%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: '-40%', right: '15%', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'white', marginBottom: '4px' }}>
                {greeting}, {user?.firstName}! 👋
              </h1>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                {currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                {' · '}{user?.designation} · {user?.department}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {!checkedIn ? (
                <button className="btn" onClick={handleCheckIn} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)' }}>
                  <Clock size={16} /> Check In
                </button>
              ) : !checkedOut ? (
                <button className="btn" onClick={handleCheckOut} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)' }}>
                  <Clock size={16} /> Check Out
                </button>
              ) : (
                <div style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.3)', color: '#86efac', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={16} /> Day Complete
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="page-grid grid-cols-4" style={{ marginBottom: '24px' }}>
        {statsCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="stats-card" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="stats-icon" style={{ background: stat.bg }}><Icon size={22} style={{ color: stat.color }} /></div>
              <div className="stats-value">{stat.value}</div>
              <div className="stats-label">{stat.label}</div>
              <div className={`stats-trend ${stat.trendDir === 'up' ? 'up' : stat.trendDir === 'down' ? 'down' : ''}`}>
                {stat.trendDir === 'up' && <TrendingUp size={12} />}
                {stat.trendDir === 'down' && <TrendingDown size={12} />}
                <span style={{ color: stat.trendDir === 'stable' ? 'var(--text-tertiary)' : undefined }}>{stat.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Zap size={18} style={{ color: 'var(--color-primary-light)' }} /> Quick Actions</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {quickActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <button key={i} onClick={() => navigate(action.path)} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = action.color; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'none'; }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${action.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={20} style={{ color: action.color }} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Announcements */}
          <div className="card">
            <div className="card-header">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Megaphone size={18} style={{ color: 'var(--color-primary-light)' }} /> Announcements</div>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/communication')} style={{ fontSize: '12px', color: 'var(--color-primary-light)' }}>View All <ChevronRight size={14} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {announcements.slice(0, 4).map(ann => (
                <div key={ann.id} style={{ padding: '14px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', transition: 'all 0.15s ease', cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    {ann.pinned && <Pin size={12} style={{ color: 'var(--color-warning)' }} />}
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>{ann.title}</span>
                    <span className={`badge ${ann.priority === 'high' ? 'badge-danger' : ann.priority === 'medium' ? 'badge-warning' : 'badge-neutral'}`}>{ann.priority}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', lineHeight: 1.5, marginBottom: '6px' }}>{ann.content?.substring(0, 120)}...</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <span>{ann.author}</span><span>·</span><span>{ann.department}</span><span>·</span>
                    <span>{new Date(ann.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Tasks */}
          <div className="card">
            <div className="card-header">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Target size={18} style={{ color: 'var(--color-primary-light)' }} /> My Tasks</div>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/tasks')} style={{ fontSize: '12px', color: 'var(--color-primary-light)' }}>View All <ChevronRight size={14} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tasks.filter(t => t.status !== 'done').slice(0, 5).map(task => (
                <div key={task.id} style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.15s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, background: task.priority === 'critical' ? '#ef4444' : task.priority === 'high' ? '#f59e0b' : task.priority === 'medium' ? '#3b82f6' : '#6b7280' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '2px' }} className="truncate">{task.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{task.project} · Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  </div>
                  <span className={`badge ${task.status === 'in-progress' ? 'badge-primary' : task.status === 'review' ? 'badge-warning' : 'badge-neutral'}`} style={{ fontSize: '10px' }}>
                    {task.status === 'in-progress' ? 'In Progress' : task.status === 'review' ? 'Review' : 'To Do'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Leave Balance */}
          <div className="card">
            <div className="card-header">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CalendarDays size={18} style={{ color: 'var(--color-primary-light)' }} /> Leave Balance</div>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/leave')} style={{ fontSize: '12px', color: 'var(--color-primary-light)' }}>Apply <ChevronRight size={14} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {leaveTypes.slice(0, 4).map((leave, i) => {
                const remaining = leave.total - (leave.used || 0);
                const pct = (remaining / leave.total) * 100;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{leave.type}</span>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{remaining}/{leave.total}</span>
                      </div>
                      <div className="progress-bar progress-sm">
                        <div className="progress-fill" style={{ width: `${pct}%`, background: leave.color }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Holidays */}
          <div className="card">
            <div className="card-header">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={18} style={{ color: 'var(--color-primary-light)' }} /> Upcoming Holidays</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {upcomingHolidays.map((holiday, i) => {
                const hDate = new Date(holiday.date);
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--gradient-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary-light)', lineHeight: 1 }}>{hDate.getDate()}</span>
                      <span style={{ fontSize: '9px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>{hDate.toLocaleDateString('en-US', { month: 'short' })}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{holiday.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                        {hDate.toLocaleDateString('en-US', { weekday: 'long' })} · <span className={`badge ${holiday.type === 'national' ? 'badge-danger' : holiday.type === 'public' ? 'badge-primary' : 'badge-neutral'}`} style={{ fontSize: '9px', padding: '1px 6px' }}>{holiday.type}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pending Approvals (Manager/HR/Admin) */}
          {(isAdmin || isHR || isManager) && (
            <div className="card">
              <div className="card-header">
                <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><AlertCircle size={18} style={{ color: 'var(--color-warning)' }} /> Pending Approvals</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {leaveRequests.filter(l => l.status === 'pending').map(req => (
                  <div key={req.id} style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{req.employee}</span>
                      <span className="badge badge-warning" style={{ fontSize: '10px' }}>Pending</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
                      {req.type} · {req.days} day(s) · {new Date(req.from).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(req.to).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-success btn-sm" style={{ fontSize: '11px', padding: '4px 12px' }} onClick={() => { ds.updateLeaveStatus(req.id, 'approved', user?.id); addToast(`Leave approved for ${req.employee}`, 'success'); }}>Approve</button>
                      <button className="btn btn-danger btn-sm" style={{ fontSize: '11px', padding: '4px 12px' }} onClick={() => { ds.updateLeaveStatus(req.id, 'rejected', user?.id); addToast(`Leave rejected for ${req.employee}`, 'error'); }}>Reject</button>
                    </div>
                  </div>
                ))}
                {leaveRequests.filter(l => l.status === 'pending').length === 0 && (
                  <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-tertiary)', fontSize: '13px' }}>No pending approvals 🎉</div>
                )}
              </div>
            </div>
          )}

          {/* Recent Notifications */}
          <div className="card">
            <div className="card-header">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={18} style={{ color: 'var(--color-primary-light)' }} /> Notifications
                {unreadNotifs > 0 && <span className="badge badge-danger" style={{ fontSize: '10px' }}>{unreadNotifs}</span>}
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/notifications')} style={{ fontSize: '12px', color: 'var(--color-primary-light)' }}>All <ChevronRight size={14} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {notifications.slice(0, 4).map(notif => (
                <div key={notif.id} style={{ padding: '10px 12px', borderRadius: '8px', background: notif.read ? 'transparent' : 'rgba(79,70,229,0.05)', display: 'flex', gap: '10px', cursor: 'pointer' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', marginTop: '6px', flexShrink: 0, background: notif.read ? 'var(--text-muted)' : 'var(--color-primary)' }} />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: notif.read ? 400 : 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{notif.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                      {new Date(notif.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 1024px) { .page > div:last-of-type { grid-template-columns: 1fr !important; } }
        @media (max-width: 640px) { .page > div:nth-of-type(2) { grid-template-columns: 1fr 1fr !important; } }
      `}</style>
    </div>
  );
}
