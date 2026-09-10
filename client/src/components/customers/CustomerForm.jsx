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
      <div className="modal-overlay" onClick={onClose} />
      
      <div className="modal-content">
        
        {/* Header */}
        <div className="modal-header">
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
        <div className="modal-body scrollbar-hide">
          <form id="customer-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="label">Full Name <span className="text-red-400">*</span></label>
                <input type="text" className="input" placeholder="Steve Rogers" {...register('name')} />
                {errors.name && <p className="field-error">{errors.name.message}</p>}
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="label">Email <span className="text-red-400">*</span></label>
                <input type="email" className="input" placeholder="steve@company.com" {...register('email')} />
                {errors.email && <p className="field-error">{errors.email.message}</p>}
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="label">Phone</label>
                <input type="tel" className="input" placeholder="+91 98765 43210" {...register('phone')} />
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
                <input type="text" className="input" placeholder="Mumbai, MH" {...register('location')} />
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
        <div className="modal-footer">
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
