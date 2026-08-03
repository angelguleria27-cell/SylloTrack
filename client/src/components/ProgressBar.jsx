import React from 'react';

const ProgressBar = ({ completed = 0, total = 0, variant = 'accent', showLabel = true, height = '10px' }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="progress-bar-container">
      {showLabel && (
        <div className="progress-bar-label">
          <span style={{ color: 'var(--text-muted)' }}>Progress</span>
          <span style={{ color: 'var(--text-main)' }}>{percentage}%</span>
        </div>
      )}
      <div className="progress-bar-track dark-track" style={{ height }}>
        <div
          className={`progress-bar-fill ${variant}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
