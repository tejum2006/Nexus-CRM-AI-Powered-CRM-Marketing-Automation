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
    <div className="page-full">
      {/* Header */}
      <div className="page-header shrink-0">
        <div>
          <h1 className="text-display mb-1">Segments & Tags</h1>
          <p className="text-body">Manage audience segments and custom classification tags.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">

        {/* Segments table */}
        <div className="lg:col-span-2 card flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b shrink-0"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}>
            <div>
              <h2 className="text-heading">Audience Segments</h2>
              <p className="text-caption mt-0.5">Create distinct groups for targeted campaigns.</p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => { setEditingSegment(null); setIsFormOpen(true); }}
            >
              <Plus size={14} /> New Segment
            </button>
          </div>

          <div className="flex-1 overflow-auto" style={{ background: 'var(--bg-base)' }}>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Preview</th>
                    <th>Type</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i}>
                        <td><Skeleton className="w-28 h-3.5" /></td>
                        <td><Skeleton className="w-20 h-5 rounded-full" /></td>
                        <td><Skeleton className="w-14 h-4 rounded-full" /></td>
                        <td style={{ textAlign: 'right' }}><Skeleton className="w-16 h-7 rounded-md ml-auto" /></td>
                      </tr>
                    ))
                  ) : segments.length === 0 ? (
                    <tr>
                      <td colSpan="4">
                        <div className="empty-state">
                          <TagsIcon size={24} style={{ color: 'var(--text-faint)' }} />
                          <p className="text-caption">No segments found.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    segments.map(seg => (
                      <tr key={seg._id} className="table-row group">
                        <td>
                          <span className="text-[13.5px] font-medium" style={{ color: 'var(--text-primary)' }}>
                            {seg.name}
                          </span>
                        </td>
                        <td>
                          <SegmentBadge name={seg.name} color={seg.color} />
                        </td>
                        <td>
                          {seg.isDefault ? (
                            <span className="badge badge-neutral" style={{ fontSize: '11px' }}>System</span>
                          ) : (
                            <span className="badge badge-jade" style={{ fontSize: '11px' }}>Custom</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => { setEditingSegment(seg); setIsFormOpen(true); }}
                              className="btn btn-ghost h-7 w-7 p-0"
                              title="Edit"
                            >
                              <Edit2 size={12} />
                            </button>
                            {!seg.isDefault && (
                              <button
                                onClick={() => handleDelete(seg)}
                                className="btn btn-ghost h-7 w-7 p-0 hover:text-red-400"
                                title="Delete"
                              >
                                <Trash2 size={12} />
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

        {/* Tag Cloud */}
        <div className="card flex flex-col overflow-hidden">
          <div className="p-5 border-b shrink-0"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}>
            <h2 className="text-heading flex items-center gap-2">
              <Hash size={15} style={{ color: 'var(--text-muted)' }} />
              Tag Cloud
            </h2>
            <p className="text-caption mt-1">All tags in use across your customers.</p>
          </div>
          <div className="flex-1 overflow-auto p-5">
            {loading ? (
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} className="w-16 h-6 rounded-full" />
                ))}
              </div>
            ) : tags.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <Hash size={24} style={{ color: 'var(--text-faint)', marginBottom: '8px' }} />
                <p className="text-caption">No tags in use yet.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => <TagChip key={i} name={tag} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      <SegmentForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingSegment}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Segments;
