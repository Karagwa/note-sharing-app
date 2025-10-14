import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, FileText, Search, X } from 'lucide-react';
import { notesAPI } from '../../services/api';
import NoteCard from './NoteCard';
import './Notes.css';

const NoteList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // Wait 300ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch all notes or search results
  const { data: notes, isLoading, error, refetch } = useQuery({
    queryKey: ['notes', debouncedQuery],
    queryFn: async () => {
      if (debouncedQuery.trim()) {
        setIsSearching(true);
        const response = await notesAPI.searchNotes(debouncedQuery);
        setIsSearching(false);
        return response.data;
      } else {
        setIsSearching(false);
        const response = await notesAPI.getNotes();
        return response.data;
      }
    },
  });

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
  }, []);

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
        <div className="header-content">
          <div>
            <h1 className="page-title">My Notes</h1>
            <p className="page-subtitle">Create, edit, and share your notes</p>
          </div>
          <Link to="/notes/new" className="btn btn-primary">
            <Plus size={18} />
            New Note
          </Link>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search notes by title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>
          {isSearching && (
            <div className="search-loading">
              <div className="spinner-small"></div>
            </div>
          )}
        </div>
      </div>

      {notes && notes.length === 0 ? (
        <div className="empty-state">
          <FileText size={64} className="empty-icon" />
          {debouncedQuery ? (
            <>
              <h2>No results found</h2>
              <p>No notes match "{debouncedQuery}"</p>
              <button onClick={handleClearSearch} className="btn btn-secondary">
                Clear Search
              </button>
            </>
          ) : (
            <>
              <h2>No notes yet</h2>
              <p>Create your first note to get started</p>
              <Link to="/notes/new" className="btn btn-primary">
                <Plus size={18} />
                Create Note
              </Link>
            </>
          )}
        </div>
      ) : (
        <>
          {debouncedQuery && (
            <div className="search-results-info">
              Found {notes?.length} note{notes?.length !== 1 ? 's' : ''} matching "{debouncedQuery}"
            </div>
          )}
          <div className="notes-grid">
            {notes?.map((note) => (
              <NoteCard key={note.id} note={note} onUpdate={refetch} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default NoteList;