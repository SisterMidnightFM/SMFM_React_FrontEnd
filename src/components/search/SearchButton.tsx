import './SearchButton.css';

interface SearchButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function SearchButton({ onClick, disabled = false, isLoading = false }: SearchButtonProps) {
  return (
    <button
      type="button"
      className="search-button"
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? 'Searching...' : 'Search'}
    </button>
  );
}
