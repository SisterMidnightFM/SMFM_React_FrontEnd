import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import './SidePanel.css';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  side: 'left' | 'right';
  children: React.ReactNode;
}

export const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose, side, children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const showCloseButton = side === 'right' && isMobile;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const swipeHandlers = useSwipeable({
    onSwiping: (eventData) => {
      if (!isOpen || !isMobile) return;

      const { deltaX } = eventData;

      // Left panel: allow negative deltaX (swiping left)
      // Right panel: allow positive deltaX (swiping right)
      if (side === 'left' && deltaX < 0) {
        setIsSwiping(true);
        setSwipeOffset(deltaX); // Negative value moves panel left
      } else if (side === 'right' && deltaX > 0) {
        setIsSwiping(true);
        setSwipeOffset(deltaX); // Positive value moves panel right
      }
    },
    onSwipedLeft: () => {
      // Left panel (Explore) closes when swiped left
      if (side === 'left' && isOpen && isMobile && Math.abs(swipeOffset) > 50) {
        onClose();
      }
      setIsSwiping(false);
      setSwipeOffset(0);
    },
    onSwipedRight: () => {
      // Right panel (Up Next) closes when swiped right
      if (side === 'right' && isOpen && isMobile && swipeOffset > 50) {
        onClose();
      }
      setIsSwiping(false);
      setSwipeOffset(0);
    },
    onTouchEndOrOnMouseUp: () => {
      // Reset if swipe doesn't meet threshold
      setIsSwiping(false);
      setSwipeOffset(0);
    },
    delta: 10, // Lower threshold for starting to track
    trackMouse: false,
    trackTouch: true,
    preventScrollOnSwipe: false,
    swipeDuration: 500,
  });

  const panelStyle: React.CSSProperties = isSwiping
    ? {
        transform: `translateX(${swipeOffset}px)`,
        transition: 'none', // No transition while actively swiping
      }
    : {};

  return (
    <aside
      {...(isMobile ? swipeHandlers : {})}
      className={`side-panel side-panel--${side} ${isOpen ? 'side-panel--open' : ''}`}
      style={panelStyle}
      aria-hidden={!isOpen}
    >
      {isOpen && showCloseButton && (
        <button
          className={`side-panel__close side-panel__close--${side}`}
          onClick={onClose}
          aria-label="Close panel"
        >
          ✕
        </button>
      )}
      <div className="side-panel__content">
        {children}
      </div>
    </aside>
  );
};
