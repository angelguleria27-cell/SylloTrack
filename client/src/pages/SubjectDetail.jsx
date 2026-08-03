import React, { useState, useEffect, useCallback } from 'react';
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
  Trophy,
} from 'lucide-react';
import api from '../api/axios';
import ProgressBar from '../components/ProgressBar';
import ConfettiCanvas from '../components/ConfettiCanvas';
import { useTheme } from '../context/ThemeContext';

const SubjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playCheckSound, playCelebrationSound, playDeleteSound, playClickSound } = useTheme();

  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openUnits, setOpenUnits] = useState({});
  const [searchTopicQuery, setSearchTopicQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'completed' | 'pending'
  const [triggerConfetti, setTriggerConfetti] = useState(false);

  const handleConfettiComplete = useCallback(() => {
    setTriggerConfetti(false);
  }, []);

  const fetchSubjectDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/subjects/${id}`);
      setSubject(res.data);

      if (res.data.units) {
        const initialOpenState = {};
        res.data.units.forEach((u) => {
          initialOpenState[u._id] = false; // Collapsed by default
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
    playClickSound();
    setOpenUnits((prev) => ({
      ...prev,
      [unitId]: !prev[unitId],
    }));
  };

  const handleExpandAll = () => {
    playClickSound();
    if (!subject?.units) return;
    const allOpen = {};
    subject.units.forEach((u) => {
      allOpen[u._id] = true;
    });
    setOpenUnits(allOpen);
  };

  const handleCollapseAll = () => {
    playClickSound();
    if (!subject?.units) return;
    const allClosed = {};
    subject.units.forEach((u) => {
      allClosed[u._id] = false;
    });
    setOpenUnits(allClosed);
  };

  const handleToggleTopic = async (topicId) => {
    if (!subject) return;

    let targetWasCompleted = false;
    let unitJustCompleted = false;

    const updatedUnits = subject.units.map((unit) => {
      let unitCompletedCount = 0;
      let topicInThisUnit = false;

      const updatedTopics = unit.topics.map((topic) => {
        if (topic._id === topicId) {
          topicInThisUnit = true;
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

      if (topicInThisUnit && !targetWasCompleted && unitCompletedCount === unitTotal && unitTotal > 0) {
        unitJustCompleted = true;
      }

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

    const isNowCompleted = !targetWasCompleted;
    playCheckSound(isNowCompleted);

    if (isNowCompleted && (unitJustCompleted || newOverallPercentage === 100)) {
      playCelebrationSound();
      setTriggerConfetti(true);
    }

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
      alert('Network error: Could not sync topic progress with server. Reverting status.');
      fetchSubjectDetail();
    }
  };

  const handleDeleteSubject = async () => {
    playDeleteSound();
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
      <div className="empty-state card">
        <AlertCircle size={32} color="var(--danger)" />
        <h3>Subject Not Found</h3>
        <p>{error}</p>
        <Link to="/subjects" className="btn btn-primary" onClick={playClickSound}>
          Back to Subjects Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="subject-detail-page animate-fade-in">
      <ConfettiCanvas trigger={triggerConfetti} onComplete={handleConfettiComplete} />

      {/* Navigation Breadcrumb */}
      <div className="detail-breadcrumb">
        <Link
          to="/subjects"
          className="breadcrumb-link"
          onClick={playClickSound}
        >
          <ArrowLeft size={16} />
          <span>Back to Subjects Directory</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="subject-detail-header card glass-panel">
        <div className="header-info-col">
          <div className="header-tags-row">
            <span className="code-pill">{subject.code}</span>
            <span className="section-badge glow-badge">
              <BookOpen size={12} />
              {subject.section || 'Section A'}
            </span>
            <span className="meta-pill">Sem {subject.semester}</span>
            <span className="meta-pill">L-T-P-C: {subject.ltpc}</span>
          </div>

          <h1 className="subject-detail-title">{subject.name}</h1>
          <p className="subject-detail-desc">
            {subject.description || 'Pre-loaded syllabus structure for B.Tech CSE Section A.'}
          </p>
        </div>

        {!subject.isGlobal && (
          <div className="header-actions-col">
            <Link to={`/edit-subject/${subject._id}`} className="btn btn-secondary" onClick={playClickSound}>
              <Edit3 size={16} />
              <span>Edit</span>
            </Link>
            <button onClick={handleDeleteSubject} className="btn btn-danger">
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Overall Progress Banner */}
      <div className="subject-progress-banner card glass-panel glow-border">
        <div className="progress-banner-top">
          <div>
            <span className="banner-small-label">SYLLABUS COMPLETION</span>
            <div className="banner-title-row">
              <h2>
                {subject.completedTopics} of {subject.totalTopics} Topics Completed
              </h2>
              {subject.progressPercentage === 100 && (
                <span className="completion-badge glow-badge">
                  <Trophy size={14} /> 100% Complete!
                </span>
              )}
            </div>
          </div>
          <div className="progress-banner-percentage">
            {subject.progressPercentage}%
          </div>
        </div>
        <ProgressBar
          completed={subject.completedTopics}
          total={subject.totalTopics}
          height="12px"
          variant="accent"
        />
      </div>

      {/* Toolbar & Filters */}
      <div className="syllabus-toolbar card glass-panel">
        <div className="search-topic-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="input-field"
            placeholder="Search syllabus topics in this course..."
            value={searchTopicQuery}
            onChange={(e) => setSearchTopicQuery(e.target.value)}
          />
        </div>

        <div className="toolbar-controls-right">
          <div className="filter-pill-group">
            <button
              className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => {
                playClickSound();
                setStatusFilter('all');
              }}
            >
              All ({subject.totalTopics})
            </button>
            <button
              className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
              onClick={() => {
                playClickSound();
                setStatusFilter('pending');
              }}
            >
              Pending ({subject.totalTopics - subject.completedTopics})
            </button>
            <button
              className={`filter-btn ${statusFilter === 'completed' ? 'active' : ''}`}
              onClick={() => {
                playClickSound();
                setStatusFilter('completed');
              }}
            >
              Done ({subject.completedTopics})
            </button>
          </div>

          <div className="expand-collapse-group">
            <button className="btn btn-secondary btn-sm" onClick={handleExpandAll}>
              <ChevronDown size={14} /> Expand All
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleCollapseAll}>
              <ChevronUp size={14} /> Collapse
            </button>
          </div>
        </div>
      </div>

      {/* Unit Accordions List */}
      <div className="units-list">
        {subject.units && subject.units.length > 0 ? (
          subject.units.map((unit, index) => {
            const isUnitOpen = Boolean(openUnits[unit._id]) || Boolean(searchTopicQuery);

            const filteredTopics = (unit.topics || []).filter((topic) => {
              const matchesSearch = topic.title.toLowerCase().includes(searchTopicQuery.toLowerCase());
              if (statusFilter === 'completed') return matchesSearch && topic.completed;
              if (statusFilter === 'pending') return matchesSearch && !topic.completed;
              return matchesSearch;
            });

            if (searchTopicQuery || statusFilter !== 'all') {
              if (filteredTopics.length === 0) return null;
            }

            return (
              <div key={unit._id || index} className="unit-card card glass-panel">
                {/* Unit Accordion Header */}
                <div className="unit-header" onClick={() => toggleUnitCollapse(unit._id)}>
                  <div className="unit-title-group">
                    <span className="unit-number-badge">Unit {unit.unitNumber || (index + 1)}</span>
                    <h3 className="unit-title">{unit.title || unit.unitName || unit.name || `Unit ${unit.unitNumber}`}</h3>
                  </div>

                  <div className="unit-meta-group">
                    <span className="unit-topic-count">
                      {unit.completedTopics || 0} / {unit.topics?.length || 0} Done
                    </span>
                    <div className="icon-btn-ghost">
                      {isUnitOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                </div>

                {/* Unit Progress Line */}
                <div className="unit-progress-track">
                  <ProgressBar
                    completed={unit.completedTopics || 0}
                    total={unit.topics?.length || 0}
                    showLabel={false}
                    height="4px"
                  />
                </div>

                {/* Topics Grid */}
                {isUnitOpen && (
                  <div className="unit-topics-container">
                    {filteredTopics.length > 0 ? (
                      <div className="topics-grid">
                        {filteredTopics.map((topic) => (
                          <div
                            key={topic._id}
                            className={`topic-item ${topic.completed ? 'completed' : ''}`}
                            onClick={() => handleToggleTopic(topic._id)}
                          >
                            <div className="topic-checkbox">
                              {topic.completed ? (
                                <CheckCircle2 size={20} color="var(--success)" className="animated-check" />
                              ) : (
                                <Circle size={20} color="var(--text-light)" />
                              )}
                            </div>
                            <span className="topic-title">{topic.title}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-topics-text">
                        No topics match your current filter.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="empty-state card">
            <Layers size={32} color="var(--text-muted)" />
            <p>No units found for this subject.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectDetail;
