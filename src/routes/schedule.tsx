import { createFileRoute } from '@tanstack/react-router';
import { ScheduleView } from '../components/schedule/ScheduleView';
import { PageHeader } from '../components/shared/PageHeader';

export const Route = createFileRoute('/schedule')({
  component: SchedulePage,
});

function SchedulePage() {
  return (
    <div className="schedule-page">
      <PageHeader
        title="Radio Schedule"
        subtitle="Explore the schedule today, in the past, or upcoming."
        iconSrc="/Images/Sun1_Dark.webp"
      />

      <ScheduleView />
    </div>
  );
}
