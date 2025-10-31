import { useNavigate } from '@tanstack/react-router';
import { fetchArtists } from '../../services/artists';
import { fetchShows } from '../../services/shows';
import { fetchEpisodes } from '../../services/episodes';
import './LuckyDipButton.css';

export const LuckyDipButton: React.FC<{
  children: React.ReactNode;
  onClose?: () => void;
}> = ({
  children,
  onClose
}) => {
  const navigate = useNavigate();

  const handleLuckyDip = async (e: React.MouseEvent) => {
    e.preventDefault();

    // Close the panel if onClose is provided
    onClose?.();

    try {
      // Randomly choose between artists, shows, or episodes
      const type = ['artists', 'shows', 'episodes'][Math.floor(Math.random() * 3)];

      if (type === 'artists') {
        const { artists } = await fetchArtists(1, 100);
        if (artists.length > 0) {
          const randomArtist = artists[Math.floor(Math.random() * artists.length)];
          navigate({
            to: '/artists/$slug',
            params: { slug: randomArtist.Artist_Slug }
          });
        }
      } else if (type === 'shows') {
        const { shows } = await fetchShows(1, 100);
        if (shows.length > 0) {
          const randomShow = shows[Math.floor(Math.random() * shows.length)];
          navigate({
            to: '/shows/$slug',
            params: { slug: randomShow.ShowSlug }
          });
        }
      } else {
        const { episodes } = await fetchEpisodes(1, 100);
        if (episodes.length > 0) {
          const randomEpisode = episodes[Math.floor(Math.random() * episodes.length)];
          navigate({
            to: '/episodes/$slug',
            params: { slug: randomEpisode.EpisodeSlug }
          });
        }
      }
    } catch (error) {
      console.error('Lucky dip error:', error);
    }
  };

  return (
    <button onClick={handleLuckyDip} className="lucky-dip-button">
      {children}
    </button>
  );
};
