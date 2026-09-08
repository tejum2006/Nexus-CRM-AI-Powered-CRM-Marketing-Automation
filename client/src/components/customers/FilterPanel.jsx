import React from 'react';
import { Filter, X } from 'lucide-react';

const FilterPanel = ({ filters, onFilterChange, onClearFilters }) => {
  const hasActiveFilters = !!(filters.status || filters.segments || filters.tags || filters.industry);

  return (
    <div className="flex items-center gap-2">
      {/* Status filter */}
      <div className="flex items-center gap-2 h-[38px] px-3 rounded-[10px] border"
        style={{ background: 'var(--bg-input)', borderColor: 'var(--border)' }}>
        <Filter size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <select
          className="bg-transparent border-none text-[13px] outline-none cursor-pointer"
          style={{ color: 'var(--text-primary)' }}
          value={filters.status || ''}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
        >
          <option value="">All Statuses</option>
          <option value="Lead">Lead</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Churned">Churned</option>
        </select>
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="flex items-center gap-1.5 h-[38px] px-2.5 rounded-[10px] text-[12.5px] transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <X size={13} />
          <span className="hide-mobile">Clear</span>
        </button>
      )}
    </div>
  );
};

export default FilterPanel;
