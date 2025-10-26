export async function fetchEpisodeBySlug(slug: string) {
  // Example implementation
  const response = await fetch(`/api/episodes/${slug}`);
  if (!response.ok) {
    throw new Error('Failed to fetch episode');
  }
  return response.json();
}