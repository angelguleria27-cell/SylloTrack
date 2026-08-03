import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Layers, CheckCircle2, Edit3, Trash2, ArrowRight } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { useTheme } from '../context/ThemeContext';

const SubjectCard = ({ subject, onDelete }) => {
  const { playClickSound, playDeleteSound } = useTheme();

  const {
    _id,
    name,
    code,
    semester,
    ltpc,
    unitsCount = 0,
    totalTopics = 0,
    completedTopics = 0,
    isGlobal = false,
  } = subject;

  const percentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <div className="subject-card card glass-panel interactive-card">
      {/* Top Banner Row */}
      <div className="subject-card-top">
        <div className="subject-code-badge">
          <span className="code-tag">{code || 'COURSE'}</span>
          {semester && <span className="sem-tag">Sem {semester}</span>}
        </div>
        <span className={`status-pill ${percentage === 100 ? 'done' : percentage > 0 ? 'in-progress' : 'new'}`}>
          {percentage}% Complete
        </span>
      </div>

      {/* Title & Metadata */}
      <div className="subject-card-body">
        <h3 className="subject-name" title={name}>{name}</h3>
        
        {ltpc && (
          <div className="subject-ltpc-row">
            <span className="ltpc-pill">L-T-P-C: {ltpc}</span>
          </div>
        )}

        <div className="subject-stats-row">
          {unitsCount > 0 && (
            <span className="stat-pill">
              <Layers size={13} className="stat-icon" />
              {unitsCount} Units
            </span>
          )}
          <span className="stat-pill">
            <CheckCircle2 size={13} className="stat-icon-success" />
            {completedTopics}/{totalTopics} Topics
          </span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="subject-card-progress-wrapper">
        <div className="progress-label-row">
          <span className="progress-label">Syllabus Progress</span>
          <span className="progress-value">{percentage}%</span>
        </div>
        <ProgressBar
          completed={completedTopics}
          total={totalTopics}
          variant="accent"
          height="6px"
        />
      </div>

      {/* Actions Row */}
      <div className="subject-card-actions">
        <Link
          to={`/subject/${_id}`}
          className="btn btn-primary btn-card-action"
          onClick={playClickSound}
        >
          <BookOpen size={15} />
          <span>Explore Syllabus</span>
          <ArrowRight size={15} className="arrow-icon" />
        </Link>

        {!isGlobal && onDelete && (
          <div className="card-actions-secondary">
            <Link
              to={`/edit-subject/${_id}`}
              className="btn btn-secondary btn-icon-only"
              onClick={playClickSound}
              title="Edit Subject"
            >
              <Edit3 size={14} />
            </Link>
            <button
              onClick={() => {
                playDeleteSound();
                onDelete(_id, name);
              }}
              className="btn btn-danger btn-icon-only"
              title="Delete Subject"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectCard;
