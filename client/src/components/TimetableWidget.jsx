import React, { useState } from 'react';
import { Clock, BookOpen, MapPin } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

// Pre-loaded class timetable for B.Tech CSE Section A (Semester 5)
const SECTION_A_TIMETABLE = {
  Mon: [
    { time: '09:00 - 10:00', code: 'BTCS-501', name: 'Database Management Systems', room: 'LH-101', type: 'Lecture' },
    { time: '10:00 - 11:00', code: 'BTCS-502', name: 'Operating Systems', room: 'LH-101', type: 'Lecture' },
    { time: '11:15 - 12:15', code: 'BTCS-503', name: 'Design & Analysis of Algorithms', room: 'LH-101', type: 'Lecture' },
    { time: '01:30 - 03:30', code: 'BTCS-506', name: 'DBMS Lab (Batch A1/A2)', room: 'Computer Lab 3', type: 'Lab' },
  ],
  Tue: [
    { time: '09:00 - 10:00', code: 'BTCS-504', name: 'Computer Networks', room: 'LH-101', type: 'Lecture' },
    { time: '10:00 - 11:00', code: 'BTCS-505', name: 'Software Engineering', room: 'LH-101', type: 'Lecture' },
    { time: '11:15 - 12:15', code: 'BTCS-502', name: 'Operating Systems', room: 'LH-101', type: 'Lecture' },
    { time: '01:30 - 03:30', code: 'BTCS-507', name: 'OS & Linux Lab', room: 'Computer Lab 1', type: 'Lab' },
  ],
  Wed: [
    { time: '09:00 - 10:00', code: 'BTCS-503', name: 'Design & Analysis of Algorithms', room: 'LH-101', type: 'Lecture' },
    { time: '10:00 - 11:00', code: 'BTCS-501', name: 'Database Management Systems', room: 'LH-101', type: 'Lecture' },
    { time: '11:15 - 12:15', code: 'BTCS-504', name: 'Computer Networks', room: 'LH-101', type: 'Lecture' },
    { time: '01:30 - 03:30', code: 'BTCS-508', name: 'Algorithms Lab', room: 'Computer Lab 2', type: 'Lab' },
  ],
  Thu: [
    { time: '09:00 - 10:00', code: 'BTCS-505', name: 'Software Engineering', room: 'LH-101', type: 'Lecture' },
    { time: '10:00 - 11:00', code: 'BTCS-502', name: 'Operating Systems', room: 'LH-101', type: 'Lecture' },
    { time: '11:15 - 12:15', code: 'BTCS-503', name: 'Design & Analysis of Algorithms', room: 'LH-101', type: 'Lecture' },
    { time: '01:30 - 03:30', code: 'BTCS-509', name: 'Networks Lab', room: 'Networking Lab', type: 'Lab' },
  ],
  Fri: [
    { time: '09:00 - 10:00', code: 'BTCS-504', name: 'Computer Networks', room: 'LH-101', type: 'Lecture' },
    { time: '10:00 - 11:00', code: 'BTCS-501', name: 'Database Management Systems', room: 'LH-101', type: 'Lecture' },
    { time: '11:15 - 12:15', code: 'HSMC-101', name: 'Aptitude & Soft Skills', room: 'Auditorium B', type: 'Seminar' },
    { time: '01:30 - 03:30', code: 'BTCS-510', name: 'Minor Project Seminar', room: 'Seminar Hall', type: 'Project' },
  ],
};

const Days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const TimetableWidget = () => {
  const { playClickSound } = useTheme();
  
  const getTodayAbbr = () => {
    const dayIndex = new Date().getDay();
    const map = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const name = map[dayIndex];
    return Days.includes(name) ? name : 'Mon';
  };

  const [selectedDay, setSelectedDay] = useState(getTodayAbbr());
  const todayAbbr = getTodayAbbr();

  const currentLectures = SECTION_A_TIMETABLE[selectedDay] || [];

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
        {currentLectures.map((lecture, idx) => (
          <div key={idx} className="timetable-class-card">
            <div className="class-time-col">
              <span className="time-badge">{lecture.time}</span>
              <span className={`type-tag type-${lecture.type.toLowerCase()}`}>
                {lecture.type}
              </span>
            </div>

            <div className="class-details">
              <div className="class-header-row">
                <span className="code-pill">{lecture.code}</span>
                <span className="room-pill">
                  <MapPin size={12} /> {lecture.room}
                </span>
              </div>
              <h4 className="class-name">{lecture.name}</h4>
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
        ))}
      </div>
    </div>
  );
};

export default TimetableWidget;
