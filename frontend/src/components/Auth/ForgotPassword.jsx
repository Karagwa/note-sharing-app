import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import './Auth.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/forgot-password', { email });
      
      if (response.data.ok) {
        setSuccess(true);
        setEmail(''); // Clear the form
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(
        err.response?.data?.detail || 
        'Failed to send reset email. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Back to Login Link */}
        <Link to="/login" className="back-link">
          <ArrowLeft size={18} />
          <span>Back to Login</span>
        </Link>

        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon">
            <Mail size={32} />
          </div>
          <h1 className="auth-title">Forgot Password?</h1>
          <p className="auth-subtitle">
            {success 
              ? "Check your email for reset instructions"
              : "Enter your email and we'll send you a reset link"
            }
          </p>
        </div>

        {/* Success Message */}
        {success ? (
          <div className="success-message">
            <CheckCircle size={48} className="success-icon" />
            <h3>Email Sent!</h3>
            <p>
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="success-note">
              The link will expire in 1 hour. If you don't receive the email, 
              please check your spam folder.
            </p>
            <Link to="/login" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Return to Login
            </Link>
          </div>
        ) : (
          /* Forgot Password Form */
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Error Message */}
            {error && (
              <div className="error-message">
                <span>{error}</span>
              </div>
            )}

            {/* Email Input */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="input-group">
                <Mail size={20} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoFocus
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn btn-primary btn-full"
              disabled={loading || !email}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>

            {/* Additional Info */}
            <div className="auth-footer">
              <p className="info-text">
                Remember your password?{' '}
                <Link to="/login" className="auth-link">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;