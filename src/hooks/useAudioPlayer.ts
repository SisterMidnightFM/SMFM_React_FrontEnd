import { createContext, useContext } from 'react';

export interface AudioPlayerContextType {
  isPlaying: boolean;
  isLoading: boolean;
  isOnline: boolean;
  currentShow: string;
  play: () => void;
  pause: () => void;
  toggle: () => void;
}

// Lives here rather than alongside the provider so that AudioPlayerContext.tsx
// exports only a component, which is what React Fast Refresh needs
export const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const useAudioPlayer = (): AudioPlayerContextType => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};
