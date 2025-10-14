import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import './Auth.css';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Redirect if no token
    if (!token) {
      navigate('/forgot-password');
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const validatePassword = () => {
    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validatePassword()) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/reset-password', {
        token: token,
        new_password: formData.newPassword
      });

      if (response.data.ok) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError(
        err.response?.data?.detail || 
        'Failed to reset password. The link may have expired.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon">
            <Lock size={32} />
          </div>
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">
            {success 
              ? "Your password has been reset successfully"
              : "Enter your new password"
            }
          </p>
        </div>

        {/* Success Message */}
        {success ? (
          <div className="success-message">
            <CheckCircle size={48} className="success-icon" />
            <h3>Password Reset!</h3>
            <p>
              Your password has been changed successfully.
            </p>
            <p className="success-note">
              You will be redirected to the login page in a few seconds...
            </p>
            <Link to="/login" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Go to Login
            </Link>
          </div>
        ) : (
          /* Reset Password Form */
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Error Message */}
            {error && (
              <div className="error-message">
                <span>{error}</span>
              </div>
            )}

            {/* New Password Input */}
            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">
                New Password
              </label>
              <div className="input-group">
                <Lock size={20} className="input-icon" />
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  autoFocus
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <small className="form-hint">Must be at least 6 characters</small>
            </div>

            {/* Confirm Password Input */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <div className="input-group">
                <Lock size={20} className="input-icon" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex="-1"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn btn-primary btn-full"
              disabled={loading || !formData.newPassword || !formData.confirmPassword}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Resetting...
                </>
              ) : (
                'Reset Password'
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

export default ResetPassword;