import React from 'react';
import { 
  Users, Edit3, MessageSquare, Sparkles, 
  Megaphone, Activity, Clock 
} from 'lucide-react';

const CustomerTimeline = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'customer_created': return <Users size={16} style={{ color: 'var(--brand-primary)' }} />;
      case 'customer_updated': return <Edit3 size={16} style={{ color: 'var(--brand-primary)' }} />;
      case 'note_added': return <MessageSquare size={16} style={{ color: '#F59E0B' }} />;
      case 'campaign_generated': return <Sparkles size={16} style={{ color: 'var(--status-success)' }} />;
      case 'campaign_assigned': return <Megaphone size={16} style={{ color: 'var(--brand-premium)' }} />;
      case 'status_changed': return <Activity size={16} style={{ color: '#F59E0B' }} />;
      default: return <Clock size={16} style={{ color: 'var(--text-tertiary)' }} />;
    }
  };

  const getActivityBg = (type) => {
    switch (type) {
      case 'note_added': return { background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' };
      case 'campaign_generated': return { background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' };
      case 'status_changed': return { background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' };
      case 'campaign_assigned': return { background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)' };
      default: return { background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' };
    }
  };

  if (!activities.length) {
    return (
      <div className="p-8 text-center text-[var(--text-tertiary)] text-sm">
        No activity recorded yet.
      </div>
    );
  }

  return (
    <div className="relative ml-4 my-2" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Glowing Vertical Axis */}
      <div className="absolute top-2 bottom-2 left-0 w-0.5" style={{ background: 'linear-gradient(to bottom, rgba(59,130,246,0.5), transparent)' }} />

      {activities.map((activity, idx) => (
        <div key={activity._id || idx} className="relative pl-7 group">
          {/* Timeline Dot Icon */}
          <div 
            className="absolute -left-[17px] top-3.5 w-[34px] h-[34px] rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110"
            style={getActivityBg(activity.type)}
          >
            {getActivityIcon(activity.type)}
          </div>
          
          {/* Content Card */}
          <div className="card transition-all duration-300 hover:translate-x-1" style={{ padding: '20px', background: 'var(--bg-app)' }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                  {activity.title}
                </h4>
                <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                  {activity.description}
                </p>
              </div>
              <div className="text-[11px] text-[var(--text-tertiary)] flex items-center gap-1.5 shrink-0 whitespace-nowrap px-2.5 py-1 rounded-full border border-[var(--border-subtle)]" style={{ background: 'rgba(0,0,0,0.2)' }}>
                <Clock size={12} style={{ color: 'var(--brand-primary)' }} />
                {new Date(activity.createdAt).toLocaleString(undefined, {
                  month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                })}
              </div>
            </div>
            
            <div className="mt-3 text-xs text-[var(--text-tertiary)] flex items-center gap-2 pt-3 border-t border-[var(--border-subtle)]">
               <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: 'rgba(59,130,246,0.2)', color: 'var(--brand-primary)' }}>
                 {activity.userName?.charAt(0)?.toUpperCase() || 'U'}
               </div>
               <span className="font-medium text-[var(--text-secondary)]">{activity.userName || 'System'}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerTimeline;
