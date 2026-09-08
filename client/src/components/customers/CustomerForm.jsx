import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save } from 'lucide-react';
import SegmentSelector from './SegmentSelector';
import TagInput from './TagInput';

const customerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  company: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(['Lead', 'Active', 'Inactive', 'Churned']),
  segments: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
});

const CustomerForm = ({ isOpen, onClose, onSubmit, initialData = null, isSubmitting = false }) => {
  const { register, handleSubmit, control, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      industry: '',
      location: '',
      status: 'Lead',
      segments: [],
      tags: [],
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Pre-fill form
        Object.keys(initialData).forEach(key => {
          if (key !== '_id' && key !== 'createdAt' && key !== 'updatedAt' && key !== '__v') {
            setValue(key, initialData[key]);
          }
        });
      } else {
        reset(); // Clear form for new customer
      }
    }
  }, [isOpen, initialData, setValue, reset]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      
      <div className="modal !fixed !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !max-h-[90vh] !w-[95%] sm:!w-[600px] flex flex-col z-[100] p-0 shadow-2xl bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-card)]">
          <h2 className="text-section text-[var(--text-primary)]">
            {initialData ? 'Edit Customer' : 'New Customer'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.05)] rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <form id="customer-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="label">Full Name <span className="text-red-400">*</span></label>
                <input type="text" className="input" placeholder="Jane Smith" {...register('name')} />
                {errors.name && <p className="field-error">{errors.name.message}</p>}
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="label">Email <span className="text-red-400">*</span></label>
                <input type="email" className="input" placeholder="jane@company.com" {...register('email')} />
                {errors.email && <p className="field-error">{errors.email.message}</p>}
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="label">Phone</label>
                <input type="tel" className="input" placeholder="+1 (555) 000-0000" {...register('phone')} />
                {errors.phone && <p className="field-error">{errors.phone.message}</p>}
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="label">Company</label>
                <input type="text" className="input" placeholder="Acme Corp" {...register('company')} />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="label">Industry</label>
                <input type="text" className="input" placeholder="Software" {...register('industry')} />
              </div>

              <div className="col-span-2">
                <label className="label">Location</label>
                <input type="text" className="input" placeholder="New York, NY" {...register('location')} />
              </div>

              <div className="col-span-2">
                <label className="label">Status</label>
                <select className="input" {...register('status')}>
                  <option value="Lead">Lead</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Churned">Churned</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="label">Segments</label>
                <Controller
                  name="segments"
                  control={control}
                  render={({ field }) => (
                    <SegmentSelector 
                      value={field.value} 
                      onChange={field.onChange} 
                    />
                  )}
                />
              </div>
              
              <div className="col-span-2">
                <label className="label">Tags</label>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <TagInput 
                      value={field.value} 
                      onChange={field.onChange} 
                    />
                  )}
                />
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button 
            form="customer-form"
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            {isSubmitting ? (
              <span className="btn-spinner mr-2" style={{ borderColor: 'rgba(9,9,11,0.25)', borderTopColor: '#09090b' }}></span>
            ) : (
              <Save size={16} className="mr-2" />
            )}
            {initialData ? 'Save Changes' : 'Create Customer'}
          </button>
        </div>

      </div>
    </>
  );
};

export default CustomerForm;
