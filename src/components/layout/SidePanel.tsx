import React from 'react';
import './SidePanel.css';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  side: 'left' | 'right';
  children: React.ReactNode;
}

export const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose, side, children }) => {
  const showCloseButton = side === 'right' && window.innerWidth < 1024;

  return (
    <aside
      className={`side-panel side-panel--${side} ${isOpen ? 'side-panel--open' : ''}`}
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
