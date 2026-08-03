import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Circle,
  AlertCircle,
  BookOpen,
  Trash2,
  Edit2,
  Sparkles,
  X,
  FileText,
  GraduationCap,
  Layers,
  Check,
} from 'lucide-react';
import api from '../api/axios';
import { useTheme } from '../context/ThemeContext';
import { formatTimeRange, formatSingleTime } from '../utils/timeFormat';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const CalendarPage = () => {
  const { playClickSound, playCheckSound, playSuccessSound, playDeleteSound, is12Hour } = useTheme();

  // View state: 'calendar' | 'scheduler' | 'deadlines'
  const [activeTab, setActiveTab] = useState('calendar');

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  // Data states
  const [events, setEvents] = useState([]);
  const [scheduleBlocks, setScheduleBlocks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [filterType, setFilterType] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');

  // Modals
  const [showEventModal, setShowEventModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [generatingSchedule, setGeneratingSchedule] = useState(false);

  // Forms
  const [eventForm, setEventForm] = useState({
    title: '',
    type: 'exam',
    subject: '',
    date: selectedDateStr,
    time: '10:00',
    priority: 'medium',
    description: '',
  });

  const [scheduleForm, setScheduleForm] = useState({
    date: selectedDateStr,
    startTime: '09:00',
    endTime: '10:00',
    title: '',
    type: 'study',
    subject: '',
    notes: '',
  });

  useEffect(() => {
    fetchInitialData();
  }, [currentDate]);

  useEffect(() => {
    if (selectedDateStr) {
      fetchDaySchedule(selectedDateStr);
    }
  }, [selectedDateStr]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError('');
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const startOfMonth = new Date(year, month - 1, 1).toISOString();
      const endOfMonth = new Date(year, month + 2, 0).toISOString();

      const [eventsRes, subjectsRes] = await Promise.all([
        api.get(`/events?start=${startOfMonth}&end=${endOfMonth}`),
        api.get('/subjects'),
      ]);

      setEvents(eventsRes.data);
      setSubjects(subjectsRes.data);
    } catch (err) {
      console.error('Error fetching calendar data:', err);
      setError('Failed to load events and subjects.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDaySchedule = async (dateStr) => {
    try {
      const res = await api.get(`/schedule?date=${dateStr}`);
      setScheduleBlocks(res.data);
    } catch (err) {
      console.error('Error fetching day schedule:', err);
    }
  };

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    playClickSound();
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    playClickSound();
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    playClickSound();
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(today.toISOString().split('T')[0]);
  };

  const handleSelectDate = (dateString) => {
    playClickSound();
    setSelectedDateStr(dateString);
    setEventForm((prev) => ({ ...prev, date: dateString }));
    setScheduleForm((prev) => ({ ...prev, date: dateString }));
  };

  const filteredEvents = events.filter((ev) => {
    if (filterType !== 'all' && ev.type !== filterType) return false;
    if (filterSubject !== 'all' && (ev.subject?._id || ev.subject) !== filterSubject) return false;
    return true;
  });

  const getEventsForDate = (dateObj) => {
    const dateStr = dateObj.toISOString().split('T')[0];
    return filteredEvents.filter((ev) => {
      const evDateStr = new Date(ev.date).toISOString().split('T')[0];
      return evDateStr === dateStr;
    });
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    playClickSound();
    try {
      if (editingEvent) {
        const res = await api.put(`/events/${editingEvent._id}`, eventForm);
        setEvents(events.map((ev) => (ev._id === editingEvent._id ? res.data : ev)));
      } else {
        const res = await api.post('/events', eventForm);
        setEvents([...events, res.data]);
      }
      playSuccessSound();
      setShowEventModal(false);
      setEditingEvent(null);
      resetEventForm();
    } catch (err) {
      console.error('Failed to save event:', err);
      alert('Could not save event.');
    }
  };

  const handleToggleEvent = async (eventId) => {
    const targetEv = events.find((e) => e._id === eventId);
    playCheckSound(!targetEv?.completed);
    try {
      const res = await api.patch(`/events/${eventId}/toggle`);
      setEvents(events.map((ev) => (ev._id === eventId ? res.data : ev)));
    } catch (err) {
      console.error('Failed to toggle event:', err);
      alert('Could not update event completion status.');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    playDeleteSound();
    if (window.confirm('Delete this event?')) {
      try {
        await api.delete(`/events/${eventId}`);
        setEvents(events.filter((ev) => ev._id !== eventId));
      } catch (err) {
        console.error('Failed to delete event:', err);
      }
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    playClickSound();
    try {
      if (editingSchedule) {
        const res = await api.put(`/schedule/${editingSchedule._id}`, scheduleForm);
        setScheduleBlocks(scheduleBlocks.map((b) => (b._id === editingSchedule._id ? res.data : b)));
      } else {
        const res = await api.post('/schedule', scheduleForm);
        setScheduleBlocks([...scheduleBlocks, res.data]);
      }
      playSuccessSound();
      setShowScheduleModal(false);
      setEditingSchedule(null);
      resetScheduleForm();
    } catch (err) {
      console.error('Failed to save schedule block:', err);
      alert('Could not save schedule block.');
    }
  };

  const handleToggleSchedule = async (blockId) => {
    const targetBlock = scheduleBlocks.find((b) => b._id === blockId);
    playCheckSound(!targetBlock?.completed);
    try {
      const res = await api.patch(`/schedule/${blockId}/toggle`);
      setScheduleBlocks(scheduleBlocks.map((b) => (b._id === blockId ? res.data : b)));
    } catch (err) {
      console.error('Failed to toggle schedule block:', err);
      alert('Could not update schedule block status.');
    }
  };

  const handleDeleteSchedule = async (blockId) => {
    playDeleteSound();
    if (window.confirm('Delete this schedule block?')) {
      try {
        await api.delete(`/schedule/${blockId}`);
        setScheduleBlocks(scheduleBlocks.filter((b) => b._id !== blockId));
      } catch (err) {
        console.error('Failed to delete schedule block:', err);
      }
    }
  };

  const handleAutoGenerateSchedule = async () => {
    try {
      setGeneratingSchedule(true);
      playClickSound();
      const res = await api.post('/schedule/auto-generate', {
        date: selectedDateStr,
        startHour: 9,
        blocksCount: 4,
        durationMinutes: 60,
      });
      fetchDaySchedule(selectedDateStr);
      playSuccessSound();
      alert(`Generated ${res.data.length} study sessions for Section A!`);
    } catch (err) {
      console.error('Failed to auto-generate schedule:', err);
      alert(err.response?.data?.message || 'Could not auto-generate schedule.');
    } finally {
      setGeneratingSchedule(false);
    }
  };

  const openAddEvent = (dateStr = selectedDateStr) => {
    playClickSound();
    setEditingEvent(null);
    setEventForm({
      title: '',
      type: 'exam',
      subject: subjects[0]?._id || '',
      date: dateStr,
      time: '10:00',
      priority: 'medium',
      description: '',
    });
    setShowEventModal(true);
  };

  const openEditEvent = (ev) => {
    playClickSound();
    setEditingEvent(ev);
    setEventForm({
      title: ev.title,
      type: ev.type,
      subject: ev.subject?._id || ev.subject || '',
      date: new Date(ev.date).toISOString().split('T')[0],
      time: ev.time || '',
      priority: ev.priority || 'medium',
      description: ev.description || '',
    });
    setShowEventModal(true);
  };

  const openAddSchedule = (timeSlot = '09:00') => {
    playClickSound();
    setEditingSchedule(null);
    const endH = (parseInt(timeSlot.split(':')[0], 10) + 1).toString().padStart(2, '0');
    setScheduleForm({
      date: selectedDateStr,
      startTime: timeSlot,
      endTime: `${endH}:00`,
      title: '',
      type: 'study',
      subject: subjects[0]?._id || '',
      notes: '',
    });
    setShowScheduleModal(true);
  };

  const openEditSchedule = (block) => {
    playClickSound();
    setEditingSchedule(block);
    setScheduleForm({
      date: block.date,
      startTime: block.startTime,
      endTime: block.endTime,
      title: block.title,
      type: block.type,
      subject: block.subject?._id || block.subject || '',
      notes: block.notes || '',
    });
    setShowScheduleModal(true);
  };

  const resetEventForm = () => {
    setEventForm({
      title: '',
      type: 'exam',
      subject: '',
      date: selectedDateStr,
      time: '10:00',
      priority: 'medium',
      description: '',
    });
  };

  const resetScheduleForm = () => {
    setScheduleForm({
      date: selectedDateStr,
      startTime: '09:00',
      endTime: '10:00',
      title: '',
      type: 'study',
      subject: '',
      notes: '',
    });
  };

  const renderTypeBadge = (type) => {
    switch (type) {
      case 'exam':
        return <span className="badge badge-exam">🎓 Exam</span>;
      case 'assignment':
        return <span className="badge badge-assignment">📝 Assignment</span>;
      case 'study':
        return <span className="badge badge-study">📚 Study</span>;
      default:
        return <span className="badge badge-other">📌 Other</span>;
    }
  };

  const getDaysRemainingText = (eventDateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const evDate = new Date(eventDateStr);
    evDate.setHours(0, 0, 0, 0);

    const diffTime = evDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return <span className="countdown-tag overdue">Overdue</span>;
    if (diffDays === 0) return <span className="countdown-tag today">Today!</span>;
    if (diffDays === 1) return <span className="countdown-tag urgent">Tomorrow</span>;
    if (diffDays <= 7) return <span className="countdown-tag warning">In {diffDays} days</span>;
    return <span className="countdown-tag info">In {diffDays} days</span>;
  };

  const completedScheduleCount = scheduleBlocks.filter((b) => b.completed).length;
  const scheduleProgress = scheduleBlocks.length > 0 ? Math.round((completedScheduleCount / scheduleBlocks.length) * 100) : 0;

  const upcomingDeadlines = events
    .filter((ev) => ev.type === 'exam' || ev.type === 'assignment')
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="calendar-page-container animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Calendar & Day Scheduler</h1>
          <p className="page-subtitle">
            Manage your exam dates, project deadlines, and build your daily study timetable.
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => openAddSchedule()}>
            <Clock size={16} />
            <span>Schedule Slot</span>
          </button>
          <button className="btn btn-primary" onClick={() => openAddEvent()}>
            <Plus size={16} />
            <span>Add Exam / Deadline</span>
          </button>
        </div>
      </div>

      {/* View Switcher & Filters */}
      <div className="calendar-top-bar card glass-panel">
        <div className="view-tab-group">
          <button
            className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => { playClickSound(); setActiveTab('calendar'); }}
          >
            <CalendarIcon size={16} />
            <span>Month Calendar</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'scheduler' ? 'active' : ''}`}
            onClick={() => { playClickSound(); setActiveTab('scheduler'); }}
          >
            <Clock size={16} />
            <span>Day Scheduler</span>
            {scheduleBlocks.length > 0 && (
              <span className="tab-pill">{completedScheduleCount}/{scheduleBlocks.length}</span>
            )}
          </button>
          <button
            className={`tab-btn ${activeTab === 'deadlines' ? 'active' : ''}`}
            onClick={() => { playClickSound(); setActiveTab('deadlines'); }}
          >
            <AlertCircle size={16} />
            <span>Exams & Deadlines</span>
            {upcomingDeadlines.length > 0 && (
              <span className="tab-pill alert-pill">{upcomingDeadlines.length}</span>
            )}
          </button>
        </div>

        <div className="filter-group">
          <div className="filter-item">
            <Filter size={14} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="exam">🎓 Exams Only</option>
              <option value="assignment">📝 Deadlines Only</option>
              <option value="study">📚 Study Sessions</option>
            </select>
          </div>

          <div className="filter-item">
            <BookOpen size={14} />
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Subjects</option>
              {subjects.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : activeTab === 'calendar' ? (
        /* Month Calendar View */
        <div className="calendar-grid-wrapper">
          <div className="calendar-card card glass-panel">
            <div className="calendar-header-nav">
              <h2 className="month-title">
                {MONTH_NAMES[month]} {year}
              </h2>
              <div className="nav-btn-group">
                <button onClick={handleToday} className="btn-today">
                  Today
                </button>
                <button onClick={handlePrevMonth} className="btn-icon-nav" title="Previous Month">
                  <ChevronLeft size={18} />
                </button>
                <button onClick={handleNextMonth} className="btn-icon-nav" title="Next Month">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Weekday headers */}
            <div className="calendar-weekdays">
              {DAYS_OF_WEEK.map((d) => (
                <div key={d} className="weekday-header">
                  {d}
                </div>
              ))}
            </div>

            {/* Month Days Grid */}
            <div className="calendar-days-grid">
              {Array.from({ length: firstDayOfMonth }).map((_, idx) => {
                const dayNum = prevMonthDays - firstDayOfMonth + idx + 1;
                return (
                  <div key={`prev-${idx}`} className="calendar-day other-month">
                    <span className="day-number">{dayNum}</span>
                  </div>
                );
              })}

              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const dObj = new Date(year, month, dayNum);
                const dateStr = dObj.toISOString().split('T')[0];
                const dayEvents = getEventsForDate(dObj);

                const isToday = new Date().toISOString().split('T')[0] === dateStr;
                const isSelected = selectedDateStr === dateStr;

                return (
                  <div
                    key={`day-${dayNum}`}
                    className={`calendar-day ${isToday ? 'today' : ''} ${
                      isSelected ? 'selected' : ''
                    }`}
                    onClick={() => handleSelectDate(dateStr)}
                  >
                    <div className="day-top">
                      <span className="day-number">{dayNum}</span>
                      {isToday && <span className="today-dot"></span>}
                    </div>

                    <div className="day-events-list">
                      {dayEvents.slice(0, 3).map((ev) => (
                        <div
                          key={ev._id}
                          className={`event-chip chip-${ev.type} ${ev.completed ? 'completed' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditEvent(ev);
                          }}
                          title={`${ev.title} (${ev.type})`}
                        >
                          <span className="chip-icon">
                            {ev.type === 'exam' ? '🎓' : ev.type === 'assignment' ? '📝' : '📚'}
                          </span>
                          <span className="chip-title">{ev.title}</span>
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="more-chip">+{dayEvents.length - 3} more</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Date Detail Drawer */}
          <div className="date-detail-sidebar card glass-panel">
            <div className="sidebar-date-header">
              <h3>
                {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </h3>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => openAddEvent(selectedDateStr)}
              >
                <Plus size={14} /> Add Event
              </button>
            </div>

            <div className="sidebar-section">
              <h4>Exams & Deadlines</h4>
              {getEventsForDate(new Date(selectedDateStr + 'T00:00:00')).length === 0 ? (
                <p className="no-items-text">No exams or deadlines set for this date.</p>
              ) : (
                <div className="sidebar-event-list">
                  {getEventsForDate(new Date(selectedDateStr + 'T00:00:00')).map((ev) => (
                    <div key={ev._id} className={`sidebar-event-item item-${ev.type}`}>
                      <button
                        className="btn-toggle-check"
                        onClick={() => handleToggleEvent(ev._id)}
                      >
                        {ev.completed ? (
                          <CheckCircle2 className="icon-check active" size={18} />
                        ) : (
                          <Circle className="icon-check" size={18} />
                        )}
                      </button>

                      <div className="event-info">
                        <span className={`event-title ${ev.completed ? 'strikethrough' : ''}`}>
                          {ev.title}
                        </span>
                        <div className="event-meta">
                          {renderTypeBadge(ev.type)}
                          {ev.time && <span className="time-tag"><Clock size={11} /> {ev.time}</span>}
                        </div>
                      </div>

                      <div className="item-actions">
                        <button onClick={() => openEditEvent(ev)} title="Edit">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => handleDeleteEvent(ev._id)} title="Delete" className="text-danger">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="sidebar-section">
              <div className="section-header-row">
                <h4>Day Schedule</h4>
                <button
                  className="btn-link-action"
                  onClick={() => setActiveTab('scheduler')}
                >
                  Full Scheduler →
                </button>
              </div>

              {scheduleBlocks.length === 0 ? (
                <div className="empty-mini-box">
                  <p>No study slots scheduled.</p>
                  <button
                    className="btn btn-sm btn-secondary"
                    style={{ marginTop: '0.5rem' }}
                    onClick={() => openAddSchedule('09:00')}
                  >
                    + Add Slot
                  </button>
                </div>
              ) : (
                <div className="sidebar-schedule-list">
                  {scheduleBlocks.map((block) => (
                    <div key={block._id} className="sidebar-schedule-item">
                      <button
                        className="btn-toggle-check"
                        onClick={() => handleToggleSchedule(block._id)}
                      >
                        {block.completed ? (
                          <CheckCircle2 className="icon-check active" size={16} />
                        ) : (
                          <Circle className="icon-check" size={16} />
                        )}
                      </button>
                      <div className="schedule-info">
                        <span className="time-range">{formatTimeRange(block.startTime, block.endTime, is12Hour)}</span>
                        <span className={`schedule-title ${block.completed ? 'strikethrough' : ''}`}>
                          {block.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : activeTab === 'scheduler' ? (
        /* Day Scheduler View */
        <div className="day-scheduler-container">
          <div className="scheduler-header-card card glass-panel">
            <div className="scheduler-date-selector">
              <button
                className="btn-icon-nav"
                onClick={() => {
                  const prev = new Date(selectedDateStr + 'T00:00:00');
                  prev.setDate(prev.getDate() - 1);
                  handleSelectDate(prev.toISOString().split('T')[0]);
                }}
              >
                <ChevronLeft size={18} />
              </button>
              <input
                type="date"
                value={selectedDateStr}
                onChange={(e) => handleSelectDate(e.target.value)}
                className="date-picker-input"
              />
              <button
                className="btn-icon-nav"
                onClick={() => {
                  const next = new Date(selectedDateStr + 'T00:00:00');
                  next.setDate(next.getDate() + 1);
                  handleSelectDate(next.toISOString().split('T')[0]);
                }}
              >
                <ChevronRight size={18} />
              </button>
              <button onClick={handleToday} className="btn-today">
                Today
              </button>
            </div>

            <div className="scheduler-progress-box">
              <div className="progress-text-row">
                <span>Daily Completion</span>
                <strong>{completedScheduleCount} / {scheduleBlocks.length} Slots ({scheduleProgress}%)</strong>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${scheduleProgress}%` }} />
              </div>
            </div>

            <div className="scheduler-header-actions">
              <button
                className="btn btn-secondary btn-auto-gen"
                onClick={handleAutoGenerateSchedule}
                disabled={generatingSchedule}
              >
                <Sparkles size={16} className="sparkle-icon" />
                <span>{generatingSchedule ? 'Generating...' : 'Auto-Generate Study Plan'}</span>
              </button>
              <button className="btn btn-primary" onClick={() => openAddSchedule('09:00')}>
                <Plus size={16} />
                <span>Add Time Slot</span>
              </button>
            </div>
          </div>

          <div className="time-slots-grid">
            {scheduleBlocks.length === 0 ? (
              <div className="empty-state card">
                <Clock size={36} color="var(--primary)" />
                <h3>No schedule blocks for this date</h3>
                <p>Click "Auto-Generate Study Plan" to automatically build your day from pending topics!</p>
                <div className="empty-action-row">
                  <button className="btn btn-primary" onClick={() => openAddSchedule('09:00')}>
                    + Add Time Slot
                  </button>
                  <button className="btn btn-secondary" onClick={handleAutoGenerateSchedule}>
                    <Sparkles size={16} /> Auto-Generate
                  </button>
                </div>
              </div>
            ) : (
              <div className="schedule-timeline">
                {scheduleBlocks.map((block) => (
                  <div key={block._id} className={`timeline-block ${block.completed ? 'completed' : ''}`}>
                    <div className="block-time-col">
                      <span className="start-time">{formatSingleTime(block.startTime, is12Hour)}</span>
                      <span className="end-time">{formatSingleTime(block.endTime, is12Hour)}</span>
                    </div>

                    <div className="block-card card glass-panel">
                      <div className="block-card-header">
                        <div className="block-title-row">
                          <button
                            className="btn-toggle-check"
                            onClick={() => handleToggleSchedule(block._id)}
                          >
                            {block.completed ? (
                              <CheckCircle2 size={20} color="var(--success)" className="active animated-check" />
                            ) : (
                              <Circle size={20} color="var(--text-light)" />
                            )}
                          </button>
                          <h4 className={block.completed ? 'strikethrough' : ''}>{block.title}</h4>
                        </div>

                        <div className="block-actions">
                          <button onClick={() => openEditSchedule(block)} title="Edit">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDeleteSchedule(block._id)} title="Delete" className="text-danger">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="block-card-meta">
                        {renderTypeBadge(block.type)}
                        {block.subject?.name && (
                          <span className="subject-pill">
                            <BookOpen size={12} /> {block.subject.name}
                          </span>
                        )}
                        {block.notes && <p className="block-notes">{block.notes}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Deadlines Hub View */
        <div className="deadlines-container">
          <div className="deadlines-header-row">
            <h2>Upcoming Exams & Assignment Deadlines</h2>
            <button className="btn btn-primary" onClick={() => openAddEvent()}>
              <Plus size={16} /> Add Exam / Assignment
            </button>
          </div>

          {upcomingDeadlines.length === 0 ? (
            <div className="empty-state card">
              <GraduationCap size={36} color="var(--primary)" />
              <h3>No upcoming exams or assignments scheduled</h3>
              <p>Add your exam dates and project deadlines to keep track of remaining days.</p>
              <button className="btn btn-primary" onClick={() => openAddEvent()}>
                + Add Exam Date / Deadline
              </button>
            </div>
          ) : (
            <div className="deadlines-list-grid">
              {upcomingDeadlines.map((ev) => (
                <div key={ev._id} className={`deadline-card card glass-panel type-${ev.type} ${ev.completed ? 'completed' : ''}`}>
                  <div className="deadline-card-header">
                    <div className="type-and-countdown">
                      {renderTypeBadge(ev.type)}
                      {getDaysRemainingText(ev.date)}
                    </div>
                    <div className="item-actions">
                      <button onClick={() => openEditEvent(ev)} title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDeleteEvent(ev._id)} title="Delete" className="text-danger">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <h3 className={`deadline-title ${ev.completed ? 'strikethrough' : ''}`}>{ev.title}</h3>

                  <div className="deadline-details">
                    <div className="detail-item">
                      <CalendarIcon size={14} />
                      <span>{new Date(ev.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>

                    {ev.time && (
                      <div className="detail-item">
                        <Clock size={14} />
                        <span>{ev.time}</span>
                      </div>
                    )}

                    {ev.subject?.name && (
                      <div className="detail-item">
                        <BookOpen size={14} />
                        <span>{ev.subject.name}</span>
                      </div>
                    )}
                  </div>

                  {ev.description && <p className="deadline-desc">{ev.description}</p>}

                  <div className="deadline-footer">
                    <button
                      className={`btn-complete-toggle ${ev.completed ? 'is-complete' : ''}`}
                      onClick={() => handleToggleEvent(ev._id)}
                    >
                      {ev.completed ? (
                        <>
                          <Check size={15} /> Mark Incomplete
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={15} /> Mark Completed
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: Event */}
      {showEventModal && (
        <div className="modal-backdrop">
          <div className="modal-card card glass-panel">
            <div className="modal-header">
              <h3>{editingEvent ? 'Edit Event / Deadline' : 'Add Exam / Deadline'}</h3>
              <button className="btn-close-modal icon-btn-ghost" onClick={() => setShowEventModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEventSubmit} className="modal-body">
              <div className="form-group">
                <label>Event / Exam Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Midterm DBMS Exam, OS Lab Submission"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={eventForm.type}
                    onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                    className="form-control"
                  >
                    <option value="exam">🎓 Exam</option>
                    <option value="assignment">📝 Assignment</option>
                    <option value="study">📚 Study Session</option>
                    <option value="other">📌 Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Related Subject</label>
                  <select
                    value={eventForm.subject}
                    onChange={(e) => setEventForm({ ...eventForm, subject: e.target.value })}
                    className="form-control"
                  >
                    <option value="">(None / General)</option>
                    {subjects.map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    required
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description / Notes</label>
                <textarea
                  rows="3"
                  placeholder="Topics covered, room number, submission link, etc."
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="form-control"
                ></textarea>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEventModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingEvent ? 'Update Event' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Schedule Block */}
      {showScheduleModal && (
        <div className="modal-backdrop">
          <div className="modal-card card glass-panel">
            <div className="modal-header">
              <h3>{editingSchedule ? 'Edit Schedule Slot' : 'Add Schedule Slot'}</h3>
              <button className="btn-close-modal icon-btn-ghost" onClick={() => setShowScheduleModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="modal-body">
              <div className="form-group">
                <label>Slot Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DBMS Unit 2 Normalization Practice"
                  value={scheduleForm.title}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Start Time (HH:mm) *</label>
                  <input
                    type="text"
                    required
                    placeholder="09:00"
                    value={scheduleForm.startTime}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, startTime: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>End Time (HH:mm) *</label>
                  <input
                    type="text"
                    required
                    placeholder="10:30"
                    value={scheduleForm.endTime}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, endTime: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Related Subject</label>
                <select
                  value={scheduleForm.subject}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, subject: e.target.value })}
                  className="form-control"
                >
                  <option value="">(None / General)</option>
                  {subjects.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowScheduleModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSchedule ? 'Update Slot' : 'Save Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
