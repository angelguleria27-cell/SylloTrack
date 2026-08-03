import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  LayoutDashboard,
  Layers,
  Calendar,
  PlusCircle,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme, soundEnabled, toggleSound, playClickSound } = useTheme();

  if (!isAuthenticated) return null;

  const firstName = user?.name ? user.name.split(' ')[0] : 'Student';

  const handleNavClick = () => {
    playClickSound();
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const handleLogout = () => {
    playClickSound();
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      path: '/',
      label: 'Command Center',
      icon: LayoutDashboard,
      badge: 'Live',
    },
    {
      path: '/subjects',
      label: 'Subjects & Syllabus',
      icon: Layers,
    },
    {
      path: '/calendar',
      label: 'Calendar & Scheduler',
      icon: Calendar,
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="sidebar-mobile-backdrop"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`app-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Sidebar Header / Brand */}
        <div className="sidebar-brand-wrapper">
          <Link to="/" className="sidebar-brand" onClick={handleNavClick}>
            <div className="brand-logo-icon">
              <GraduationCap size={22} />
            </div>
            <div className="brand-text-col">
              <span className="brand-title">SylloTrack</span>
              <span className="brand-badge">B.Tech CSE • Sec A</span>
            </div>
          </Link>
          <button
            className="mobile-close-btn icon-btn-ghost"
            onClick={() => setIsMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Live Section Context Pill */}
        <div className="sidebar-section-status">
          <div className="status-indicator-dot" />
          <div className="status-text">
            <span>Section A • Semester 5</span>
            <strong style={{ display: 'block', fontSize: '0.72rem', opacity: 0.8 }}>
              90 Classmates Syncing
            </strong>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="sidebar-quick-action">
          <Link
            to="/calendar"
            onClick={handleNavClick}
            className="btn btn-primary btn-sidebar-action"
          >
            <PlusCircle size={17} />
            <span>+ Add Exam / Slot</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          <div className="nav-group-label">WORKSPACE</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={19} className="nav-link-icon" />
                <span className="nav-link-text">{item.label}</span>
                {item.badge && <span className="nav-link-badge">{item.badge}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / User Profile */}
        <div className="sidebar-footer">
          <div className="sidebar-user-card">
            <div className="sidebar-avatar">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <span className="user-name-text">{user?.name || 'Student'}</span>
              <span className="user-email-text">{user?.email || 'CSE Section A'}</span>
            </div>
          </div>

          <div className="sidebar-controls-row">
            <button
              onClick={toggleTheme}
              className={`icon-btn theme-toggle-btn ${isDark ? 'is-dark' : 'is-light'}`}
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <button
              onClick={toggleSound}
              className={`icon-btn sound-toggle-btn ${soundEnabled ? 'is-on' : 'is-off'}`}
              title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
            >
              {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
            </button>

            <button
              onClick={handleLogout}
              className="icon-btn logout-btn"
              title="Sign Out"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
