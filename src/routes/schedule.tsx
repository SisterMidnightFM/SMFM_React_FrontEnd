import { createFileRoute } from '@tanstack/react-router';
import { ScheduleView } from '../components/schedule/ScheduleView';

export const Route = createFileRoute('/schedule')({
  component: SchedulePage,
});

function SchedulePage() {
  return (
    <div className="schedule-page">
      <header className="schedule-page__header">
        <h1>Radio Schedule</h1>
      </header>

      <ScheduleView />
    </div>
  );
}
