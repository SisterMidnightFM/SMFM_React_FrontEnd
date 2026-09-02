import { createLazyFileRoute } from '@tanstack/react-router';
import { ResidentsPage } from '../components/residents/ResidentsPage';

export const Route = createLazyFileRoute('/residents')({
  component: ResidentsPage,
});
