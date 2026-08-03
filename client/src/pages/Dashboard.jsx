import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle,
  ListTodo,
  TrendingUp,
  PlusCircle,
  Calendar,
  Clock,
  AlertCircle,
  ArrowRight,
  GraduationCap,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import SubjectCard from '../components/SubjectCard';

const Dashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const todayStr = new Date().toISOString().split('T')[0];

      const [subRes, evRes, schedRes] = await Promise.all([
        api.get('/subjects'),
        api.get('/events'),
        api.get(`/schedule?date=${todayStr}`),
      ]);

      setSubjects(subRes.data);
      setUpcomingEvents(
        evRes.data
          .filter((e) => e.type === 'exam' || e.type === 'assignment')
          .slice(0, 4)
      );
      setTodaySchedule(schedRes.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteSubject = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" and all its topics?`)) {
      try {
        await api.delete(`/subjects/${id}`);
        setSubjects(subjects.filter((s) => s._id !== id));
      } catch (err) {
        console.error('Failed to delete subject:', err);
        alert('Could not delete subject');
      }
    }
  };

  const handleToggleSchedule = async (id) => {
    try {
      const res = await api.patch(`/schedule/${id}/toggle`);
      setTodaySchedule(todaySchedule.map((b) => (b._id === id ? res.data : b)));
    } catch (err) {
      console.error('Failed to toggle schedule block:', err);
    }
  };

  // Calculate overall stats
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
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>Dashboard</h1>
          <p className="page-subtitle">Track your syllabus progress, exams, and daily study schedule.</p>
        </div>
        <div className="header-actions">
          <Link to="/calendar" className="btn btn-secondary">
            <Calendar size={18} />
            <span>Calendar & Schedule</span>
          </Link>
          <Link to="/add-subject" className="btn btn-primary">
            <PlusCircle size={18} />
            <span>Add Subject</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="empty-state" style={{ borderColor: 'var(--danger)', marginBottom: '1.5rem' }}>
          <p style={{ color: 'var(--danger)' }}>{error}</p>
          <button onClick={fetchDashboardData} className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>
            Retry
          </button>
        </div>
      )}

      {/* Banner Card */}
      <div className="overview-banner">
        <div className="overview-details">
          <h2>Syllabus & Goal Mastery</h2>
          <p>You have completed {completedTopics} out of {totalTopics} total topics across all subjects.</p>
          <Link to="/calendar" className="btn btn-secondary" style={{ color: 'var(--primary)' }}>
            + Plan Schedule & Deadlines
          </Link>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar-label">
            <span>Overall Progress</span>
            <span>{overallPercentage}%</span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Subjects"
          value={totalSubjects}
          icon={BookOpen}
          color="blue"
        />
        <StatCard
          title="Total Topics"
          value={totalTopics}
          icon={ListTodo}
          color="amber"
        />
        <StatCard
          title="Completed Topics"
          value={completedTopics}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Overall Completion"
          value={`${overallPercentage}%`}
          icon={TrendingUp}
          color="blue"
        />
      </div>

      {/* Quick Access Widgets: Deadlines & Today's Schedule */}
      <div className="dashboard-widgets-grid">
        {/* Widget 1: Upcoming Exams & Deadlines */}
        <div className="dash-widget-card">
          <div className="widget-header">
            <div className="widget-title">
              <GraduationCap size={20} className="text-primary" />
              <h3>Exams & Deadlines</h3>
            </div>
            <Link to="/calendar" className="widget-link">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="widget-empty">
              <AlertCircle size={24} />
              <p>No exams or assignments scheduled.</p>
              <Link to="/calendar" className="btn btn-sm btn-secondary">
                + Add Exam Date
              </Link>
            </div>
          ) : (
            <div className="widget-items-list">
              {upcomingEvents.map((ev) => (
                <div key={ev._id} className="widget-item">
                  <span className={`chip-badge chip-${ev.type}`}>
                    {ev.type === 'exam' ? '🎓 Exam' : '📝 Deadline'}
                  </span>
                  <div className="widget-item-info">
                    <strong>{ev.title}</strong>
                    <span className="widget-item-date">
                      {new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {ev.subject?.name ? ` • ${ev.subject.name}` : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Widget 2: Today's Day Schedule */}
        <div className="dash-widget-card">
          <div className="widget-header">
            <div className="widget-title">
              <Clock size={20} className="text-primary" />
              <h3>Today's Study Schedule ({completedTodayCount}/{todaySchedule.length})</h3>
            </div>
            <Link to="/calendar" className="widget-link">
              Day Scheduler <ArrowRight size={14} />
            </Link>
          </div>

          {todaySchedule.length === 0 ? (
            <div className="widget-empty">
              <Clock size={24} />
              <p>No study slots scheduled for today.</p>
              <Link to="/calendar" className="btn btn-sm btn-primary">
                + Plan Today's Schedule
              </Link>
            </div>
          ) : (
            <div className="widget-items-list">
              {todaySchedule.map((block) => (
                <div key={block._id} className="widget-item schedule-item">
                  <button
                    className="btn-toggle-check"
                    onClick={() => handleToggleSchedule(block._id)}
                  >
                    {block.completed ? (
                      <CheckCircle2 size={18} className="active" />
                    ) : (
                      <Circle size={18} />
                    )}
                  </button>
                  <div className="widget-item-info">
                    <strong className={block.completed ? 'strikethrough' : ''}>
                      {block.startTime} - {block.endTime}: {block.title}
                    </strong>
                    {block.subject?.name && (
                      <span className="widget-item-date">{block.subject.name}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Subjects Grid */}
      <div>
        <h2 className="section-title">Your Subjects ({totalSubjects})</h2>

        {subjects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <BookOpen size={28} />
            </div>
            <h3>No subjects added yet</h3>
            <p>Start tracking your syllabus by adding your subjects and topics.</p>
            <Link to="/add-subject" className="btn btn-primary">
              <PlusCircle size={18} />
              <span>Add Your First Subject</span>
            </Link>
          </div>
        ) : (
          <div className="subject-grid">
            {subjects.map((subject) => (
              <SubjectCard
                key={subject._id}
                subject={subject}
                onDelete={handleDeleteSubject}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
