import React from 'react';
import { Menu, LogOut, Bell, Sun, Moon, Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

const Topbar = ({ toggleSidebar }) => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <header className="topbar">
      {/* Hamburger (mobile) */}
      <button
        className="show-mobile -ml-1 p-2 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
        onClick={toggleSidebar}
        aria-label="Open menu"
      >
        <Menu size={19} />
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-1">

        {/* Quick new campaign */}
        <button
          onClick={() => navigate('/campaigns/new')}
          className="hidden sm:flex items-center gap-1.5 h-8 px-3 rounded-md text-[12.5px] font-medium transition-colors"
          style={{
            color: 'var(--gold)',
            background: 'var(--gold-dim)'
          }}
        >
          <Plus size={13} />
          New Campaign
        </button>

        {/* Notification bell */}
        <button
          onClick={() => toast.info('No new notifications')}
          className="relative p-2 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
          aria-label="Notifications"
        >
          <Bell size={17} />
          <span className="absolute top-[7px] right-[7px] w-1.5 h-1.5 rounded-full" style={{ background: 'var(--gold)' }} />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Divider */}
        <div className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />

        {/* Log out */}
        <button
          onClick={logout}
          className="flex items-center gap-1.5 h-8 px-3 rounded-md text-[12.5px] font-medium text-[var(--text-muted)] hover:text-red-400 hover:bg-[rgba(248,113,113,0.08)] transition-colors"
        >
          <LogOut size={14} />
          <span className="hide-mobile">Sign out</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
