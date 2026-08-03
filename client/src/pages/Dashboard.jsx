import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, ListTodo, TrendingUp, PlusCircle } from 'lucide-react';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import SubjectCard from '../components/SubjectCard';

const Dashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/subjects');
      setSubjects(res.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch subjects:', err);
      setError('Failed to load subjects. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
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

  // Calculate overall stats
  const totalSubjects = subjects.length;
  const totalTopics = subjects.reduce((acc, curr) => acc + (curr.totalTopics || 0), 0);
  const completedTopics = subjects.reduce((acc, curr) => acc + (curr.completedTopics || 0), 0);
  const overallPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

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
          <p className="page-subtitle">Track your syllabus progress and stay on top of your studies.</p>
        </div>
        <Link to="/add-subject" className="btn btn-primary">
          <PlusCircle size={18} />
          <span>Add New Subject</span>
        </Link>
      </div>

      {error && (
        <div className="empty-state" style={{ borderColor: 'var(--danger)', marginBottom: '1.5rem' }}>
          <p style={{ color: 'var(--danger)' }}>{error}</p>
          <button onClick={fetchSubjects} className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>
            Retry
          </button>
        </div>
      )}

      {/* Banner Card */}
      <div className="overview-banner">
        <div className="overview-details">
          <h2>Syllabus Mastery</h2>
          <p>You have completed {completedTopics} out of {totalTopics} total topics across all subjects.</p>
          <Link to="/add-subject" className="btn btn-secondary" style={{ color: 'var(--primary)' }}>
            + Create New Subject
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
