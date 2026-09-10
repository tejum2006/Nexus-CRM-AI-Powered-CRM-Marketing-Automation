import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save } from 'lucide-react';

const segmentSchema = z.object({
  name: z.string().min(2, 'Name is required').max(50),
  color: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, 'Invalid Hex Color').default('#9ca3af'),
});

const PRESET_COLORS = [
  '#f8ba33', // Gold
  '#0ea5e9', // Blue
  '#10b981', // Green
  '#f43f5e', // Rose
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#f97316', // Orange
  '#9ca3af', // Gray
];

const SegmentForm = ({ isOpen, onClose, onSubmit, initialData = null, isSubmitting = false }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    resolver: zodResolver(segmentSchema),
    defaultValues: { name: '', color: '#9ca3af' }
  });

  const currentColor = watch('color');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          name: initialData.name,
          color: initialData.color || '#9ca3af',
        });
      } else {
        reset({ name: '', color: '#9ca3af' });
      }
    }
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content sm:max-w-md mx-auto">
        
        <div className="modal-header">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            {initialData ? 'Edit Segment' : 'Create Segment'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <form id="segment-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <div>
              <label className="label">Segment Name <span className="text-red-400">*</span></label>
              <input 
                type="text" 
                className="input" 
                placeholder="e.g. High Value Customers"
                {...register('name')} 
              />
              {errors.name && <p className="field-error">{errors.name.message}</p>}
            </div>

            <div>
              <label className="label">Color Label <span className="text-red-400">*</span></label>
              <div className="flex items-center gap-3 mb-2">
                <input 
                  type="color" 
                  className="w-10 h-10 p-1 bg-[var(--bg-input)] border border-[var(--border)] rounded-md cursor-pointer"
                  {...register('color')}
                />
                <input 
                  type="text" 
                  className="input flex-1 uppercase font-mono text-[13px]" 
                  {...register('color')}
                />
              </div>
              {errors.color && <p className="field-error">{errors.color.message}</p>}
              
              <div className="mt-3">
                <p className="text-[11px] text-[var(--text-muted)] mb-2 font-medium">Quick Presets</p>
                <div className="flex gap-3 flex-wrap">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setValue('color', c)}
                      className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--gold)]"
                      style={{ 
                        backgroundColor: c, 
                        borderColor: currentColor.toLowerCase() === c.toLowerCase() ? 'white' : 'transparent',
                        boxShadow: currentColor.toLowerCase() === c.toLowerCase() ? '0 0 0 1px rgba(255,255,255,0.5)' : 'none'
                      }}
                      aria-label={`Select color ${c}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-6 p-4 bg-[var(--bg-input)] border border-[var(--border)] rounded-lg">
               <p className="text-[11px] text-[var(--text-muted)] mb-2 font-medium">Badge Preview</p>
               <span 
                 className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11.5px] font-medium border"
                 style={{ 
                   backgroundColor: `${currentColor}15`, 
                   color: currentColor,
                   borderColor: `${currentColor}30`
                 }}
               >
                 {watch('name') || 'Segment Name'}
               </span>
            </div>

          </form>
        </div>
        <div className="modal-footer">
          <button 
            type="button" 
            onClick={onClose}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="segment-form"
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            <Save size={14} className="mr-1.5" />
            {isSubmitting ? 'Saving...' : 'Save Segment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SegmentForm;
