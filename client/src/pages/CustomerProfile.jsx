import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Edit2, Trash2, Sparkles, Building2,
  MapPin, Phone, Mail, Hash, Briefcase
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import * as customerService from '../services/customerService';
import * as segmentService from '../services/segmentService';
import CustomerForm from '../components/customers/CustomerForm';
import CustomerTimeline from '../components/customers/CustomerTimeline';
import Skeleton from '../components/ui/Skeleton';
import SegmentBadge from '../components/customers/SegmentBadge';
import TagChip from '../components/customers/TagChip';

const CustomerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [customer, setCustomer] = useState(null);
  const [activities, setActivities] = useState([]);
  const [availableSegments, setAvailableSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [isNoteSubmitting, setIsNoteSubmitting] = useState(false);

  const fetchCustomer = useCallback(async () => {
    try {
      setLoading(true);
      const [customerData, segmentData] = await Promise.all([
        customerService.getCustomerById(id),
        segmentService.getSegments()
      ]);
      if (customerData.success) {
        setCustomer(customerData.data.customer);
        setActivities(customerData.data.activities);
      }
      if (segmentData.success) setAvailableSegments(segmentData.data);
    } catch (error) {
      console.error('Failed to fetch:', error);
      toast.error('Failed to load customer profile.');
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => { fetchCustomer(); }, [fetchCustomer]);

  const handleUpdate = async (data) => {
    try {
      await customerService.updateCustomer(id, data);
      setIsEditOpen(false);
      fetchCustomer();
      toast.success('Customer updated!');
    } catch (error) {
      console.error('Failed to update:', error);
      toast.error('Failed to update customer.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this customer? This cannot be undone.')) return;
    try {
      await customerService.deleteCustomer(id);
      navigate('/customers');
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete customer.');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    try {
      setIsNoteSubmitting(true);
      await customerService.addCustomerNote(id, noteContent);
      setNoteContent('');
      fetchCustomer();
      toast.success('Note added!');
    } catch (error) {
      console.error('Failed to add note:', error);
      toast.error('Failed to add note.');
    } finally {
      setIsNoteSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="page-enter max-w-5xl mx-auto">
        <Skeleton className="w-32 h-4 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card p-6">
            <Skeleton className="w-14 h-14 rounded-full mb-4" />
            <Skeleton className="w-40 h-5 mb-2" />
            <Skeleton className="w-28 h-4" />
          </div>
          <div className="lg:col-span-2 card p-6">
            <Skeleton className="w-full h-[300px] rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="page-enter text-center py-20">
        <p className="text-body mb-3">Customer not found.</p>
        <Link to="/customers" className="nexus-link">← Back to Customers</Link>
      </div>
    );
  }

  const InfoRow = ({ icon: Icon, value }) => (
    value ? (
      <div className="flex items-start gap-2.5">
        <Icon size={13} className="shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }} />
        <span className="text-[13.5px] truncate" style={{ color: 'var(--text-primary)' }}>{value}</span>
      </div>
    ) : null
  );

  return (
    <div className="page-enter">
      {/* Sub-navigation */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/customers"
          className="flex items-center gap-1.5 text-[13px] transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <ArrowLeft size={14} />
          Customers
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsEditOpen(true)} className="btn btn-outline">
            <Edit2 size={13} /> Edit
          </button>
          <button onClick={handleDelete} className="btn btn-danger">
            <Trash2 size={13} /> Delete
          </button>
          <button onClick={() => navigate('/campaigns/new')} className="btn btn-primary">
            <Sparkles size={13} /> New Campaign
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Profile details */}
        <div className="space-y-4">

          {/* Profile Card */}
          <div className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold"
                style={{
                  background: 'var(--gold-dim)',
                  border: '2px solid var(--gold-border)',
                  color: 'var(--gold-light)',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}>
                {customer.name.charAt(0).toUpperCase()}
              </div>
              <span className={`badge ${
                customer.status === 'Active' ? 'badge-jade' :
                customer.status === 'Lead' ? 'badge-copper' : 'badge-neutral'
              }`}>
                {customer.status}
              </span>
            </div>
            <h1 className="text-[17px] font-semibold mb-1 tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {customer.name}
            </h1>
            {customer.company && (
              <p className="flex items-center gap-1.5 text-[13px]" style={{ color: 'var(--text-muted)' }}>
                <Building2 size={12} /> {customer.company}
              </p>
            )}
          </div>

          {/* Contact Info */}
          <div className="card p-5">
            <h3 className="text-label mb-4">Contact</h3>
            <div className="space-y-3">
              <InfoRow icon={Mail} value={customer.email} />
              <InfoRow icon={Phone} value={customer.phone} />
              <InfoRow icon={MapPin} value={customer.location} />
              <InfoRow icon={Briefcase} value={customer.industry} />
            </div>
          </div>

          {/* Segments & Tags */}
          <div className="card p-5">
            <h3 className="text-label mb-4">Classification</h3>

            <div className="mb-4">
              <p className="flex items-center gap-1 text-[11.5px] mb-2" style={{ color: 'var(--text-muted)' }}>
                <Hash size={11} /> Segments
              </p>
              <div className="flex flex-wrap gap-1.5">
                {customer.segments?.length > 0
                  ? customer.segments.map(s => {
                      const segData = availableSegments.find(seg => seg.name === s) || { name: s, color: '#9ca3af' };
                      return <SegmentBadge key={s} name={segData.name} color={segData.color} />;
                    })
                  : <span className="text-caption italic">None</span>}
              </div>
            </div>

            <div>
              <p className="flex items-center gap-1 text-[11.5px] mb-2" style={{ color: 'var(--text-muted)' }}>
                <Hash size={11} /> Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {customer.tags?.length > 0
                  ? customer.tags.map(t => <TagChip key={t} name={t} />)
                  : <span className="text-caption italic">None</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Notes + Timeline */}
        <div className="lg:col-span-2 space-y-4">

          {/* Add Note */}
          <div className="card p-5">
            <h3 className="text-heading mb-3">Add Note</h3>
            <form onSubmit={handleAddNote}>
              <textarea
                className="input w-full mb-3"
                style={{ minHeight: '90px', resize: 'none' }}
                placeholder="Log a call, meeting, or important detail…"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!noteContent.trim() || isNoteSubmitting}
                  className="btn btn-primary"
                >
                  {isNoteSubmitting ? <><span className="btn-spinner" /> Saving…</> : 'Save Note'}
                </button>
              </div>
            </form>
          </div>

          {/* Timeline */}
          <div className="card p-5">
            <h3 className="text-heading mb-5">Activity Timeline</h3>
            <CustomerTimeline activities={activities} />
          </div>
        </div>
      </div>

      <CustomerForm
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleUpdate}
        initialData={customer}
      />
    </div>
  );
};

export default CustomerProfile;
