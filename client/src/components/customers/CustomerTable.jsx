import React from 'react';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
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
      className="cursor-pointer select-none hover:text-white transition-colors"
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-1.5">
        {label}
        <ArrowUpDown
          size={12}
          className={sortConfig?.key === sortKey ? 'text-[var(--brand-primary)]' : 'text-[var(--text-tertiary)]'}
        />
      </div>
    </th>
  );

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th className="w-12 text-center">
              <input type="checkbox" className="rounded border-[var(--border-strong)] bg-transparent cursor-pointer" />
            </th>
            <SortHeader label="Customer" sortKey="name" />
            <SortHeader label="Company" sortKey="company" />
            <SortHeader label="Status" sortKey="status" />
            <th>Segments</th>
            <SortHeader label="Added" sortKey="createdAt" />
            <th className="w-16"></th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <tr key={i}>
                <td className="text-center"><Skeleton className="w-4 h-4 rounded mx-auto" /></td>
                <td>
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                    <div className="flex-1">
                      <Skeleton className="w-24 h-3.5 mb-1.5" />
                      <Skeleton className="w-32 h-3" />
                    </div>
                  </div>
                </td>
                <td>
                  <Skeleton className="w-24 h-3.5 mb-1.5" />
                  <Skeleton className="w-16 h-3" />
                </td>
                <td><Skeleton className="w-16 h-5 rounded-full" /></td>
                <td>
                  <div className="flex gap-1.5">
                    <Skeleton className="w-12 h-5 rounded-full" />
                    <Skeleton className="w-16 h-5 rounded-full" />
                  </div>
                </td>
                <td><Skeleton className="w-20 h-3.5" /></td>
                <td></td>
              </tr>
            ))
          ) : customers.length === 0 ? (
            <tr>
              <td colSpan="7">
                <div className="flex flex-col items-center justify-center py-16 text-[var(--text-tertiary)]">
                  <div className="w-12 h-12 rounded-full bg-[var(--bg-surface-hover)] flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">No customers found</h3>
                  <p className="text-xs">Get started by adding a customer or adjusting your filters.</p>
                </div>
              </td>
            </tr>
          ) : (
            customers.map((customer) => (
              <tr
                key={customer._id}
                className="cursor-pointer group hover:bg-[var(--bg-surface-hover)] transition-colors"
                onClick={() => onRowClick(customer._id)}
              >
                {/* Checkbox */}
                <td className="text-center" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" className="rounded border-[var(--border-strong)] bg-transparent cursor-pointer" />
                </td>

                {/* Customer */}
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20 flex items-center justify-center text-xs font-bold shrink-0">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white group-hover:text-[var(--brand-primary)] transition-colors truncate">
                        {customer.name}
                      </div>
                      <div className="text-xs text-[var(--text-secondary)] truncate">
                        {customer.email}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Company */}
                <td>
                  <div className="text-sm text-white truncate">
                    {customer.company || '—'}
                  </div>
                  {customer.industry && (
                    <div className="text-xs text-[var(--text-secondary)] truncate mt-0.5">
                      {customer.industry}
                    </div>
                  )}
                </td>

                {/* Status */}
                <td>
                  <span className={`badge ${
                    customer.status === 'Active' ? 'badge-success' :
                    customer.status === 'Lead' ? 'badge-blue' :
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
                      <span className="text-xs text-[var(--text-tertiary)]">—</span>
                    )}
                  </div>
                </td>

                {/* Date */}
                <td>
                  <span className="text-sm text-[var(--text-secondary)]">
                    {new Date(customer.createdAt).toLocaleDateString(undefined, {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </span>
                </td>

                {/* Actions */}
                <td>
                  <button
                    className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-white hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.info('Action menu coming soon!');
                    }}
                  >
                    <MoreHorizontal size={16} />
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
