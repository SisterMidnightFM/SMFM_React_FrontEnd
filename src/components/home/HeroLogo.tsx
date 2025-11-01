import React, { useState, useEffect, useRef } from 'react';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';
import './HeroLogo.css';

// Possible rotation angles for stop-motion effect
const ROTATION_ANGLES = [-15, -10, -5, 0, 5, 10, 15, -12, 8, -8, 12];

// Generate random position offset with wider variation
const getRandomOffset = () => {
  return Math.random() * 20 - 10; // -10% to +10%
};

// Star configuration with randomized positions and sizes
const generateStarConfig = () => [
  {
    src: '/Images/Star1_Dark.webp',
    size: 65,
    position: {
      top: `${15 + getRandomOffset()}%`,
      left: `${20 + getRandomOffset()}%`
    },
    mobilePosition: { top: '8%', left: '10%' }, // Top-left on mobile
    id: 'star-1'
  },
  {
    src: '/Images/Star2_Dark.webp',
    size: 50,
    position: {
      top: `${60 + getRandomOffset()}%`,
      right: `${15 + getRandomOffset()}%`
    },
    mobilePosition: null, // Hidden on mobile
    id: 'star-2'
  },
  {
    src: '/Images/Star3_Dark.webp',
    size: 75,
    position: {
      bottom: `${20 + getRandomOffset()}%`,
      left: `${25 + getRandomOffset()}%`
    },
    mobilePosition: { bottom: '8%', right: '10%' }, // Bottom-right on mobile
    id: 'star-3'
  }
];

export const HeroLogo: React.FC = () => {
  const { isPlaying } = useAudioPlayer();
  const [isStopping, setIsStopping] = useState(false);
  const [stars] = useState(generateStarConfig());
  const [starRotations, setStarRotations] = useState<number[]>([0, 0, 0]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const wasPlayingRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Track mobile/desktop breakpoint
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Jitter effect - randomly change rotation at intervals
  useEffect(() => {
    const changeRotation = () => {
      setStarRotations([
        ROTATION_ANGLES[Math.floor(Math.random() * ROTATION_ANGLES.length)],
        ROTATION_ANGLES[Math.floor(Math.random() * ROTATION_ANGLES.length)],
        ROTATION_ANGLES[Math.floor(Math.random() * ROTATION_ANGLES.length)]
      ]);
    };

    // Initial rotation
    changeRotation();

    // Change rotation every 200-400ms for choppy effect
    intervalRef.current = setInterval(() => {
      changeRotation();
    }, 300 + Math.random() * 300);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Detect when playback stops
    if (wasPlayingRef.current && !isPlaying) {
      setIsStopping(true);
      // Reset stopping state after animation completes
      const timer = setTimeout(() => {
        setIsStopping(false);
      }, 3000); // Match the spinStop animation duration
      return () => clearTimeout(timer);
    }

    // Update ref for next render
    wasPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Determine which class to apply
  const getImageClass = () => {
    if (isPlaying) return 'hero-logo__image--spinning';
    if (isStopping) return 'hero-logo__image--stopping';
    return '';
  };

  return (
    <div className="hero-logo">
      {/* Animated decorative stars */}
      {stars.map((star, index) => {
        // Use mobile position if on mobile, otherwise use desktop position
        const position = isMobile && star.mobilePosition
          ? star.mobilePosition
          : star.position;

        // Hide star-2 on mobile (it has null mobilePosition)
        if (isMobile && !star.mobilePosition) {
          return null;
        }

        return (
          <img
            key={star.id}
            src={star.src}
            alt=""
            className="hero-logo__star"
            data-star-id={star.id}
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              transform: isMobile
                ? `rotate(${starRotations[index]}deg) scale(0.6)`
                : `rotate(${starRotations[index]}deg)`,
              transition: 'none', // Instant jumps, no smooth transitions
              ...position
            }}
          />
        );
      })}

      {/* Main logo */}
      <img
        src="/Images/SMFM LOGO SVG.svg"
        alt="Sister Midnight FM"
        className={`hero-logo__image ${getImageClass()}`}
      />
    </div>
  );
};
