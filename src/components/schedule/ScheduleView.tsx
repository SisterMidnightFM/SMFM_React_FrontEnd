import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { fetchScheduleByDate } from '../../services/schedule';
import type { Schedule } from '../../types/schedule';
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

export function ScheduleView() {
  const [selectedDate, setSelectedDate] = useState<string>(formatDateISO(new Date()));
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load schedule when date changes
  useEffect(() => {
    async function loadSchedule() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchScheduleByDate(selectedDate);
        setSchedule(data);
      } catch (err) {
        console.error('Failed to load schedule:', err);
        setError('Failed to load schedule');
      } finally {
        setIsLoading(false);
      }
    }

    loadSchedule();
  }, [selectedDate]);

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
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && !schedule && (
          <div className="schedule-view__empty">
            <p>No schedule published for this date.</p>
          </div>
        )}

        {!isLoading && !error && schedule && schedule.Show_Slots && schedule.Show_Slots.length > 0 && (
          <div className="schedule-view__schedule">
            <ul className="schedule-view__slots">
              {schedule.Show_Slots.map((slot) => {
                const showName = slot.Show_Name?.ShowName || 'Unknown Show';
                const showSlug = slot.Show_Name?.ShowSlug;
                const startTime = slot.Start_Time ? formatTime(slot.Start_Time) : '';
                const endTime = slot.End_Time ? formatTime(slot.End_Time) : '';

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
