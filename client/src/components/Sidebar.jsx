import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  LayoutDashboard,
  Layers,
  Calendar,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ isMobileOpen, setIsMobileOpen, isCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { playClickSound } = useTheme();

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

      <aside
        className={`app-sidebar ${isMobileOpen ? 'mobile-open' : ''} ${
          isCollapsed ? 'collapsed' : ''
        }`}
      >
        {/* Sidebar Header / Brand */}
        <div className="sidebar-brand-wrapper">
          <Link to="/" className="sidebar-brand" onClick={handleNavClick} title="SylloTrack Home">
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
            title="Close Menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Live Section Context Pill */}
        <div
          className="sidebar-section-status"
          title="Section A • Semester 5"
        >
          <div className="status-indicator-dot" />
          <div className="status-text">
            <span>Section A • Semester 5</span>
          </div>
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
                title={item.label}
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
          <div className="sidebar-user-card" title={user?.name || 'Student'}>
            <div className="sidebar-avatar">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <span className="user-name-text">{user?.name || 'Student'}</span>
              <span className="user-email-text">{user?.email || 'CSE Section A'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="icon-btn logout-btn"
              title="Sign Out"
              style={{ marginLeft: 'auto' }}
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
