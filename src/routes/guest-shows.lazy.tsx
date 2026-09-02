import { createLazyFileRoute } from '@tanstack/react-router';
import { GuestShowsPage } from '../components/guest-shows/GuestShowsPage';

export const Route = createLazyFileRoute('/guest-shows')({
  component: GuestShowsPage,
});
