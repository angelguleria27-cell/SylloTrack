import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Layers, CheckCircle2, TrendingUp, PlusCircle, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import SubjectCard from '../components/SubjectCard';
import StatCard from '../components/StatCard';

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/subjects');
      setSubjects(res.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch subjects:', err);
      setError('Could not load subjects. Please check if backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleDeleteSubject = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await api.delete(`/subjects/${id}`);
        setSubjects(subjects.filter((s) => s._id !== id));
      } catch (err) {
        console.error('Failed to delete subject:', err);
        alert('Could not delete subject');
      }
    }
  };

  const filteredSubjects = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.code && s.code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalSubjects = subjects.length;
  const totalTopics = subjects.reduce((acc, s) => acc + (s.totalTopics || 0), 0);
  const completedTopics = subjects.reduce((acc, s) => acc + (s.completedTopics || 0), 0);
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
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span className="section-badge">
              <BookOpen size={12} />
              B.Tech CSE - Section A
            </span>
            <span className="meta-pill">Semester 5</span>
          </div>
          <h1>Subjects & Syllabus</h1>
          <p className="page-subtitle">
            Explore pre-loaded course structures, units, modules, and track syllabus progress independently.
          </p>
        </div>
        <div className="header-actions">
          <Link to="/add-subject" className="btn btn-secondary">
            <PlusCircle size={18} />
            <span>Add Custom Subject</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="empty-state" style={{ borderColor: 'var(--danger)', marginBottom: '1.5rem' }}>
          <p style={{ color: 'var(--danger)' }}>{error}</p>
          <button onClick={fetchSubjects} className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>
            Retry
          </button>
        </div>
      )}

      {/* Stats Summary Bar */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <StatCard
          title="Section Subjects"
          value={totalSubjects}
          icon={BookOpen}
          color="blue"
        />
        <StatCard
          title="Total Syllabus Topics"
          value={totalTopics}
          icon={Layers}
          color="amber"
        />
        <StatCard
          title="Topics Completed"
          value={completedTopics}
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          title="Syllabus Progress"
          value={`${overallPercentage}%`}
          icon={TrendingUp}
          color="blue"
        />
      </div>

      {/* Filter and Controls */}
      <div className="controls-bar">
        <div className="search-filter-box">
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search subject name or code (e.g. BTCS-23502)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredSubjects.length}</strong> of <strong>{totalSubjects}</strong> subjects
        </div>
      </div>

      {/* Subject Cards Grid */}
      {filteredSubjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <AlertCircle size={28} />
          </div>
          <h3>No subjects match your search</h3>
          <p>Try clearing your search query or add a new subject.</p>
          <button onClick={() => setSearchQuery('')} className="btn btn-secondary">
            Clear Search Filter
          </button>
        </div>
      ) : (
        <div className="subject-grid">
          {filteredSubjects.map((subject) => (
            <SubjectCard
              key={subject._id}
              subject={subject}
              onDelete={handleDeleteSubject}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubjectsPage;
