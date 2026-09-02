import React, { useState, useRef, useEffect, type ReactNode } from 'react';
import { useLiveNow } from '../hooks/useLiveNow';
import { AudioPlayerContext } from '../hooks/useAudioPlayer';

// Radio Cult serves a single Icecast stream (no separate low-bitrate mobile URL)
const STREAM_URL = 'https://sister-midnight-fm.radiocult.fm/stream';

export const AudioPlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Station status and current show name (cached and polled by TanStack Query)
  const { isOnline, showName: currentShow } = useLiveNow();

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
