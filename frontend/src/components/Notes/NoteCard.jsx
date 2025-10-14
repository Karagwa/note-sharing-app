import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Share2, Clock, Calendar } from 'lucide-react';
import { notesAPI } from '../../services/api';
import ShareNote from './ShareNote';

const NoteCard = ({ note, onUpdate }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/notes/${note.id}/edit`);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await notesAPI.deleteNote(note.id);
      onUpdate();
    } catch (error) {
      console.error('Failed to delete note:', error);
      alert('Failed to delete note. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  return (
    <>
      <div className="note-card">
        <div className="note-card-header">
          <h3 className="note-card-title">{note.title}</h3>
          <div className="note-card-actions">
            <button
              onClick={() => setShowShareModal(true)}
              className="icon-btn icon-btn-share"
              title="Share note"
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={handleEdit}
              className="icon-btn icon-btn-edit"
              title="Edit note"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={handleDelete}
              className="icon-btn icon-btn-delete"
              title="Delete note"
              disabled={isDeleting}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="note-card-content">
          <p>{note.content.substring(0, 150)}{note.content.length > 150 ? '...' : ''}</p>
        </div>

        <div className="note-card-footer">
          <div className="note-meta">
            <span className="meta-item">
              <Calendar size={14} />
              {formatDate(note.created_at)}
            </span>
            <span className="meta-item">
              <Clock size={14} />
              {formatTime(note.created_at)}
            </span>
          </div>
          {note.share_token && (
            <span className="badge badge-shared">Shared</span>
          )}
        </div>
      </div>

      {showShareModal && (
        <ShareNote
          note={note}
          onClose={() => setShowShareModal(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};

export default NoteCard;