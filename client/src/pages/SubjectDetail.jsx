import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Circle,
  Layers,
  ChevronDown,
  ChevronUp,
  Search,
  CheckSquare,
  Sparkles,
  Filter,
  AlertCircle,
  Edit3,
  Trash2,
} from 'lucide-react';
import api from '../api/axios';
import ProgressBar from '../components/ProgressBar';

const SubjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openUnits, setOpenUnits] = useState({});
  const [searchTopicQuery, setSearchTopicQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'completed' | 'pending'

  const fetchSubjectDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/subjects/${id}`);
      setSubject(res.data);

      // Open all units by default for easy viewing
      if (res.data.units) {
        const initialOpenState = {};
        res.data.units.forEach((u) => {
          initialOpenState[u._id] = true;
        });
        setOpenUnits(initialOpenState);
      }

      setError('');
    } catch (err) {
      console.error('Error fetching subject detail:', err);
      setError('Subject not found or failed to load syllabus.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjectDetail();
  }, [id]);

  const toggleUnitCollapse = (unitId) => {
    setOpenUnits((prev) => ({
      ...prev,
      [unitId]: !prev[unitId],
    }));
  };

  const handleExpandAll = () => {
    if (!subject?.units) return;
    const allOpen = {};
    subject.units.forEach((u) => {
      allOpen[u._id] = true;
    });
    setOpenUnits(allOpen);
  };

  const handleCollapseAll = () => {
    setOpenUnits({});
  };

  const handleToggleTopic = async (topicId) => {
    if (!subject) return;

    // Optimistically update topic completion status in state
    let targetWasCompleted = false;

    const updatedUnits = subject.units.map((unit) => {
      let unitCompletedCount = 0;
      const updatedTopics = unit.topics.map((topic) => {
        if (topic._id === topicId) {
          targetWasCompleted = topic.completed;
          const nextCompleted = !topic.completed;
          if (nextCompleted) unitCompletedCount++;
          return { ...topic, completed: nextCompleted };
        }
        if (topic.completed) unitCompletedCount++;
        return topic;
      });

      const unitTotal = updatedTopics.length;
      const unitPercentage = unitTotal > 0 ? Math.round((unitCompletedCount / unitTotal) * 100) : 0;

      return {
        ...unit,
        completedTopics: unitCompletedCount,
        progressPercentage: unitPercentage,
        topics: updatedTopics,
      };
    });

    const newCompletedCount = targetWasCompleted
      ? Math.max(0, subject.completedTopics - 1)
      : subject.completedTopics + 1;
    const newOverallPercentage =
      subject.totalTopics > 0 ? Math.round((newCompletedCount / subject.totalTopics) * 100) : 0;

    setSubject({
      ...subject,
      units: updatedUnits,
      completedTopics: newCompletedCount,
      progressPercentage: newOverallPercentage,
    });

    try {
      await api.post(`/subjects/${id}/toggle-topic`, { topicId });
    } catch (err) {
      console.error('Failed to sync topic toggle with server:', err);
      // Re-fetch to sync state on failure
      fetchSubjectDetail();
    }
  };

  const handleDeleteSubject = async () => {
    if (window.confirm(`Are you sure you want to delete or reset "${subject?.name}"?`)) {
      try {
        await api.delete(`/subjects/${id}`);
        navigate('/subjects');
      } catch (err) {
        console.error('Failed to delete subject:', err);
        alert('Could not delete subject');
      }
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !subject) {
    return (
      <div className="empty-state">
        <AlertCircle size={32} color="var(--danger)" />
        <h3>Subject Not Found</h3>
        <p>{error}</p>
        <Link to="/subjects" className="btn btn-primary">
          Back to Subjects Directory
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Navigation Breadcrumb */}
      <div style={{ marginBottom: '1rem' }}>
        <Link
          to="/subjects"
          className="nav-link"
          style={{ paddingLeft: 0, display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Subjects Directory</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div className="page-title-group">
          <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <span className="code-pill" style={{ fontSize: '0.9rem' }}>
              {subject.code}
            </span>
            <span className="section-badge">
              <BookOpen size={12} />
              {subject.section || 'Section A'}
            </span>
            <span className="meta-pill">Sem {subject.semester}</span>
            <span className="meta-pill">L-T-P-C: {subject.ltpc}</span>
          </div>
          <h1 style={{ fontSize: '1.85rem' }}>{subject.name}</h1>
          <p className="page-subtitle">
            {subject.description || 'Pre-loaded syllabus structure for B.Tech CSE Section A.'}
          </p>
        </div>

        {!subject.isGlobal && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to={`/edit-subject/${id}`} className="btn btn-secondary">
              <Edit3 size={16} />
              <span>Edit</span>
            </Link>
            <button onClick={handleDeleteSubject} className="btn btn-danger">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Overview Progress Card */}
      <div
        className="form-card"
        style={{
          maxWidth: '100%',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderColor: '#e2e8f0',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} color="var(--primary)" />
              Syllabus Completion Overview
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              {subject.completedTopics} of {subject.totalTopics} total syllabus topics completed
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)' }}>
                {subject.progressPercentage}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Completion
              </div>
            </div>
          </div>
        </div>

        <ProgressBar
          completed={subject.completedTopics}
          total={subject.totalTopics}
          variant="accent"
          height="14px"
          showLabel={false}
        />
      </div>

      {/* Syllabus Controls */}
      <div className="controls-bar">
        <div style={{ display: 'flex', gap: '0.75rem', flex: 1, flexWrap: 'wrap' }}>
          <div className="search-filter-box">
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search topic in syllabus..."
              value={searchTopicQuery}
              onChange={(e) => setSearchTopicQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
            <button
              onClick={() => setStatusFilter('all')}
              className={`btn btn-sm ${statusFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            >
              All Topics
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`btn btn-sm ${statusFilter === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`btn btn-sm ${statusFilter === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Completed
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handleExpandAll} className="btn btn-sm btn-secondary">
            Expand All Units
          </button>
          <button onClick={handleCollapseAll} className="btn btn-sm btn-secondary">
            Collapse All
          </button>
        </div>
      </div>

      {/* Units & Topics List */}
      <div>
        {(!subject.units || subject.units.length === 0) ? (
          <div className="empty-state">
            <p>No units found for this subject.</p>
          </div>
        ) : (
          subject.units.map((unit) => {
            const isOpen = openUnits[unit._id];

            // Filter topics inside unit
            const matchingTopics = (unit.topics || []).filter((topic) => {
              const matchesSearch = topic.title.toLowerCase().includes(searchTopicQuery.toLowerCase());
              if (!matchesSearch) return false;

              if (statusFilter === 'completed') return topic.completed;
              if (statusFilter === 'pending') return !topic.completed;
              return true;
            });

            // Skip rendering empty unit if filtering and no matching topics
            if (searchTopicQuery || statusFilter !== 'all') {
              if (matchingTopics.length === 0) return null;
            }

            return (
              <div key={unit._id} className="unit-card">
                {/* Unit Header */}
                <div
                  className="unit-header"
                  onClick={() => toggleUnitCollapse(unit._id)}
                >
                  <div className="unit-header-title">
                    <span className="unit-number-badge">{unit.unitNumber}</span>
                    <span className="unit-title-text">
                      Unit {unit.unitNumber}: {unit.title}
                    </span>
                  </div>

                  <div className="unit-header-meta">
                    <div className="unit-progress-info">
                      <span>
                        {unit.completedTopics} / {unit.totalTopics} topics ({unit.progressPercentage}%)
                      </span>
                      <div className="unit-mini-progress">
                        <div
                          className="unit-mini-fill"
                          style={{ width: `${unit.progressPercentage}%` }}
                        />
                      </div>
                    </div>
                    {isOpen ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                  </div>
                </div>

                {/* Topics Container */}
                {isOpen && (
                  <div className="unit-topics-list">
                    {matchingTopics.length === 0 ? (
                      <div style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        No topics match the selected filter in this unit.
                      </div>
                    ) : (
                      matchingTopics.map((topic) => (
                        <div
                          key={topic._id}
                          className={`syllabus-topic-row ${topic.completed ? 'completed' : ''}`}
                        >
                          <div className="syllabus-topic-left">
                            <button
                              type="button"
                              className={`custom-check-btn ${topic.completed ? 'checked' : ''}`}
                              onClick={() => handleToggleTopic(topic._id)}
                              title={topic.completed ? 'Mark topic pending' : 'Mark topic complete'}
                            >
                              {topic.completed ? (
                                <CheckCircle2 size={22} className="text-success" />
                              ) : (
                                <Circle size={22} />
                              )}
                            </button>
                            <span className="syllabus-topic-name">{topic.title}</span>
                          </div>

                          <div style={{ fontSize: '0.78rem', color: topic.completed ? 'var(--success)' : 'var(--text-light)', fontWeight: 600 }}>
                            {topic.completed ? 'Completed' : 'Pending'}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SubjectDetail;
