import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Calendar, Send, Sparkles, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import * as campaignService from '../services/campaignService';
import SegmentSelector from '../components/customers/SegmentSelector';
import TagInput from '../components/customers/TagInput';
import Skeleton from '../components/ui/Skeleton';
import AIGeneratorModal from '../components/campaigns/AIGeneratorModal';
import LaunchCampaignModal from '../components/campaigns/LaunchCampaignModal';

const campaignSchema = z.object({
  name: z.string().min(2, 'Campaign name is required'),
  subject: z.string().optional(),
  type: z.enum(['Email', 'SMS']),
  targetSegments: z.array(z.string()).default([]),
  targetTags: z.array(z.string()).default([]),
  content: z.string().optional(),
});

const CampaignBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const isNew = id === 'new';

  const passedState = location.state || {};
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [campaign, setCampaign] = useState(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);

  const { register, handleSubmit, control, formState: { errors }, reset, watch, setValue } = useForm({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: '',
      subject: '',
      type: passedState.type || 'Email',
      targetSegments: passedState.targetSegments || [],
      targetTags: passedState.targetTags || [],
      content: passedState.content || '',
    }
  });

  const campaignType = watch('type');

  useEffect(() => {
    if (isNew) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await campaignService.getCampaignById(id);
        if (data.success) {
          setCampaign(data.data);
          reset({
            name: data.data.name,
            subject: data.data.subject || '',
            type: data.data.type,
            targetSegments: data.data.targetSegments || [],
            targetTags: data.data.targetTags || [],
            content: data.data.content || '',
          });
        }
      } catch (error) {
        console.error('Failed to fetch campaign:', error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, isNew, reset]);

  const onSaveDraft = async (data) => {
    try {
      setSaving(true);
      const payload = { ...data, status: 'Draft' };
      
      if (isNew) {
        const response = await campaignService.createCampaign(payload);
        toast.success('Draft created! You can now test or launch it.');
        navigate(`/campaigns/${response.data._id}`); // Stay on the builder page
      } else {
        await campaignService.updateCampaign(id, payload);
        toast.success('Draft updated!');
      }
    } catch {
      toast.error('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const onSchedule = async (data) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    try {
      setSaving(true);
      const payload = { ...data, status: 'Scheduled', scheduledFor: tomorrow };
      isNew
        ? await campaignService.createCampaign(payload)
        : await campaignService.updateCampaign(id, payload);
      toast.success('Campaign scheduled!');
      navigate('/campaigns');
    } catch {
      toast.error('Failed to schedule campaign');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this campaign?')) return;
    try {
      setDeleting(true);
      await campaignService.deleteCampaign(id);
      toast.success('Campaign deleted!');
      navigate('/campaigns');
    } catch {
      toast.error('Failed to delete campaign');
      setDeleting(false);
    }
  };

  const isReadOnly = campaign && ['Active', 'Completed'].includes(campaign.status);

  return (
    <div className="page-scroll flex flex-col h-[calc(100vh-var(--header-height))] space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between shrink-0 gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/campaigns')}
            className="p-1.5 -ml-1.5 text-[var(--text-secondary)] hover:text-white transition-colors rounded-lg hover:bg-[var(--bg-surface-hover)]"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="heading-1 mb-0.5">{isNew ? 'New Campaign' : campaign?.name || 'Loading...'}</h1>
            {!isNew && campaign && (
              <span className={`badge ${
                campaign.status === 'Active' ? 'badge-success' :
                campaign.status === 'Scheduled' ? 'badge-blue' :
                'badge-neutral'
              }`}>
                {campaign.status}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isNew && !isReadOnly && (
            <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
              <Trash2 size={14} /> Delete
            </button>
          )}
          {!isReadOnly && (
            <>
              <button 
                className="btn btn-secondary" 
                onClick={handleSubmit(onSaveDraft)}
                disabled={saving || loading}
              >
                <Save size={14} /> Save Draft
              </button>
              <button 
                className="btn btn-secondary text-[var(--brand-premium)]" 
                onClick={handleSubmit(onSchedule)}
                disabled={saving || loading}
              >
                <Calendar size={14} /> Schedule
              </button>
              <button 
                type="button"
                className="btn btn-primary" 
                onClick={() => {
                  if (isNew) {
                    toast.error('Please save the campaign as a draft first before launching or testing.');
                    return;
                  }
                  setIsLaunchModalOpen(true);
                }}
                disabled={saving || loading}
              >
                <Send size={14} /> Launch Now
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto card" style={{ padding: '32px' }}>
        {loading ? (
          <div className="space-y-6 max-w-3xl">
            <Skeleton className="w-full h-12 rounded-xl" />
            <Skeleton className="w-1/2 h-12 rounded-xl" />
            <Skeleton className="w-full h-48 rounded-xl" />
          </div>
        ) : (
          <form id="campaign-form" style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '48rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label className="input-label">Campaign Name <span style={{ color: 'var(--status-error)' }}>*</span></label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="e.g. Summer Flash Sale"
                  disabled={isReadOnly}
                  {...register('name')} 
                />
                {errors.name && <p className="text-xs text-[var(--status-error)] mt-1.5">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="input-label">Type</label>
                  <select
                    className="input"
                    style={{
                      background: 'rgba(10, 15, 28, 0.6)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      appearance: 'auto',
                    }}
                    disabled={isReadOnly}
                    {...register('type')}
                  >
                    <option value="Email" style={{ background: '#111827', color: '#f9fafb' }}>Email</option>
                    <option value="SMS" style={{ background: '#111827', color: '#f9fafb' }}>SMS</option>
                  </select>
                </div>
                {campaignType === 'Email' && (
                  <div>
                    <label className="input-label">Subject Line</label>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="Subject line for email..."
                      disabled={isReadOnly}
                      {...register('subject')} 
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-[var(--border-subtle)]">
              <h3 className="heading-3 mb-4">Target Audience</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="input-label">Include Segments</label>
                  <Controller
                    name="targetSegments"
                    control={control}
                    render={({ field }) => (
                      <SegmentSelector 
                        value={field.value} 
                        onChange={field.onChange} 
                        disabled={isReadOnly}
                      />
                    )}
                  />
                </div>
                <div>
                  <label className="input-label">Include Tags</label>
                  <Controller
                    name="targetTags"
                    control={control}
                    render={({ field }) => (
                      <TagInput 
                        value={field.value} 
                        onChange={field.onChange} 
                        disabled={isReadOnly}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[var(--border-subtle)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="heading-3">Content / Message</h3>
                {!isReadOnly && user?.role !== 'Sales Executive' && (
                  <button 
                    type="button"
                    onClick={() => setIsAIModalOpen(true)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[var(--brand-ai)] hover:text-white transition-colors py-1.5 px-3 rounded-md bg-[var(--brand-ai)]/10 hover:bg-[var(--brand-ai)]/20"
                  >
                    <Sparkles size={14} />
                    Generate with AI
                  </button>
                )}
              </div>
              <textarea 
                className="input" 
                style={{ paddingTop: '12px', paddingBottom: '12px', minHeight: '240px', resize: 'vertical', lineHeight: '1.6' }} 
                placeholder={campaignType === 'Email' ? 'Write your email content...' : 'Write your SMS message...'}
                disabled={isReadOnly}
                {...register('content')} 
              />
            </div>

          </form>
        )}
      </div>

      <AIGeneratorModal 
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        campaignContext={{
          type: watch('type'),
          targetSegments: watch('targetSegments'),
          targetTags: watch('targetTags')
        }}
        onApply={(generatedContent) => {
          setValue('content', generatedContent);
          toast.success('AI content applied to campaign!');
        }}
      />

      <LaunchCampaignModal
        isOpen={isLaunchModalOpen}
        onClose={() => setIsLaunchModalOpen(false)}
        campaign={{
          ...watch(),
          _id: id,
          isNew
        }}
        onLaunchSuccess={() => {
          toast.success('Campaign launched successfully!');
          navigate('/campaigns');
        }}
      />
    </div>
  );
};

export default CampaignBuilder;
