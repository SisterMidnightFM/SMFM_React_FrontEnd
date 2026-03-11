import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface EpisodePlayerState {
  type: 'soundcloud' | 'mixcloud';
  url: string;
  episodeTitle: string;
  showName?: string;
  key: number; // Forces remount on player switch
}

interface EpisodePlayerContextType {
  activePlayer: EpisodePlayerState | null;
  openPlayer: (type: 'soundcloud' | 'mixcloud', url: string, episodeTitle: string, showName?: string) => void;
  closePlayer: () => void;
}

const EpisodePlayerContext = createContext<EpisodePlayerContextType | undefined>(undefined);

let playerKey = 0;

export const EpisodePlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activePlayer, setActivePlayer] = useState<EpisodePlayerState | null>(null);

  const openPlayer = useCallback((type: 'soundcloud' | 'mixcloud', url: string, episodeTitle: string, showName?: string) => {
    playerKey++;
    setActivePlayer({ type, url, episodeTitle, showName, key: playerKey });
  }, []);

  const closePlayer = useCallback(() => {
    setActivePlayer(null);
  }, []);

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
