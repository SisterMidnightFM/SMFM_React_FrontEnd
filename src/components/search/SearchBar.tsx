import './SearchBar.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, onClear, placeholder = 'Search shows, episodes, artists...' }: SearchBarProps) {
  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-bar__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
      />
      {value && (
        <button
          type="button"
          className="search-bar__clear"
          onClick={onClear}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
