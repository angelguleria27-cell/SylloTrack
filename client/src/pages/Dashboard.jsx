import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  ListTodo,
  CheckCircle,
  TrendingUp,
  Sparkles,
  Layers,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  Circle,
  GraduationCap,
  AlertCircle,
} from 'lucide-react';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import TimetableWidget from '../components/TimetableWidget';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { formatTimeRange } from '../utils/timeFormat';
import { getTodayStr, formatEventDisplayDate } from '../utils/dateUtils';

const Dashboard = () => {
  const { user } = useAuth();
  const { playCheckSound, playClickSound, is12Hour } = useTheme();

  const [subjects, setSubjects] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const firstName = user?.name ? user.name.split(' ')[0] : 'Student';

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const todayStr = getTodayStr();

      const [subRes, evRes, schedRes, annRes, assRes] = await Promise.all([
        api.get('/subjects'),
        api.get('/events'),
        api.get(`/schedule?date=${todayStr}`),
        api.get('/announcements'),
        api.get('/assignments'),
      ]);

      setSubjects(subRes.data);
      setUpcomingEvents(
        evRes.data
          .filter((e) => e.type === 'exam' || e.type === 'assignment')
          .slice(0, 4)
      );
      setTodaySchedule(schedRes.data);
      setAnnouncements(annRes.data);
      setAssignments(assRes.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load command center. Please ensure server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleSchedule = async (id) => {
    const targetBlock = todaySchedule.find((b) => b._id === id);
    const nextState = !targetBlock?.completed;
    playCheckSound(nextState);

    try {
      const res = await api.patch(`/schedule/${id}/toggle`);
      setTodaySchedule(todaySchedule.map((b) => (b._id === id ? res.data : b)));
    } catch (err) {
      console.error('Failed to toggle schedule block:', err);
    }
  };

  const totalSubjects = subjects.length;
  const totalTopics = subjects.reduce((acc, curr) => acc + (curr.totalTopics || 0), 0);
  const completedTopics = subjects.reduce((acc, curr) => acc + (curr.completedTopics || 0), 0);
  const overallPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const completedTodayCount = todaySchedule.filter((b) => b.completed).length;

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="command-center-container animate-fade-in">
      {/* Hero Welcome Banner */}
      <div className="hero-command-banner card glass-panel glow-border">
        <div className="hero-content">
          <div className="hero-badge-row">
            <span className="hero-tag glow-badge">
              <Sparkles size={13} /> Command Center
            </span>
            <span className="hero-tag-secondary">B.Tech CSE • Section A</span>
            <span className="hero-tag-secondary">Semester 5</span>
          </div>

          <h1 className="hero-title">
            Welcome back, <span className="highlight-gradient">{firstName}</span>
          </h1>

          <p className="hero-subtitle">
            You've completed <strong>{completedTopics}</strong> of <strong>{totalTopics}</strong> syllabus topics for Section A. Keep pushing forward!
          </p>

          <div className="hero-actions-row">
            <Link to="/subjects" className="btn btn-primary" onClick={playClickSound}>
              <Layers size={17} />
              <span>Explore Subjects & Syllabus</span>
            </Link>
            <Link to="/calendar" className="btn btn-secondary" onClick={playClickSound}>
              <Calendar size={17} />
              <span>Study Scheduler</span>
            </Link>
          </div>
        </div>

        {/* Circular Progress Gauge / Banner Widget */}
        <div className="hero-gauge-box">
          <div className="gauge-circle-wrapper">
            <svg viewBox="0 0 100 100" className="gauge-svg">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="gauge-track"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                className="gauge-fill"
                style={{
                  strokeDasharray: 264,
                  strokeDashoffset: 264 - (264 * overallPercentage) / 100,
                }}
              />
            </svg>
            <div className="gauge-center-text">
              <span className="gauge-percentage">{overallPercentage}%</span>
              <span className="gauge-label">Syllabus Done</span>
            </div>
          </div>
        </div>
      </div>

      {/* Department Announcements Banner */}
      {announcements.length > 0 && (
        <div className="card glass-panel" style={{ borderLeft: '4px solid var(--primary)', marginBottom: '1.5rem', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="hero-tag glow-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: 'var(--primary)' }}>
              📢 Section A Announcement
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Posted by {announcements[0].author?.name || 'Admin'}
            </span>
          </div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', fontWeight: 700 }}>{announcements[0].title}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.5' }}>{announcements[0].content}</p>
        </div>
      )}

      {error && (
        <div className="empty-state card" style={{ borderColor: 'var(--danger)', marginBottom: '1.5rem' }}>
          <p style={{ color: 'var(--danger)' }}>{error}</p>
          <button
            onClick={() => {
              playClickSound();
              fetchDashboardData();
            }}
            className="btn btn-secondary"
            style={{ marginTop: '0.5rem' }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Key Metrics Stats Grid */}
      <div className="stats-grid">
        <StatCard
          title="Section Subjects"
          value={totalSubjects}
          subtitle="Core CSE 5th Sem"
          icon={BookOpen}
          color="blue"
        />
        <StatCard
          title="Total Syllabus Topics"
          value={totalTopics}
          subtitle="All Units & Modules"
          icon={ListTodo}
          color="amber"
        />
        <StatCard
          title="Topics Completed"
          value={completedTopics}
          subtitle="Verified Progress"
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Overall Progress"
          value={`${overallPercentage}%`}
          subtitle="Semester Completion"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Section A Class Timetable Widget & Today's Schedule Grid */}
      <div className="dash-two-col-grid">
        {/* Widget 1: Section A Class Schedule */}
        <TimetableWidget />

        {/* Widget 2: Today's Study Sessions & Deadlines */}
        <div className="dash-widget-column">
          {/* Today's Study Sessions */}
          <div className="dash-widget-card card glass-panel">
            <div className="widget-header">
              <div className="widget-title">
                <Clock size={19} color="var(--primary)" />
                <h3>Today's Study Plan ({completedTodayCount}/{todaySchedule.length})</h3>
              </div>
              <Link to="/calendar" className="widget-link" onClick={playClickSound}>
                Full Scheduler <ArrowRight size={14} />
              </Link>
            </div>

            {todaySchedule.length === 0 ? (
              <div className="widget-empty">
                <Clock size={28} className="empty-icon-muted" />
                <p>No study slots scheduled for today.</p>
                <Link to="/calendar" className="btn btn-sm btn-primary" onClick={playClickSound}>
                  + Auto-Plan Study Schedule
                </Link>
              </div>
            ) : (
              <div className="widget-items-list">
                {todaySchedule.map((block) => (
                  <div
                    key={block._id}
                    className={`widget-item card ${block.completed ? 'completed' : ''}`}
                    onClick={() => handleToggleSchedule(block._id)}
                  >
                    <button className="check-trigger-btn">
                      {block.completed ? (
                        <CheckCircle2 size={18} color="var(--success)" className="animated-check" />
                      ) : (
                        <Circle size={18} color="var(--text-light)" />
                      )}
                    </button>
                    <div className="widget-item-info">
                      <span className={`block-title ${block.completed ? 'strikethrough' : ''}`}>
                        {formatTimeRange(block.startTime, block.endTime, is12Hour)}: {block.title}
                      </span>
                      {block.subject?.name && (
                        <span className="block-sub-badge">{block.subject.name}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Exams & Deadlines Widget */}
          <div className="dash-widget-card card glass-panel" style={{ marginTop: '1.25rem' }}>
            <div className="widget-header">
              <div className="widget-title">
                <GraduationCap size={19} color="var(--primary)" />
                <h3>Exams & Deadlines</h3>
              </div>
              <Link to="/calendar" className="widget-link" onClick={playClickSound}>
                View All <ArrowRight size={14} />
              </Link>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="widget-empty">
                <AlertCircle size={28} className="empty-icon-muted" />
                <p>No upcoming exams or assignments.</p>
                <Link to="/calendar" className="btn btn-sm btn-secondary" onClick={playClickSound}>
                  + Add Deadline
                </Link>
              </div>
            ) : (
              <div className="widget-items-list">
                {upcomingEvents.map((ev) => (
                  <div key={ev._id} className="widget-item card">
                    <span className={`code-pill ${ev.type === 'exam' ? 'pill-exam' : 'pill-assignment'}`}>
                      {ev.type === 'exam' ? '🎓 Exam' : '📝 Deadline'}
                    </span>
                    <div className="widget-item-info">
                      <strong className="ev-title">{ev.title}</strong>
                      <span className="ev-date">
                        {formatEventDisplayDate(ev.date, { month: 'short', day: 'numeric' })}
                        {ev.subject?.name ? ` • ${ev.subject.name}` : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
