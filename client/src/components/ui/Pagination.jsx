import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
  const startItem = Math.max(1, (currentPage - 1) * itemsPerPage + 1);
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t shrink-0"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>

      {/* Count info */}
      <p className="text-caption">
        {totalItems > 0 ? (
          <>
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{startItem}–{endItem}</span>
            {' of '}
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{totalItems}</span>
            {' results'}
          </>
        ) : (
          'No results'
        )}
      </p>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn btn-outline h-8 w-8 p-0"
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>

        <span className="text-[12.5px] font-medium px-1" style={{ color: 'var(--text-primary)' }}>
          {currentPage} / {totalPages || 1}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="btn btn-outline h-8 w-8 p-0"
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
