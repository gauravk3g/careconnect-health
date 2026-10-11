/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  HeartPulse,
  Search,
  Bell,
  Menu,
  X,
  User,
  Settings,
  Shield,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import { DemoBadge } from '../common/DemoBadge.js';
import { PatientProfile } from '../../types/index.js';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  patient: PatientProfile | null;
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
  onOpenGlobalSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  patient,
  onToggleMobileMenu,
  isMobileMenuOpen,
  onOpenGlobalSearch,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    {
      id: 'notif-1',
      title: 'Upcoming Appointment Reminder',
      detail: 'Cardiology Follow-Up with Dr. Sarah Jenkins on Oct 18 at 10:30 AM.',
      time: '2 hours ago',
      icon: Calendar,
      unread: true,
    },
    {
      id: 'notif-2',
      title: 'Support Request Status Updated',
      detail: 'Request REQ-2026-1042 is currently Under Review by clinic staff.',
      time: '1 day ago',
      icon: CheckCircle,
      unread: true,
    },
    {
      id: 'notif-3',
      title: 'Educational Summary Available',
      detail: 'New article: "Understanding Your Discharge Summary: A Step-by-Step Guide".',
      time: '3 days ago',
      icon: HeartPulse,
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand & Mobile Menu button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Close navigation' : 'Open navigation'}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors font-display">
                  CareConnect
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60 hidden sm:inline-block">
                  Health
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block -mt-0.5">
                Patient Support & Information
              </p>
            </div>
          </button>
        </div>

        {/* Center: Search input button */}
        <div className="flex-1 max-w-md mx-2 hidden sm:block">
          <button
            onClick={onOpenGlobalSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-xl transition-all shadow-2xs group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
              <span>Search appointments, articles, clinics...</span>
            </div>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded text-slate-400">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Actions: Demo Badge, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <DemoBadge />

          {/* Quick search mobile button */}
          <button
            onClick={onOpenGlobalSearch}
            aria-label="Search"
            className="sm:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              aria-label="Notifications"
              className="p-2 relative rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-600 ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 px-2">
                  <h4 className="font-semibold text-slate-900 text-sm">Notifications</h4>
                  <span className="text-[11px] font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                    2 New
                  </span>
                </div>
                <div className="space-y-1.5 max-h-80 overflow-y-auto">
                  {notifications.map((n) => {
                    const Icon = n.icon;
                    return (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl text-left transition-colors flex items-start gap-3 ${
                          n.unread ? 'bg-teal-50/50 hover:bg-teal-50' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-teal-100 text-teal-700 shrink-0 mt-0.5">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                          <p className="text-xs text-slate-600 mt-0.5 leading-snug">{n.detail}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors text-left cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                {patient?.preferredName ? patient.preferredName.charAt(0) : 'E'}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-semibold text-slate-900 leading-tight">
                  {patient?.preferredName || 'Eleanor'} Vance
                </p>
                <p className="text-[10px] text-slate-500 leading-none mt-0.5">Demo Patient</p>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-slate-900">{patient?.fullName || 'Eleanor Vance'}</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">{patient?.mrn || 'MRN-DEMO-849201'}</p>
                  <span className="inline-block mt-1 text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200/80 px-2 py-0.5 rounded-full">
                    Fictional Demonstration Profile
                  </span>
                </div>

                <div className="space-y-0.5">
                  <button
                    onClick={() => {
                      onNavigate('settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
                  >
                    <User className="w-4 h-4 text-slate-500" />
                    <span>Patient Profile & Preferences</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('admin');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
                  >
                    <Shield className="w-4 h-4 text-teal-600" />
                    <span>Healthcare Admin Analytics</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
                  >
                    <Settings className="w-4 h-4 text-slate-500" />
                    <span>Accessibility & Notifications</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
