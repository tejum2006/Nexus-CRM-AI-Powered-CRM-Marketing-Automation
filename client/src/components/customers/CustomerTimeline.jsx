import React from 'react';
import { 
  Users, Edit3, MessageSquare, Sparkles, 
  Megaphone, Activity, Clock 
} from 'lucide-react';

const CustomerTimeline = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'customer_created': return <Users size={16} className="text-[var(--text-secondary)]" />;
      case 'customer_updated': return <Edit3 size={16} className="text-[var(--text-secondary)]" />;
      case 'note_added': return <MessageSquare size={16} className="text-[var(--gold-light)]" />;
      case 'campaign_generated': return <Sparkles size={16} className="text-[var(--jade)]" />;
      case 'campaign_assigned': return <Megaphone size={16} className="text-[var(--text-secondary)]" />;
      case 'status_changed': return <Activity size={16} className="text-[var(--gold)]" />;
      default: return <Clock size={16} className="text-[var(--text-muted)]" />;
    }
  };

  const getActivityBg = (type) => {
    switch (type) {
      case 'note_added': return 'bg-[rgba(232,184,109,0.1)] border-[rgba(232,184,109,0.2)]';
      case 'campaign_generated': return 'bg-[rgba(52,211,153,0.1)] border-[rgba(52,211,153,0.2)]';
      case 'status_changed': return 'bg-[rgba(200,135,74,0.1)] border-[rgba(200,135,74,0.2)]';
      default: return 'bg-[var(--bg-elevated)] border-[var(--border)]';
    }
  };

  if (!activities.length) {
    return (
      <div className="p-8 text-center text-[var(--text-muted)] text-sm">
        No activity recorded yet.
      </div>
    );
  }

  return (
    <div className="relative border-l border-[var(--border)] ml-4 my-2 space-y-8">
      {activities.map((activity, idx) => (
        <div key={activity._id || idx} className="relative pl-6 group">
          {/* Timeline Dot */}
          <div className={`absolute -left-[17px] w-[34px] h-[34px] rounded-full border-2 border-[var(--bg-base)] flex items-center justify-center shadow-sm ${getActivityBg(activity.type)} transition-transform group-hover:scale-110`}>
            {getActivityIcon(activity.type)}
          </div>
          
          {/* Content */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4 shadow-sm hover:border-[var(--gold-border)] transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-[14px] font-medium text-[var(--text-primary)]">
                  {activity.title}
                </h4>
                <p className="text-[13px] text-[var(--text-secondary)] mt-1">
                  {activity.description}
                </p>
              </div>
              <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                <Clock size={12} />
                {new Date(activity.createdAt).toLocaleString(undefined, {
                  month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                })}
              </div>
            </div>
            
            <div className="mt-3 text-[12px] text-[var(--text-muted)] flex items-center gap-1.5 border-t border-[var(--border)] pt-3">
               <div className="w-5 h-5 rounded-full bg-[var(--bg-input)] flex items-center justify-center text-[10px] font-medium border border-[var(--border)]">
                 {activity.userName?.charAt(0)?.toUpperCase() || 'U'}
               </div>
               <span>{activity.userName || 'System'}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerTimeline;
