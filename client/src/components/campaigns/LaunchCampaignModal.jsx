import React, { useState } from 'react';
import { X, Send, AlertTriangle } from 'lucide-react';
import * as campaignService from '../../services/campaignService';
import { useToast } from '../../context/ToastContext';

const LaunchCampaignModal = ({ isOpen, onClose, campaign, onLaunchSuccess }) => {
  const [isLaunching, setIsLaunching] = useState(false);
  const { toast } = useToast();

  if (!isOpen || !campaign) return null;

  const handleLaunch = async () => {
    try {
      setIsLaunching(true);
      const response = await campaignService.launchCampaign(campaign._id);
      
      if (response.success) {
        toast.success(`Launched to ${response.data.metrics.sent} customers!`);
        onLaunchSuccess();
      }
    } catch (error) {
      console.error('Failed to launch campaign:', error);
      toast.error(error.response?.data?.error || 'Failed to launch campaign');
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--bg-surface)] w-full max-w-md rounded-xl shadow-2xl border border-[var(--border-color)] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
        
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Launch Campaign</h2>
          <button 
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
            disabled={isLaunching}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center text-[var(--accent-primary)] mx-auto mb-4">
            <Send className="w-8 h-8 ml-1" />
          </div>
          
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Ready to send?</h3>
          
          <p className="text-[var(--text-muted)] mb-4">
            You are about to launch <strong>"{campaign.name}"</strong> to all customers matching its target segments and tags.
          </p>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-left flex items-start space-x-3 text-yellow-400/90 text-sm">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Warning: Irreversible Action</p>
              <p>Once launched, the campaign status will be marked as Completed and activities will be logged on customer timelines. Emails will be simulated via the execution engine.</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-surface-hover)] flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[var(--text-primary)] hover:bg-[var(--bg-input)] rounded-md transition-colors font-medium border border-[var(--border-color)]"
            disabled={isLaunching}
          >
            Cancel
          </button>
          <button
            onClick={handleLaunch}
            disabled={isLaunching}
            className="px-4 py-2 bg-[var(--accent-primary)] text-white rounded-md hover:bg-[var(--accent-hover)] transition-colors font-medium shadow-[0_0_15px_rgba(var(--accent-primary-rgb),0.3)] disabled:opacity-50 flex items-center"
          >
            {isLaunching ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Launching...
              </>
            ) : (
              'Launch Now'
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default LaunchCampaignModal;
