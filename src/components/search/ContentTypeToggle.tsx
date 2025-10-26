import type { ContentType } from '../../types/search';
import './ContentTypeToggle.css';

interface ContentTypeToggleProps {
  selectedTypes: ContentType[];
  onChange: (types: ContentType[]) => void;
}

const contentTypeLabels: Record<ContentType, string> = {
  episodes: 'Episodes',
  shows: 'Shows',
  artists: 'Artists',
};

export function ContentTypeToggle({ selectedTypes, onChange }: ContentTypeToggleProps) {
  const toggleType = (type: ContentType) => {
    if (selectedTypes.includes(type)) {
      // Remove type (but keep at least one selected)
      const newTypes = selectedTypes.filter((t) => t !== type);
      if (newTypes.length > 0) {
        onChange(newTypes);
      }
    } else {
      // Add type
      onChange([...selectedTypes, type]);
    }
  };

  return (
    <div className="content-type-toggle">
      {(Object.keys(contentTypeLabels) as ContentType[]).map((type) => (
        <button
          key={type}
          type="button"
          className={`content-type-toggle__button ${
            selectedTypes.includes(type) ? 'content-type-toggle__button--active' : ''
          }`}
          onClick={() => toggleType(type)}
          aria-pressed={selectedTypes.includes(type)}
        >
          {contentTypeLabels[type]}
        </button>
      ))}
    </div>
  );
}
