import { Link } from '@tanstack/react-router';
import { ArtistList } from '../artists/ArtistList';
import { PageHeader } from '../shared/PageHeader';
import { useResidentArtists } from '../../hooks/useResidentArtists';
import './ResidentsPage.css';

export function ResidentsPage() {
  const { data: artists, isLoading, error } = useResidentArtists();

  return (
    <div className="residents-page">
      <PageHeader
        title="RESIDENTS"
        subtitle="The artists and hosts with a regular show on SMFM."
        iconSrc="/Images/Star1_Dark.webp"
      />

      <Link to="/artists" className="residents-page__all-artists">
        <span>SEE ALL ARTISTS</span>
        <img src="/icons/arrow-right.svg" width="20" height="20" alt="" />
      </Link>

      <ArtistList
        artists={artists ?? []}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
