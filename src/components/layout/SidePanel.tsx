import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import './SidePanel.css';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  side: 'left' | 'right';
  isMobile: boolean;
  children: React.ReactNode;
}

export const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose, side, isMobile, children }) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const showCloseButton = side === 'right' && isMobile;

  const swipeHandlers = useSwipeable({
    onSwiping: (eventData) => {
      if (!isOpen || !isMobile) return;

      const { deltaX } = eventData;

      if (side === 'left' && deltaX < 0) {
        setIsSwiping(true);
        setSwipeOffset(deltaX);
      } else if (side === 'right' && deltaX > 0) {
        setIsSwiping(true);
        setSwipeOffset(deltaX);
      }
    },
    onSwipedLeft: () => {
      if (side === 'left' && isOpen && isMobile && Math.abs(swipeOffset) > 50) {
        onClose();
      }
      setIsSwiping(false);
      setSwipeOffset(0);
    },
    onSwipedRight: () => {
      if (side === 'right' && isOpen && isMobile && swipeOffset > 50) {
        onClose();
      }
      setIsSwiping(false);
      setSwipeOffset(0);
    },
    onTouchEndOrOnMouseUp: () => {
      setIsSwiping(false);
      setSwipeOffset(0);
    },
    delta: 10,
    trackMouse: false,
    trackTouch: true,
    preventScrollOnSwipe: false,
    swipeDuration: 500,
  });

  const panelStyle: React.CSSProperties = isSwiping
    ? {
        transform: `translateX(${swipeOffset}px)`,
        transition: 'none',
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
