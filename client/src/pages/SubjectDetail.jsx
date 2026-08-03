import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, CheckSquare, Edit3, Trash2, Save, X, Check, BookOpen } from 'lucide-react';
import api from '../api/axios';
import ProgressBar from '../components/ProgressBar';

const SubjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [addingTopic, setAddingTopic] = useState(false);
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [editTopicTitle, setEditTopicTitle] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subjRes, topicsRes] = await Promise.all([
        api.get(`/subjects/${id}`),
        api.get(`/topics/${id}`),
      ]);
      setSubject(subjRes.data);
      setTopics(topicsRes.data);
      setError('');
    } catch (err) {
      console.error('Error loading subject details:', err);
      setError('Subject not found or failed to load topics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // Toggle completion
  const handleToggleComplete = async (topic) => {
    const updatedCompleted = !topic.completed;
    
    // Optimistic UI update
    setTopics((prevTopics) =>
      prevTopics.map((t) =>
        t._id === topic._id ? { ...t, completed: updatedCompleted } : t
      )
    );

    // Update subject stats in state optimistically
    if (subject) {
      const newCompletedCount = updatedCompleted
        ? subject.completedTopics + 1
        : Math.max(0, subject.completedTopics - 1);
      setSubject({ ...subject, completedTopics: newCompletedCount });
    }

    try {
      await api.put(`/topics/${topic._id}`, { completed: updatedCompleted });
      // Refresh to ensure exact sync
      const resSubj = await api.get(`/subjects/${id}`);
      setSubject(resSubj.data);
    } catch (err) {
      console.error('Failed to toggle completion:', err);
      // Revert on error
      fetchData();
    }
  };

  // Add new topic
  const handleAddTopic = async (e) => {
    e.preventDefault();
    if (!newTopicTitle.trim()) return;

    try {
      setAddingTopic(true);
      const res = await api.post('/topics', {
        subjectId: id,
        title: newTopicTitle.trim(),
      });
      setTopics([...topics, res.data]);
      setNewTopicTitle('');
      
      // Refresh subject stats
      const resSubj = await api.get(`/subjects/${id}`);
      setSubject(resSubj.data);
    } catch (err) {
      console.error('Failed to add topic:', err);
      alert('Could not add topic.');
    } finally {
      setAddingTopic(false);
    }
  };

  // Start editing topic
  const startEditTopic = (topic) => {
    setEditingTopicId(topic._id);
    setEditTopicTitle(topic.title);
  };

  // Save topic edit
  const handleSaveTopicEdit = async (topicId) => {
    if (!editTopicTitle.trim()) return;

    try {
      const res = await api.put(`/topics/${topicId}`, { title: editTopicTitle.trim() });
      setTopics(topics.map(t => t._id === topicId ? res.data : t));
      setEditingTopicId(null);
    } catch (err) {
      console.error('Failed to update topic title:', err);
      alert('Could not update topic title.');
    }
  };

  // Delete topic
  const handleDeleteTopic = async (topicId) => {
    if (window.confirm('Are you sure you want to delete this topic?')) {
      try {
        await api.delete(`/topics/${topicId}`);
        setTopics(topics.filter(t => t._id !== topicId));

        // Refresh subject stats
        const resSubj = await api.get(`/subjects/${id}`);
        setSubject(resSubj.data);
      } catch (err) {
        console.error('Failed to delete topic:', err);
        alert('Could not delete topic.');
      }
    }
  };

  const handleDeleteSubject = async () => {
    if (window.confirm(`Are you sure you want to delete "${subject?.name}" and all its topics?`)) {
      try {
        await api.delete(`/subjects/${id}`);
        navigate('/');
      } catch (err) {
        console.error('Failed to delete subject:', err);
        alert('Could not delete subject.');
      }
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !subject) {
    return (
      <div className="empty-state">
        <h3>Subject Not Found</h3>
        <p>{error}</p>
        <Link to="/" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <Link to="/" className="nav-link" style={{ paddingLeft: 0, marginBottom: '0.5rem', display: 'inline-flex' }}>
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
          <h1>{subject.name}</h1>
          <p className="page-subtitle">
            {subject.completedTopics} of {subject.totalTopics} topics completed
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to={`/edit-subject/${id}`} className="btn btn-secondary">
            <Edit3 size={16} />
            <span>Edit Subject</span>
          </Link>
          <button onClick={handleDeleteSubject} className="btn btn-danger">
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Overview Progress Card */}
      <div className="form-card" style={{ maxWidth: '100%', marginBottom: '2rem' }}>
        <ProgressBar
          completed={subject.completedTopics}
          total={subject.totalTopics}
          variant="accent"
          height="14px"
        />
      </div>

      {/* Topics Container */}
      <div className="topics-container">
        <h2 className="section-title" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
          <CheckSquare size={20} color="var(--primary)" />
          <span>Syllabus Topics</span>
        </h2>

        {/* Add Topic Form */}
        <form onSubmit={handleAddTopic} className="add-topic-box">
          <input
            type="text"
            className="form-control"
            placeholder="Add a new topic to this syllabus..."
            value={newTopicTitle}
            onChange={(e) => setNewTopicTitle(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={addingTopic || !newTopicTitle.trim()}>
            <Plus size={16} />
            <span>Add Topic</span>
          </button>
        </form>

        {/* Topics List */}
        {topics.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <p>No topics found for this subject yet. Add one above!</p>
          </div>
        ) : (
          <div>
            {topics.map((topic) => {
              const isEditing = editingTopicId === topic._id;

              return (
                <div
                  key={topic._id}
                  className={`topic-item ${topic.completed ? 'completed' : ''}`}
                >
                  <div className="topic-left">
                    <input
                      type="checkbox"
                      className="topic-checkbox"
                      checked={topic.completed}
                      onChange={() => handleToggleComplete(topic)}
                    />
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        style={{ padding: '0.35rem 0.6rem' }}
                        value={editTopicTitle}
                        onChange={(e) => setEditTopicTitle(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      <span className="topic-title">{topic.title}</span>
                    )}
                  </div>

                  <div className="topic-actions">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleSaveTopicEdit(topic._id)}
                          className="action-btn-subtle"
                          title="Save"
                          style={{ color: 'var(--success)' }}
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => setEditingTopicId(null)}
                          className="action-btn-subtle"
                          title="Cancel"
                        >
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditTopic(topic)}
                          className="action-btn-subtle"
                          title="Edit Topic"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteTopic(topic._id)}
                          className="action-btn-subtle delete"
                          title="Delete Topic"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectDetail;
