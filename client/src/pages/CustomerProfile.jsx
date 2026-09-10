import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Edit2, Trash2, Sparkles, Building2,
  MapPin, Phone, Mail, Hash, Briefcase, Plus
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
  const toastRef = useRef(toast);
  useEffect(() => { toastRef.current = toast; }, [toast]);

  const [customer, setCustomer] = useState(null);
  const [activities, setActivities] = useState([]);
  const [availableSegments, setAvailableSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [isNoteSubmitting, setIsNoteSubmitting] = useState(false);

  const fetchCustomer = useCallback(async () => {
    try {
      setLoading(true);
      setNotFound(false);
      const [customerData, segmentData] = await Promise.all([
        customerService.getCustomerById(id),
        segmentService.getSegments()
      ]);
      if (customerData.success) {
        setCustomer(customerData.data.customer);
        setActivities(customerData.data.activities);
      } else {
        setNotFound(true);
      }
      if (segmentData.success) setAvailableSegments(segmentData.data);
    } catch (error) {
      console.error('Failed to fetch customer:', error);
      const status = error?.response?.status;
      if (status === 404) {
        setNotFound(true);
      } else {
        toastRef.current?.error('Failed to load customer profile.');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

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

  if (notFound || (!loading && !customer)) {
    return (
      <div className="page-scroll flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--bg-surface-hover)] flex items-center justify-center mb-5">
          <span className="font-mono font-bold text-2xl text-[var(--text-tertiary)]">?</span>
        </div>
        <h2 className="heading-2 mb-2">Customer Not Found</h2>
        <p className="text-body mb-6 max-w-md">
          The customer profile you're looking for doesn't exist or has been deleted.
        </p>
        <Link to="/customers" className="btn btn-primary">
          <ArrowLeft size={16} /> Back to Customers
        </Link>
      </div>
    );
  }

  return (
    <div className="page-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Navigation Bar */}
      <div>
        <button 
          onClick={() => navigate('/customers')}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-[var(--bg-surface-hover)]"
        >
          <ArrowLeft size={16} /> Back to Customers
        </button>
      </div>

      {/* Profile Hero Banner */}
      <div className="card border-t-4 border-t-[var(--brand-primary)]" style={{ padding: '32px' }}>
        {loading ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <Skeleton className="w-20 h-20 rounded-xl" />
              <div className="space-y-3">
                <Skeleton className="w-48 h-8 rounded-lg" />
                <Skeleton className="w-32 h-5 rounded-full" />
              </div>
            </div>
            <div className="flex gap-4">
              <Skeleton className="w-28 h-9 rounded-lg" />
              <Skeleton className="w-28 h-9 rounded-lg" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* User Details Left */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-20 h-20 rounded-xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20 flex items-center justify-center shrink-0">
                <span className="text-3xl font-bold">
                  {customer.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="heading-1">{customer.name}</h1>
                  <span className={`badge ${
                    customer.status === 'Active' ? 'badge-success' :
                    customer.status === 'Lead' ? 'badge-blue' :
                    customer.status === 'Churned' ? 'badge-red' :
                    'badge-neutral'
                  }`}>
                    {customer.status}
                  </span>
                </div>
                
                {/* Inline Quick Contacts */}
                <div className="flex items-center gap-5 text-sm text-[var(--text-secondary)] flex-wrap pt-1">
                  <a href={`mailto:${customer.email}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                    <Mail size={16} className="text-[var(--text-tertiary)]" />
                    <span>{customer.email}</span>
                  </a>
                  {customer.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone size={16} className="text-[var(--text-tertiary)]" />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                  {customer.company && (
                    <div className="flex items-center gap-1.5">
                      <Building2 size={16} className="text-[var(--text-tertiary)]" />
                      <span className="font-medium text-[var(--text-primary)]">{customer.company}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons Right */}
            <div className="flex items-center gap-3 shrink-0">
              <button 
                className="btn btn-secondary"
                onClick={() => setIsEditOpen(true)}
              >
                <Edit2 size={16} /> Edit Profile
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleDelete}
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main 2-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Metadata & Classification */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Detailed Contact Card */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
             <h3 className="heading-3 pb-3 border-b border-[var(--border-subtle)]">
               Profile Overview
             </h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface-hover)] flex items-center justify-center text-[var(--text-tertiary)] shrink-0">
                   <Mail size={16} />
                 </div>
                 <div className="min-w-0 flex-1">
                   <p className="text-label mb-0.5">Primary Email</p>
                   <p className="text-sm font-medium text-white truncate">{customer?.email || '—'}</p>
                 </div>
               </div>
               
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface-hover)] flex items-center justify-center text-[var(--text-tertiary)] shrink-0">
                   <Phone size={16} />
                 </div>
                 <div className="min-w-0 flex-1">
                   <p className="text-label mb-0.5">Phone Number</p>
                   <p className="text-sm font-medium text-white">{customer?.phone || 'Not specified'}</p>
                 </div>
               </div>

               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface-hover)] flex items-center justify-center text-[var(--text-tertiary)] shrink-0">
                   <Building2 size={16} />
                 </div>
                 <div className="min-w-0 flex-1">
                   <p className="text-label mb-0.5">Company Name</p>
                   <p className="text-sm font-medium text-white">{customer?.company || 'Not specified'}</p>
                 </div>
               </div>

               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface-hover)] flex items-center justify-center text-[var(--text-tertiary)] shrink-0">
                   <Briefcase size={16} />
                 </div>
                 <div className="min-w-0 flex-1">
                   <p className="text-label mb-0.5">Industry Sector</p>
                   <p className="text-sm font-medium text-white">{customer?.industry || 'Not specified'}</p>
                 </div>
               </div>

               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface-hover)] flex items-center justify-center text-[var(--text-tertiary)] shrink-0">
                   <MapPin size={16} />
                 </div>
                 <div className="min-w-0 flex-1">
                   <p className="text-label mb-0.5">Location</p>
                   <p className="text-sm font-medium text-white">{customer?.location || 'Not specified'}</p>
                 </div>
               </div>
             </div>
          </div>

          {/* Classification Card */}
          {!loading && (customer?.segments?.length > 0 || customer?.tags?.length > 0) && (
            <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 className="heading-3 pb-3 border-b border-[var(--border-subtle)]">
                Segments & Tags
              </h3>
              
              {customer.segments?.length > 0 && (
                <div>
                  <p className="text-label mb-2">Audience Segments</p>
                  <div className="flex flex-wrap gap-2">
                    {customer.segments.map(seg => (
                      <SegmentBadge key={seg._id} segment={seg} />
                    ))}
                  </div>
                </div>
              )}

              {customer.tags?.length > 0 && (
                <div className={customer.segments?.length > 0 ? "pt-2" : ""}>
                  <p className="text-label mb-2">Custom Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {customer.tags.map(tag => (
                      <TagChip key={tag} tag={tag} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Column: Activity Timeline & Note Composer */}
        <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Note Input Box */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
             <h3 className="heading-3">Log Interaction</h3>
             <form onSubmit={handleAddNote} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
               <textarea
                 value={noteContent}
                 onChange={(e) => setNoteContent(e.target.value)}
                 placeholder="Type an interaction note or updates regarding this customer..."
                 className="input h-auto resize-y"
                 style={{ minHeight: '100px', paddingTop: '12px', paddingBottom: '12px', lineHeight: '1.6' }}
                 rows={3}
               />
               <div className="flex justify-end">
                 <button
                   type="submit"
                   disabled={!noteContent.trim() || isNoteSubmitting || loading}
                   className="btn btn-primary"
                 >
                   <Plus size={16} />
                   {isNoteSubmitting ? 'Saving...' : 'Add Note'}
                 </button>
               </div>
             </form>
          </div>

          {/* Activity Timeline List */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
              <h3 className="heading-3">Activity Timeline</h3>
              <span className="text-label">History & Audit Logs</span>
            </div>
            
            {loading ? (
              <div className="space-y-6 py-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="w-1/3 h-5" />
                      <Skeleton className="w-2/3 h-14 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <CustomerTimeline activities={activities} />
            )}
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
