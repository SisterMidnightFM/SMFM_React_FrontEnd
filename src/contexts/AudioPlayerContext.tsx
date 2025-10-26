import React, { createContext, useContext, useState, useRef, useEffect, type ReactNode } from 'react';

interface RadioStatus {
  status: string;
}

interface CurrentTrackData {
  title: string;
  start_time: string;
  artwork_urls: {
    standard: string;
    large: string;
  };
  track_artist: string;
  track_title: string;
}

interface CurrentTrackResponse {
  data: CurrentTrackData;
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

const STREAM_URLS = {
  standard: 'https://stream.radio.co/s35e4926a1/listen',
  mobile: 'https://stream.radio.co/s35e4926a1/low',
};

// Detect if mobile device (for stream selection)
const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const AudioPlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [currentShow, setCurrentShow] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    const streamUrl = isMobileDevice() ? STREAM_URLS.mobile : STREAM_URLS.standard;
    const audio = new Audio(streamUrl);
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

  // Fetch station status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('https://public.radio.co/stations/s35e4926a1/status');
        const data: RadioStatus = await response.json();
        setIsOnline(data.status === 'online');
      } catch (error) {
        console.error('Error fetching station status:', error);
        setIsOnline(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Fetch current track/show
  useEffect(() => {
    const fetchCurrentTrack = async () => {
      try {
        const response = await fetch('https://public.radio.co/api/v2/s35e4926a1/track/current');
        const result: CurrentTrackResponse = await response.json();
        setCurrentShow(result.data.title || 'Sister Midnight FM');
      } catch (error) {
        console.error('Error fetching current track:', error);
        setCurrentShow('Sister Midnight FM');
      }
    };

    fetchCurrentTrack();
    const interval = setInterval(fetchCurrentTrack, 10000); // Update every 10 seconds

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
