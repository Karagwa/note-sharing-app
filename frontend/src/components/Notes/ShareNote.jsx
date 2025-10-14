import React, { useState, useEffect } from 'react';
import { X, Copy, Share2, Link as LinkIcon, CheckCircle, XCircle } from 'lucide-react';
import { sharingAPI } from '../../services/api';

const ShareNote = ({ note, onClose, onUpdate }) => {
  const [shareData, setShareData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const fetchShareInfo = async () => {
    try {
      const response = await sharingAPI.getShareInfo(note.id);
      setShareData(response.data);
    } catch (error) {
      console.error('Failed to fetch share info:', error);
    }
  };

  useEffect(() => {
    if (note.share_token) {
      fetchShareInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note.share_token]);

  const handleGenerateLink = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await sharingAPI.generateShareLink(note.id);
      setShareData(response.data);
      onUpdate();
    } catch (error) {
      console.error('Failed to generate share link:', error);
      setError('Failed to generate share link');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (shareData?.share_url) {
      try {
        await navigator.clipboard.writeText(shareData.share_url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy:', error);
        alert('Failed to copy link');
      }
    }
  };

  const handleRevokeLink = async () => {
    if (!window.confirm('Are you sure you want to revoke this share link? The link will no longer work.')) {
      return;
    }

    setLoading(true);
    try {
      await sharingAPI.revokeShareLink(note.id);
      setShareData(null);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Failed to revoke share link:', error);
      setError('Failed to revoke share link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Share2 size={24} className="modal-icon" />
            <h2>Share Note</h2>
          </div>
          <button onClick={onClose} className="modal-close">
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="share-note-info">
            <h3>{note.title}</h3>
            <p className="text-muted">{note.content.substring(0, 100)}...</p>
          </div>

          {shareData ? (
            <>
              <div className="share-link-section">
                <label className="label">
                  <LinkIcon size={16} />
                  Share Link
                </label>
                <div className="share-link-input-group">
                  <input
                    type="text"
                    className="input"
                    value={shareData.share_url}
                    readOnly
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`btn ${copied ? 'btn-success' : 'btn-secondary'}`}
                  >
                    {copied ? (
                      <>
                        <CheckCircle size={18} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="input-hint">
                  Anyone with this link can view your note
                </p>
              </div>

              <div className="share-actions">
                <button
                  onClick={handleRevokeLink}
                  className="btn btn-outline-danger"
                  disabled={loading}
                >
                  <XCircle size={18} />
                  Revoke Link
                </button>
              </div>
            </>
          ) : (
            <div className="no-share-link">
              <p>This note hasn't been shared yet.</p>
              <button
                onClick={handleGenerateLink}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner-small"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <LinkIcon size={18} />
                    Generate Share Link
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareNote;