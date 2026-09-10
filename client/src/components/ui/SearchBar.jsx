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
    <div className={`relative flex items-center w-full max-w-md ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={16} className="shrink-0" style={{ color: 'var(--text-tertiary)' }} />
      </div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoComplete="off"
        className="input"
        style={{
          paddingLeft: '2.5rem',
          paddingRight: value ? '2.5rem' : '0.75rem',
          height: '40px',
          width: '100%',
          fontSize: '14px',
        }}
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors z-10"
          style={{ color: 'var(--text-tertiary)' }}
          aria-label="Clear search"
        >
          <X size={14} className="shrink-0" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
