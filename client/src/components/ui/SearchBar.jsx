import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ onSearch, placeholder = 'Search...', className = '' }) => {
  const [value, setValue] = React.useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
    onSearch(e.target.value);
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div className={`search-bar ${className}`}>
      <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoComplete="off"
      />
      {value && (
        <button
          onClick={handleClear}
          className="flex-shrink-0 transition-colors"
          style={{ color: 'var(--text-muted)' }}
          aria-label="Clear search"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
