import { createLazyFileRoute } from '@tanstack/react-router';
import { SMFMPicksPage } from '../components/smfm-picks/SMFMPicksPage';

export const Route = createLazyFileRoute('/smfm-picks')({
  component: SMFMPicksPage,
});
