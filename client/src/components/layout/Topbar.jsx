import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, CheckCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Topbar = ({ toggleSidebar, isDesktopClosed }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

        <div className="relative" ref={notifRef}>
          <button
            className={`relative p-2 rounded-lg transition-colors ${
              isNotifOpen 
                ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]' 
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]'
            }`}
            onClick={() => setIsNotifOpen(!isNotifOpen)}
          >
            <Bell size={18} />
          </button>

          {isNotifOpen && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
              <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-app)]">
                <h3 className="font-semibold text-[var(--text-primary)] text-sm">Notifications</h3>
                <button className="text-xs text-[var(--brand-primary)] hover:text-[var(--brand-premium)] transition-colors">
                  Mark all as read
                </button>
              </div>
              <div className="p-8 flex flex-col items-center justify-center text-center bg-[var(--bg-surface)]">
                <div className="w-12 h-12 rounded-full bg-[var(--bg-surface-hover)] flex items-center justify-center mb-3">
                  <CheckCircle size={24} className="text-[var(--text-tertiary)]" />
                </div>
                <p className="text-[var(--text-primary)] font-medium text-sm">You're all caught up!</p>
                <p className="text-[var(--text-secondary)] text-xs mt-1">No new notifications right now.</p>
              </div>
            </div>
          )}
        </div>

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
