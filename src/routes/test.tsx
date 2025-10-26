import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { EpisodeCard } from '../components/episodes/EpisodeCard'
import { ArtistCard } from '../components/artists/ArtistCard'
import { ShowCard } from '../components/shows/ShowCard'
import { NewsCard } from '../components/news/NewsCard'
import type { Episode } from '../types/episode'
import type { Artist } from '../types/artist'
import type { Show } from '../types/show'
import type { News } from '../types/news'
import '../components/home/HomeSection.css'

// Use the environment variable
const token = import.meta.env.VITE_STRAPI_API_TOKEN;

export const Route = createFileRoute('/test')({
  component: RouteComponent,
})

function RouteComponent() {
  const [episode, setEpisode] = useState<Episode | null>(null)
  const [artist, setArtist] = useState<Artist | null>(null)
  const [show, setShow] = useState<Show | null>(null)
  const [news, setNews] = useState<News | null>(null)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch one episode
        const episodeRes = await fetch('http://localhost:1337/api/episodes?populate=*&pagination[limit]=1&sort=BroadcastDateTime:desc', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const episodeData = await episodeRes.json();
        if (episodeData.data && episodeData.data.length > 0) {
          setEpisode(episodeData.data[0]);
        }

        // Fetch multiple episodes for carousel
        const episodesRes = await fetch('http://localhost:1337/api/episodes?populate=*&pagination[limit]=10&sort=BroadcastDateTime:desc', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const episodesData = await episodesRes.json();
        if (episodesData.data && episodesData.data.length > 0) {
          setEpisodes(episodesData.data);
        }

        // Fetch one artist
        const artistRes = await fetch('http://localhost:1337/api/artists?populate=*&pagination[limit]=1', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const artistData = await artistRes.json();
        if (artistData.data && artistData.data.length > 0) {
          setArtist(artistData.data[0]);
        }

        // Fetch one show
        const showRes = await fetch('http://localhost:1337/api/shows?populate=*&pagination[limit]=1', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const showData = await showRes.json();
        if (showData.data && showData.data.length > 0) {
          setShow(showData.data[0]);
        }

        // Fetch one news item
        const newsRes = await fetch('http://localhost:1337/api/news?populate=*&pagination[limit]=1', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const newsData = await newsRes.json();
        if (newsData.data && newsData.data.length > 0) {
          setNews(newsData.data[0]);
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
  if (error) return <div style={{ padding: '2rem' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', color: 'var(--Colour2)' }}>Card Component Test Page</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {episode && (
          <div>
            <h2 style={{ marginBottom: '1rem', color: 'var(--Colour2)' }}>Episode Card</h2>
            <EpisodeCard episode={episode} />
          </div>
        )}

        {artist && (
          <div>
            <h2 style={{ marginBottom: '1rem', color: 'var(--Colour2)' }}>Artist Card</h2>
            <ArtistCard artist={artist} />
          </div>
        )}

        {show && (
          <div>
            <h2 style={{ marginBottom: '1rem', color: 'var(--Colour2)' }}>Show Card</h2>
            <ShowCard show={show} />
          </div>
        )}

        {news && (
          <div>
            <h2 style={{ marginBottom: '1rem', color: 'var(--Colour2)' }}>News Card</h2>
            <NewsCard news={news} />
          </div>
        )}
      </div>

      {/* Carousel Section */}
      <section className="home-section" style={{ marginTop: '4rem' }}>
        <div className="home-section__header">
          <span className="home-section__icon" aria-hidden="true">🌙</span>
          <h2 className="home-section__title">EPISODES CAROUSEL</h2>
        </div>
        <div className="home-section__cards">
          {episodes.map((ep) => (
            <EpisodeCard key={ep.id} episode={ep} />
          ))}
        </div>
      </section>
    </div>
  );
}
