import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Tags, Megaphone, Sparkles,
  Settings, X, Hexagon, ChevronRight, Users2
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard',      path: '/dashboard',     icon: LayoutDashboard },
    { name: 'Customers',      path: '/customers',     icon: Users },
    { name: 'Segments & Tags',path: '/segments',      icon: Tags },
    { name: 'Campaigns',      path: '/campaigns',     icon: Megaphone },
  ];

  if (user?.role === 'Admin' || user?.role === 'Marketing Manager') {
    navItems.push({ name: 'AI Generator', path: '/ai-generator', icon: Sparkles });
  }

  const handleNav = () => {
    if (window.innerWidth <= 1024) toggleSidebar();
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={toggleSidebar}
      />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>

        {/* Logo */}
        <div className="flex items-center justify-between px-5"
          style={{ height: 'var(--topbar-h)', minHeight: 'var(--topbar-h)' }}>
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Nexus" className="w-9 h-9 shrink-0 rounded-lg object-cover" />
            <span className="font-bold text-[19px] tracking-tight text-[var(--text-primary)]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Nexus
            </span>
          </div>
          <button
            className="show-mobile p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          <p className="text-label px-3 mb-2">Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={handleNav}
            >
              <item.icon size={15} className="nav-icon shrink-0 opacity-80" />
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Bottom: admin + profile */}
        <div>

          {/* Admin links */}
          {user?.role === 'Admin' && (
            <div className="px-3 pt-3 pb-1 space-y-0.5">
              <NavLink
                to="/team"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={handleNav}
              >
                <Users2 size={15} className="nav-icon shrink-0 opacity-80" />
                Team
              </NavLink>
              <NavLink
                to="/settings"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={handleNav}
              >
                <Settings size={15} className="nav-icon shrink-0 opacity-80" />
                Settings
              </NavLink>
            </div>
          )}

          {/* User Profile */}
          <div
            className="flex items-center gap-3 px-4 py-4 cursor-pointer hover:bg-[var(--bg-hover)] transition-colors group"
            onClick={() => { navigate('/settings'); handleNav(); }}
            role="button"
            tabIndex={0}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[13px] font-semibold"
              style={{
                background: 'var(--gold-dim)',
                color: 'var(--gold-light)',
              }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-[13.5px] font-medium text-[var(--text-primary)] truncate leading-tight">
                {user?.name || 'User'}
              </p>
              <p className="text-[11.5px] text-[var(--text-muted)] truncate leading-tight mt-0.5">
                {user?.role || 'Member'}
              </p>
            </div>
            <ChevronRight size={14} className="text-[var(--text-faint)] group-hover:text-[var(--text-muted)] transition-colors shrink-0" />
          </div>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
