import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, KeyRound, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const AdminLogin = () => {
  const { playClickSound, playSuccessSound } = useTheme();

  const [formData, setFormData] = useState({
    email: 'admin@syllotrack.com',
    password: 'Admin@123456',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    playClickSound();

    if (!formData.email.trim() || !formData.password) {
      setError('Please enter admin email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await adminLogin(formData.email, formData.password);
      playSuccessSound();
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      console.error('Admin login error:', err);
      const message =
        err.response?.data?.message || 'Access denied. Invalid administrator credentials.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page animate-fade-in admin-auth-theme">
      <div className="auth-container">
        {/* Left Side: Admin Portal Branding */}
        <div className="auth-branding admin-branding-gradient">
          <div className="branding-content">
            <div className="brand-logo-large glow-badge admin-badge-glow">
              <ShieldCheck size={38} color="#38bdf8" />
            </div>
            <h1 className="brand-headline">SylloTrack Admin</h1>
            <p className="brand-tagline">
              Administrative Command & Content Management Center
            </p>
            <div className="feature-list" style={{ marginTop: '2rem' }}>
              <div className="feature-item">
                <div className="feature-icon" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                  <KeyRound size={18} />
                </div>
                <div>
                  <strong>Role-Based Access Control</strong>
                  <p>Restricted access reserved for verified faculty and admins.</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <strong>Curriculum Management</strong>
                  <p>Create subjects, syllabus units, assignment deadlines & announcements.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Admin Auth Card */}
        <div className="auth-card-wrapper">
          <div className="auth-card card glass-panel admin-card-border">
            <div className="auth-card-header">
              <div className="admin-portal-pill">
                <ShieldCheck size={14} /> Faculty & Admin Portal
              </div>
              <h2 style={{ marginTop: '0.5rem' }}>Admin Authentication</h2>
              <p>Sign in with your administrator account to access dashboard controls</p>
            </div>

            {error && (
              <div className="auth-alert error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="input-group">
                <label htmlFor="admin-email">Admin Email</label>
                <div className="input-with-icon">
                  <Mail className="input-icon" size={18} />
                  <input
                    type="email"
                    id="admin-email"
                    name="email"
                    className="form-control"
                    placeholder="admin@syllotrack.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="admin-password">Password</label>
                <div className="input-with-icon">
                  <Lock className="input-icon" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="admin-password"
                    name="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn icon-btn-ghost"
                    onClick={() => { playClickSound(); setShowPassword(!showPassword); }}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="admin-seed-hint">
                <p>
                  <strong>Default Admin Credentials:</strong><br />
                  Email: <code>admin@syllotrack.com</code><br />
                  Password: <code>Admin@123456</code>
                </p>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-auth admin-btn-glow"
                disabled={isSubmitting}
                style={{ width: '100%', marginTop: '1rem' }}
              >
                {isSubmitting ? (
                  <>
                    <span className="btn-spinner"></span>
                    Authenticating Admin...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign In to Admin Dashboard
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <a href="/login" onClick={playClickSound} className="auth-link" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                ← Switch to Student Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
