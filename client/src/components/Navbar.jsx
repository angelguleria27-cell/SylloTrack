import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Search,
  Menu,
  Sparkles,
  Calendar,
  BookOpen,
  Command,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

import { formatEventDisplayDate } from '../utils/dateUtils';

const Navbar = ({ onOpenMobileMenu, onGlobalSearch, isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { isDark, toggleTheme, soundEnabled, toggleSound, playClickSound } = useTheme();

  if (!isAuthenticated) return null;

  // Format today's date nicely
  const todayFormatted = formatEventDisplayDate(new Date(), {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  // Get current page title dynamically
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Command Center';
    if (path.startsWith('/subjects')) return 'Subjects & Syllabus Directory';
    if (path.startsWith('/calendar')) return 'Calendar & Scheduler';
    if (path.startsWith('/subject/')) return 'Subject Syllabus Details';
    if (path.startsWith('/add-subject')) return 'Add Subject';
    if (path.startsWith('/edit-subject')) return 'Edit Subject';
    return 'SylloTrack Workspace';
  };

  const handleToggle = () => {
    playClickSound();
    if (onToggleCollapse) onToggleCollapse();
  };

  return (
    <header className="top-navbar">
      <div className="top-nav-left">
        <button
          className="mobile-menu-trigger icon-btn-ghost"
          onClick={onOpenMobileMenu}
          title="Open Menu"
        >
          <Menu size={22} />
        </button>

        <button
          className="desktop-nav-toggle-btn icon-btn-ghost"
          onClick={handleToggle}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>

        <div className="top-nav-title-group">
          <span className="top-page-title">{getPageTitle()}</span>
          <span className="top-nav-divider">•</span>
          <span className="top-section-pill">B.Tech CSE Sec A</span>
        </div>
      </div>

      {/* Global Quick Search / Filter Input */}
      <div className="top-nav-center">
        <div className="global-search-box">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Quick search syllabus topics, codes (BTCS-501)..."
            onChange={(e) => onGlobalSearch && onGlobalSearch(e.target.value)}
          />
          <kbd className="search-shortcut">
            <Command size={11} /> K
          </kbd>
        </div>
      </div>

      {/* Top Bar Right Actions */}
      <div className="top-nav-right">
        <div className="top-date-pill" title="Today's Date">
          <Calendar size={14} />
          <span>{todayFormatted}</span>
        </div>

        <div className="top-controls-group">
          <button
            onClick={toggleTheme}
            className={`top-icon-btn ${isDark ? 'is-dark' : 'is-light'}`}
            title={isDark ? 'Light Theme' : 'Dark Theme'}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            onClick={toggleSound}
            className={`top-icon-btn ${soundEnabled ? 'is-on' : 'is-off'}`}
            title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
