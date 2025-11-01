import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { fetchEpisodes, fetchStaffPickEpisodes } from '../../services/episodes';
import { fetchShows } from '../../services/shows';
import { fetchArtists } from '../../services/artists';
import './ExplorePanel.css';

interface ExplorePanelProps {
  onClose?: () => void;
}

export const ExplorePanel: React.FC<ExplorePanelProps> = ({ onClose }) => {
  const [isArchiveExpanded, setIsArchiveExpanded] = useState(false);
  const queryClient = useQueryClient();

  const toggleArchive = () => {
    setIsArchiveExpanded(!isArchiveExpanded);
  };

  // Prefetch handlers for each route
  const prefetchEpisodes = () => {
    queryClient.prefetchInfiniteQuery({
      queryKey: ['episodes'],
      queryFn: () => fetchEpisodes(1, 10),
      initialPageParam: 1,
    });
  };

  const prefetchShows = () => {
    queryClient.prefetchInfiniteQuery({
      queryKey: ['shows'],
      queryFn: () => fetchShows(1, 10),
      initialPageParam: 1,
    });
  };

  const prefetchArtists = () => {
    queryClient.prefetchInfiniteQuery({
      queryKey: ['artists'],
      queryFn: () => fetchArtists(1, 10),
      initialPageParam: 1,
    });
  };

  const prefetchStaffPicks = () => {
    queryClient.prefetchQuery({
      queryKey: ['episodes', 'staff-picks'],
      queryFn: fetchStaffPickEpisodes,
    });
  };

  return (
    <nav className="explore-panel">
      <div className="explore-panel__home">
        <Link to="/" className="explore-panel__home-button" onClick={onClose}>HOME</Link>
      </div>

      <div className="explore-panel__section">
        <button
          className="explore-panel__heading explore-panel__heading--clickable"
          onClick={toggleArchive}
          aria-expanded={isArchiveExpanded}
        >
          <span>EXPLORE ARCHIVE</span>
          <span className="explore-panel__heading-icon">{isArchiveExpanded ? '−' : '+'}</span>
        </button>
        {isArchiveExpanded && (
          <ul className="explore-panel__list">
            <li><Link to="/smfm-picks" className="explore-panel__link" onClick={onClose} onMouseEnter={prefetchStaffPicks}>• SMFM PICKS</Link></li>
            <li><Link to="/episodes" className="explore-panel__link" onClick={onClose} onMouseEnter={prefetchEpisodes}>• EPISODES</Link></li>
            <li><Link to="/shows" className="explore-panel__link" onClick={onClose} onMouseEnter={prefetchShows}>• SHOWS</Link></li>
            <li><Link to="/artists" className="explore-panel__link" onClick={onClose} onMouseEnter={prefetchArtists}>• ARTISTS</Link></li>
            <li><Link to="/search" className="explore-panel__link" onClick={onClose}>• SMART SEARCH</Link></li>
          </ul>
        )}
      </div>

      <div className="explore-panel__section">
        <ul className="explore-panel__main-links">
          <li><Link to="/about" className="explore-panel__main-link" onClick={onClose}>ABOUT</Link></li>
          <li><Link to="/schedule" className="explore-panel__main-link" onClick={onClose}>SCHEDULE</Link></li>
          <li><Link to="/news" className="explore-panel__main-link" onClick={onClose}>NEWS</Link></li>
          <li><Link to="/contact" className="explore-panel__main-link" onClick={onClose}>CONTACT</Link></li>
          <li>
            <a
              href="https://www.sistermidnight.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="explore-panel__main-link"
            >
              SISTER MIDNIGHT&nbsp;↗
            </a>
          </li>
        </ul>
      </div>

    </nav>
  );
};
