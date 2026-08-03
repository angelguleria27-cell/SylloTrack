import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue', trend }) => {
  return (
    <div className={`stat-card card glass-panel stat-card-${color}`}>
      <div className="stat-card-inner">
        <div className="stat-info">
          <span className="stat-title">{title}</span>
          <div className="stat-value-row">
            <span className="stat-number">{value}</span>
            {trend && <span className="stat-trend">{trend}</span>}
          </div>
          {subtitle && <span className="stat-subtitle">{subtitle}</span>}
        </div>
        <div className={`stat-icon-wrapper color-${color}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
