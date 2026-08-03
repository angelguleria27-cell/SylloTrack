import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Layers, CheckCircle2, ChevronRight, Edit3, Trash2, ArrowUpRight } from 'lucide-react';
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
      <div className="subject-card-header">
        <div className="card-pills-row">
          {code && <span className="code-pill">{code}</span>}
          {semester && <span className="meta-pill">Sem {semester}</span>}
          {ltpc && <span className="meta-pill">L-T-P-C: {ltpc}</span>}
        </div>
        <span className={`status-pill ${percentage === 100 ? 'done' : percentage > 0 ? 'in-progress' : 'new'}`}>
          {percentage}% Done
        </span>
      </div>

      <h3 className="subject-name">{name}</h3>

      <div className="subject-card-meta">
        {unitsCount > 0 && (
          <span className="meta-item">
            <Layers size={14} color="var(--primary)" />
            {unitsCount} Units
          </span>
        )}
        <span className="meta-item">
          <CheckCircle2 size={14} color="var(--success)" />
          {completedTopics} / {totalTopics} Topics
        </span>
      </div>

      <div className="subject-card-progress">
        <ProgressBar
          completed={completedTopics}
          total={totalTopics}
          variant="accent"
          height="8px"
        />
      </div>

      <div className="subject-card-actions">
        <Link
          to={`/subject/${_id}`}
          className="btn btn-primary btn-card-action"
          onClick={playClickSound}
        >
          <BookOpen size={16} />
          <span>View Syllabus</span>
          <ArrowUpRight size={16} />
        </Link>

        {!isGlobal && onDelete && (
          <div className="card-actions-secondary">
            <Link
              to={`/edit-subject/${_id}`}
              className="btn btn-secondary btn-icon-only"
              onClick={playClickSound}
              title="Edit Subject"
            >
              <Edit3 size={15} />
            </Link>
            <button
              onClick={() => {
                playDeleteSound();
                onDelete(_id, name);
              }}
              className="btn btn-danger btn-icon-only"
              title="Delete Subject"
            >
              <Trash2 size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectCard;
