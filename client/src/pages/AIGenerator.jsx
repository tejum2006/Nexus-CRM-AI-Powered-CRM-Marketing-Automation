import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Copy, CheckCircle2, ArrowRight, Wand2, Mail, MessageSquare, Megaphone, FileText } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { useToast } from '../context/ToastContext';
import * as aiService from '../services/aiService';
import SegmentSelector from '../components/customers/SegmentSelector';
import TagInput from '../components/customers/TagInput';

const TEMPLATES = [
  { id: 'welcome', label: 'Welcome Series', prompt: 'Write a warm welcome email for new subscribers introducing our brand values and offering a 10% discount on their first purchase.', icon: Mail },
  { id: 'promo', label: 'Flash Sale', prompt: 'Create an urgent, exciting SMS announcing a 24-hour flash sale with 50% off all summer items.', icon: MessageSquare },
  { id: 'winback', label: 'Win-back', prompt: 'Write a re-engagement email for customers who haven\'t purchased in 3 months. Offer them free shipping to come back.', icon: Megaphone },
  { id: 'newsletter', label: 'Newsletter', prompt: 'Draft a short, punchy newsletter intro summarizing this month\'s top 3 product updates.', icon: FileText },
];

const TONES = ['Professional', 'Casual', 'Urgent', 'Friendly', 'Humorous', 'Luxurious', 'Direct'];

const AIGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const { register, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: {
      prompt: '',
      type: 'Email',
      tone: 'Professional',
      targetSegments: [],
      targetTags: []
    }
  });

  const handleGenerate = async (data) => {
    if (!data.prompt.trim()) {
      toast.warning("Please enter a prompt or select a template.");
      return;
    }
    
    try {
      setIsGenerating(true);
      setOutput('');
      setCopied(false);
      
      const payload = {
        prompt: data.prompt,
        type: data.type,
        tone: data.tone,
        targetSegments: data.targetSegments,
        targetTags: data.targetTags
      };

      const res = await aiService.generateContent(payload);
      if (res.success) {
        setOutput(res.data);
        toast.success("Content generated successfully!");
      }
    } catch (error) {
      console.error('AI Generation Failed:', error);
      toast.error('Failed to generate content. Check the console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateCampaign = () => {
    if (!output) return;
    const currentValues = watch();
    navigate('/campaigns/new', { 
      state: { 
        content: output,
        type: currentValues.type,
        targetSegments: currentValues.targetSegments,
        targetTags: currentValues.targetTags
      } 
    });
  };

  const handleTemplateClick = (templatePrompt) => {
    setValue('prompt', templatePrompt);
  };

  return (
    <div className="page-scroll flex flex-col h-[calc(100vh-var(--header-height))]">
      
      {/* Header */}
      <div className="page-header shrink-0 flex items-center justify-between">
        <div>
          <h1 className="heading-1 flex items-center gap-2 mb-1">
            <Sparkles size={24} className="text-[var(--brand-ai)]" />
            AI Generator
          </h1>
          <p className="text-body">Draft high-converting campaigns instantly with Nexus AI.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0 overflow-y-auto pb-6">
        
        {/* Left Column: Inputs */}
        <div className="flex flex-col gap-6">
          
          <div className="card" style={{ padding: '28px' }}>
            <h3 className="heading-3 mb-4">Quick Templates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleTemplateClick(t.prompt)}
                  className="flex items-start gap-3 p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] hover:bg-[var(--bg-surface-hover)] transition-colors text-left"
                >
                  <t.icon size={16} className="text-[var(--text-secondary)] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">{t.label}</p>
                    <p className="text-xs text-[var(--text-tertiary)] line-clamp-2">{t.prompt}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '28px', flex: 1 }}>
            <form onSubmit={handleSubmit(handleGenerate)} style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
              
              <div className="flex-1">
                <label className="label flex items-center justify-between">
                  <span>What do you want to write? <span className="text-[var(--status-error)]">*</span></span>
                  <Wand2 size={14} className="text-[var(--brand-ai)]" />
                </label>
                <textarea
                  className="input"
                  style={{ paddingTop: '12px', paddingBottom: '12px', minHeight: '140px', resize: 'vertical', lineHeight: '1.6', width: '100%' }}
                  placeholder="e.g., Write a promotional email for our new summer collection targeting VIP customers..."
                  {...register('prompt')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Format</label>
                  <select
                    className="input"
                    style={{ background: 'rgba(10,15,28,0.6)', color: 'var(--text-primary)', cursor: 'pointer' }}
                    {...register('type')}
                  >
                    <option value="Email" style={{ background: '#111827' }}>Email</option>
                    <option value="SMS" style={{ background: '#111827' }}>SMS</option>
                  </select>
                </div>
                <div>
                  <label className="label">Tone</label>
                  <select
                    className="input"
                    style={{ background: 'rgba(10,15,28,0.6)', color: 'var(--text-primary)', cursor: 'pointer' }}
                    {...register('tone')}
                  >
                    {TONES.map(t => <option key={t} value={t} style={{ background: '#111827' }}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="bg-[var(--bg-app)] p-5 rounded-lg border border-[var(--border-subtle)] space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-1">Context (Optional)</h4>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Select segments or tags. The AI will tailor the messaging to this specific audience.
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label className="label">Segments</label>
                    <Controller
                      name="targetSegments"
                      control={control}
                      render={({ field }) => (
                        <SegmentSelector value={field.value} onChange={field.onChange} />
                      )}
                    />
                  </div>
                  <div>
                    <label className="label">Tags</label>
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

              <button
                type="submit"
                disabled={isGenerating || !watch('prompt')}
                className="w-full btn btn-primary"
                style={{ marginTop: 'auto', paddingTop: '10px', paddingBottom: '10px' }}
              >
                {isGenerating ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> Generating...</>
                ) : (
                  <><Sparkles size={16} className="mr-2" /> Generate Content</>
                )}
              </button>

            </form>
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="flex flex-col gap-6">
          <div className="card flex flex-col h-full min-h-[500px]">
            <div className="px-6 py-5 border-b border-[var(--border-subtle)] flex items-center justify-between shrink-0">
              <h2 className="heading-3 mb-0">Generated Content</h2>
              {output && (
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-white transition-colors p-1.5 rounded-md hover:bg-[var(--bg-surface-hover)]"
                >
                  {copied ? <CheckCircle2 size={14} className="text-[var(--status-success)]" /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy text'}
                </button>
              )}
            </div>

            <div className="flex-1 p-6 overflow-y-auto bg-[var(--bg-app)]">
              {!output && !isGenerating ? (
                <div className="h-full flex flex-col items-center justify-center text-[var(--text-tertiary)]">
                  <Wand2 size={40} className="mb-4 opacity-30" />
                  <p className="text-sm font-medium text-[var(--text-primary)]">Your generated content will appear here.</p>
                  <p className="text-xs mt-1 text-center max-w-xs text-[var(--text-secondary)]">Fill out the prompt on the left and click Generate to see the magic happen.</p>
                </div>
              ) : isGenerating ? (
                <div className="h-full flex flex-col items-center justify-center text-[var(--brand-ai)]">
                  <div className="relative w-16 h-16 mb-4">
                    <div className="absolute inset-0 border-4 border-[var(--brand-ai)]/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-[var(--brand-ai)] border-t-transparent rounded-full animate-spin"></div>
                    <Sparkles size={20} className="absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <p className="text-sm font-medium animate-pulse text-[var(--text-secondary)]">Nexus AI is thinking...</p>
                </div>
              ) : (
                <div className="prose prose-invert max-w-none text-sm text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
                  {output}
                </div>
              )}
            </div>

            {output && (
              <div className="p-6 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] shrink-0">
                <button 
                  onClick={handleCreateCampaign}
                  className="w-full btn bg-[var(--brand-premium)] hover:bg-[var(--brand-premium)]/90 text-white"
                >
                  Use in New Campaign <ArrowRight size={16} className="ml-2" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIGenerator;
