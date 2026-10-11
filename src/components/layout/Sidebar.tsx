/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  BotMessageSquare,
  FileText,
  CalendarDays,
  BookOpen,
  LifeBuoy,
  Settings,
  BarChart3,
  Phone,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      id: 'assistant',
      label: 'AI Health Assistant',
      icon: BotMessageSquare,
      badge: 'Gemini',
    },
    {
      id: 'discharge',
      label: 'Simplify Discharge Instructions',
      icon: FileText,
      badge: 'Tool',
    },
    {
      id: 'appointments',
      label: 'Appointments & Clinics',
      icon: CalendarDays,
      badge: '2 Up',
    },
    {
      id: 'knowledge',
      label: 'Health Knowledge Center',
      icon: BookOpen,
      badge: undefined,
    },
    {
      id: 'support',
      label: 'Contact Support',
      icon: LifeBuoy,
      badge: undefined,
    },
    {
      id: 'settings',
      label: 'Profile & Settings',
      icon: Settings,
      badge: undefined,
    },
    {
      id: 'admin',
      label: 'Admin Analytics',
      icon: BarChart3,
      badge: 'Admin',
    },
  ];

  const handleSelect = (id: string) => {
    onNavigate(id);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between p-4">
      <div className="space-y-6">
        {/* Navigation items */}
        <div>
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Patient Portal
          </p>
          <nav className="space-y-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left group ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-sm shadow-teal-700/20 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/90'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-500 group-hover:text-teal-600'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-teal-50 text-teal-700 border border-teal-200/50'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Support & Safety Footer Card */}
      <div className="pt-4 border-t border-slate-200/70 space-y-3">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100/80 shadow-2xs">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 bg-teal-600 text-white rounded-lg shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">24/7 Nurse Advice Line</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                (555) 890-CARE (Demo)
              </p>
              <button
                onClick={() => handleSelect('support')}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 hover:text-teal-800 mt-2 transition-colors"
              >
                <span>Request Human Callback</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Prototype Build</span>
          </span>
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden md:block w-72 shrink-0 border-r border-slate-200/80 bg-white/70 backdrop-blur-md min-h-[calc(100vh-4rem)]">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Overlay */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
