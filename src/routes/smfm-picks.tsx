import { createFileRoute } from '@tanstack/react-router';
import { SMFMPicksPage } from '../components/smfm-picks/SMFMPicksPage';

export const Route = createFileRoute('/smfm-picks')({
  component: SMFMPicksPage,
});
