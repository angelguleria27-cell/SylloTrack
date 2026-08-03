import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Mail, Lock, Eye, EyeOff, LogIn, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
  const { playClickSound, playSuccessSound } = useTheme();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    playClickSound();

    if (!formData.email.trim() || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await login(formData.email, formData.password);
      playSuccessSound();
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      const message =
        err.response?.data?.message || 'Failed to sign in. Please check your credentials.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    playClickSound();
    try {
      setIsSubmitting(true);
      setError('');
      try {
        await login('student@syllotrack.edu', 'password123');
      } catch (loginErr) {
        const { register } = useAuth();
        await register('Alex Morgan', 'student@syllotrack.edu', 'password123');
      }
      playSuccessSound();
      navigate(from, { replace: true });
    } catch (err) {
      setError('Could not complete demo login. Please try registering a new account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page animate-fade-in">
      <div className="auth-container">
        {/* Left Side: Branding / Feature Highlights */}
        <div className="auth-branding">
          <div className="branding-content">
            <div className="brand-logo-large glow-badge">
              <BookOpen size={36} />
            </div>
            <h1 className="brand-headline">SylloTrack</h1>
            <p className="brand-tagline">
              Your entire syllabus, structured and tracked down to every single topic.
            </p>
            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-icon"><Sparkles size={18} /></div>
                <div>
                  <strong>Stay Focused</strong>
                  <p>Break down massive courses into bite-sized manageable topics.</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><CheckCircle2 size={18} /></div>
                <div>
                  <strong>Real-Time Analytics</strong>
                  <p>Monitor your completion percentage across all your subjects.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="auth-card-wrapper">
          <div className="auth-card card glass-panel">
            <div className="auth-card-header">
              <h2>Welcome Back 👋</h2>
              <p>Sign in to continue tracking your academic goals</p>
            </div>

            {error && (
              <div className="auth-alert error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-with-icon">
                  <Mail className="input-icon" size={18} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="student@university.edu"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <div className="input-with-icon">
                  <Lock className="input-icon" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
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

              <button
                type="submit"
                className="btn btn-primary btn-auth"
                disabled={isSubmitting}
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                {isSubmitting ? (
                  <>
                    <span className="btn-spinner"></span>
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign In
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-demo-auth"
                onClick={handleDemoLogin}
                disabled={isSubmitting}
                style={{ width: '100%', marginTop: '0.75rem' }}
              >
                <Sparkles size={16} /> Quick Demo Student Access
              </button>
            </form>

            <div className="auth-footer" style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p>
                Don't have an account?{' '}
                <Link to="/register" onClick={playClickSound} className="auth-link" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
