import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Layers,
  CheckCircle2,
  TrendingUp,
  PlusCircle,
  AlertCircle,
  Grid,
  List,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import api from '../api/axios';
import SubjectCard from '../components/SubjectCard';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import { useTheme } from '../context/ThemeContext';

const SubjectsPage = () => {
  const { playClickSound, playDeleteSound } = useTheme();

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

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
    playDeleteSound();
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
    <div className="subjects-page-container animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <div className="title-tags-row">
            <span className="section-badge glow-badge">
              <BookOpen size={12} />
              B.Tech CSE - Section A
            </span>
            <span className="meta-pill">Semester 5</span>
          </div>
          <h1>Subjects & Syllabus Directory</h1>
          <p className="page-subtitle">
            Explore pre-loaded B.Tech CSE course structures, unit breakdowns, and track syllabus progress.
          </p>
        </div>
        <div className="header-actions">
          <Link to="/add-subject" className="btn btn-primary" onClick={playClickSound}>
            <PlusCircle size={17} />
            <span>Add Custom Subject</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="empty-state card" style={{ borderColor: 'var(--danger)', marginBottom: '1.5rem' }}>
          <p style={{ color: 'var(--danger)' }}>{error}</p>
          <button
            onClick={() => {
              playClickSound();
              fetchSubjects();
            }}
            className="btn btn-secondary"
            style={{ marginTop: '0.5rem' }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Overview Stat Grid */}
      <div className="stats-grid">
        <StatCard
          title="Section Subjects"
          value={totalSubjects}
          subtitle="Course Modules"
          icon={BookOpen}
          color="blue"
        />
        <StatCard
          title="Total Syllabus Topics"
          value={totalTopics}
          subtitle="Curriculum Items"
          icon={Layers}
          color="amber"
        />
        <StatCard
          title="Topics Completed"
          value={completedTopics}
          subtitle="Mastered"
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          title="Overall Syllabus Progress"
          value={`${overallPercentage}%`}
          subtitle="Semester Progress"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Control Bar: Search & View Toggle */}
      <div className="controls-bar card glass-panel">
        <div className="search-filter-box">
          <Search size={17} className="search-icon" />
          <input
            type="text"
            className="input-field"
            placeholder="Search by subject name or course code (e.g. BTCS-501)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="view-controls-right">
          <span className="results-count-text">
            Showing <strong>{filteredSubjects.length}</strong> of <strong>{totalSubjects}</strong> subjects
          </span>

          <div className="view-mode-toggle">
            <button
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => {
                playClickSound();
                setViewMode('grid');
              }}
              title="Grid View"
            >
              <Grid size={16} />
            </button>
            <button
              className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => {
                playClickSound();
                setViewMode('table');
              }}
              title="List View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Subjects Content Grid or Table View */}
      {filteredSubjects.length === 0 ? (
        <div className="empty-state card">
          <AlertCircle size={32} color="var(--warning)" />
          <h3>No subjects found</h3>
          <p>No subject matches your search query. Clear search or create a new subject.</p>
          <button
            onClick={() => {
              playClickSound();
              setSearchQuery('');
            }}
            className="btn btn-secondary"
          >
            Clear Search
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="subject-grid">
          {filteredSubjects.map((subject) => (
            <SubjectCard
              key={subject._id}
              subject={subject}
              onDelete={handleDeleteSubject}
            />
          ))}
        </div>
      ) : (
        /* Table / List View */
        <div className="subjects-table-wrapper card glass-panel">
          <table className="subjects-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Subject Name</th>
                <th>Units</th>
                <th>Topics Completed</th>
                <th>Progress</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((sub) => {
                const percentage =
                  sub.totalTopics > 0 ? Math.round((sub.completedTopics / sub.totalTopics) * 100) : 0;
                return (
                  <tr key={sub._id}>
                    <td>
                      <span className="code-pill">{sub.code || 'SEC-A'}</span>
                    </td>
                    <td>
                      <Link
                        to={`/subject/${sub._id}`}
                        className="table-subject-link"
                        onClick={playClickSound}
                      >
                        <strong>{sub.name}</strong>
                        <span className="table-sub-meta">Sem {sub.semester} • {sub.ltpc}</span>
                      </Link>
                    </td>
                    <td>
                      <span className="meta-pill">{sub.unitsCount || 0} Units</span>
                    </td>
                    <td>
                      <span className="topic-badge">
                        {sub.completedTopics} / {sub.totalTopics}
                      </span>
                    </td>
                    <td style={{ minWidth: '160px' }}>
                      <div className="table-progress-cell">
                        <ProgressBar
                          completed={sub.completedTopics}
                          total={sub.totalTopics}
                          height="8px"
                          showLabel={false}
                        />
                        <span className="progress-num">{percentage}%</span>
                      </div>
                    </td>
                    <td>
                      <Link
                        to={`/subject/${sub._id}`}
                        className="btn btn-sm btn-primary"
                        onClick={playClickSound}
                      >
                        <span>Syllabus</span>
                        <ArrowUpRight size={14} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubjectsPage;
