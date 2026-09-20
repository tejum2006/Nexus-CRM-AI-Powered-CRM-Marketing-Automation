import React from 'react';
import { Menu, Bell, Plus, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Topbar = ({ toggleSidebar, isDesktopClosed }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="h-[var(--header-height)] px-6 lg:px-8 flex items-center justify-between shrink-0 w-full bg-[var(--bg-app)] border-b border-[var(--border-subtle)] sticky top-0 z-40">
      
      {/* Left Area: Mobile Toggle & Conditional Brand */}
      <div className="flex items-center min-w-0">
        <button
          className={`p-1.5 -ml-1.5 mr-3 text-[var(--brand-premium)] hover:bg-[var(--brand-premium)]/10 rounded-lg transition-colors shrink-0 ${isDesktopClosed ? '' : 'lg:hidden'}`}
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </button>

        {/* Show brand on mobile, OR on desktop if sidebar is closed */}
        <div className={`items-center gap-3 min-w-0 flex ${isDesktopClosed ? '' : 'lg:hidden'}`}>
          <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg overflow-hidden shadow-lg border border-[var(--border-subtle)]">
            <img src="/logo.png" alt="Nexus Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <span style={{ fontFamily: 'Michroma, sans-serif' }} className="text-base leading-none text-white whitespace-nowrap tracking-wide">
              NEXUS
            </span>
            <span className="mt-0.5 text-[var(--brand-primary)] text-[9px] uppercase tracking-[0.2em] font-sans font-bold leading-none whitespace-nowrap">
              CRM
            </span>
          </div>
        </div>
      </div>

        {/* Right Area: Actions */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">

        <button
          className="relative p-1.5 text-[var(--brand-premium)] hover:bg-[var(--brand-premium)]/10 rounded-lg transition-colors"
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
