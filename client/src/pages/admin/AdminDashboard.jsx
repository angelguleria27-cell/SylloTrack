import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Calendar,
  Megaphone,
  Users,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FileText,
  Sparkles,
  LogOut,
  ShieldCheck,
  RefreshCw,
  X,
  PlusCircle,
  Tag,
} from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { playClickSound, playSuccessSound, playDeleteSound } = useTheme();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'subjects' | 'assignments' | 'timetable' | 'announcements'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Data states
  const [overviewData, setOverviewData] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // Modal / Form states
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [subjectForm, setSubjectForm] = useState({ name: '', code: '', semester: 5, ltpc: '3-0-0-3', description: '' });

  // Unit / Topic Modal states
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [unitForm, setUnitForm] = useState({ unitNumber: 1, title: '' });

  const [showTopicModal, setShowTopicModal] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [editingTopic, setEditingTopic] = useState(null);
  const [topicForm, setTopicForm] = useState({ title: '' });

  // Assignment Modal
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    subject: '',
    dueDate: '',
    dueTime: '23:59',
    priority: 'medium',
    description: '',
  });

  // Timetable Modal
  const [showTimetableModal, setShowTimetableModal] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState(null);
  const [timetableForm, setTimetableForm] = useState({
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:00',
    subject: '',
    room: 'LT-3',
    teacher: '',
  });

  // Announcement Modal
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    priority: 'normal',
  });

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError('');
      const [ovRes, subRes, assRes, ttRes, annRes] = await Promise.all([
        api.get('/admin/overview'),
        api.get('/subjects'),
        api.get('/assignments'),
        api.get('/timetable'),
        api.get('/announcements'),
      ]);

      setOverviewData(ovRes.data);
      setSubjects(subRes.data);
      setAssignments(assRes.data);
      setTimetable(ttRes.data);
      setAnnouncements(annRes.data);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
      setError(err.response?.data?.message || 'Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Handler for Subject CRUD
  const handleSaveSubject = async (e) => {
    e.preventDefault();
    playClickSound();
    try {
      if (editingSubject) {
        await api.put(`/subjects/${editingSubject._id}`, subjectForm);
      } else {
        await api.post('/subjects', { ...subjectForm, isGlobal: true });
      }
      playSuccessSound();
      setShowSubjectModal(false);
      setEditingSubject(null);
      setSubjectForm({ name: '', code: '', semester: 5, ltpc: '3-0-0-3', description: '' });
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save subject');
    }
  };

  const handleDeleteSubject = async (id, name) => {
    playDeleteSound();
    if (window.confirm(`Are you sure you want to delete subject "${name}"? This action cannot be undone.`)) {
      try {
        await api.delete(`/subjects/${id}`);
        playSuccessSound();
        fetchAllData();
      } catch (err) {
        alert('Could not delete subject');
      }
    }
  };

  // Handler for Unit CRUD
  const handleSaveUnit = async (e) => {
    e.preventDefault();
    playClickSound();
    try {
      if (editingUnit) {
        await api.put(`/subjects/${selectedSubjectId}/units/${editingUnit._id}`, unitForm);
      } else {
        await api.post(`/subjects/${selectedSubjectId}/units`, unitForm);
      }
      playSuccessSound();
      setShowUnitModal(false);
      setEditingUnit(null);
      setUnitForm({ unitNumber: 1, title: '' });
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save unit');
    }
  };

  const handleDeleteUnit = async (subjectId, unitId) => {
    playDeleteSound();
    if (window.confirm('Delete this unit/module?')) {
      try {
        await api.delete(`/subjects/${subjectId}/units/${unitId}`);
        playSuccessSound();
        fetchAllData();
      } catch (err) {
        alert('Could not delete unit');
      }
    }
  };

  // Handler for Topic CRUD
  const handleSaveTopic = async (e) => {
    e.preventDefault();
    playClickSound();
    try {
      if (editingTopic) {
        await api.put(`/subjects/${selectedSubjectId}/units/${selectedUnitId}/topics/${editingTopic._id}`, topicForm);
      } else {
        await api.post(`/subjects/${selectedSubjectId}/units/${selectedUnitId}/topics`, topicForm);
      }
      playSuccessSound();
      setShowTopicModal(false);
      setEditingTopic(null);
      setTopicForm({ title: '' });
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save topic');
    }
  };

  const handleDeleteTopic = async (subjectId, unitId, topicId) => {
    playDeleteSound();
    if (window.confirm('Delete this syllabus topic?')) {
      try {
        await api.delete(`/subjects/${subjectId}/units/${unitId}/topics/${topicId}`);
        playSuccessSound();
        fetchAllData();
      } catch (err) {
        alert('Could not delete topic');
      }
    }
  };

  // Handler for Assignment CRUD
  const handleSaveAssignment = async (e) => {
    e.preventDefault();
    playClickSound();
    try {
      if (editingAssignment) {
        await api.put(`/assignments/${editingAssignment._id}`, assignmentForm);
      } else {
        await api.post('/assignments', assignmentForm);
      }
      playSuccessSound();
      setShowAssignmentModal(false);
      setEditingAssignment(null);
      setAssignmentForm({ title: '', subject: '', dueDate: '', dueTime: '23:59', priority: 'medium', description: '' });
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save assignment');
    }
  };

  const handleDeleteAssignment = async (id) => {
    playDeleteSound();
    if (window.confirm('Remove this assignment deadline?')) {
      try {
        await api.delete(`/assignments/${id}`);
        playSuccessSound();
        fetchAllData();
      } catch (err) {
        alert('Could not delete assignment');
      }
    }
  };

  // Handler for Timetable CRUD
  const handleSaveTimetable = async (e) => {
    e.preventDefault();
    playClickSound();
    try {
      if (editingTimetable) {
        await api.put(`/timetable/${editingTimetable._id}`, timetableForm);
      } else {
        await api.post('/timetable', timetableForm);
      }
      playSuccessSound();
      setShowTimetableModal(false);
      setEditingTimetable(null);
      setTimetableForm({ day: 'Monday', startTime: '09:00', endTime: '10:00', subject: '', room: 'LT-3', teacher: '' });
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save timetable slot');
    }
  };

  const handleDeleteTimetable = async (id) => {
    playDeleteSound();
    if (window.confirm('Remove this timetable slot?')) {
      try {
        await api.delete(`/timetable/${id}`);
        playSuccessSound();
        fetchAllData();
      } catch (err) {
        alert('Could not delete timetable slot');
      }
    }
  };

  // Handler for Announcement CRUD
  const handleSaveAnnouncement = async (e) => {
    e.preventDefault();
    playClickSound();
    try {
      if (editingAnnouncement) {
        await api.put(`/announcements/${editingAnnouncement._id}`, announcementForm);
      } else {
        await api.post('/announcements', announcementForm);
      }
      playSuccessSound();
      setShowAnnouncementModal(false);
      setEditingAnnouncement(null);
      setAnnouncementForm({ title: '', content: '', priority: 'normal' });
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save announcement');
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    playDeleteSound();
    if (window.confirm('Delete this announcement?')) {
      try {
        await api.delete(`/announcements/${id}`);
        playSuccessSound();
        fetchAllData();
      } catch (err) {
        alert('Could not delete announcement');
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="spinner"></div>
        <p>Loading Admin Dashboard & CMS controls...</p>
      </div>
    );
  }

  return (
    <div className="admin-layout animate-fade-in">
      {/* Top Admin Navigation Shell Header */}
      <header className="admin-topbar">
        <div className="admin-brand">
          <div className="admin-brand-logo">
            <ShieldCheck size={24} color="#38bdf8" />
          </div>
          <div>
            <h2>SylloTrack CMS Admin</h2>
            <span className="admin-subtext">Section A Curriculum & System Management</span>
          </div>
        </div>

        <div className="admin-user-nav">
          <button onClick={fetchAllData} className="btn btn-secondary btn-sm" title="Refresh Data">
            <RefreshCw size={15} /> Refresh
          </button>
          <div className="admin-profile-chip">
            <span className="chip-avatar">{user?.name ? user.name.charAt(0) : 'A'}</span>
            <div className="chip-details">
              <strong>{user?.name || 'Administrator'}</strong>
              <span>System Admin</span>
            </div>
          </div>
          <button onClick={logout} className="btn btn-danger btn-sm" title="Sign Out">
            <LogOut size={16} /> Exit Admin
          </button>
        </div>
      </header>

      {/* Main Admin Navigation Tabs */}
      <nav className="admin-tab-bar">
        <button
          className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => { playClickSound(); setActiveTab('overview'); }}
        >
          <LayoutDashboard size={18} />
          <span>Overview & Stats</span>
        </button>
        <button
          className={`admin-tab ${activeTab === 'subjects' ? 'active' : ''}`}
          onClick={() => { playClickSound(); setActiveTab('subjects'); }}
        >
          <BookOpen size={18} />
          <span>Subjects & Syllabus ({subjects.length})</span>
        </button>
        <button
          className={`admin-tab ${activeTab === 'assignments' ? 'active' : ''}`}
          onClick={() => { playClickSound(); setActiveTab('assignments'); }}
        >
          <FileText size={18} />
          <span>Assignment Deadlines ({assignments.length})</span>
        </button>
        <button
          className={`admin-tab ${activeTab === 'timetable' ? 'active' : ''}`}
          onClick={() => { playClickSound(); setActiveTab('timetable'); }}
        >
          <Calendar size={18} />
          <span>Weekly Timetable ({timetable.length})</span>
        </button>
        <button
          className={`admin-tab ${activeTab === 'announcements' ? 'active' : ''}`}
          onClick={() => { playClickSound(); setActiveTab('announcements'); }}
        >
          <Megaphone size={18} />
          <span>Announcements ({announcements.length})</span>
        </button>
      </nav>

      {/* Content Body based on activeTab */}
      <main className="admin-main-container">
        {error && (
          <div className="auth-alert error" style={{ marginBottom: '1.5rem' }}>
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && overviewData && (
          <div className="admin-overview-view animate-fade-in">
            <div className="admin-kpi-grid">
              <div className="admin-kpi-card card">
                <div className="kpi-icon blue"><BookOpen size={24} /></div>
                <div className="kpi-data">
                  <span className="kpi-value">{overviewData.summary.totalSubjects}</span>
                  <span className="kpi-label">Section Subjects</span>
                </div>
              </div>
              <div className="admin-kpi-card card">
                <div className="kpi-icon amber"><Layers size={24} /></div>
                <div className="kpi-data">
                  <span className="kpi-value">{overviewData.summary.totalUnits} Units / {overviewData.summary.totalTopics} Topics</span>
                  <span className="kpi-label">Syllabus Structure</span>
                </div>
              </div>
              <div className="admin-kpi-card card">
                <div className="kpi-icon purple"><FileText size={24} /></div>
                <div className="kpi-data">
                  <span className="kpi-value">{overviewData.summary.totalAssignments}</span>
                  <span className="kpi-label">Active Assignments ({overviewData.summary.upcomingDeadlinesCount} Upcoming)</span>
                </div>
              </div>
              <div className="admin-kpi-card card">
                <div className="kpi-icon green"><Users size={24} /></div>
                <div className="kpi-data">
                  <span className="kpi-value">{overviewData.summary.totalStudents}</span>
                  <span className="kpi-label">Enrolled Students</span>
                </div>
              </div>
            </div>

            <div className="admin-two-column-layout" style={{ marginTop: '1.5rem' }}>
              {/* Upcoming Deadlines */}
              <div className="admin-card card">
                <div className="admin-card-header">
                  <h3><Clock size={18} color="var(--primary)" /> Upcoming Deadlines</h3>
                  <button className="btn btn-sm btn-primary" onClick={() => { setActiveTab('assignments'); setShowAssignmentModal(true); }}>
                    + New Deadline
                  </button>
                </div>
                {overviewData.upcomingDeadlines.length === 0 ? (
                  <p className="empty-text">No pending deadlines scheduled.</p>
                ) : (
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Assignment</th>
                          <th>Subject</th>
                          <th>Due Date</th>
                          <th>Priority</th>
                        </tr>
                      </thead>
                      <tbody>
                        {overviewData.upcomingDeadlines.map((item) => (
                          <tr key={item._id}>
                            <td><strong>{item.title}</strong></td>
                            <td>{item.subject?.name || 'General'}</td>
                            <td>{new Date(item.dueDate).toLocaleDateString()} @ {item.dueTime}</td>
                            <td>
                              <span className={`badge-priority ${item.priority}`}>
                                {item.priority}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Student Activity Feed */}
              <div className="admin-card card">
                <div className="admin-card-header">
                  <h3><Users size={18} color="var(--success)" /> Recent Student Progress</h3>
                </div>
                {overviewData.recentStudentActivity.length === 0 ? (
                  <p className="empty-text">No recent student activity registered.</p>
                ) : (
                  <div className="activity-feed-list">
                    {overviewData.recentStudentActivity.map((act) => (
                      <div key={act._id} className="activity-feed-item">
                        <div className="activity-avatar">{act.studentName.charAt(0)}</div>
                        <div className="activity-details">
                          <strong>{act.studentName}</strong>
                          <span className="activity-desc">
                            Completed <strong>{act.completedCount}</strong> topics in <em>{act.subjectName}</em>
                          </span>
                          <span className="activity-time">{new Date(act.updatedAt).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. SUBJECTS & SYLLABUS TAB */}
        {activeTab === 'subjects' && (
          <div className="admin-subjects-view animate-fade-in">
            <div className="admin-section-actions">
              <div>
                <h2>Section A Syllabus Management</h2>
                <p>Add subjects, create syllabus units/modules, and insert individual study topics.</p>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditingSubject(null);
                  setSubjectForm({ name: '', code: '', semester: 5, ltpc: '3-0-0-3', description: '' });
                  setShowSubjectModal(true);
                }}
              >
                <PlusCircle size={18} /> Add New Subject
              </button>
            </div>

            <div className="admin-subject-accordion-list" style={{ marginTop: '1.5rem' }}>
              {subjects.map((sub) => (
                <div key={sub._id} className="admin-subject-card card">
                  <div className="admin-subject-header">
                    <div className="sub-info">
                      <span className="sub-code">{sub.code}</span>
                      <h3>{sub.name}</h3>
                      <span className="sub-meta">Sem {sub.semester} • LTPC: {sub.ltpc} • {sub.unitsCount} Units ({sub.totalTopics} Topics)</span>
                    </div>

                    <div className="sub-actions">
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => {
                          setSelectedSubjectId(sub._id);
                          setEditingUnit(null);
                          setUnitForm({ unitNumber: (sub.unitsCount || 0) + 1, title: '' });
                          setShowUnitModal(true);
                        }}
                      >
                        + Add Unit
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => {
                          setEditingSubject(sub);
                          setSubjectForm({
                            name: sub.name,
                            code: sub.code,
                            semester: sub.semester,
                            ltpc: sub.ltpc,
                            description: sub.description || '',
                          });
                          setShowSubjectModal(true);
                        }}
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteSubject(sub._id, sub.name)}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>

                  {/* Units List */}
                  <div className="admin-units-container">
                    {!sub.units || sub.units.length === 0 ? (
                      <p className="no-units-text">No units/modules added yet. Click "+ Add Unit" to define syllabus modules.</p>
                    ) : (
                      sub.units.map((unit) => (
                        <div key={unit._id} className="admin-unit-block">
                          <div className="unit-header-row">
                            <h4>Unit {unit.unitNumber}: {unit.title}</h4>
                            <div className="unit-action-btns">
                              <button
                                className="btn btn-xs btn-primary"
                                onClick={() => {
                                  setSelectedSubjectId(sub._id);
                                  setSelectedUnitId(unit._id);
                                  setEditingTopic(null);
                                  setTopicForm({ title: '' });
                                  setShowTopicModal(true);
                                }}
                              >
                                + Add Topic
                              </button>
                              <button
                                className="btn btn-xs btn-secondary"
                                onClick={() => {
                                  setSelectedSubjectId(sub._id);
                                  setEditingUnit(unit);
                                  setUnitForm({ unitNumber: unit.unitNumber, title: unit.title });
                                  setShowUnitModal(true);
                                }}
                              >
                                <Edit size={12} /> Edit Unit
                              </button>
                              <button
                                className="btn btn-xs btn-danger"
                                onClick={() => handleDeleteUnit(sub._id, unit._id)}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>

                          {/* Topics List */}
                          <div className="unit-topics-chips">
                            {(!unit.topics || unit.topics.length === 0) ? (
                              <span className="empty-topic-tag">No topics added</span>
                            ) : (
                              unit.topics.map((t) => (
                                <div key={t._id} className="topic-chip">
                                  <span>{t.title}</span>
                                  <button
                                    onClick={() => {
                                      setSelectedSubjectId(sub._id);
                                      setSelectedUnitId(unit._id);
                                      setEditingTopic(t);
                                      setTopicForm({ title: t.title });
                                      setShowTopicModal(true);
                                    }}
                                    className="icon-chip-btn"
                                    title="Edit topic"
                                  >
                                    <Edit size={11} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTopic(sub._id, unit._id, t._id)}
                                    className="icon-chip-btn text-danger"
                                    title="Delete topic"
                                  >
                                    <X size={11} />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. ASSIGNMENTS TAB */}
        {activeTab === 'assignments' && (
          <div className="admin-assignments-view animate-fade-in">
            <div className="admin-section-actions">
              <div>
                <h2>Section A Assignment Deadlines</h2>
                <p>Create, update, and remove official subject assignments for Section A students.</p>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditingAssignment(null);
                  setAssignmentForm({
                    title: '',
                    subject: subjects[0]?._id || '',
                    dueDate: '',
                    dueTime: '23:59',
                    priority: 'medium',
                    description: '',
                  });
                  setShowAssignmentModal(true);
                }}
              >
                <PlusCircle size={18} /> + Add Assignment
              </button>
            </div>

            <div className="admin-card card" style={{ marginTop: '1.5rem' }}>
              {assignments.length === 0 ? (
                <div className="empty-state">
                  <FileText size={32} color="var(--primary)" />
                  <p>No master assignments posted yet.</p>
                </div>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Subject</th>
                        <th>Due Date & Time</th>
                        <th>Priority</th>
                        <th>Description</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignments.map((ass) => (
                        <tr key={ass._id}>
                          <td><strong>{ass.title}</strong></td>
                          <td><span className="code-pill">{ass.subject?.code || 'SEC-A'}</span> {ass.subject?.name}</td>
                          <td>{new Date(ass.dueDate).toLocaleDateString()} @ {ass.dueTime}</td>
                          <td><span className={`badge-priority ${ass.priority}`}>{ass.priority}</span></td>
                          <td>{ass.description || '—'}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              className="btn btn-sm btn-secondary"
                              style={{ marginRight: '0.4rem' }}
                              onClick={() => {
                                setEditingAssignment(ass);
                                setAssignmentForm({
                                  title: ass.title,
                                  subject: ass.subject?._id || ass.subject || '',
                                  dueDate: ass.dueDate ? new Date(ass.dueDate).toISOString().split('T')[0] : '',
                                  dueTime: ass.dueTime || '23:59',
                                  priority: ass.priority || 'medium',
                                  description: ass.description || '',
                                });
                                setShowAssignmentModal(true);
                              }}
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteAssignment(ass._id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. TIMETABLE TAB */}
        {activeTab === 'timetable' && (
          <div className="admin-timetable-view animate-fade-in">
            <div className="admin-section-actions">
              <div>
                <h2>Section A Class Timetable Schedule</h2>
                <p>Manage official daily lecture & lab timetable entries for 5th Sem CSE Section A.</p>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditingTimetable(null);
                  setTimetableForm({
                    day: 'Monday',
                    startTime: '09:00',
                    endTime: '10:00',
                    subject: subjects[0]?._id || '',
                    room: 'LT-3',
                    teacher: '',
                  });
                  setShowTimetableModal(true);
                }}
              >
                <PlusCircle size={18} /> + Add Timetable Slot
              </button>
            </div>

            <div className="admin-card card" style={{ marginTop: '1.5rem' }}>
              {timetable.length === 0 ? (
                <div className="empty-state">
                  <Calendar size={32} color="var(--primary)" />
                  <p>No timetable slots configured yet.</p>
                </div>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Time Slot</th>
                        <th>Subject</th>
                        <th>Room / Venue</th>
                        <th>Faculty / Instructor</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timetable.map((tt) => (
                        <tr key={tt._id}>
                          <td><strong>{tt.day}</strong></td>
                          <td><Clock size={14} /> {tt.startTime} - {tt.endTime}</td>
                          <td><span className="code-pill">{tt.subject?.code}</span> {tt.subject?.name}</td>
                          <td>{tt.room || 'LT-3'}</td>
                          <td>{tt.teacher || 'Department Faculty'}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              className="btn btn-sm btn-secondary"
                              style={{ marginRight: '0.4rem' }}
                              onClick={() => {
                                setEditingTimetable(tt);
                                setTimetableForm({
                                  day: tt.day,
                                  startTime: tt.startTime,
                                  endTime: tt.endTime,
                                  subject: tt.subject?._id || tt.subject || '',
                                  room: tt.room || 'LT-3',
                                  teacher: tt.teacher || '',
                                });
                                setShowTimetableModal(true);
                              }}
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteTimetable(tt._id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. ANNOUNCEMENTS TAB */}
        {activeTab === 'announcements' && (
          <div className="admin-announcements-view animate-fade-in">
            <div className="admin-section-actions">
              <div>
                <h2>Section A Announcements Broadcast</h2>
                <p>Publish important notices and department updates to all Section A student dashboards.</p>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditingAnnouncement(null);
                  setAnnouncementForm({ title: '', content: '', priority: 'normal' });
                  setShowAnnouncementModal(true);
                }}
              >
                <PlusCircle size={18} /> + Post Announcement
              </button>
            </div>

            <div className="admin-announcements-grid" style={{ marginTop: '1.5rem' }}>
              {announcements.length === 0 ? (
                <div className="admin-card card empty-state">
                  <Megaphone size={32} color="var(--primary)" />
                  <p>No active announcements broadcast.</p>
                </div>
              ) : (
                announcements.map((ann) => (
                  <div key={ann._id} className="admin-announcement-card card">
                    <div className="announcement-header">
                      <span className={`badge-priority ${ann.priority}`}>
                        {ann.priority.toUpperCase()}
                      </span>
                      <span className="ann-date">{new Date(ann.createdAt).toLocaleDateString()}</span>
                    </div>

                    <h3>{ann.title}</h3>
                    <p>{ann.content}</p>

                    <div className="ann-footer">
                      <span className="ann-author">By: {ann.author?.name || 'Administrator'}</span>
                      <div className="ann-actions">
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => {
                            setEditingAnnouncement(ann);
                            setAnnouncementForm({ title: ann.title, content: ann.content, priority: ann.priority });
                            setShowAnnouncementModal(true);
                          }}
                        >
                          <Edit size={14} /> Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteAnnouncement(ann._id)}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* --- MODALS --- */}

      {/* 1. Subject Modal */}
      {showSubjectModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal card glass-panel">
            <div className="admin-modal-header">
              <h3>{editingSubject ? 'Edit Subject Details' : 'Add New Subject'}</h3>
              <button className="icon-btn-ghost" onClick={() => setShowSubjectModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveSubject}>
              <div className="input-group">
                <label>Subject Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Operating Systems"
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="input-group-row">
                <div className="input-group">
                  <label>Course Code</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. BTCS-23505"
                    value={subjectForm.code}
                    onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Semester</label>
                  <input
                    type="number"
                    className="form-control"
                    value={subjectForm.semester}
                    onChange={(e) => setSubjectForm({ ...subjectForm, semester: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>L-T-P-C</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="3-0-0-3"
                    value={subjectForm.ltpc}
                    onChange={(e) => setSubjectForm({ ...subjectForm, ltpc: e.target.value })}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Subject syllabus overview..."
                  value={subjectForm.description}
                  onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                />
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowSubjectModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Subject</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Unit Modal */}
      {showUnitModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal card glass-panel">
            <div className="admin-modal-header">
              <h3>{editingUnit ? 'Edit Unit / Module' : 'Add Unit / Module'}</h3>
              <button className="icon-btn-ghost" onClick={() => setShowUnitModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveUnit}>
              <div className="input-group">
                <label>Unit Number</label>
                <input
                  type="number"
                  className="form-control"
                  value={unitForm.unitNumber}
                  onChange={(e) => setUnitForm({ ...unitForm, unitNumber: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="input-group">
                <label>Unit / Module Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Relational Data Model"
                  value={unitForm.title}
                  onChange={(e) => setUnitForm({ ...unitForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowUnitModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Unit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Topic Modal */}
      {showTopicModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal card glass-panel">
            <div className="admin-modal-header">
              <h3>{editingTopic ? 'Edit Syllabus Topic' : 'Add Syllabus Topic'}</h3>
              <button className="icon-btn-ghost" onClick={() => setShowTopicModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveTopic}>
              <div className="input-group">
                <label>Topic Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Armstrong's Axioms"
                  value={topicForm.title}
                  onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowTopicModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Topic</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Assignment Modal */}
      {showAssignmentModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal card glass-panel">
            <div className="admin-modal-header">
              <h3>{editingAssignment ? 'Edit Assignment Deadline' : 'Post New Assignment Deadline'}</h3>
              <button className="icon-btn-ghost" onClick={() => setShowAssignmentModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveAssignment}>
              <div className="input-group">
                <label>Assignment Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Lab Assignment 1 - SQL Queries"
                  value={assignmentForm.title}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="input-group">
                <label>Associated Subject</label>
                <select
                  className="form-control"
                  value={assignmentForm.subject}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, subject: e.target.value })}
                  required
                >
                  <option value="">Select a subject...</option>
                  {subjects.map((s) => (
                    <option key={s._id} value={s._id}>{s.code} - {s.name}</option>
                  ))}
                </select>
              </div>

              <div className="input-group-row">
                <div className="input-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={assignmentForm.dueDate}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Due Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={assignmentForm.dueTime}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, dueTime: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label>Priority</label>
                  <select
                    className="form-control"
                    value={assignmentForm.priority}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label>Description & Instructions</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Assignment guidelines, submission instructions..."
                  value={assignmentForm.description}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                />
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAssignmentModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Timetable Modal */}
      {showTimetableModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal card glass-panel">
            <div className="admin-modal-header">
              <h3>{editingTimetable ? 'Edit Timetable Entry' : 'Add Timetable Entry'}</h3>
              <button className="icon-btn-ghost" onClick={() => setShowTimetableModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveTimetable}>
              <div className="input-group-row">
                <div className="input-group">
                  <label>Day of Week</label>
                  <select
                    className="form-control"
                    value={timetableForm.day}
                    onChange={(e) => setTimetableForm({ ...timetableForm, day: e.target.value })}
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Start Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={timetableForm.startTime}
                    onChange={(e) => setTimetableForm({ ...timetableForm, startTime: e.target.value })}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>End Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={timetableForm.endTime}
                    onChange={(e) => setTimetableForm({ ...timetableForm, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Subject</label>
                <select
                  className="form-control"
                  value={timetableForm.subject}
                  onChange={(e) => setTimetableForm({ ...timetableForm, subject: e.target.value })}
                  required
                >
                  <option value="">Select subject...</option>
                  {subjects.map((s) => (
                    <option key={s._id} value={s._id}>{s.code} - {s.name}</option>
                  ))}
                </select>
              </div>

              <div className="input-group-row">
                <div className="input-group">
                  <label>Room / Hall</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. LT-3 or Lab 2"
                    value={timetableForm.room}
                    onChange={(e) => setTimetableForm({ ...timetableForm, room: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label>Teacher / Instructor</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Dr. Sharma"
                    value={timetableForm.teacher}
                    onChange={(e) => setTimetableForm({ ...timetableForm, teacher: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowTimetableModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Timetable Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Announcement Modal */}
      {showAnnouncementModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal card glass-panel">
            <div className="admin-modal-header">
              <h3>{editingAnnouncement ? 'Edit Announcement' : 'Broadcast New Announcement'}</h3>
              <button className="icon-btn-ghost" onClick={() => setShowAnnouncementModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveAnnouncement}>
              <div className="input-group">
                <label>Announcement Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Mid-Sem Examination Schedule Released"
                  value={announcementForm.title}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="input-group">
                <label>Priority Level</label>
                <select
                  className="form-control"
                  value={announcementForm.priority}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, priority: e.target.value })}
                >
                  <option value="normal">Normal</option>
                  <option value="important">Important</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="input-group">
                <label>Announcement Message</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Write message content for Section A students..."
                  value={announcementForm.content}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                  required
                />
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAnnouncementModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Post Announcement</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
