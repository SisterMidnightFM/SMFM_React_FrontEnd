import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/search')({
  validateSearch: (search: Record<string, unknown>) => {
    return search;
  },
});
