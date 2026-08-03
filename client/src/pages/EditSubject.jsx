import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Edit3, BookOpen } from 'lucide-react';
import api from '../api/axios';

const EditSubject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [topics, setTopics] = useState([]);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subjRes, topicsRes] = await Promise.all([
        api.get(`/subjects/${id}`),
        api.get(`/topics/${id}`),
      ]);
      setName(subjRes.data.name);
      setTopics(topicsRes.data);
      setError('');
    } catch (err) {
      console.error('Failed to load subject for editing:', err);
      setError('Subject not found or failed to load.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleTopicTitleChange = (topicId, newTitle) => {
    setTopics(topics.map(t => t._id === topicId ? { ...t, title: newTitle } : t));
  };

  const handleAddNewTopic = async () => {
    if (!newTopicTitle.trim()) return;
    try {
      const res = await api.post('/topics', {
        subjectId: id,
        title: newTopicTitle.trim(),
      });
      setTopics([...topics, res.data]);
      setNewTopicTitle('');
    } catch (err) {
      console.error('Failed to add topic:', err);
      alert('Failed to add topic.');
    }
  };

  const handleDeleteTopic = async (topicId) => {
    try {
      await api.delete(`/topics/${topicId}`);
      setTopics(topics.filter(t => t._id !== topicId));
    } catch (err) {
      console.error('Failed to delete topic:', err);
      alert('Failed to delete topic.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Subject name is required.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      // Update subject name
      await api.put(`/subjects/${id}`, { name: name.trim() });

      // Save updated titles for existing topics
      for (const topic of topics) {
        if (topic.title && topic.title.trim()) {
          await api.put(`/topics/${topic._id}`, { title: topic.title.trim() });
        }
      }

      navigate(`/subject/${id}`);
    } catch (err) {
      console.error('Failed to save subject updates:', err);
      setError('Failed to save updates. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <Link to={`/subject/${id}`} className="nav-link" style={{ paddingLeft: 0, marginBottom: '0.5rem', display: 'inline-flex' }}>
            <ArrowLeft size={16} />
            <span>Back to Subject</span>
          </Link>
          <h1>Edit Subject</h1>
          <p className="page-subtitle">Update subject name and manage topics.</p>
        </div>
      </div>

      <div className="form-card">
        {error && (
          <div className="empty-state" style={{ borderColor: 'var(--danger)', padding: '1rem', marginBottom: '1.5rem' }}>
            <p style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Subject Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Manage Topics ({topics.length})</label>
            
            {/* Quick Add Topic in Edit Mode */}
            <div className="add-topic-box" style={{ marginTop: '0.5rem' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Add new topic title..."
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleAddNewTopic}
                disabled={!newTopicTitle.trim()}
              >
                <Plus size={16} />
                <span>Add</span>
              </button>
            </div>

            <div className="dynamic-topics-list">
              {topics.map((topic) => (
                <div key={topic._id} className="dynamic-topic-row">
                  <input
                    type="text"
                    className="form-control"
                    value={topic.title}
                    onChange={(e) => handleTopicTitleChange(topic._id, e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-icon-only"
                    onClick={() => handleDeleteTopic(topic._id)}
                    title="Delete topic"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              style={{ flex: 1 }}
            >
              <Save size={18} />
              <span>{saving ? 'Saving Changes...' : 'Save Changes'}</span>
            </button>
            <Link to={`/subject/${id}`} className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSubject;
