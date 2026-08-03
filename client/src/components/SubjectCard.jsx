import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Edit3, Trash2, ArrowRight } from 'lucide-react';
import ProgressBar from './ProgressBar';

const SubjectCard = ({ subject, onDelete }) => {
  const { _id, name, totalTopics = 0, completedTopics = 0 } = subject;

  return (
    <div className="subject-card">
      <div>
        <div className="subject-card-header">
          <h3 className="subject-name">{name}</h3>
          <span className="topic-badge">
            {completedTopics} / {totalTopics} Topics
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

      <div className="subject-card-actions">
        <Link to={`/subject/${_id}`} className="btn btn-primary btn-card-action">
          <BookOpen size={16} />
          <span>View</span>
        </Link>
        <Link to={`/edit-subject/${_id}`} className="btn btn-secondary btn-card-action">
          <Edit3 size={16} />
          <span>Edit</span>
        </Link>
        <button
          onClick={() => onDelete(_id, name)}
          className="btn btn-danger btn-icon-only"
          title="Delete Subject"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default SubjectCard;
