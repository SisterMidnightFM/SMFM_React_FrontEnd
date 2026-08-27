import React from 'react';
import { Link } from '@tanstack/react-router';
import type { LinkProps } from '@tanstack/react-router';
import './SeeMoreCard.css';

interface SeeMoreCardProps {
  /** The page this carousel's "see more" leads to */
  to: LinkProps['to'];
  /** Accessible name, e.g. "See more guest shows" */
  ariaLabel: string;
  onMouseEnter?: () => void;
}

/**
 * Tile that sits at the end of a home page carousel and links to the full page
 */
export const SeeMoreCard: React.FC<SeeMoreCardProps> = ({ to, ariaLabel, onMouseEnter }) => (
  <Link to={to} className="see-more-card" aria-label={ariaLabel} onMouseEnter={onMouseEnter}>
    <span className="see-more-card__icon">
      <img src="/icons/arrow-right.svg" width="24" height="24" alt="" />
    </span>
    <span className="see-more-card__label">SEE MORE</span>
  </Link>
);
