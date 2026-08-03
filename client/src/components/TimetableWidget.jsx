import React, { useState, useEffect } from 'react';
import { Clock, BookOpen, MapPin } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const DayFullNames = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
};

const TimetableWidget = () => {
  const { playClickSound } = useTheme();

  const getTodayAbbr = () => {
    const dayIndex = new Date().getDay();
    const map = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const name = map[dayIndex];
    return Days.includes(name) ? name : 'Mon';
  };

  const [selectedDay, setSelectedDay] = useState(getTodayAbbr());
  const [dbTimetable, setDbTimetable] = useState([]);
  const todayAbbr = getTodayAbbr();

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await api.get('/timetable');
        if (res.data && res.data.length > 0) {
          setDbTimetable(res.data);
        }
      } catch (err) {
        console.error('Failed to load timetable widget data:', err);
      }
    };
    fetchTimetable();
  }, []);

  const fullDay = DayFullNames[selectedDay];
  const dayEntries = dbTimetable.filter((t) => t.day === fullDay);

  return (
    <div className="timetable-widget card glass-panel">
      <div className="timetable-widget-header">
        <div className="widget-title-group">
          <div className="widget-icon-pill">
            <Clock size={18} color="var(--primary)" />
          </div>
          <div>
            <h3>Section A Class Schedule</h3>
            <p className="widget-subtitle">B.Tech CSE • Semester 5 Lecture Plan</p>
          </div>
        </div>

        {/* Day Tabs Switcher */}
        <div className="timetable-days-pill">
          {Days.map((day) => (
            <button
              key={day}
              className={`day-pill-btn ${selectedDay === day ? 'active' : ''} ${todayAbbr === day ? 'is-today' : ''}`}
              onClick={() => {
                playClickSound();
                setSelectedDay(day);
              }}
            >
              {day}
              {todayAbbr === day && <span className="today-badge">Today</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Lectures List */}
      <div className="timetable-classes-list">
        {dayEntries.length === 0 ? (
          <div className="widget-empty" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <Clock size={24} className="empty-icon-muted" />
            <p style={{ margin: '0.5rem 0', color: 'var(--text-muted)' }}>No lectures scheduled for {fullDay}.</p>
          </div>
        ) : (
          dayEntries.map((lecture) => (
            <div key={lecture._id} className="timetable-class-card">
              <div className="class-time-col">
                <span className="time-badge">{lecture.startTime} - {lecture.endTime}</span>
                <span className="type-tag type-lecture">
                  Class
                </span>
              </div>

              <div className="class-details">
                <div className="class-header-row">
                  <span className="code-pill">{lecture.subject?.code || 'SEC-A'}</span>
                  <span className="room-pill">
                    <MapPin size={12} /> {lecture.room || 'LT-3'}
                  </span>
                </div>
                <h4 className="class-name">{lecture.subject?.name || 'Lecture'}</h4>
                {lecture.teacher && <span className="teacher-name" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Faculty: {lecture.teacher}</span>}
              </div>

              <Link
                to="/subjects"
                onClick={playClickSound}
                className="class-action-btn"
                title="View Subject Syllabus"
              >
                <BookOpen size={16} />
                <span>Syllabus</span>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TimetableWidget;
