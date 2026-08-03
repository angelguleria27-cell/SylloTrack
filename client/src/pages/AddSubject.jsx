import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, BookOpen, Save } from 'lucide-react';
import api from '../api/axios';

const AddSubject = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [topics, setTopics] = useState(['', '']); // Initial 2 empty fields
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTopicChange = (index, value) => {
    const updated = [...topics];
    updated[index] = value;
    setTopics(updated);
  };

  const handleAddTopicField = () => {
    setTopics([...topics, '']);
  };

  const handleRemoveTopicField = (index) => {
    if (topics.length <= 1) return;
    const updated = topics.filter((_, i) => i !== index);
    setTopics(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a subject name.');
      return;
    }

    const validTopics = topics.map(t => t.trim()).filter(t => t.length > 0);

    try {
      setLoading(true);
      setError('');
      await api.post('/subjects', {
        name: name.trim(),
        topics: validTopics,
      });
      navigate('/');
    } catch (err) {
      console.error('Failed to create subject:', err);
      setError(err.response?.data?.message || 'Failed to create subject. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <Link to="/" className="nav-link" style={{ paddingLeft: 0, marginBottom: '0.5rem', display: 'inline-flex' }}>
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
          <h1>Add New Subject</h1>
          <p className="page-subtitle">Enter subject details and syllabus topics to start tracking.</p>
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
            <label className="form-label">Subject Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Data Structures & Algorithms, Physics, Chemistry..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Syllabus Topics</label>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleAddTopicField}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
              >
                <Plus size={14} />
                <span>Add Topic Field</span>
              </button>
            </div>

            <div className="dynamic-topics-list">
              {topics.map((topic, index) => (
                <div key={index} className="dynamic-topic-row">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Topic ${index + 1} (e.g. Binary Search Trees)`}
                    value={topic}
                    onChange={(e) => handleTopicChange(index, e.target.value)}
                  />
                  {topics.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger btn-icon-only"
                      onClick={() => handleRemoveTopicField(index)}
                      title="Remove field"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ flex: 1 }}
            >
              <Save size={18} />
              <span>{loading ? 'Creating Subject...' : 'Create Subject'}</span>
            </button>
            <Link to="/" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubject;
