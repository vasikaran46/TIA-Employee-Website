import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      position: 'relative',
      overflow: 'hidden',
      padding: '20px',
    }}>
      {/* Background Effects */}
      <div style={{
        position: 'absolute', top: '-20%', left: '-10%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(172,64,242,0.12) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '800px', height: '800px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(73,61,245,0.06) 0%, transparent 60%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      {/* Login Card */}
      <div className="animate-scaleIn" style={{
        width: '100%',
        maxWidth: '440px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'var(--gradient-primary)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '24px', color: 'white',
            fontFamily: 'var(--font-display)',
            boxShadow: 'var(--shadow-glow)',
            marginBottom: '16px',
          }}>T</div>
          <h1 style={{
            fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)',
            marginBottom: '4px',
          }}>
            <span className="gradient-text">TIA Portal</span>
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>
            Employee Management System
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card-static" style={{ padding: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
              Welcome back
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
              Sign in to your employee portal
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: '8px',
                background: 'var(--color-danger-bg)',
                border: '1px solid rgba(239,68,68,0.2)',
                color: 'var(--color-danger)',
                fontSize: '13px', marginBottom: '20px',
                animation: 'fadeIn 0.2s ease',
              }}>
                {error}
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{
                  position: 'absolute', left: '12px', top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--text-tertiary)',
                }} />
                <input
                  id="login-email"
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{
                  position: 'absolute', left: '12px', top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--text-tertiary)',
                }} />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '40px', paddingRight: '40px' }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%)', color: 'var(--text-tertiary)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '4px',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '24px',
            }}>
              <label className="form-checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <Link to="/forgot-password" style={{
                fontSize: '13px', color: 'var(--color-primary-light)',
                fontWeight: 500,
              }}>
                Forgot password?
              </Link>
            </div>

            <button
              id="login-submit"
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={isLoading}
              style={{ width: '100%', justifyContent: 'center', height: '44px' }}
            >
              {isLoading ? (
                <div className="loading-spinner loading-spinner-sm" style={{
                  borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)',
                }} />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Demo Credentials */}
        <div className="glass-card-static" style={{ padding: '20px', marginTop: '16px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            marginBottom: '12px', fontSize: '12px', fontWeight: 600,
            color: 'var(--color-primary-light)',
          }}>
            <Sparkles size={14} />
            DEMO CREDENTIALS
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px',
          }}>
            {[
              { label: 'Admin', email: 'admin@tia.com', pass: 'admin123', color: '#4f46e5' },
              { label: 'HR Manager', email: 'hr@tia.com', pass: 'hr123', color: '#ac40f2' },
              { label: 'Manager', email: 'manager@tia.com', pass: 'manager123', color: '#22c55e' },
              { label: 'Employee', email: 'employee@tia.com', pass: 'employee123', color: '#3b82f6' },
            ].map(demo => (
              <button
                key={demo.email}
                onClick={() => fillDemo(demo.email, demo.pass)}
                style={{
                  padding: '8px 12px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer', transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.borderColor = demo.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                <div style={{
                  fontSize: '12px', fontWeight: 600, color: demo.color, marginBottom: '2px',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  <div style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: demo.color,
                  }} />
                  {demo.label}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                  {demo.email}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p style={{
          textAlign: 'center', marginTop: '24px',
          fontSize: '12px', color: 'var(--text-tertiary)',
        }}>
          © 2026 TIA Software Solutions. All rights reserved.
        </p>
      </div>
    </div>
  );
}
