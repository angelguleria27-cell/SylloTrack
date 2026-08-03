import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'blue' }) => {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>
        <Icon size={24} />
      </div>
      <div className="stat-info">
        <h3>{title}</h3>
        <div className="stat-number">{value}</div>
      </div>
    </div>
  );
};

export default StatCard;
