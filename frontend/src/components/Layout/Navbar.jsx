import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Plus, StickyNote, Home } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <StickyNote size={28} />
          <span>NoteShare</span>
        </Link>

        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link to="/notes" className="navbar-link">
                <Home size={18} />
                My Notes
              </Link>
              <Link to="/notes/new" className="btn btn-primary btn-sm">
                <Plus size={18} />
                New Note
              </Link>

              <div className="navbar-user">
                <span className="user-name">{user?.username}</span>
                <button onClick={handleLogout} className="btn btn-outline btn-sm">
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/" className="navbar-link active">
                Home
              </Link>
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;