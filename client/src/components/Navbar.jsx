import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, LayoutDashboard, Calendar, LogOut, User, GraduationCap, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  const firstName = user?.name ? user.name.split(' ')[0] : 'Student';

  return (
    <header className="navbar">
      <div className="nav-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <Link to="/" className="brand">
            <div className="brand-icon">
              <GraduationCap size={24} />
            </div>
            <span>SylloTrack</span>
          </Link>
          <span className="section-badge">
            <BookOpen size={13} />
            <span>Sec A CSE</span>
          </span>
        </div>

        <nav className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/subjects"
            className={`nav-link ${location.pathname.startsWith('/subject') ? 'active' : ''}`}
          >
            <Layers size={18} />
            <span>Subjects</span>
          </Link>
          <Link
            to="/calendar"
            className={`nav-link ${location.pathname === '/calendar' ? 'active' : ''}`}
          >
            <Calendar size={18} />
            <span>Calendar & Scheduler</span>
          </Link>

          {/* User profile & Logout */}
          <div className="nav-user-section">
            <div className="user-pill" title={user?.email}>
              <div className="user-avatar">
                <User size={15} />
              </div>
              <span className="user-name">Hi, {firstName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="btn-logout"
              title="Sign Out"
            >
              <LogOut size={18} />
              <span className="logout-text">Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
