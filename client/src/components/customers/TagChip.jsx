import React from 'react';
import { X } from 'lucide-react';

const TagChip = ({ name, onRemove }) => (
  <div
    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11.5px] font-medium whitespace-nowrap transition-colors"
    style={{
      background: 'var(--bg-hover)',
      border: '1px solid var(--border)',
      color: 'var(--text-secondary)',
    }}
  >
    <span>#</span>{name}
    {onRemove && (
      <button
        type="button"
        onClick={onRemove}
        className="transition-colors flex items-center"
        style={{ color: 'var(--text-muted)' }}
        onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        aria-label={`Remove tag ${name}`}
      >
        <X size={11} />
      </button>
    )}
  </div>
);

export default TagChip;
