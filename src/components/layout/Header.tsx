import React from 'react';
import { Link } from '@tanstack/react-router';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';
import { useEpisodePlayer } from '../../contexts/EpisodePlayerContext';
import './Header.css';

export const Header: React.FC = () => {
  const { isPlaying, isLoading, isOnline, currentShow, toggle } = useAudioPlayer();
  const { closePlayer } = useEpisodePlayer();

  const handleToggle = () => {
    // Close episode player when main radio is played
    if (!isPlaying) {
      closePlayer();
    }
    toggle();
  };

  return (
    <header className="header">
      <div className="header__logo">
        <Link to="/">
          <img
            src="/Images/Wide Logo Brown.webp"
            alt="Sister Midnight FM"
          />
        </Link>
      </div>

      <div className="header__live-now">
        <button
          className="header__play-button"
          onClick={handleToggle}
          disabled={isLoading}
          aria-label={isPlaying ? 'Pause live stream' : 'Play live stream'}
        >
          {isLoading ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="header__spinner">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </svg>
          ) : isPlaying ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
        <div className="header__live-info">
          <span className="header__live-label">
            {isOnline ? (
              <>
                LIVE NOW <span className="header__live-indicator"></span>
              </>
            ) : (
              'OFFLINE'
            )}
          </span>
          <span className="header__show-name">{currentShow || 'Sister Midnight FM'}</span>
        </div>
      </div>

      <Link
        to="/chatroom"
        className="header__chat-button"
      >
        <span>CHAT ROOM</span>
      </Link>
    </header>
  );
};
