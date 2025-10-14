import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FileText, Calendar, Clock, Home, Share2 } from 'lucide-react';
import { sharingAPI } from '../../services/api';
import '../Notes/Notes.css';

const SharedNote = () => {
  const { token } = useParams();

  const { data: note, isLoading, error } = useQuery({
    queryKey: ['sharedNote', token],
    queryFn: async () => {
      const response = await sharingAPI.getSharedNote(token);
      return response.data;
    },
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading shared note...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-container">
          <FileText size={64} className="error-icon" />
          <h2>Note Not Found</h2>
          <p>This shared note doesn't exist or has been removed.</p>
          <Link to="/" className="btn btn-primary">
            <Home size={18} />
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="shared-note-container">
        <div className="shared-note-header">
          <div className="shared-badge">
            <Share2 size={20} />
            <span>Shared Note</span>
          </div>
          <Link to="/" className="btn btn-outline btn-sm">
            <Home size={16} />
            Home
          </Link>
        </div>

        <div className="shared-note-card">
          <div className="shared-note-title-section">
            <FileText size={32} className="note-icon" />
            <h1 className="shared-note-title">{note.title}</h1>
          </div>

          <div className="shared-note-meta">
            <span className="meta-item">
              <Calendar size={16} />
              Created {formatDate(note.created_at)}
            </span>
            <span className="meta-item">
              <Clock size={16} />
              {formatTime(note.created_at)}
            </span>
          </div>

          <div className="shared-note-content">
            <pre className="note-content-text">{note.content}</pre>
          </div>
        </div>

        <div className="shared-note-footer">
          <p className="text-muted">
            💡 Want to create your own notes?{' '}
            <Link to="/register" className="auth-link">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SharedNote;