import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface EpisodePlayerState {
  type: 'soundcloud' | 'mixcloud';
  url: string;
  episodeTitle: string;
  showName?: string;
}

interface EpisodePlayerContextType {
  activePlayer: EpisodePlayerState | null;
  openPlayer: (type: 'soundcloud' | 'mixcloud', url: string, episodeTitle: string, showName?: string) => void;
  closePlayer: () => void;
}

const EpisodePlayerContext = createContext<EpisodePlayerContextType | undefined>(undefined);

export const EpisodePlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activePlayer, setActivePlayer] = useState<EpisodePlayerState | null>(null);

  const openPlayer = (type: 'soundcloud' | 'mixcloud', url: string, episodeTitle: string, showName?: string) => {
    // If a player is already open, close it first
    if (activePlayer) {
      setActivePlayer(null);
      // Wait for unmount before opening new player
      setTimeout(() => {
        setActivePlayer({ type, url, episodeTitle, showName });
      }, 100);
    } else {
      setActivePlayer({ type, url, episodeTitle, showName });
    }
  };

  const closePlayer = () => {
    setActivePlayer(null);
  };

  return (
    <EpisodePlayerContext.Provider
      value={{
        activePlayer,
        openPlayer,
        closePlayer,
      }}
    >
      {children}
    </EpisodePlayerContext.Provider>
  );
};

export const useEpisodePlayer = (): EpisodePlayerContextType => {
  const context = useContext(EpisodePlayerContext);
  if (context === undefined) {
    throw new Error('useEpisodePlayer must be used within an EpisodePlayerProvider');
  }
  return context;
};
