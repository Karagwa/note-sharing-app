import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, FileText } from 'lucide-react';
import { notesAPI } from '../../services/api';

const NoteEditor = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    is_public: false,
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const fetchNote = async () => {
    setFetchLoading(true);
    try {
      const response = await notesAPI.getNote(id);
      setFormData({
        title: response.data.title,
        content: response.data.content,
        is_public: response.data.is_public,
      });
    } catch (error) {
      console.error('Failed to fetch note:', error);
      setError('Failed to load note');
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      fetchNote();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isEditMode) {
        await notesAPI.updateNote(id, formData);
      } else {
        await notesAPI.createNote(formData);
      }
      navigate('/notes');
    } catch (error) {
      console.error('Failed to save note:', error);
      setError(error.response?.data?.detail || 'Failed to save note');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Discard changes?')) {
      navigate('/');
    }
  };

  if (fetchLoading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading note...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="editor-container">
        <div className="editor-header">
          <div className="editor-title-section">
            <FileText size={32} className="editor-icon" />
            <h1>{isEditMode ? 'Edit Note' : 'Create New Note'}</h1>
          </div>
          <div className="editor-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-outline"
            >
              <X size={18} />
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner-small"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Note
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="editor-form">
          <div className="form-group">
            <label htmlFor="title" className="label">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="input input-lg"
              placeholder="Enter note title..."
              value={formData.title}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="content" className="label">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              className="textarea"
              placeholder="Write your note content here..."
              value={formData.content}
              onChange={handleChange}
              required
              rows={15}
            />
            <p className="character-count">
              {formData.content.length} characters
            </p>
          </div>

          <div className="form-group-checkbox">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_public"
                checked={formData.is_public}
                onChange={handleChange}
                className="checkbox"
              />
              <span>Make this note public</span>
            </label>
            <p className="input-hint">
              Public notes can be discovered by other users
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteEditor;