import { useState, useRef, useEffect } from 'react';
import type { TagGenre, TagMoodVibe, TagTheme } from '../../types/tag';
import './FilterDropdowns.css';

interface FilterDropdownsProps {
  genres: TagGenre[];
  moods: TagMoodVibe[];
  themes: TagTheme[];
  selectedGenreIds: number[];
  selectedMoodIds: number[];
  selectedThemeIds: number[];
  onGenreChange: (ids: number[]) => void;
  onMoodChange: (ids: number[]) => void;
  onThemeChange: (ids: number[]) => void;
  isLoading?: boolean;
}

type DropdownType = 'genre' | 'mood' | 'theme' | null;

export function FilterDropdowns({
  genres,
  moods,
  themes,
  selectedGenreIds,
  selectedMoodIds,
  selectedThemeIds,
  onGenreChange,
  onMoodChange,
  onThemeChange,
  isLoading = false,
}: FilterDropdownsProps) {
  const [openDropdown, setOpenDropdown] = useState<DropdownType>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (type: DropdownType) => {
    setOpenDropdown(openDropdown === type ? null : type);
  };

  const toggleGenre = (id: number) => {
    if (selectedGenreIds.includes(id)) {
      onGenreChange(selectedGenreIds.filter((i) => i !== id));
    } else {
      onGenreChange([...selectedGenreIds, id]);
    }
  };

  const toggleMood = (id: number) => {
    if (selectedMoodIds.includes(id)) {
      onMoodChange(selectedMoodIds.filter((i) => i !== id));
    } else {
      onMoodChange([...selectedMoodIds, id]);
    }
  };

  const toggleTheme = (id: number) => {
    if (selectedThemeIds.includes(id)) {
      onThemeChange(selectedThemeIds.filter((i) => i !== id));
    } else {
      onThemeChange([...selectedThemeIds, id]);
    }
  };

  const getDropdownLabel = (type: DropdownType, count: number): string => {
    const labels = {
      genre: 'Genre',
      mood: 'Mood',
      theme: 'Theme',
    };

    if (!type) return '';
    const label = labels[type];
    return count > 0 ? `${label} (${count})` : label;
  };

  if (isLoading) {
    return (
      <div className="filter-dropdowns">
        <div className="filter-dropdowns__loading">Loading filters...</div>
      </div>
    );
  }

  return (
    <div className="filter-dropdowns" ref={dropdownRef}>
      {/* Genre Dropdown */}
      <div className="filter-dropdowns__item">
        <button
          type="button"
          className={`filter-dropdowns__button ${selectedGenreIds.length > 0 ? 'filter-dropdowns__button--active' : ''}`}
          onClick={() => toggleDropdown('genre')}
        >
          {getDropdownLabel('genre', selectedGenreIds.length)}
          <span className="filter-dropdowns__arrow">{openDropdown === 'genre' ? '▲' : '▼'}</span>
        </button>

        {openDropdown === 'genre' && (
          <div className="filter-dropdowns__dropdown">
            {genres.length === 0 ? (
              <div className="filter-dropdowns__empty">No genres available</div>
            ) : (
              genres.map((genre) => (
                <label key={genre.id} className="filter-dropdowns__option">
                  <input
                    type="checkbox"
                    checked={selectedGenreIds.includes(genre.id)}
                    onChange={() => toggleGenre(genre.id)}
                  />
                  <span>{genre.Genre}</span>
                </label>
              ))
            )}
          </div>
        )}
      </div>

      {/* Mood Dropdown */}
      <div className="filter-dropdowns__item">
        <button
          type="button"
          className={`filter-dropdowns__button ${selectedMoodIds.length > 0 ? 'filter-dropdowns__button--active' : ''}`}
          onClick={() => toggleDropdown('mood')}
        >
          {getDropdownLabel('mood', selectedMoodIds.length)}
          <span className="filter-dropdowns__arrow">{openDropdown === 'mood' ? '▲' : '▼'}</span>
        </button>

        {openDropdown === 'mood' && (
          <div className="filter-dropdowns__dropdown">
            {moods.length === 0 ? (
              <div className="filter-dropdowns__empty">No moods available</div>
            ) : (
              moods.map((mood) => (
                <label key={mood.id} className="filter-dropdowns__option">
                  <input
                    type="checkbox"
                    checked={selectedMoodIds.includes(mood.id)}
                    onChange={() => toggleMood(mood.id)}
                  />
                  <span>{mood.Mood_or_Vibe}</span>
                </label>
              ))
            )}
          </div>
        )}
      </div>

      {/* Theme Dropdown */}
      <div className="filter-dropdowns__item">
        <button
          type="button"
          className={`filter-dropdowns__button ${selectedThemeIds.length > 0 ? 'filter-dropdowns__button--active' : ''}`}
          onClick={() => toggleDropdown('theme')}
        >
          {getDropdownLabel('theme', selectedThemeIds.length)}
          <span className="filter-dropdowns__arrow">{openDropdown === 'theme' ? '▲' : '▼'}</span>
        </button>

        {openDropdown === 'theme' && (
          <div className="filter-dropdowns__dropdown">
            {themes.length === 0 ? (
              <div className="filter-dropdowns__empty">No themes available</div>
            ) : (
              themes.map((theme) => (
                <label key={theme.id} className="filter-dropdowns__option">
                  <input
                    type="checkbox"
                    checked={selectedThemeIds.includes(theme.id)}
                    onChange={() => toggleTheme(theme.id)}
                  />
                  <span>{theme.Theme}</span>
                </label>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
