import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, User, Mail, Lock, Eye, EyeOff, UserPlus, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Register = () => {
  const { playClickSound, playSuccessSound } = useTheme();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    playClickSound();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await register(formData.name.trim(), formData.email.trim(), formData.password);
      playSuccessSound();
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Registration error:', err);
      const message =
        err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
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
            <h1 className="brand-headline">Join SylloTrack</h1>
            <p className="brand-tagline">
              Empower your study routine with organized syllabus tracking and goal achievement.
            </p>
            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-icon"><Sparkles size={18} /></div>
                <div>
                  <strong>Custom Study Plans</strong>
                  <p>Add your semester subjects and map out every unit easily.</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><CheckCircle2 size={18} /></div>
                <div>
                  <strong>Visual Milestones</strong>
                  <p>Watch your progress bars fill up as you master each topic.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="auth-card-wrapper">
          <div className="auth-card card glass-panel">
            <div className="auth-card-header">
              <h2>Create Account 🚀</h2>
              <p>Start managing your syllabus effectively today</p>
            </div>

            {error && (
              <div className="auth-alert error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-with-icon">
                  <User className="input-icon" size={18} />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    placeholder="Alex Morgan"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                  />
                </div>
              </div>

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
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
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

              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-with-icon">
                  <Lock className="input-icon" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                  />
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Sign Up
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer" style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p>
                Already have an account?{' '}
                <Link to="/login" onClick={playClickSound} className="auth-link" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
