import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Tags,
  Megaphone,
  Sparkles,
  Settings,
  PanelLeftClose,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ isMobileOpen, isDesktopClosed, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Customers',
      path: '/customers',
      icon: Users,
    },
    {
      name: 'Segments & Tags',
      path: '/segments',
      icon: Tags,
    },
    {
      name: 'Campaigns',
      path: '/campaigns',
      icon: Megaphone,
    },
  ];

  if (user?.role === 'Admin' || user?.role === 'Marketing Manager') {
    navItems.push({
      name: 'AI Generator',
      path: '/ai-generator',
      icon: Sparkles,
    });
  }

  const bottomItems = [
    {
      name: 'Team',
      path: '/team',
      icon: ShieldCheck,
      adminOnly: true,
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
      adminOnly: false,
    },
  ];

  const handleNav = () => {
    if (window.innerWidth <= 1024) {
      toggleSidebar();
    }
  };

  const getNavClass = (path) => {
    const isActive = location.pathname.startsWith(path);

    return `
      group
      flex items-center
      w-full
      gap-3
      rounded-lg
      text-base font-medium
      transition-all duration-200
      ${isActive
        ? `
            bg-[var(--brand-premium)]/10
            text-[var(--brand-premium)]
          `
        : `
            text-[var(--text-secondary)]
            hover:bg-[var(--bg-surface-hover)]
            hover:text-[var(--brand-premium)]
          `
      }
    `;
  };

  const navStyle = { padding: '12px 16px' };

  return (
    <aside
      className={`
        fixed lg:static
        inset-y-0 left-0
        z-50

        flex flex-col
        shrink-0

        w-[240px]
        h-screen

        bg-[var(--bg-app)]
        border-r border-[var(--border-subtle)]

        transition-transform duration-300 ease-in-out

        ${isMobileOpen
          ? 'translate-x-0'
          : '-translate-x-full lg:translate-x-0'
        }
        ${isDesktopClosed ? 'lg:hidden' : 'lg:flex'}
      `}
    >
      {/* =========================================================
          BRAND HEADER
      ========================================================== */}
      <div
        className="
          h-[var(--header-height)]
          min-h-[64px]

          flex items-center justify-between

          px-5

          shrink-0

          border-b
          border-[var(--border-subtle)]
          lg:border-transparent
        "
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Logo */}
          <div
            className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl overflow-hidden shadow-lg border border-[var(--border-subtle)]"
          >
            <img src="/logo.png" alt="Nexus Logo" className="w-full h-full object-cover" />
          </div>

          {/* Brand */}
          <div className="flex flex-col justify-center min-w-0">
            <span
              style={{ fontFamily: 'Michroma, sans-serif' }}
              className="
                text-lg
                leading-none
                text-white
                whitespace-nowrap
                tracking-wide
              "
            >
              NEXUS
            </span>

            <span
              className="
                mt-1
                text-[var(--brand-primary)]
                text-[10px]
                uppercase
                tracking-[0.2em]
                font-sans
                font-bold
                leading-none
                whitespace-nowrap
              "
            >
              CRM
            </span>
          </div>
        </div>

        <button
          type="button"
          aria-label="Hide navigation"
          className="
            flex items-center justify-center
            w-8 h-8
            rounded-lg
            text-[var(--brand-premium)]
            hover:bg-[var(--brand-premium)]/10
            transition-colors
          "
          onClick={toggleSidebar}
        >
          <PanelLeftClose size={18} strokeWidth={2} />
        </button>
      </div>

      {/* =========================================================
          MAIN NAVIGATION
      ========================================================== */}
      <div
        className="
          flex-1
          min-h-0

          overflow-y-auto

          px-3
          py-5
        "
      >
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={handleNav}
                className={getNavClass(item.path)}
                style={navStyle}
              >
                <Icon
                  size={25}
                  strokeWidth={2}
                  className="
                    shrink-0
                    transition-transform duration-200
                    group-hover:scale-[1.03]
                  "
                />

                <span className="truncate">
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* =========================================================
          BOTTOM SECTION
      ========================================================== */}
      <div
        className="
          shrink-0

          px-3
          pt-5
          pb-4
        "
      >
        {/* Bottom Navigation */}
        <nav className="flex flex-col gap-1.5 mb-5">
          {bottomItems.map((item) => {
            if (item.adminOnly && user?.role !== 'Admin') {
              return null;
            }

            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={handleNav}
                className={getNavClass(item.path)}
                style={navStyle}
              >
                <Icon
                  size={25}
                  strokeWidth={2}
                  className="shrink-0"
                />

                <span className="truncate">
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* =======================================================
            USER PROFILE
        ======================================================== */}
        <div
          className="
            pt-4

            border-t
            border-[var(--border-subtle)]
          "
        >
          <div
            className="
              flex items-center

              gap-3

              px-2.5
              py-2

              rounded-lg

              min-w-0
            "
          >
            {/* Avatar */}
            <div
              className="
                w-9 h-9
                shrink-0

                flex items-center justify-center

                rounded-full

                bg-[var(--bg-surface-hover)]

                border
                border-[var(--border-strong)]

                text-[var(--text-secondary)]

                font-semibold
                text-xs
              "
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>

            {/* User info */}
            <div className="flex-1 min-w-0">
              <p
                className="
                  text-sm
                  font-medium
                  text-white
                  truncate
                "
              >
                {user?.name || 'User'}
              </p>

              <p
                className="
                  mt-0.5

                  text-xs
                  text-[var(--text-tertiary)]

                  truncate
                "
              >
                {user?.role || 'Member'}
              </p>
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={logout}
              title="Sign Out"
              aria-label="Sign Out"
              className="
                w-8 h-8
                shrink-0

                flex items-center justify-center

                rounded-lg

                text-[var(--text-tertiary)]

                hover:text-[var(--status-error)]
                hover:bg-[var(--bg-surface-hover)]

                transition-colors
              "
            >
              <LogOut size={16} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;