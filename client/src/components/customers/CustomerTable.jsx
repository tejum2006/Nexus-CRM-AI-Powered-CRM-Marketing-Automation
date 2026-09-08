import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import SegmentBadge from './SegmentBadge';
import { useToast } from '../../context/ToastContext';

const CustomerTable = ({
  customers = [],
  loading = false,
  onRowClick,
  onSort,
  sortConfig,
  availableSegments = []
}) => {
  const { toast } = useToast();

  const getSegmentColor = (segName) => {
    const seg = availableSegments.find(s => s.name === segName);
    return seg ? seg.color : '#9ca3af';
  };

  const SortHeader = ({ label, sortKey }) => (
    <th
      className="cursor-pointer select-none"
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-1.5">
        {label}
        <ArrowUpDown
          size={11}
          style={{ color: sortConfig?.key === sortKey ? 'var(--gold)' : 'var(--text-faint)' }}
        />
      </div>
    </th>
  );

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th style={{ width: '44px' }}>
              <input
                type="checkbox"
                className="rounded"
                style={{
                  accentColor: 'var(--gold)',
                  background: 'var(--bg-input)',
                  cursor: 'pointer',
                }}
              />
            </th>
            <SortHeader label="Customer" sortKey="name" />
            <SortHeader label="Company" sortKey="company" />
            <SortHeader label="Status" sortKey="status" />
            <th>Segments</th>
            <SortHeader label="Added" sortKey="createdAt" />
            <th style={{ width: '52px' }} />
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <tr key={i}>
                <td><Skeleton className="w-4 h-4 rounded" /></td>
                <td>
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div>
                      <Skeleton className="w-28 h-3.5 mb-1.5" />
                      <Skeleton className="w-36 h-3" />
                    </div>
                  </div>
                </td>
                <td><Skeleton className="w-24 h-3.5" /></td>
                <td><Skeleton className="w-16 h-5 rounded-full" /></td>
                <td><div className="flex gap-1.5"><Skeleton className="w-14 h-5 rounded-full" /><Skeleton className="w-14 h-5 rounded-full" /></div></td>
                <td><Skeleton className="w-20 h-3.5" /></td>
                <td />
              </tr>
            ))
          ) : customers.length === 0 ? (
            <tr>
              <td colSpan="7">
                <div className="empty-state">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-1"
                    style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)' }}>
                    <svg className="w-5 h-5" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-heading">No customers found</h3>
                  <p className="text-caption max-w-xs">
                    Get started by adding a customer or adjusting your filters.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            customers.map((customer) => (
              <tr
                key={customer._id}
                className="table-row cursor-pointer group"
                onClick={() => onRowClick(customer._id)}
              >
                {/* Checkbox */}
                <td onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="rounded"
                    style={{ accentColor: 'var(--gold)', cursor: 'pointer' }}
                  />
                </td>

                {/* Customer */}
                <td>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0"
                      style={{
                        background: 'var(--gold-dim)',
                        border: '1px solid var(--gold-border)',
                        color: 'var(--gold-light)',
                      }}
                    >
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13.5px] font-medium truncate transition-colors"
                        style={{ color: 'var(--text-primary)' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}
                      >
                        {customer.name}
                      </div>
                      <div className="text-[12px] truncate" style={{ color: 'var(--text-muted)' }}>
                        {customer.email}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Company */}
                <td>
                  <div className="text-[13.5px]" style={{ color: 'var(--text-primary)' }}>
                    {customer.company || '—'}
                  </div>
                  {customer.industry && (
                    <div className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                      {customer.industry}
                    </div>
                  )}
                </td>

                {/* Status */}
                <td>
                  <span className={`badge ${
                    customer.status === 'Active'   ? 'badge-jade' :
                    customer.status === 'Lead'     ? 'badge-copper' :
                    'badge-neutral'
                  }`}>
                    {customer.status}
                  </span>
                </td>

                {/* Segments */}
                <td>
                  <div className="flex flex-wrap gap-1.5">
                    {customer.segments?.slice(0, 2).map((seg, i) => (
                      <SegmentBadge key={i} name={seg} color={getSegmentColor(seg)} />
                    ))}
                    {customer.segments?.length > 2 && (
                      <span className="badge badge-neutral">+{customer.segments.length - 2}</span>
                    )}
                    {(!customer.segments || customer.segments.length === 0) && (
                      <span style={{ color: 'var(--text-faint)', fontSize: '13px' }}>—</span>
                    )}
                  </div>
                </td>

                {/* Date */}
                <td>
                  <span className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
                    {new Date(customer.createdAt).toLocaleDateString(undefined, {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </span>
                </td>

                {/* Actions */}
                <td>
                  <button
                    className="btn btn-ghost h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.info('Action menu coming soon!');
                    }}
                    aria-label="More actions"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;
