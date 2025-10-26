import { createFileRoute } from '@tanstack/react-router';
import { StaffPicksPage } from '../components/staff-picks/StaffPicksPage';

export const Route = createFileRoute('/staff-picks')({
  component: StaffPicksPage,
});
