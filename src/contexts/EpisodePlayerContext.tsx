import React, { useState, useCallback, type ReactNode } from 'react';
import { EpisodePlayerContext, type EpisodePlayerState } from '../hooks/useEpisodePlayer';

const STORAGE_KEY = 'smfm_episode_player';
let playerKey = 0;

function loadPersisted(): { player: EpisodePlayerState | null; position: number | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { player: null, position: null };
    const { type, url, episodeTitle, showName, position } = JSON.parse(raw);
    return {
      player: { type, url, episodeTitle, showName, key: ++playerKey },
      position: typeof position === 'number' ? position : null,
    };
  } catch { return { player: null, position: null }; }
}

const persisted = loadPersisted();

export const EpisodePlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activePlayer, setActivePlayer] = useState<EpisodePlayerState | null>(persisted.player);
  const [savedPosition, setSavedPosition] = useState<number | null>(persisted.position);

  const openPlayer = useCallback((type: 'soundcloud' | 'mixcloud', url: string, episodeTitle: string, showName?: string) => {
    playerKey++;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ type, url, episodeTitle, showName }));
    setActivePlayer({ type, url, episodeTitle, showName, key: playerKey });
    setSavedPosition(null);
  }, []);

  const savePosition = useCallback((ms: number) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      data.position = ms;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch { /* ignore */ }
  }, []);

  const closePlayer = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setActivePlayer(null);
    setSavedPosition(null);
  }, []);

  return (
    <EpisodePlayerContext.Provider
      value={{
        activePlayer,
        openPlayer,
        closePlayer,
        savedPosition,
        savePosition,
      }}
    >
      {children}
    </EpisodePlayerContext.Provider>
  );
};
