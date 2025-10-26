import { useState } from 'react';
import type { DateRange } from '../../types/search';
import './DateRangePicker.css';

interface DateRangePickerProps {
  dateRange: DateRange;
  onChange: (dateRange: DateRange) => void;
  onClear: () => void;
}

export function DateRangePicker({ dateRange, onChange, onClear }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleStartDateChange = (date: string) => {
    onChange({
      ...dateRange,
      start: date || null,
    });
  };

  const handleEndDateChange = (date: string) => {
    onChange({
      ...dateRange,
      end: date || null,
    });
  };

  const handleClear = () => {
    onClear();
    setIsOpen(false);
  };

  const formatDateForDisplay = (date: string | null): string => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const displayText = () => {
    if (dateRange.start && dateRange.end) {
      return `${formatDateForDisplay(dateRange.start)} - ${formatDateForDisplay(dateRange.end)}`;
    } else if (dateRange.start) {
      return `From ${formatDateForDisplay(dateRange.start)}`;
    } else if (dateRange.end) {
      return `Until ${formatDateForDisplay(dateRange.end)}`;
    }
    return 'Select broadcast date range';
  };

  return (
    <div className="date-range-picker">
      <button
        type="button"
        className={`date-range-picker__toggle ${dateRange.start || dateRange.end ? 'date-range-picker__toggle--active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {displayText()}
      </button>

      {isOpen && (
        <div className="date-range-picker__dropdown">
          <div className="date-range-picker__inputs">
            <div className="date-range-picker__field">
              <label htmlFor="start-date" className="date-range-picker__label">
                Start Date
              </label>
              <input
                type="date"
                id="start-date"
                className="date-range-picker__input"
                value={dateRange.start || ''}
                onChange={(e) => handleStartDateChange(e.target.value)}
              />
            </div>

            <div className="date-range-picker__field">
              <label htmlFor="end-date" className="date-range-picker__label">
                End Date
              </label>
              <input
                type="date"
                id="end-date"
                className="date-range-picker__input"
                value={dateRange.end || ''}
                onChange={(e) => handleEndDateChange(e.target.value)}
              />
            </div>
          </div>

          <div className="date-range-picker__actions">
            <button
              type="button"
              className="date-range-picker__clear"
              onClick={handleClear}
            >
              Clear
            </button>
            <button
              type="button"
              className="date-range-picker__apply"
              onClick={() => setIsOpen(false)}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
