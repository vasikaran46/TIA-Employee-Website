import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { NOTIFICATIONS } from '../data/mockData';
import {
  LayoutDashboard, User, Clock, CalendarDays, DollarSign, ListTodo,
  Timer, FileText, MessageSquare, TrendingUp, Users, GraduationCap,
  Headphones, Package, Receipt, Calendar, Bell, BarChart3, Shield,
  Menu, X, ChevronLeft, Search, LogOut, Settings, ChevronDown,
  Building2, Sun, Moon
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', module: 'dashboard' },
  { path: '/profile', icon: User, label: 'My Profile', module: 'profile' },
  { path: '/attendance', icon: Clock, label: 'Attendance', module: 'attendance' },
  { path: '/leave', icon: CalendarDays, label: 'Leave', module: 'leave' },
  { path: '/payroll', icon: DollarSign, label: 'Payroll', module: 'payroll' },
  { path: '/tasks', icon: ListTodo, label: 'Tasks & Projects', module: 'tasks' },
  { path: '/timesheet', icon: Timer, label: 'Timesheet', module: 'timesheet' },
  { path: '/documents', icon: FileText, label: 'Documents', module: 'documents' },
  { path: '/communication', icon: MessageSquare, label: 'Communication', module: 'communication' },
  { path: '/performance', icon: TrendingUp, label: 'Performance', module: 'performance' },
  { path: '/recruitment', icon: Users, label: 'Recruitment', module: 'recruitment' },
  { path: '/training', icon: GraduationCap, label: 'Training', module: 'training' },
  { path: '/helpdesk', icon: Headphones, label: 'Help Desk', module: 'helpdesk' },
  { path: '/assets', icon: Package, label: 'Assets', module: 'assets' },
  { path: '/expenses', icon: Receipt, label: 'Expenses', module: 'expenses' },
  { path: '/calendar', icon: Calendar, label: 'Calendar', module: 'calendar' },
  { path: '/notifications', icon: Bell, label: 'Notifications', module: 'notifications' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics', module: 'analytics' },
  { path: '/admin', icon: Shield, label: 'Admin Panel', module: 'admin' },
];

export default function DashboardLayout() {
  const { user, logout, hasPermission } = useAuth();
  const { sidebarCollapsed, sidebarMobileOpen, toggleSidebar, toggleMobileSidebar, closeMobileSidebar, toasts, removeToast, searchQuery, setSearchQuery } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

  const filteredNav = NAV_ITEMS.filter(item => hasPermission(item.module));

  // Close mobile sidebar on route change
  useEffect(() => {
    closeMobileSidebar();
    setUserMenuOpen(false);
    setNotifOpen(false);
  }, [location.pathname, closeMobileSidebar]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.user-menu-wrapper')) setUserMenuOpen(false);
      if (!e.target.closest('.notif-wrapper')) setNotifOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const currentPage = NAV_ITEMS.find(item => location.pathname.startsWith(item.path));

  return (
    <div className="layout" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile Overlay */}
      {sidebarMobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeMobileSidebar}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 99, display: 'none',
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className="glass-sidebar"
        style={{
          width: sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
          height: '100vh',
          position: 'fixed',
          top: 0, left: 0,
          zIndex: 'var(--z-sidebar)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s ease',
          overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <div style={{
          padding: sidebarCollapsed ? '20px 12px' : '20px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          minHeight: '64px',
        }}>
          {!sidebarCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'var(--gradient-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '16px', color: 'white',
                fontFamily: 'var(--font-display)',
              }}>T</div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                  TIA Portal
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>
                  EMPLOYEE MANAGEMENT
                </div>
              </div>
            </div>
          )}
          {sidebarCollapsed && (
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '16px', color: 'white',
              fontFamily: 'var(--font-display)',
            }}>T</div>
          )}
        </div>

        {/* Navigation */}
        <nav style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '12px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}>
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: sidebarCollapsed ? '10px' : '10px 16px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--color-primary-light)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--bg-active)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  whiteSpace: 'nowrap',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--bg-hover)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                {isActive && (
                  <div style={{
                    position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                    width: '3px', height: '20px', borderRadius: '0 3px 3px 0',
                    background: 'var(--gradient-primary)',
                  }} />
                )}
                <Icon size={18} style={{ flexShrink: 0 }} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={{
          padding: sidebarCollapsed ? '16px 8px' : '16px',
          borderTop: '1px solid var(--border-color)',
        }}>
          <button
            onClick={toggleSidebar}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '8px', width: '100%', padding: '8px',
              borderRadius: '8px', background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-tertiary)', cursor: 'pointer',
              fontSize: '12px', transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-hover)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--glass-bg)';
              e.currentTarget.style.color = 'var(--text-tertiary)';
            }}
          >
            <ChevronLeft size={16} style={{
              transform: sidebarCollapsed ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.3s ease',
            }} />
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        marginLeft: sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
        transition: 'margin-left 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <header
          className="glass-header"
          style={{
            height: 'var(--header-height)',
            position: 'sticky', top: 0,
            zIndex: 'var(--z-header)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
          }}
        >
          {/* Left: Mobile Menu + Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              className="mobile-menu-btn"
              onClick={toggleMobileSidebar}
              style={{
                display: 'none', padding: '8px', borderRadius: '8px',
                color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer',
              }}
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                {currentPage?.label || 'Dashboard'}
              </h1>
            </div>
          </div>

          {/* Right: Search + Notifications + User */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Search */}
            <div className="search-container" style={{ position: 'relative' }}>
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '200px' }}
              />
            </div>

            {/* Notifications */}
            <div className="notif-wrapper" style={{ position: 'relative' }}>
              <button
                onClick={(e) => { e.stopPropagation(); setNotifOpen(!notifOpen); }}
                style={{
                  padding: '8px', borderRadius: '8px', position: 'relative',
                  color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="notification-count">{unreadCount}</span>
                )}
              </button>
              {notifOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  width: '360px', background: 'var(--bg-elevated)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)',
                  animation: 'fadeInDown 0.2s ease', zIndex: 'var(--z-dropdown)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    padding: '16px 20px', borderBottom: '1px solid var(--border-color)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <span style={{ fontWeight: 700, fontSize: '14px' }}>Notifications</span>
                    <span className="badge badge-primary">{unreadCount} new</span>
                  </div>
                  <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                    {NOTIFICATIONS.slice(0, 5).map(notif => (
                      <div key={notif.id} style={{
                        padding: '12px 20px',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        background: notif.read ? 'transparent' : 'rgba(79,70,229,0.05)',
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = notif.read ? 'transparent' : 'rgba(79,70,229,0.05)'; }}
                      >
                        <div style={{ fontSize: '13px', fontWeight: notif.read ? 400 : 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                          {notif.title}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                          {notif.message.substring(0, 60)}...
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      padding: '12px', textAlign: 'center',
                      borderTop: '1px solid var(--border-color)',
                      cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                      color: 'var(--color-primary-light)',
                    }}
                    onClick={() => { navigate('/notifications'); setNotifOpen(false); }}
                  >
                    View All Notifications
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="user-menu-wrapper" style={{ position: 'relative' }}>
              <button
                onClick={(e) => { e.stopPropagation(); setUserMenuOpen(!userMenuOpen); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '6px 12px 6px 6px', borderRadius: '12px',
                  background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                  cursor: 'pointer', transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
              >
                <div className="avatar avatar-sm" style={{ fontSize: '12px' }}>
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div style={{ textAlign: 'left', lineHeight: 1.3 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {user?.firstName}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>
                    {user?.role}
                  </div>
                </div>
                <ChevronDown size={14} style={{ color: 'var(--text-tertiary)' }} />
              </button>

              {userMenuOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  width: '220px', background: 'var(--bg-elevated)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)',
                  animation: 'fadeInDown 0.2s ease', zIndex: 'var(--z-dropdown)',
                  overflow: 'hidden', padding: '6px',
                }}>
                  <div style={{
                    padding: '10px 12px', borderBottom: '1px solid var(--border-color)', marginBottom: '4px',
                  }}>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{user?.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{user?.email}</div>
                  </div>
                  {[
                    { icon: User, label: 'My Profile', action: () => navigate('/profile') },
                    { icon: Settings, label: 'Settings', action: () => navigate('/profile') },
                  ].map(item => (
                    <button
                      key={item.label}
                      onClick={() => { item.action(); setUserMenuOpen(false); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        width: '100%', padding: '8px 12px', borderRadius: '8px',
                        fontSize: '13px', color: 'var(--text-secondary)',
                        background: 'none', border: 'none', cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    >
                      <item.icon size={16} />
                      {item.label}
                    </button>
                  ))}
                  <div style={{ height: '1px', background: 'var(--border-color)', margin: '4px 0' }} />
                  <button
                    onClick={() => { logout(); navigate('/login'); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      width: '100%', padding: '8px 12px', borderRadius: '8px',
                      fontSize: '13px', color: 'var(--color-danger)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-danger-bg)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{
          flex: 1,
          padding: '24px',
          maxWidth: 'var(--content-max-width)',
          width: '100%',
          margin: '0 auto',
        }}>
          <Outlet />
        </main>

        {/* Footer */}
        <footer style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: 'var(--text-tertiary)',
        }}>
          <span>© 2026 TIA Software Solutions. All rights reserved.</span>
          <span>Employee Management Portal v2.0</span>
        </footer>
      </div>

      {/* Toast Container */}
      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map(toast => (
            <div key={toast.id} className={`toast toast-${toast.type}`}>
              <span className="toast-message">{toast.message}</span>
              <button className="toast-close" onClick={() => removeToast(toast.id)}>
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Mobile Sidebar Styles */}
      <style>{`
        @media (max-width: 768px) {
          .glass-sidebar {
            transform: ${sidebarMobileOpen ? 'translateX(0)' : 'translateX(-100%)'} !important;
            width: var(--sidebar-width) !important;
            z-index: 200 !important;
          }
          .sidebar-overlay {
            display: ${sidebarMobileOpen ? 'block' : 'none'} !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
          main {
            margin-left: 0 !important;
          }
          div[style*="marginLeft"] {
            margin-left: 0 !important;
          }
          .search-container {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
