import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setSubmitted(true);
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

      <div className="animate-scaleIn" style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
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
        </div>

        <div className="glass-card-static" style={{ padding: '32px' }}>
          {!submitted ? (
            <>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
                  Forgot Password?
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {error && (
                  <div style={{
                    padding: '10px 14px', borderRadius: '8px',
                    background: 'var(--color-danger-bg)', border: '1px solid rgba(239,68,68,0.2)',
                    color: 'var(--color-danger)', fontSize: '13px', marginBottom: '20px',
                  }}>
                    {error}
                  </div>
                )}
                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label">Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{
                      position: 'absolute', left: '12px', top: '50%',
                      transform: 'translateY(-50%)', color: 'var(--text-tertiary)',
                    }} />
                    <input
                      id="forgot-email"
                      type="email"
                      className="form-input"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      style={{ paddingLeft: '40px' }}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                  Send Reset Link
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center' }} className="animate-fadeInUp">
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'var(--color-success-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <CheckCircle size={32} style={{ color: 'var(--color-success)' }} />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
                Check Your Email
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '24px' }}>
                We've sent a password reset link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
              </p>
              <button onClick={() => setSubmitted(false)} className="btn btn-secondary" style={{ marginBottom: '12px', width: '100%', justifyContent: 'center' }}>
                Try Different Email
              </button>
            </div>
          )}

          <Link to="/login" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            marginTop: '20px', fontSize: '13px', color: 'var(--text-secondary)',
            fontWeight: 500,
          }}>
            <ArrowLeft size={14} />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
