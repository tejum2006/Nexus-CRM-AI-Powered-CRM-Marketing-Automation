import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Megaphone, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as campaignService from '../services/campaignService';
import SearchBar from '../components/ui/SearchBar';
import Pagination from '../components/ui/Pagination';
import Skeleton from '../components/ui/Skeleton';

const STATUS_FILTERS = ['', 'Draft', 'Scheduled', 'Active', 'Completed'];

const getStatusBadge = (status) => {
  const map = { 
    Active: 'badge-success', 
    Scheduled: 'badge-blue', 
    Completed: 'badge-neutral', 
    Draft: 'badge-neutral' 
  };
  return map[status] || 'badge-neutral';
};

const Campaigns = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const limit = 10;

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const data = await campaignService.getCampaigns({ page, limit, search, status: statusFilter, sort: '-createdAt' });
      if (data.success) {
        setCampaigns(data.data.campaigns);
        setTotalPages(data.data.pagination.pages);
        setTotalItems(data.data.pagination.total);
      }
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  return (
    <div className="page-scroll flex flex-col" style={{ height: 'calc(100vh - var(--header-height))', gap: '24px' }}>
      {/* Header */}
      <div className="page-header shrink-0">
        <div>
          <h1 className="heading-1 mb-1">Campaigns</h1>
          <p className="text-body">Create, schedule, and track your marketing campaigns.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-primary" onClick={() => navigate('/campaigns/new')}>
            <Plus size={16} />
            <span className="hidden sm:inline">New Campaign</span>
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="card flex flex-col flex-1 min-h-0 overflow-hidden">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-b border-[var(--border-subtle)] shrink-0 w-full" style={{ padding: '24px' }}>
          <SearchBar
            onSearch={(t) => { setSearch(t); setPage(1); }}
            placeholder="Search campaigns…"
            className="flex-1 sm:max-w-xs"
          />

          {/* Status segmented control */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--bg-surface-hover)]">
            {STATUS_FILTERS.map(status => (
              <button
                key={status}
                onClick={() => { setStatusFilter(status); setPage(1); }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  statusFilter === status 
                    ? 'bg-[var(--bg-app)] text-white shadow-sm' 
                    : 'text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                {status || 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto bg-[var(--bg-app)]">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th className="py-3 px-6 text-left">Campaign</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Type</th>
                  <th className="py-3 px-6 text-left">Target Audience</th>
                  <th className="py-3 px-6 text-left">Performance</th>
                  <th className="py-3 px-6 text-right">Created</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="py-4 px-6"><Skeleton className="w-48 h-5" /></td>
                      <td className="py-4 px-6"><Skeleton className="w-20 h-6 rounded-full" /></td>
                      <td className="py-4 px-6"><Skeleton className="w-16 h-5" /></td>
                      <td className="py-4 px-6"><Skeleton className="w-32 h-5" /></td>
                      <td className="py-4 px-6"><Skeleton className="w-40 h-5" /></td>
                      <td className="py-4 px-6"><div className="flex justify-end"><Skeleton className="w-24 h-5" /></div></td>
                    </tr>
                  ))
                ) : campaigns.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-16">
                      <div className="flex flex-col items-center">
                        <Megaphone size={36} className="text-[var(--text-tertiary)] mb-4" />
                        <p className="text-white font-bold text-lg">No campaigns found</p>
                        <p className="text-[var(--text-secondary)] mt-1 mb-6">Create your first campaign to get started.</p>
                        <button className="btn btn-primary" onClick={() => navigate('/campaigns/new')}>
                          <Plus size={16} /> Create Campaign
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  campaigns.map((camp) => (
                    <tr 
                      key={camp._id} 
                      className="cursor-pointer hover:bg-[var(--bg-surface-hover)] transition-colors border-b border-[var(--border-subtle)]"
                      onClick={() => navigate(`/campaigns/${camp._id}`)}
                    >
                      <td className="py-4 px-6">
                        <p className="font-semibold text-white truncate">{camp.name}</p>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5 truncate max-w-[250px]">{camp.subject}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`badge ${getStatusBadge(camp.status)}`}>
                          {camp.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-[var(--text-primary)]">{camp.type}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          {camp.targetSegments?.length > 0 && (
                            <span className="text-xs text-[var(--text-secondary)] font-medium">
                              {camp.targetSegments.length} Segments
                            </span>
                          )}
                          {camp.targetTags?.length > 0 && (
                            <span className="text-xs text-[var(--text-secondary)] font-medium">
                              {camp.targetTags.length} Tags
                            </span>
                          )}
                          {(!camp.targetSegments?.length && !camp.targetTags?.length) && (
                            <span className="text-xs text-[var(--text-tertiary)]">All Customers</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {camp.status === 'Draft' || camp.status === 'Scheduled' ? (
                          <span className="text-sm text-[var(--text-tertiary)]">—</span>
                        ) : (
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase font-bold text-[var(--text-tertiary)]">Sent</span>
                              <span className="text-sm font-bold text-white font-mono">{camp.metrics?.sent || 0}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase font-bold text-[var(--text-tertiary)]">Opened</span>
                              <span className="text-sm font-bold text-[var(--status-success)] font-mono">{camp.metrics?.opened || 0}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase font-bold text-[var(--text-tertiary)]">Clicked</span>
                              <span className="text-sm font-bold text-[var(--brand-primary)] font-mono">{camp.metrics?.clicked || 0}</span>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-medium text-[var(--text-secondary)]">
                            {new Date(camp.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-[var(--text-tertiary)] flex items-center gap-1 mt-0.5">
                            <Calendar size={10} className="text-[var(--brand-primary)]" />
                            {new Date(camp.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]" style={{ padding: '16px 24px' }}>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={limit}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Campaigns;
