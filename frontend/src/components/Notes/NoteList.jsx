import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, FileText } from 'lucide-react';
import { notesAPI } from '../../services/api';
import NoteCard from './NoteCard';
import './Notes.css';

const NoteList = () => {
  const { data: notes, isLoading, error, refetch } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const response = await notesAPI.getNotes();
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your notes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-container">
          <p>Failed to load notes. Please try again.</p>
          <button onClick={() => refetch()} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">My Notes</h1>
        <p className="page-subtitle">Create, edit, and share your notes</p>
      </div>

      {notes && notes.length === 0 ? (
        <div className="empty-state">
          <FileText size={64} className="empty-icon" />
          <h2>No notes yet</h2>
          <p>Create your first note to get started</p>
          <Link to="/notes/new" className="btn btn-primary">
            <Plus size={18} />
            Create Note
          </Link>
        </div>
      ) : (
        <div className="notes-grid">
          {notes?.map((note) => (
            <NoteCard key={note.id} note={note} onUpdate={refetch} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteList;