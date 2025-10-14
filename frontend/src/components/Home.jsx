import React from 'react';
import { Link } from 'react-router-dom';
import { StickyNote, Share2, Lock, Zap, Users, Cloud } from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Share Your Ideas
                <span className="highlight"> Seamlessly</span>
              </h1>
              <p className="hero-subtitle">
                Create, collaborate, and share notes with NoteShare. The modern platform
                for organizing your thoughts and connecting with others.
              </p>
              <div className="hero-actions">
                <Link to="/register" className="btn btn-primary btn-large">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn btn-outline btn-large">
                  Sign In
                </Link>
              </div>
            </div>
            <div className="hero-visual">
              <div className="floating-card primary">
                <StickyNote size={24} />
                <h3>Create Notes</h3>
                <p>Write and format your thoughts beautifully</p>
              </div>
              <div className="floating-card secondary">
                <Share2 size={24} />
                <h3>Share Instantly</h3>
                <p>Share with friends and colleagues in seconds</p>
              </div>
              <div className="floating-card tertiary">
                <Lock size={24} />
                <h3>Private & Secure</h3>
                <p>Your notes are protected and encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose NoteShare?</h2>
            <p>Everything you need to manage and share your notes effectively</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Zap size={32} />
              </div>
              <h3>Lightning Fast</h3>
              <p>Create and access your notes instantly with our optimized platform</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Users size={32} />
              </div>
              <h3>Collaborate</h3>
              <p>Work together with your team on shared notes and projects</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Cloud size={32} />
              </div>
              <h3>Cloud Sync</h3>
              <p>Your notes are automatically synced across all your devices</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Sharing?</h2>
            <p>Join thousands of users who trust NoteShare for their note-taking needs</p>
            <Link to="/register" className="btn btn-primary btn-large">
              Create Your Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
