import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Layers, CheckCircle2, ChevronRight, Edit3, Trash2 } from 'lucide-react';
import ProgressBar from './ProgressBar';

const SubjectCard = ({ subject, onDelete }) => {
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

  return (
    <div className="subject-card">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {code && <span className="code-pill">{code}</span>}
            {semester && <span className="meta-pill">Sem {semester}</span>}
            {ltpc && <span className="meta-pill">L-T-P-C: {ltpc}</span>}
          </div>
          <span className="topic-badge">
            {completedTopics} / {totalTopics} Topics
          </span>
        </div>

        <h3 className="subject-name" style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>
          {name}
        </h3>

        <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '0.85rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {unitsCount > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Layers size={15} color="var(--primary)" />
              {unitsCount} Units / Modules
            </span>
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle2 size={15} color="var(--success)" />
            {completedTopics} Completed
          </span>
        </div>

        <div className="subject-card-body">
          <ProgressBar
            completed={completedTopics}
            total={totalTopics}
            variant="accent"
          />
        </div>
      </div>

      <div className="subject-card-actions" style={{ marginTop: '1rem' }}>
        <Link to={`/subject/${_id}`} className="btn btn-primary btn-card-action">
          <BookOpen size={16} />
          <span>Syllabus & Topics</span>
          <ChevronRight size={16} />
        </Link>
        {!isGlobal && onDelete && (
          <>
            <Link to={`/edit-subject/${_id}`} className="btn btn-secondary btn-card-action">
              <Edit3 size={16} />
            </Link>
            <button
              onClick={() => onDelete(_id, name)}
              className="btn btn-danger btn-icon-only"
              title="Delete Subject"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SubjectCard;
