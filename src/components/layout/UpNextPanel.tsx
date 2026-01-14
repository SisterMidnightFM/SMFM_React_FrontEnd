import React, { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { fetchRecentNews } from '../../services/news';
import { fetchScheduleForToday, fetchNextUpcomingShow } from '../../services/schedule';
import type { News } from '../../types/news';
import type { Schedule, UpcomingShow } from '../../types/schedule';
import './UpNextPanel.css';

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

export const UpNextPanel: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [nextShow, setNextShow] = useState<UpcomingShow | null>(null);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNews() {
      try {
        setIsLoadingNews(true);
        const data = await fetchRecentNews(4);
        setNews(data);
      } catch (err) {
        console.error('Failed to load news:', err);
        setNewsError('Failed to load news');
      } finally {
        setIsLoadingNews(false);
      }
    }

    async function loadSchedule() {
      try {
        setIsLoadingSchedule(true);
        const data = await fetchScheduleForToday();
        setSchedule(data);

        // If no schedule for today, fetch the next upcoming show
        if (!data || !data.Show_Slots || data.Show_Slots.length === 0) {
          const upcoming = await fetchNextUpcomingShow();
          setNextShow(upcoming);
        }
      } catch (err) {
        console.error('Failed to load schedule:', err);
        setScheduleError('Failed to load schedule');
      } finally {
        setIsLoadingSchedule(false);
      }
    }

    loadNews();
    loadSchedule();
  }, []);

  return (
    <div className="up-next-panel">
      <h2 className="up-next-panel__title">UP NEXT</h2>

      <section className="up-next-panel__section">
        <Link to="/schedule" className="up-next-panel__subtitle-link">
          <h3 className="up-next-panel__subtitle">RADIO SCHEDULE</h3>
        </Link>
        {isLoadingSchedule && <p className="up-next-panel__loading">Loading schedule...</p>}
        {scheduleError && <p className="up-next-panel__error">{scheduleError}</p>}
        {!isLoadingSchedule && !scheduleError && schedule && schedule.Show_Slots && schedule.Show_Slots.length > 0 ? (
          <ul className="up-next-panel__schedule">
            {schedule.Show_Slots.map((slot) => {
              const showName = slot.Show_Name?.ShowName || 'Unknown Show';
              const showSlug = slot.Show_Name?.ShowSlug;
              // Format time from HH:mm:ss.SSS to a readable format (e.g., "2pm")
              const startTime = slot.Start_Time ? formatTime(slot.Start_Time) : '';

              return (
                <li key={slot.id} className="up-next-panel__schedule-item">
                  {showSlug ? (
                    <Link
                      to="/shows/$slug"
                      params={{ slug: showSlug }}
                      className="up-next-panel__show-link"
                    >
                      <span className="up-next-panel__show">{showName}</span>
                    </Link>
                  ) : (
                    <span className="up-next-panel__show">{showName}</span>
                  )}
                  <span className="up-next-panel__time">{startTime}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          !isLoadingSchedule && !scheduleError && (
            nextShow ? (
              <div className="up-next-panel__next-show">
                <span className="up-next-panel__next-label">Next live broadcast will be:</span>
                {nextShow.showSlug ? (
                  <Link
                    to="/shows/$slug"
                    params={{ slug: nextShow.showSlug }}
                    className="up-next-panel__show-link"
                  >
                    <span className="up-next-panel__show">{nextShow.showName}</span>
                  </Link>
                ) : (
                  <span className="up-next-panel__show">{nextShow.showName}</span>
                )}
                <span className="up-next-panel__next-datetime">
                  {nextShow.formattedDate} {nextShow.formattedTime}
                </span>
              </div>
            ) : (
              <p className="up-next-panel__loading">No upcoming shows scheduled</p>
            )
          )
        )}
      </section>

      <div className="up-next-panel__divider"></div>

      <section className="up-next-panel__section">
        <Link to="/news" className="up-next-panel__subtitle-link">
          <h3 className="up-next-panel__subtitle">NEWS</h3>
        </Link>
        {isLoadingNews && <p className="up-next-panel__loading">Loading news...</p>}
        {newsError && <p className="up-next-panel__error">{newsError}</p>}
        {!isLoadingNews && !newsError && (
          <ul className="up-next-panel__news">
            {news.map((item) => (
              <li key={item.id} className="up-next-panel__news-item">
                <Link
                  to="/news/$slug"
                  params={{ slug: item.News_Slug }}
                  className="up-next-panel__news-link"
                >
                  <p className="up-next-panel__news-title">{item.News_Title} →</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
