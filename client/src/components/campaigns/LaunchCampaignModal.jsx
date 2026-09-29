import React, { useState } from 'react';
import { X, Send, AlertTriangle } from 'lucide-react';
import * as campaignService from '../../services/campaignService';
import { useToast } from '../../context/ToastContext';

const LaunchCampaignModal = ({ isOpen, onClose, campaign, onLaunchSuccess }) => {
  const [isLaunching, setIsLaunching] = useState(false);
  const [isSimulation, setIsSimulation] = useState(true);
  const [testEmail, setTestEmail] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  if (!isOpen || !campaign) return null;

  const handleLaunch = async () => {
    try {
      setIsLaunching(true);
      const response = await campaignService.launchCampaign(campaign._id, isSimulation);
      
      if (response.success) {
        toast.success(isSimulation ? `Simulated launch to ${response.data.metrics.sent} customers!` : `Emails successfully sent to ${response.data.metrics.sent} customers!`);
        onLaunchSuccess();
      }
    } catch (error) {
      console.error('Failed to launch campaign:', error);
      toast.error(error.response?.data?.error || 'Failed to launch campaign');
    } finally {
      setIsLaunching(false);
    }
  };

  const handleSendTest = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      return toast.error('Please enter a valid test email address.');
    }
    
    try {
      setIsTesting(true);
      const response = await campaignService.sendTestEmail(campaign._id, testEmail);
      if (response.success) {
        toast.success('Test email sent successfully!');
      }
    } catch (error) {
      console.error('Failed to send test email:', error);
      toast.error(error.response?.data?.error || 'Failed to send test email');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-[var(--bg-surface)] w-full max-w-lg rounded-2xl shadow-2xl border border-[var(--border-subtle)] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
        
        <div className="flex items-center justify-between p-5 px-8 border-b border-[var(--border-subtle)]">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Launch Campaign</h2>
          <button 
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--brand-premium)] transition-colors p-1"
            disabled={isLaunching || isTesting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 text-center flex flex-col gap-6">
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[var(--brand-primary)]/20 flex items-center justify-center text-[var(--brand-primary)] mb-4">
              <Send className="w-8 h-8 ml-1" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Ready to send?</h3>
            <p className="text-[var(--text-muted)] text-[15px]">
              You are about to launch <strong>"{campaign.name}"</strong> to all matching customers.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="text-left bg-[var(--bg-app)] border border-[var(--border-subtle)] rounded-xl p-5 shadow-sm transition-all">
              <label className="flex items-center space-x-4 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={!isSimulation} 
                  onChange={(e) => setIsSimulation(!e.target.checked)}
                  className="w-5 h-5 rounded text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] bg-[var(--bg-input)] border-[var(--border-strong)]"
                />
                <span className="text-[16px] font-semibold text-[var(--text-primary)]">
                  Send Real Emails via SendGrid
                </span>
              </label>
              <p className="text-[14px] text-[var(--text-secondary)] mt-2 ml-9">
                {isSimulation ? "Currently in Simulation Mode. No real emails will be sent." : "Warning: Real emails will be dispatched to customer email addresses."}
              </p>
            </div>

            {!isSimulation && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-left flex items-start space-x-3 text-yellow-500 text-[14px] shadow-sm animate-in fade-in slide-in-from-top-2">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold mb-1">Warning: Irreversible Action</p>
                  <p>This will consume your email quota and send real emails to your customers.</p>
                </div>
              </div>
            )}

            <div className="text-left bg-[var(--bg-app)] border border-[var(--border-subtle)] rounded-xl p-5 shadow-sm">
              <label className="text-[15px] font-semibold text-[var(--text-primary)] mb-3 block">Send Test Email</label>
              <div className="flex gap-3">
                <input 
                  type="email" 
                  placeholder="test@example.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="input flex-1 bg-[var(--bg-surface)] py-2.5 px-4"
                  disabled={isLaunching || isTesting}
                />
                <button 
                  onClick={handleSendTest}
                  disabled={isLaunching || isTesting || !testEmail}
                  className="btn btn-secondary shrink-0 px-5 font-semibold"
                >
                  {isTesting ? 'Sending...' : 'Send Test'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 px-8 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-hover)] flex justify-between">
          <button
            onClick={onClose}
            className="px-10 py-3.5 text-[var(--text-primary)] hover:bg-[var(--bg-input)] rounded-xl transition-colors font-bold border border-[var(--border-strong)]"
            disabled={isLaunching || isTesting}
          >
            Cancel
          </button>
          <button
            onClick={handleLaunch}
            disabled={isLaunching || isTesting}
            className={`px-10 py-3.5 text-white rounded-xl transition-colors font-bold shadow-lg disabled:opacity-50 flex items-center justify-center ${isSimulation ? 'bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)]' : 'bg-green-600 hover:bg-green-500'}`}
          >
            {isLaunching ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                {isSimulation ? 'Simulating...' : 'Sending...'}
              </>
            ) : (
              isSimulation ? 'Simulate Launch' : 'Send Real Campaign'
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default LaunchCampaignModal;
