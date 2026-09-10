import React, { useState } from 'react';
import { X, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import * as aiService from '../../services/aiService';

const TEMPLATES = [
  { id: 'welcome', label: 'Welcome Series', prompt: 'Write a warm, welcoming email to new subscribers introducing our brand and offering a 10% discount code (WELCOME10).' },
  { id: 'flash_sale', label: 'Flash Sale', prompt: 'Write an urgent, exciting message announcing a 24-hour flash sale with up to 50% off select items.' },
  { id: 'reengage', label: 'Re-engagement', prompt: 'Write a "we miss you" message to inactive customers, highlighting what\'s new and offering a special incentive to return.' },
  { id: 'newsletter', label: 'Newsletter', prompt: 'Write an engaging monthly newsletter introduction summarizing our latest product launches and community news.' },
];

const TONES = ['Professional', 'Casual', 'Urgent', 'Humorous', 'Empathetic'];

const AIGeneratorModal = ({ isOpen, onClose, onApply, campaignContext }) => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('Professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  if (!isOpen) return null;

  const handleTemplateClick = (templatePrompt) => {
    setPrompt(templatePrompt);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    try {
      setIsGenerating(true);
      const response = await aiService.generateContent({
        prompt,
        tone,
        type: campaignContext?.type || 'Email',
        template: 'Custom/Quick Template',
        targetSegments: campaignContext?.targetSegments,
        targetTags: campaignContext?.targetTags,
      });

      if (response.success) {
        setGeneratedContent(response.data);
      }
    } catch (error) {
      console.error('Failed to generate content:', error);
      toast.error('Failed to generate content. Check your API key or try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (generatedContent) {
      onApply(generatedContent);
      onClose();
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content" style={{ maxWidth: '800px', width: '95%' }}>
        
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-2 text-[var(--gold)]">
            <Sparkles size={18} />
            <h2 className="text-base font-semibold text-[var(--text-primary)]">AI Content Generator</h2>
          </div>
          <button onClick={onClose} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors rounded-md hover:bg-[var(--bg-input)]">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-body scrollbar-hide">
          
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '24px', height: '100%' }}>
            
            {/* Left Column: Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Context Summary */}
              <div className="bg-[var(--bg-input)] border border-[var(--border)] rounded-lg" style={{ padding: '12px' }}>
                <p className="text-[var(--text-muted)] mb-1 font-medium text-[12px]">Campaign Context:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: '16px', rowGap: '4px', fontSize: '12px' }}>
                  <p><span className="text-[var(--text-secondary)]">Type:</span> <span className="text-[var(--text-primary)]">{campaignContext?.type}</span></p>
                  <p><span className="text-[var(--text-secondary)]">Segments:</span> <span className="text-[var(--brand-primary)]">{campaignContext?.targetSegments?.length ? campaignContext.targetSegments.join(', ') : 'All'}</span></p>
                </div>
              </div>

              {/* Templates */}
              <div>
                <label className="text-[12px] font-medium text-[var(--text-secondary)] mb-2 block">Quick Templates</label>
                <div className="flex flex-wrap gap-2">
                  {TEMPLATES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => handleTemplateClick(t.prompt)}
                      className="px-2.5 py-1.5 text-[11px] font-medium rounded-md border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--gold-border)] hover:text-[var(--gold)] transition-colors"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone Selection */}
              <div>
                <label className="text-[12px] font-medium text-[var(--text-secondary)] mb-2 block">Tone of Voice</label>
                <select 
                  className="input"
                  style={{ height: '32px', fontSize: '13px', background: 'rgba(10,15,28,0.6)', color: 'var(--text-primary)', cursor: 'pointer' }}
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  {TONES.map(t => <option key={t} value={t} style={{ background: '#111827' }}>{t}</option>)}
                </select>
              </div>

              {/* Custom Prompt */}
              <div className="flex-1 flex flex-col" style={{ minHeight: '150px' }}>
                <label className="text-[12px] font-medium text-[var(--text-secondary)] mb-2 block">Custom Instructions</label>
                <textarea
                  className="input flex-1 w-full"
                  style={{ resize: 'none', fontSize: '13px', padding: '12px' }}
                  placeholder="Describe what you want the AI to write..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <button 
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="btn btn-primary w-full justify-center"
              >
                {isGenerating ? (
                  <><Loader2 size={16} className="animate-spin mr-2" /> Generating...</>
                ) : (
                  <><Sparkles size={16} className="mr-2" /> Generate Content</>
                )}
              </button>

            </div>

            {/* Right Column: Output */}
            <div className="flex flex-col h-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg overflow-hidden">
              <div className="bg-[var(--bg-input)] border-b border-[var(--border)] shrink-0" style={{ padding: '12px' }}>
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">Generated Output</span>
              </div>
              
              <div className="flex-1 overflow-auto" style={{ padding: '16px' }}>
                {isGenerating ? (
                  <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] space-y-3">
                    <Loader2 size={24} className="animate-spin text-[var(--gold)]" />
                    <p className="text-[13px] animate-pulse">Crafting your message...</p>
                  </div>
                ) : generatedContent ? (
                  <div className="text-[13px] text-[var(--text-primary)] whitespace-pre-wrap font-mono leading-relaxed">
                    {generatedContent}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)]">
                    <Sparkles size={32} className="opacity-20 mb-3" />
                    <p className="text-[13px] text-center max-w-[200px]">Your generated content will appear here.</p>
                  </div>
                )}
              </div>

              {generatedContent && !isGenerating && (
                <div className="p-3 border-t border-[var(--border)] bg-[var(--bg-input)] shrink-0">
                  <button 
                    onClick={handleApply}
                    className="btn btn-primary w-full justify-center text-[13px]"
                  >
                    Apply to Campaign <ArrowRight size={14} className="ml-1" />
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default AIGeneratorModal;
