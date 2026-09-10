import React from 'react';
import { Menu, Bell, Plus, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Topbar = ({ toggleMobileSidebar }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Generate simple breadcrumbs from location
  const pathParts = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathParts.map((part, index) => {
    const isLast = index === pathParts.length - 1;
    const title = part.charAt(0).toUpperCase() + part.slice(1).replace('-', ' ');
    return { title, isLast };
  });

  return (
    <header className="h-[var(--header-height)] px-6 lg:px-8 flex items-center justify-between shrink-0 w-full bg-[var(--bg-app)] border-b border-[var(--border-subtle)] sticky top-0 z-40">
      
      {/* Left Area: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          className="lg:hidden p-1.5 -ml-1.5 text-[var(--text-secondary)] hover:text-white rounded-lg transition-colors shrink-0"
          onClick={toggleMobileSidebar}
        >
          <Menu size={20} />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-sm">
          {breadcrumbs.length > 0 ? (
            breadcrumbs.map((bc, i) => (
              <React.Fragment key={i}>
                <span className={bc.isLast ? 'text-white font-semibold' : 'text-[var(--text-secondary)]'}>
                  {bc.title}
                </span>
                {!bc.isLast && <ChevronRight size={14} className="text-[var(--text-tertiary)]" />}
              </React.Fragment>
            ))
          ) : (
            <span className="text-white font-semibold">Overview</span>
          )}
        </div>
      </div>

      {/* Right Area: Actions */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        
        <button
          onClick={() => navigate('/campaigns/new')}
          className="btn btn-primary h-8 px-3 rounded-lg text-xs"
        >
          <Plus size={14} />
          <span className="hidden sm:inline">New Campaign</span>
        </button>

        <div className="w-px h-5 bg-[var(--border-strong)] hidden sm:block mx-1" />

        <button
          className="relative p-1.5 text-[var(--text-secondary)] hover:text-white rounded-lg transition-colors"
          title="Notifications (coming soon)"
          onClick={() => {}}
        >
          <Bell size={18} />
        </button>

        <div
          onClick={() => navigate('/settings')}
          title={user?.name || 'Profile'}
          className="w-8 h-8 rounded-full bg-[var(--brand-primary)]/20 border border-[var(--brand-primary)]/40 text-[var(--brand-primary)] flex items-center justify-center shrink-0 font-bold text-xs ml-2 cursor-pointer hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/30 transition-colors"
        >
          <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
