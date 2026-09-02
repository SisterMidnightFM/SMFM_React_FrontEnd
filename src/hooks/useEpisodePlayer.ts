import { createContext, useContext } from 'react';

export interface EpisodePlayerState {
  type: 'soundcloud' | 'mixcloud';
  url: string;
  episodeTitle: string;
  showName?: string;
  key: number; // Forces remount on player switch
}

export interface EpisodePlayerContextType {
  activePlayer: EpisodePlayerState | null;
  openPlayer: (type: 'soundcloud' | 'mixcloud', url: string, episodeTitle: string, showName?: string) => void;
  closePlayer: () => void;
  savedPosition: number | null;
  savePosition: (ms: number) => void;
}

// Lives here rather than alongside the provider so that EpisodePlayerContext.tsx
// exports only a component, which is what React Fast Refresh needs
export const EpisodePlayerContext = createContext<EpisodePlayerContextType | undefined>(undefined);

export const useEpisodePlayer = (): EpisodePlayerContextType => {
  const context = useContext(EpisodePlayerContext);
  if (context === undefined) {
    throw new Error('useEpisodePlayer must be used within an EpisodePlayerProvider');
  }
  return context;
};
