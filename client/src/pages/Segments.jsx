import React, { useState, useEffect, useCallback } from 'react';
import { Tags as TagsIcon, Plus, Edit2, Trash2, Hash } from 'lucide-react';
import * as segmentService from '../services/segmentService';
import * as customerService from '../services/customerService';
import Skeleton from '../components/ui/Skeleton';
import SegmentForm from '../components/customers/SegmentForm';
import SegmentBadge from '../components/customers/SegmentBadge';
import TagChip from '../components/customers/TagChip';
import { useToast } from '../context/ToastContext';

const Segments = () => {
  const { toast } = useToast();
  const [segments, setSegments] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSegment, setEditingSegment] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [segRes, tagsRes] = await Promise.all([
        segmentService.getSegments(),
        customerService.getAllTags()
      ]);
      if (segRes.success) setSegments(segRes.data);
      if (tagsRes.success) setTags(tagsRes.data);
    } catch (error) {
      console.error('Failed to fetch:', error);
      toast.error('Failed to load data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      if (editingSegment) {
        await segmentService.updateSegment(editingSegment._id, data);
        toast.success('Segment updated!');
      } else {
        await segmentService.createSegment(data);
        toast.success('Segment created!');
      }
      setIsFormOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save segment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (segment) => {
    if (segment.isDefault) { toast.warning('Cannot delete a system segment.'); return; }
    if (!window.confirm(`Delete segment "${segment.name}"?`)) return;
    try {
      await segmentService.deleteSegment(segment._id);
      toast.success('Segment deleted!');
      fetchData();
    } catch {
      toast.error('Failed to delete segment.');
    }
  };

  return (
    <div className="page-scroll flex flex-col" style={{ gap: '24px' }}>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="heading-1 mb-1">Segments & Tags</h1>
          <p className="text-body">Manage audience segments and custom classification tags.</p>
        </div>
      </div>

      {/* Main Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.2fr)_minmax(280px,1fr)] gap-6 items-start">

        {/* Segments table */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] shrink-0" style={{ padding: '24px' }}>
            <div>
              <h2 className="heading-3 mb-0.5">Audience Segments</h2>
              <p className="text-small">Create distinct groups for targeted marketing campaigns.</p>
            </div>
            <button
              className="btn btn-primary h-9 px-4 rounded-lg text-sm font-semibold shrink-0"
              onClick={() => { setEditingSegment(null); setIsFormOpen(true); }}
            >
              <Plus size={16} /> <span className="hidden sm:inline">New Segment</span>
            </button>
          </div>

          <div className="overflow-auto bg-[var(--bg-app)]">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th className="py-4 px-6 text-left">Segment</th>
                    <th className="py-4 px-6 text-left">Color Label</th>
                    <th className="py-4 px-6 text-left">Customers</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i}>
                        <td className="py-5 px-6"><Skeleton className="w-32 h-5" /></td>
                        <td className="py-5 px-6"><Skeleton className="w-24 h-6 rounded-full" /></td>
                        <td className="py-5 px-6"><Skeleton className="w-12 h-5" /></td>
                        <td className="py-5 px-6"><div className="flex justify-end"><Skeleton className="w-16 h-8 rounded-lg" /></div></td>
                      </tr>
                    ))
                  ) : segments.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-16">
                        <div className="flex flex-col items-center">
                          <TagsIcon size={36} className="text-[var(--text-tertiary)] mb-3" />
                          <p className="text-white font-bold text-lg">No segments found</p>
                          <p className="text-sm text-[var(--text-secondary)] mt-1">Create a segment to organize your customers.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    segments.map(seg => (
                      <tr key={seg._id} className="hover:bg-[var(--bg-surface-hover)] transition-colors border-b border-[var(--border-subtle)]">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-white text-sm">{seg.name}</span>
                            {seg.isDefault && (
                              <span className="badge badge-neutral text-[10px] uppercase">System</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <SegmentBadge segment={seg} />
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-[var(--text-secondary)] font-semibold font-mono">
                            {seg.customerCount || 0}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => { setEditingSegment(seg); setIsFormOpen(true); }}
                              className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-white hover:bg-white/10 transition-colors"
                              title="Edit Segment"
                            >
                              <Edit2 size={16} />
                            </button>
                            {!seg.isDefault && (
                              <button
                                onClick={() => handleDelete(seg)}
                                className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--status-error)] hover:bg-[var(--status-error)]/10 transition-colors"
                                title="Delete Segment"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tags List */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="pb-4 border-b border-[var(--border-subtle)]">
            <h2 className="heading-3 mb-0.5">Active Tags</h2>
            <p className="text-small">Tags used across your customers.</p>
          </div>
          
          <div>
            {loading ? (
              <div className="flex flex-wrap gap-2.5 py-2">
                {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="w-20 h-8 rounded-full" />)}
              </div>
            ) : tags.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-10 text-[var(--text-tertiary)]">
                <Hash size={28} className="mb-3 opacity-50" />
                <p className="text-sm font-medium">No tags created yet.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <TagChip key={tag} tag={tag} />
                ))}
              </div>
            )}
            
            <div className="mt-8 p-4 bg-[var(--bg-surface-hover)] rounded-lg">
               <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                 <strong className="text-[var(--text-primary)]">Tip:</strong> Tags are created dynamically when you add them to a customer profile. They are automatically removed when no longer associated with any customer.
               </p>
            </div>
          </div>
        </div>

      </div>

      <SegmentForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingSegment(null); }}
        onSubmit={handleSubmit}
        initialData={editingSegment}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Segments;
