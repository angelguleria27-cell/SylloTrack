import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, PlusCircle, LayoutDashboard, LogOut, User } from 'lucide-react';
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
    return null; // Don't show top nav on auth pages (or show simple logo header if desired)
  }

  // Get first name or initial
  const firstName = user?.name ? user.name.split(' ')[0] : 'Student';

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="brand">
          <div className="brand-icon">
            <BookOpen size={22} />
          </div>
          <span>SylloTrack</span>
        </Link>
        <nav className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/add-subject"
            className="nav-link btn-primary-nav"
          >
            <PlusCircle size={18} />
            <span>Add Subject</span>
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
