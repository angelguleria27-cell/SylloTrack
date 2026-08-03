import React, { useState, useEffect } from 'react';
import { Clock, BookOpen, MapPin, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { formatTimeRange } from '../utils/timeFormat';

const Days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const DayFullNames = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
};

const TimetableWidget = () => {
  const { playClickSound, is12Hour, toggleTimeFormat } = useTheme();

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

        <div className="timetable-header-actions">
          {/* 12H / 24H Time Format Toggle Switcher */}
          <div className="time-format-switcher" title="Toggle between 12-hour and 24-hour time format">
            <button
              type="button"
              className={`time-format-btn ${is12Hour ? 'active' : ''}`}
              onClick={() => {
                if (!is12Hour) {
                  playClickSound();
                  toggleTimeFormat();
                }
              }}
            >
              12H
            </button>
            <button
              type="button"
              className={`time-format-btn ${!is12Hour ? 'active' : ''}`}
              onClick={() => {
                if (is12Hour) {
                  playClickSound();
                  toggleTimeFormat();
                }
              }}
            >
              24H
            </button>
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
      </div>

      {/* Lectures List */}
      <div className="timetable-classes-list">
        {dayEntries.length === 0 ? (
          <div className="widget-empty" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
            <Clock size={28} className="empty-icon-muted" />
            <p style={{ margin: '0.5rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No lectures scheduled for {fullDay}.</p>
          </div>
        ) : (
          dayEntries.map((lecture) => {
            const isLab =
              (lecture.room && (lecture.room.includes('HWL') || lecture.room.includes('CL') || lecture.room.includes('Lab'))) ||
              (lecture.teacher && lecture.teacher.includes('Lab'));

            return (
              <div key={lecture._id} className={`timetable-class-card ${isLab ? 'is-lab' : ''}`}>
                <div className="class-time-col">
                  <span className="time-badge">{formatTimeRange(lecture.startTime, lecture.endTime, is12Hour)}</span>
                  <span className={`type-tag ${isLab ? 'type-lab' : 'type-lecture'}`}>
                    {isLab ? 'Lab Session' : 'Lecture'}
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
                  {lecture.teacher && (
                    <span className="teacher-name" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      <User size={12} /> {lecture.teacher}
                    </span>
                  )}
                </div>

                <Link
                  to="/subjects"
                  onClick={playClickSound}
                  className="class-action-btn"
                  title="View Subject Syllabus"
                >
                  <BookOpen size={15} />
                  <span>Syllabus</span>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TimetableWidget;
