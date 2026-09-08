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
    // We pass the generated content and context to the Campaign Builder via state
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
    <div className="page-enter flex flex-col h-full min-h-0">
      
      {/* Header */}
      <div className="page-header shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-display flex items-center gap-2 mb-1">
            <Sparkles size={24} className="text-[var(--gold)]" />
            AI Generator Workspace
          </h1>
          <p className="text-body">A dedicated sandbox to brainstorm, test prompts, and generate marketing copy.</p>
        </div>
      </div>

      {/* Split Pane Workspace */}
      <div className="grid lg:grid-cols-[minmax(360px,0.8fr)_minmax(500px,1.2fr)] flex-1 min-h-0 px-4 sm:px-6 lg:px-8 pb-6 gap-6">
        
        {/* Left Pane: Controls */}
        <div className="flex flex-col h-full min-h-[500px]">
          <div className="card flex flex-col h-full overflow-hidden border-t-4 border-t-[var(--gold)]">
            <div className="p-5 border-b border-[var(--border)] bg-[var(--bg-elevated)] shrink-0">
               <h2 className="text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
                 <Wand2 size={16} className="text-[var(--text-muted)]" />
                 Generation Parameters
               </h2>
            </div>
            
            <div className="flex-1 overflow-auto p-5 bg-[var(--bg-card)] space-y-6">
              
              <form id="ai-form" onSubmit={handleSubmit(handleGenerate)} className="space-y-5">
                
                {/* Prompt & Templates */}
                <div>
                  <label className="label">What should the AI write about?</label>
                  <textarea 
                    className="input w-full min-h-[120px] resize-y text-[13px]" 
                    placeholder="e.g. Write a catchy email introducing our new Fall collection..."
                    {...register('prompt')}
                  />
                  
                  <div className="mt-3">
                    <p className="text-[11px] text-[var(--text-muted)] mb-2 uppercase tracking-wider font-semibold">Quick Start Templates</p>
                    <div className="grid grid-cols-2 gap-2">
                      {TEMPLATES.map(t => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => handleTemplateClick(t.prompt)}
                          className="flex items-center gap-2 p-2 text-left bg-[var(--bg-input)] border border-[var(--border)] rounded-md hover:border-[var(--gold-border)] hover:bg-[rgba(248,186,51,0.05)] transition-all group"
                        >
                          <t.icon size={14} className="text-[var(--text-muted)] group-hover:text-[var(--gold)]" />
                          <span className="text-[12px] font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tone & Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Format</label>
                    <select className="input text-[13px]" {...register('type')}>
                      <option value="Email">Email</option>
                      <option value="SMS">SMS</option>
                      <option value="Ad Copy">Ad Copy</option>
                      <option value="Social Post">Social Post</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Tone of Voice</label>
                    <select className="input text-[13px]" {...register('tone')}>
                      {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                {/* Target Audience Context */}
                <div className="pt-4 border-t border-[var(--border)] space-y-4">
                  <h3 className="text-[12px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Audience Context (Optional)</h3>
                  
                  <div>
                    <label className="label mb-1">Target Segments</label>
                    <Controller
                      name="targetSegments"
                      control={control}
                      render={({ field }) => (
                        <SegmentSelector value={field.value} onChange={field.onChange} />
                      )}
                    />
                  </div>
                  
                  <div>
                    <label className="label mb-1">Target Tags</label>
                    <Controller
                      name="targetTags"
                      control={control}
                      render={({ field }) => (
                        <TagInput value={field.value} onChange={field.onChange} />
                      )}
                    />
                  </div>
                </div>

              </form>
            </div>
            
            <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-elevated)] shrink-0">
               <button 
                  type="submit" 
                  form="ai-form"
                  disabled={isGenerating}
                  className="btn btn-primary w-full text-[14px] py-2.5 shadow-lg shadow-[rgba(248,186,51,0.15)]"
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="animate-spin" size={16} /> Generating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles size={16} /> Generate Copy
                    </span>
                  )}
                </button>
            </div>
          </div>
        </div>

        {/* Right Pane: Output Workspace */}
        <div className="flex flex-col h-full min-h-[500px]">
          <div className="card flex flex-col h-full overflow-hidden shadow-2xl relative">
            
            <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-elevated)] flex justify-between items-center shrink-0">
               <h2 className="text-[13px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Output Workspace</h2>
               
               {output && (
                 <div className="flex items-center gap-2">
                   <button 
                     onClick={handleCopy}
                     className="btn bg-transparent border border-[var(--border)] hover:bg-[var(--bg-input)] text-[12px] px-3 py-1.5"
                   >
                     {copied ? <CheckCircle2 size={14} className="text-green-400 mr-1.5" /> : <Copy size={14} className="text-[var(--text-muted)] mr-1.5" />}
                     {copied ? 'Copied!' : 'Copy'}
                   </button>
                   <button 
                     onClick={handleCreateCampaign}
                     className="btn bg-[var(--gold-dim)] border border-[var(--gold-border)] text-[var(--gold-light)] hover:text-[var(--gold)] text-[12px] px-3 py-1.5 transition-colors group"
                   >
                     Create Campaign <ArrowRight size={14} className="ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                   </button>
                 </div>
               )}
            </div>

            <div className="flex-1 p-6 overflow-auto bg-[var(--bg-base)] relative">
               {isGenerating ? (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--bg-base)] z-10 animate-pulse">
                    <div className="w-16 h-16 rounded-full border-4 border-[var(--bg-input)] border-t-[var(--gold)] animate-spin mb-4" />
                    <p className="text-[var(--gold)] font-medium tracking-wider text-sm">Gemini is writing...</p>
                 </div>
               ) : output ? (
                 <div className="prose prose-invert max-w-none">
                   <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-[var(--text-primary)] font-medium">
                     {output}
                   </p>
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="opacity-40 flex flex-col items-center">
                      <Sparkles size={48} className="mb-4 text-[var(--text-muted)]" />
                      <p className="text-[15px] text-[var(--text-secondary)] font-medium">Your generated content will appear here.</p>
                      <p className="text-[13px] text-[var(--text-muted)] mt-2 max-w-sm">Use the controls on the left to set up your prompt and target audience context.</p>
                    </div>
                 </div>
               )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AIGenerator;
