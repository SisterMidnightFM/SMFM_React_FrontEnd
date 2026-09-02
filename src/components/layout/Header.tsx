import React, { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { useEpisodePlayer } from '../../hooks/useEpisodePlayer';
import './Header.css';

/** Keep in sync with the show-name animation duration in Header.css */
const SHOW_NAME_ANIMATION_MS = 450;

/**
 * The show name, scrolling the old name up and out and the new one in from
 * below whenever what's broadcasting changes
 */
const ShowName: React.FC<{ name: string }> = ({ name }) => {
  const [state, setState] = useState({ current: name, previous: null as string | null, version: 0 });

  useEffect(() => {
    setState((prev) =>
      prev.current === name
        ? prev
        : { current: name, previous: prev.current, version: prev.version + 1 }
    );
  }, [name]);

  // Drop the outgoing name once it has scrolled away
  useEffect(() => {
    if (state.previous === null) return;

    const timeout = setTimeout(() => {
      setState((prev) => ({ ...prev, previous: null }));
    }, SHOW_NAME_ANIMATION_MS);

    return () => clearTimeout(timeout);
  }, [state.version, state.previous]);

  return (
    <span className="header__show-name">
      {state.previous !== null && (
        <span
          key={`out-${state.version}`}
          className="header__show-name-text header__show-name-text--out"
          aria-hidden="true"
        >
          {state.previous}
        </span>
      )}
      <span
        key={`in-${state.version}`}
        className={`header__show-name-text${state.version > 0 ? ' header__show-name-text--in' : ''}`}
      >
        {state.current}
      </span>
    </span>
  );
};

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
          <ShowName name={currentShow || 'Sister Midnight FM'} />
        </div>
      </div>

      <div className="header__buttons">
        <Link
          to="/chatroom"
          className="header__chat-button"
        >
          <span>CHAT ROOM</span>
        </Link>
        <a
          href="https://sistermidnightfm.setmore.com"
          target="_blank"
          rel="noopener noreferrer"
          className="header__book-button"
        >
          <span>BOOK STUDIO</span>
        </a>
      </div>
    </header>
  );
};
