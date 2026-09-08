import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Megaphone, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as campaignService from '../services/campaignService';
import SearchBar from '../components/ui/SearchBar';
import Pagination from '../components/ui/Pagination';
import Skeleton from '../components/ui/Skeleton';

const STATUS_FILTERS = ['', 'Draft', 'Scheduled', 'Active', 'Completed'];

const getStatusBadge = (status) => {
  const map = { Active: 'badge-jade', Scheduled: 'badge-copper', Completed: 'badge-neutral', Draft: 'badge-neutral' };
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
    <div className="page-full">
      {/* Header */}
      <div className="page-header shrink-0">
        <div>
          <h1 className="text-display mb-1">Campaigns</h1>
          <p className="text-body">Create, schedule, and track your marketing campaigns.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => navigate('/campaigns/new')}>
            <Plus size={14} />
            <span className="hide-mobile">New Campaign</span>
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="card flex flex-col flex-1 min-h-0 overflow-hidden">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center p-4 border-b shrink-0"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}>
          <SearchBar
            onSearch={(t) => { setSearch(t); setPage(1); }}
            placeholder="Search campaigns…"
            className="flex-1 sm:max-w-xs"
          />

          {/* Status segmented control */}
          <div className="flex items-center gap-1 p-1 rounded-[10px]"
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border)' }}>
            {STATUS_FILTERS.map(status => (
              <button
                key={status}
                onClick={() => { setStatusFilter(status); setPage(1); }}
                className="px-3 py-1 rounded-md text-[12.5px] font-medium transition-colors whitespace-nowrap"
                style={{
                  color: statusFilter === status ? 'var(--text-primary)' : 'var(--text-muted)',
                  background: statusFilter === status ? 'var(--bg-card)' : 'transparent',
                  border: statusFilter === status ? '1px solid var(--border)' : '1px solid transparent',
                }}
              >
                {status || 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto" style={{ background: 'var(--bg-base)' }}>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Status</th>
                  <th>Type</th>
                  <th>Audience</th>
                  <th>Performance</th>
                  <th style={{ width: '48px' }} />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td><Skeleton className="w-40 h-3.5 mb-1.5" /><Skeleton className="w-28 h-3" /></td>
                      <td><Skeleton className="w-16 h-5 rounded-full" /></td>
                      <td><Skeleton className="w-14 h-3.5" /></td>
                      <td><Skeleton className="w-20 h-3.5" /></td>
                      <td><Skeleton className="w-24 h-3.5" /></td>
                      <td />
                    </tr>
                  ))
                ) : campaigns.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      <div className="empty-state">
                        <Megaphone size={28} style={{ color: 'var(--text-faint)' }} />
                        <h3 className="text-heading">No campaigns found</h3>
                        <p className="text-caption max-w-xs">Create your first campaign to start reaching your audience.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  campaigns.map((campaign) => (
                    <tr
                      key={campaign._id}
                      className="table-row cursor-pointer group"
                      onClick={() => navigate(`/campaigns/${campaign._id}`)}
                    >
                      {/* Name + Subject */}
                      <td>
                        <div className="text-[13.5px] font-medium transition-colors"
                          style={{ color: 'var(--text-primary)' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}
                        >
                          {campaign.name}
                        </div>
                        <div className="text-[12px] mt-0.5 line-clamp-1 max-w-xs"
                          style={{ color: 'var(--text-muted)' }}>
                          {campaign.subject || 'No subject'}
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <span className={`badge ${getStatusBadge(campaign.status)}`}>
                          {campaign.status}
                        </span>
                        {campaign.status === 'Scheduled' && campaign.scheduledDate && (
                          <div className="flex items-center gap-1 mt-1.5 text-[11px]"
                            style={{ color: 'var(--text-muted)' }}>
                            <Calendar size={10} />
                            {new Date(campaign.scheduledDate).toLocaleDateString()}
                          </div>
                        )}
                      </td>

                      {/* Type */}
                      <td>
                        <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                          {campaign.type}
                        </span>
                      </td>

                      {/* Audience */}
                      <td>
                        <span className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
                          {campaign.targetSegments?.length > 0
                            ? `${campaign.targetSegments.length} Segment${campaign.targetSegments.length > 1 ? 's' : ''}`
                            : campaign.targetTags?.length > 0
                            ? `${campaign.targetTags.length} Tag${campaign.targetTags.length > 1 ? 's' : ''}`
                            : 'All Customers'}
                        </span>
                      </td>

                      {/* Performance */}
                      <td>
                        {(campaign.status === 'Completed' || campaign.status === 'Active') ? (
                          <div className="flex items-center gap-3 text-[12.5px]">
                            <span>
                              <span style={{ color: 'var(--text-muted)' }}>Sent: </span>
                              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                {campaign.metrics?.sent ?? 0}
                              </span>
                            </span>
                            <span>
                              <span style={{ color: 'var(--text-muted)' }}>Opened: </span>
                              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                {campaign.metrics?.opened ?? 0}
                              </span>
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-faint)', fontSize: '13px' }}>—</span>
                        )}
                      </td>

                      {/* Arrow */}
                      <td>
                        <span className="text-[var(--text-faint)] group-hover:text-[var(--gold)] transition-colors text-lg leading-none opacity-0 group-hover:opacity-100">
                          →
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={limit}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default Campaigns;
