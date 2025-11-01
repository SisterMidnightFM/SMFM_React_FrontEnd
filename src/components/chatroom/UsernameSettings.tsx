import { useState } from 'react';
import { getUsername, updateUsername } from '../../services/chat';
import './UsernameSettings.css';

export function UsernameSettings() {
  const [username, setUsername] = useState(getUsername() || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUsername(username.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update username:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setUsername(getUsername() || '');
    setIsEditing(false);
  };

  const displayName = username.trim() || 'Anonymous';

  if (!isEditing) {
    return (
      <div className="username-settings">
        <div className="username-settings__display">
          <span className="username-settings__label">Chatting as:</span>
          <span className="username-settings__name">{displayName}</span>
          <button
            className="username-settings__edit-btn"
            onClick={() => setIsEditing(true)}
            aria-label="Edit username"
          >
            Edit Username
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="username-settings username-settings--editing">
      <div className="username-settings__form">
        <label htmlFor="username-input" className="username-settings__label">
          Username:
        </label>
        <input
          id="username-input"
          type="text"
          className="username-settings__input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSave();
            } else if (e.key === 'Escape') {
              handleCancel();
            }
          }}
          placeholder="Enter username"
          maxLength={30}
          autoFocus
          disabled={isSaving}
        />
        <div className="username-settings__actions">
          <button
            className="username-settings__save-btn"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            className="username-settings__cancel-btn"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
