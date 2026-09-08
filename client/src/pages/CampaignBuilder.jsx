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
  const { addToast } = useToast();
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
      isNew
        ? await campaignService.createCampaign(payload)
        : await campaignService.updateCampaign(id, payload);
      addToast('Draft saved!', 'success');
      navigate('/campaigns');
    } catch {
      addToast('Failed to save draft', 'error');
    } finally {
      setSaving(false);
    }
  };

  const onSchedule = async (data) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    try {
      setSaving(true);
      const payload = { ...data, status: 'Scheduled', scheduledDate: tomorrow };
      isNew
        ? await campaignService.createCampaign(payload)
        : await campaignService.updateCampaign(id, payload);
      addToast('Campaign scheduled!', 'success');
      navigate('/campaigns');
    } catch {
      addToast('Failed to schedule', 'error');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!window.confirm('Delete this campaign? This cannot be undone.')) return;
    try {
      setDeleting(true);
      await campaignService.deleteCampaign(id);
      addToast('Campaign deleted', 'success');
      navigate('/campaigns');
    } catch (error) {
      addToast(error.response?.data?.error || 'Failed to delete', 'error');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-enter">
        <Skeleton className="w-32 h-4 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card p-6"><Skeleton className="w-full h-[400px]" /></div>
          <div className="card p-6"><Skeleton className="w-full h-[200px]" /></div>
        </div>
      </div>
    );
  }

  const isCompleted = campaign?.status === 'Completed';

  return (
    <div className="page-enter">

      {/* Back nav + actions */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/campaigns')}
          className="flex items-center gap-1.5 text-[13px] transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <ArrowLeft size={14} /> Campaigns
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSubmit(onSaveDraft)}
            disabled={saving || isCompleted}
            className="btn btn-outline"
          >
            <Save size={13} /> Save Draft
          </button>
          <button
            type="button"
            onClick={handleSubmit(onSchedule)}
            disabled={saving || isCompleted}
            className="btn btn-secondary"
          >
            <Calendar size={13} /> Schedule
          </button>
          {!isNew && campaign && !isCompleted && (
            <button
              type="button"
              onClick={() => setIsLaunchModalOpen(true)}
              className="btn btn-primary"
            >
              <Send size={13} /> Launch
            </button>
          )}
          {!isNew && user?.role === 'Admin' && (
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className="btn btn-danger"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-6">
            <h2 className="text-heading mb-5">Campaign Setup</h2>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="label">Campaign Name *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Summer Flash Sale"
                  {...register('name')}
                />
                {errors.name && <p className="field-error">{errors.name.message}</p>}
              </div>

              {/* Subject */}
              <div>
                <label className="label">Subject Line</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Don't miss out on these summer deals!"
                  {...register('subject')}
                />
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="label mb-0">Content</label>
                  <button
                    type="button"
                    onClick={() => setIsAIModalOpen(true)}
                    className="flex items-center gap-1.5 text-[12px] font-medium transition-colors"
                    style={{ color: 'var(--gold)' }}
                  >
                    <Sparkles size={12} /> Generate with AI
                  </button>
                </div>
                <textarea
                  className="input w-full font-mono text-[13px] leading-relaxed"
                  style={{ minHeight: '280px', resize: 'vertical' }}
                  placeholder="Write your email or SMS content here…"
                  {...register('content')}
                />
                <p className="text-[11.5px] mt-1.5" style={{ color: 'var(--text-muted)' }}>
                  Variables: {'{{customer.name}}'}, {'{{customer.company}}'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="text-label mb-5">Settings</h3>
            <div className="space-y-4">
              {/* Type */}
              <div>
                <label className="label">Campaign Type</label>
                <select className="input" {...register('type')}>
                  <option value="Email">Email</option>
                  <option value="SMS">SMS</option>
                </select>
              </div>

              {/* Segments */}
              <div>
                <label className="label">Target Segments</label>
                <p className="text-[11.5px] mb-2" style={{ color: 'var(--text-muted)' }}>
                  Send to customers in these segments.
                </p>
                <Controller
                  name="targetSegments"
                  control={control}
                  render={({ field }) => (
                    <SegmentSelector value={field.value} onChange={field.onChange} />
                  )}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="label">Target Tags</label>
                <p className="text-[11.5px] mb-2" style={{ color: 'var(--text-muted)' }}>
                  Further refine audience by tags.
                </p>
                <Controller
                  name="targetTags"
                  control={control}
                  render={({ field }) => (
                    <TagInput value={field.value} onChange={field.onChange} />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Status Info */}
          {!isNew && campaign && (
            <div className="card p-5">
              <h3 className="text-label mb-4">Status Info</h3>
              <div className="space-y-3 text-[13px]">
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--text-muted)' }}>Status</span>
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{campaign.status}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--text-muted)' }}>Created</span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {campaign.scheduledDate && (
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-muted)' }}>Scheduled</span>
                    <span style={{ color: 'var(--gold)' }}>
                      {new Date(campaign.scheduledDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <AIGeneratorModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onApply={(content) => setValue('content', content)}
        campaignContext={{
          type: campaignType,
          targetSegments: watch('targetSegments'),
          targetTags: watch('targetTags')
        }}
      />

      <LaunchCampaignModal
        isOpen={isLaunchModalOpen}
        onClose={() => setIsLaunchModalOpen(false)}
        campaign={campaign}
        onLaunchSuccess={() => { setIsLaunchModalOpen(false); navigate(0); }}
      />
    </div>
  );
};

export default CampaignBuilder;
