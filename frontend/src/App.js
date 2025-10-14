import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import Home from './components/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import NoteList from './components/Notes/NoteList';
import NoteEditor from './components/Notes/NoteEditor';
import SharedNote from './components/Shared/SharedNote';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import './App.css';

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/shared/:token" element={<SharedNote />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                {/* Protected Routes */}
                <Route
                  path="/notes"
                  element={
                    <ProtectedRoute>
                      <NoteList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notes/new"
                  element={
                    <ProtectedRoute>
                      <NoteEditor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notes/:id/edit"
                  element={
                    <ProtectedRoute>
                      <NoteEditor />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;