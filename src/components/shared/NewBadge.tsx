/**
 * NewBadge component - displays a spiky circular badge with "NEW" text
 * Used to indicate episodes/shows/artists with recent activity (within last 7 days)
 */

import './NewBadge.css';

export function NewBadge() {
  return (
    <div className="new-badge">
      <img
        src="/icons/Star.svg"
        alt=""
        className="new-badge__svg"
        aria-hidden="true"
      />
      <span className="new-badge__text">NEW</span>
    </div>
  );
}
