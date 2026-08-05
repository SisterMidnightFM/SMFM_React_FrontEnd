import React, { createContext, useContext, useState, useRef, useEffect, type ReactNode } from 'react';

interface LiveNowResponse {
  success: boolean;
  result?: {
    // 'schedule' | 'defaultPlaylist' | 'offAir'
    status: string;
    content?: {
      title?: string;
      startDateUtc?: string;
      endDateUtc?: string;
    } | null;
    metadata?: {
      title?: string;
      artist?: string | null;
    } | null;
  };
}

interface AudioPlayerContextType {
  isPlaying: boolean;
  isLoading: boolean;
  isOnline: boolean;
  currentShow: string;
  play: () => void;
  pause: () => void;
  toggle: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

// Radio Cult serves a single Icecast stream (no separate low-bitrate mobile URL)
const STREAM_URL = 'https://sister-midnight-fm.radiocult.fm/stream';
const LIVE_NOW_URL = 'https://api.radiocult.fm/api/station/sister-midnight-fm/schedule/live';

export const AudioPlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [currentShow, setCurrentShow] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio(STREAM_URL);
    audio.preload = 'none';
    audioRef.current = audio;

    // Audio event listeners
    const handleCanPlay = () => setIsLoading(false);
    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };
    const handlePause = () => setIsPlaying(false);
    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
      console.error('Audio playback error');
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Fetch station status and current show (one Radio Cult endpoint covers both)
  useEffect(() => {
    const fetchLiveNow = async () => {
      try {
        const response = await fetch(LIVE_NOW_URL);
        const data: LiveNowResponse = await response.json();
        const live = data.result;

        setIsOnline(data.success === true && live?.status !== 'offAir');
        setCurrentShow(live?.content?.title || live?.metadata?.title || 'Sister Midnight FM');
      } catch (error) {
        console.error('Error fetching live now:', error);
        setIsOnline(false);
        setCurrentShow('Sister Midnight FM');
      }
    };

    fetchLiveNow();
    const interval = setInterval(fetchLiveNow, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const play = () => {
    if (audioRef.current && !isPlaying) {
      setIsLoading(true);
      audioRef.current.play().catch(error => {
        console.error('Playback failed:', error);
        setIsLoading(false);
      });
    }
  };

  const pause = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
    }
  };

  const toggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        isPlaying,
        isLoading,
        isOnline,
        currentShow,
        play,
        pause,
        toggle,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = (): AudioPlayerContextType => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};
