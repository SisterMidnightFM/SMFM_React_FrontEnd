import { useEpisodePlayer } from '../../contexts/EpisodePlayerContext';
import { EpisodePlayer } from './EpisodePlayer';

export function GlobalEpisodePlayer() {
  const { activePlayer, closePlayer, savedPosition, savePosition } = useEpisodePlayer();

  if (!activePlayer) {
    return null;
  }

  return (
    <EpisodePlayer
      key={activePlayer.key}
      type={activePlayer.type}
      url={activePlayer.url}
      episodeTitle={activePlayer.episodeTitle}
      showName={activePlayer.showName}
      onClose={closePlayer}
      savedPosition={savedPosition}
      onPositionUpdate={savePosition}
    />
  );
}
