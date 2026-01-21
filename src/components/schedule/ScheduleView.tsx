import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { useSchedule } from '../../hooks/useSchedule';
import './ScheduleView.css';

/**
 * Format date from YYYY-MM-DD to readable format (e.g., "Monday, January 15, 2024")
 */
function formatDateLong(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date to YYYY-MM-DD
 */
function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format time from HH:mm:ss.SSS to readable format (e.g., "2pm", "10am")
 */
function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);

  if (hour === 0) {
    return '12am';
  } else if (hour < 12) {
    return `${hour}${minutes !== '00' ? ':' + minutes : ''}am`;
  } else if (hour === 12) {
    return `12${minutes !== '00' ? ':' + minutes : ''}pm`;
  } else {
    return `${hour - 12}${minutes !== '00' ? ':' + minutes : ''}pm`;
  }
}

/**
 * Check if a date is today
 */
function isToday(dateString: string): boolean {
  const today = formatDateISO(new Date());
  return dateString === today;
}

/**
 * Check if a date is in the past (before today)
 */
function isDateInPast(dateString: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(dateString + 'T00:00:00');
  return targetDate < today;
}

export function ScheduleView() {
  const [selectedDate, setSelectedDate] = useState<string>(formatDateISO(new Date()));
  const { schedule, isLoading, error, prefetchAdjacentDays } = useSchedule(selectedDate);

  // Prefetch adjacent days when date changes
  useEffect(() => {
    prefetchAdjacentDays(selectedDate);
  }, [selectedDate, prefetchAdjacentDays]);

  // Navigation handlers
  const goToPreviousDay = () => {
    const currentDate = new Date(selectedDate + 'T00:00:00');
    currentDate.setDate(currentDate.getDate() - 1);
    setSelectedDate(formatDateISO(currentDate));
  };

  const goToNextDay = () => {
    const currentDate = new Date(selectedDate + 'T00:00:00');
    currentDate.setDate(currentDate.getDate() + 1);
    setSelectedDate(formatDateISO(currentDate));
  };

  const goToToday = () => {
    setSelectedDate(formatDateISO(new Date()));
  };

  return (
    <div className="schedule-view">
      {/* Date Navigation */}
      <div className="schedule-view__navigation">
        <button
          onClick={goToPreviousDay}
          className="schedule-view__nav-btn"
          aria-label="Previous day"
        >
          ← Previous Day
        </button>

        <div className="schedule-view__date">
          <h2>{formatDateLong(selectedDate)}</h2>
          {!isToday(selectedDate) && (
            <button onClick={goToToday} className="schedule-view__today-btn">
              Jump to Today
            </button>
          )}
        </div>

        <button
          onClick={goToNextDay}
          className="schedule-view__nav-btn"
          aria-label="Next day"
        >
          Next Day →
        </button>
      </div>

      {/* Schedule Content */}
      <div className="schedule-view__content">
        {isLoading && (
          <div className="schedule-view__loading">
            <p>Loading schedule...</p>
          </div>
        )}

        {error && (
          <div className="schedule-view__error">
            <p>Failed to load schedule</p>
          </div>
        )}

        {!isLoading && !error && !schedule && (
          <div className="schedule-view__empty">
            {isDateInPast(selectedDate) ? (
              <p>
                No episodes were recorded for this date. Check out the{' '}
                <Link to="/episodes" className="schedule-view__archive-link">
                  episode archive
                </Link>
              </p>
            ) : (
              <p>
                SMFM broadcasts Tuesday to Thursday. There's nothing to see here but check out the{' '}
                <Link to="/episodes" className="schedule-view__archive-link">
                  episode archive
                </Link>
              </p>
            )}
          </div>
        )}

        {!isLoading && !error && schedule && schedule.Show_Slots && schedule.Show_Slots.length > 0 && (
          <div className="schedule-view__schedule">
            <ul className="schedule-view__slots">
              {schedule.Show_Slots.map((slot) => {
                const startTime = slot.Start_Time ? formatTime(slot.Start_Time) : '';
                const endTime = slot.End_Time ? formatTime(slot.End_Time) : '';

                // For past dates with episode data (no times shown)
                if (slot.episode) {
                  return (
                    <li key={slot.id} className="schedule-view__slot schedule-view__slot--episode">
                      <div className="schedule-view__show-info">
                        <Link
                          to="/episodes/$slug"
                          params={{ slug: slot.episode.EpisodeSlug }}
                          className="schedule-view__episode-link"
                        >
                          {slot.episode.EpisodeTitle}
                        </Link>
                        {slot.episode.showSlug ? (
                          <Link
                            to="/shows/$slug"
                            params={{ slug: slot.episode.showSlug }}
                            className="schedule-view__show-subtext"
                          >
                            {slot.episode.showName}
                          </Link>
                        ) : (
                          <span className="schedule-view__show-subtext">
                            {slot.episode.showName}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                }

                // For future dates (show name only)
                const showName = slot.Show_Name?.ShowName || 'Unknown Show';
                const showSlug = slot.Show_Name?.ShowSlug;

                return (
                  <li key={slot.id} className="schedule-view__slot">
                    <div className="schedule-view__time-range">
                      <span className="schedule-view__start-time">{startTime}</span>
                      {endTime && (
                        <>
                          <span className="schedule-view__time-separator">-</span>
                          <span className="schedule-view__end-time">{endTime}</span>
                        </>
                      )}
                    </div>
                    <div className="schedule-view__show-info">
                      {showSlug ? (
                        <Link
                          to="/shows/$slug"
                          params={{ slug: showSlug }}
                          className="schedule-view__show-link"
                        >
                          {showName}
                        </Link>
                      ) : (
                        <span className="schedule-view__show-name">{showName}</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
