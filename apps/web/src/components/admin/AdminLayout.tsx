import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Scroll,
  PlusCircle,
  MessageSquareHeart,
  Images,
  LogOut,
  ExternalLink,
  Menu,
  X,
  User,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { BrandLogo } from '../public/BrandLogo.js';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  subtitle,
  actions,
  breadcrumbs = [],
}) => {
  const { adminUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Memorials', href: '/admin/memorials', icon: Scroll },
    { label: 'New Memorial', href: '/admin/memorials/new', icon: PlusCircle },
    { label: 'Tributes & Moderation', href: '/admin/tributes', icon: MessageSquareHeart },
    { label: 'Media Library', href: '/admin/media', icon: Images },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col md:flex-row antialiased">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-3 py-3 bg-header-silver text-brand-primary border-b border-brand-primary/15 sticky top-0 z-40 shadow-sm">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 min-[360px]:gap-2.5">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-lg text-brand-primary hover:bg-brand-white/40 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <BrandLogo
            variant="horizontal"
            size="small"
            className="w-[106px] max-w-full min-[360px]:w-[128px] sm:w-[145px] [&_img]:w-full [&_img]:min-w-0 [&_img]:rounded-none"
          />
        </div>
        <div className="flex shrink-0 items-center gap-1 min-[360px]:gap-2">
          <span className="hidden text-xs text-brand-primary/65 font-mono tracking-tight min-[360px]:inline">ADMIN</span>
          <button
            onClick={handleLogout}
            className="p-1.5 text-brand-primary/65 hover:text-brand-primary transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-stone-950/60 z-30 md:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-header-silver text-brand-primary flex flex-col justify-between border-r border-brand-primary/15 z-40 transition-transform duration-200 ease-in-out shadow-[10px_0_30px_-24px_rgba(43,67,51,.55)] ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="px-5 py-5 border-b border-brand-primary/15">
            <Link
              to="/admin"
              className="inline-block"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BrandLogo variant="horizontal" size="small" className="max-w-[190px] mb-3 [&_img]:rounded-none" />
              <div className="flex items-center gap-2 text-brand-primary/70 text-xs tracking-widest uppercase mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
                <span>Sanctuary Portal</span>
              </div>
              <p className="text-xs text-brand-primary/60 font-sans tracking-normal mt-0.5">
                Phase 1 Administrator Console
              </p>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-brand-primary text-brand-gold-light font-semibold shadow-sm'
                      : 'text-brand-primary/75 hover:bg-brand-white/45 hover:text-brand-primary'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-action-gold' : 'text-brand-primary/55'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Quick Actions Footer */}
        <div className="p-4 border-t border-brand-primary/15 bg-brand-white/20">
          <div className="flex items-center gap-3 px-2 py-2 mb-3 rounded-lg bg-brand-white/35">
            <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-brand-gold-light text-xs font-serif font-bold">
              {adminUser?.name ? adminUser.name[0] : 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-brand-primary truncate">
                {adminUser?.name || 'Administrator'}
              </div>
              <div className="text-[11px] text-brand-primary/60 truncate">
                {adminUser?.email || 'admin@palmgrace.com'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-2 text-brand-primary/75 hover:text-brand-primary hover:bg-brand-white/40 rounded-md transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 px-2.5 py-2 text-brand-primary/75 hover:text-brand-primary hover:bg-brand-white/40 rounded-md transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header with Breadcrumbs & Actions */}
        <div className="bg-white border-b border-stone-200 px-6 py-5 md:py-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              {/* Breadcrumb Trail */}
              {breadcrumbs.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-2 font-sans">
                  <Link to="/admin" className="hover:text-stone-800 transition-colors">
                    Admin
                  </Link>
                  {breadcrumbs.map((crumb, idx) => (
                    <React.Fragment key={idx}>
                      <ChevronRight className="w-3 h-3 text-stone-400" />
                      {crumb.href ? (
                        <Link to={crumb.href} className="hover:text-stone-800 transition-colors">
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className="text-stone-800 font-medium">{crumb.label}</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}

              <h2 className="font-serif text-2xl md:text-3xl text-stone-900 tracking-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="text-sm text-stone-600 mt-1 max-w-2xl font-sans">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Header Action Buttons */}
            {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 px-4 sm:px-6 py-6 max-w-6xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
