import { useEffect, useState } from 'react';
import './EpisodePlayer.css';

interface EpisodePlayerProps {
  type: 'soundcloud' | 'mixcloud';
  url: string;
  episodeTitle: string;
  showName?: string;
  onClose: () => void;
}

export function EpisodePlayer({ type, url, episodeTitle, onClose }: EpisodePlayerProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Detect if mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Convert URLs to embed URLs
  const getEmbedUrl = (platform: 'soundcloud' | 'mixcloud', sourceUrl: string): string => {
    if (platform === 'soundcloud') {
      // SoundCloud embed URL format: https://w.soundcloud.com/player/?url=<encoded-url>
      // Note: auto_play only works on desktop, not mobile
      const autoPlay = isMobile ? 'false' : 'true';
      return `https://w.soundcloud.com/player/?url=${encodeURIComponent(sourceUrl)}&color=%23ff5500&auto_play=${autoPlay}&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true&buying=false&sharing=false&download=false`;
    } else {
      // MixCloud embed URL format: https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=<path>
      // Extract the path from the MixCloud URL
      const mixcloudPath = sourceUrl.replace('https://www.mixcloud.com/', '');
      return `https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=%2F${encodeURIComponent(mixcloudPath)}`;
    }
  };

  const embedUrl = getEmbedUrl(type, url);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      onClose();
    }, 300); // Match the slideDown animation duration
  };

  // Handle escape key to close and M key to minimize
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMinimize();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [onClose, isMinimized]);

  return (
    <div className={`episode-player ${isMinimized ? 'episode-player--minimized' : ''} ${isClosing ? 'episode-player--closing' : ''}`}>
      <div className="episode-player__content">
        <div className={`episode-player__iframe-wrapper ${isMinimized ? 'episode-player__iframe-wrapper--hidden' : ''}`}>
          <iframe
            width="100%"
            height="120"
            scrolling="no"
            frameBorder="no"
            allow="autoplay; fullscreen; encrypted-media"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox allow-presentation"
            src={embedUrl}
            title={`${type} player for ${episodeTitle}`}
            loading="lazy"
          />
        </div>
        {isMinimized && (
          <div className="episode-player__minimized-content">
            <span className="episode-player__now-playing">Now Playing: {episodeTitle}</span>
          </div>
        )}
        <button
          className="episode-player__minimize"
          onClick={toggleMinimize}
          aria-label={isMinimized ? "Expand player" : "Minimize player"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            {isMinimized ? (
              <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
            ) : (
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
            )}
          </svg>
        </button>
        <button
          className="episode-player__close"
          onClick={handleClose}
          aria-label="Close player"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
