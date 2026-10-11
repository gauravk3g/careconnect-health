/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  MessageSquare,
  FileText,
  BookOpen,
  LifeBuoy,
  Clock,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  MapPin,
  ChevronRight,
  Activity,
  CheckCircle2,
  CalendarCheck,
} from 'lucide-react';
import { api } from '../services/api.js';
import { PatientProfile, Appointment, SupportRequest, HealthArticle } from '../types/index.js';

interface DashboardPageProps {
  onNavigate: (tab: string, state?: any) => void;
  patient: PatientProfile | null;
  savedArticleIds: string[];
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  patient,
  savedArticleIds,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [articles, setArticles] = useState<HealthArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [apts, reqs, arts] = await Promise.all([
          api.getAppointments(),
          api.getSupportRequests(),
          api.getArticles(),
        ]);
        if (isMounted) {
          setAppointments(apts);
          setSupportRequests(reqs);
          setArticles(arts);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const nextAppointment = appointments.find((a) => a.status === 'confirmed');
  const activeSupportCount = supportRequests.filter((r) => r.status !== 'resolved').length;
  const savedCount = savedArticleIds.length || 2; // Default to 2 for preview

  const quickActionCards = [
    {
      title: 'Ask the AI Assistant',
      desc: 'Ask general healthcare questions and explain complex clinical terms in plain English.',
      icon: MessageSquare,
      color: 'from-teal-500 to-cyan-600',
      badge: 'Gemini AI',
      tab: 'assistant',
    },
    {
      title: 'Understand My Discharge Instructions',
      desc: 'Paste or review complex hospital instructions and generate a clear, step-by-step checklist.',
      icon: FileText,
      color: 'from-blue-600 to-indigo-600',
      badge: 'Simplifier',
      tab: 'discharge',
    },
    {
      title: 'Find Appointment Information',
      desc: 'Review upcoming clinic visits, directions, and pre-appointment preparation guidelines.',
      icon: Calendar,
      color: 'from-emerald-500 to-teal-600',
      badge: `${appointments.length} Visits`,
      tab: 'appointments',
    },
    {
      title: 'Explore Health Resources',
      desc: 'Access patient education guides on wellness, appointments, and medical terminology.',
      icon: BookOpen,
      color: 'from-amber-500 to-orange-500',
      badge: 'Knowledge Hub',
      tab: 'knowledge',
    },
    {
      title: 'Contact Human Support',
      desc: 'Send an inquiry to clinic navigation coordinators or request non-emergency assistance.',
      icon: LifeBuoy,
      color: 'from-purple-500 to-indigo-600',
      badge: 'Assistance',
      tab: 'support',
    },
  ];

  const recentActivities = [
    {
      id: 'act-1',
      title: 'Cardiology Visit Scheduled',
      time: 'Oct 18, 2026 at 10:30 AM',
      type: 'appointment',
      icon: CalendarCheck,
      color: 'text-teal-600 bg-teal-50',
    },
    {
      id: 'act-2',
      title: 'Support Request Under Review',
      time: 'Request #REQ-2026-1042 assigned to front desk',
      type: 'support',
      icon: Activity,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      id: 'act-3',
      title: 'Read: Organizing Doctor Visit Questions',
      time: 'Saved to your Health Knowledge favorites',
      type: 'article',
      icon: BookOpen,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      id: 'act-4',
      title: 'AI Consultation: Blood Pressure Guidelines',
      time: 'Explanation generated in simple language',
      type: 'chat',
      icon: Sparkles,
      color: 'text-purple-600 bg-purple-50',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-800 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-teal-100 text-xs font-semibold mb-4 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            <span>AI-Powered Patient Navigator</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
            Welcome to CareConnect Health
          </h1>
          <p className="mt-2 text-base sm:text-lg text-teal-100/90 leading-relaxed font-sans">
            How can we help you today, {patient?.preferredName || 'Eleanor'}? Access plain-language health information, clarify discharge paperwork, or connect with clinic staff.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('assistant')}
              className="px-5 py-2.5 rounded-xl bg-white text-teal-900 font-bold text-sm shadow-md hover:bg-teal-50 transition-all flex items-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-teal-700" />
              <span>Ask Health Assistant</span>
            </button>
            <button
              onClick={() => onNavigate('discharge')}
              className="px-5 py-2.5 rounded-xl bg-teal-900/60 hover:bg-teal-900/80 text-white border border-white/20 font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-cyan-300" />
              <span>Simplify Discharge Notes</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-24 top-6 w-32 h-32 rounded-full bg-cyan-400/10 blur-xl pointer-events-none" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Next Appointment Card */}
        <div
          onClick={() => onNavigate('appointments')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-teal-300 transition-all cursor-pointer group text-left"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Upcoming Visit
            </span>
            <div className="p-2 bg-teal-50 text-teal-700 rounded-xl group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1">
              {nextAppointment?.appointmentType || 'Cardiology Follow-Up'}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {nextAppointment ? new Date(nextAppointment.dateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'Oct 18, 10:30 AM'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-teal-700 font-semibold">
            <span>View All Visits</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Active Support Requests */}
        <div
          onClick={() => onNavigate('support')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group text-left"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Support Requests
            </span>
            <div className="p-2 bg-purple-50 text-purple-700 rounded-xl group-hover:scale-105 transition-transform">
              <LifeBuoy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900">
              {activeSupportCount} <span className="text-xs font-normal text-slate-500">Active</span>
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest: REQ-2026-1042 Under Review
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-purple-700 font-semibold">
            <span>Track Requests</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Saved Health Articles */}
        <div
          onClick={() => onNavigate('knowledge')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group text-left"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Saved Articles
            </span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-xl group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900">
              {savedCount} <span className="text-xs font-normal text-slate-500">Guides</span>
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Available offline for quick reference
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-blue-700 font-semibold">
            <span>Browse Library</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* AI Health Assistant shortcut */}
        <div
          onClick={() => onNavigate('assistant')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group text-left"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              AI Health Assistant
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Assistant Ready</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Ask about medical terms, prep, or diet
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
            <span>Start Conversation</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Prominent Section: "How Can We Help You?" */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              How Can We Help You Today?
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select a tool to explore plain-language guidance or connect with care coordinators.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActionCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.tab}
                onClick={() => onNavigate(card.tab)}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all text-left flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-tr ${card.color} text-white shadow-xs group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-teal-50 group-hover:text-teal-700 transition-colors">
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-700 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-slate-700 group-hover:text-teal-700 transition-colors">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Two Column Layout: Upcoming Highlight & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Appointment Detailed Card */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Next Appointment</h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Confirmed
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <p className="text-base font-bold text-slate-900">
                  {nextAppointment?.appointmentType || 'Cardiology Follow-Up'}
                </p>
                <p className="text-xs font-semibold text-teal-700 mt-0.5">
                  {nextAppointment?.providerName || 'Dr. Sarah Jenkins, MD'}
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>Saturday, Oct 18, 2026 at 10:30 AM (Check in 15 min early)</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>420 Health Sciences Blvd, Suite 300</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 italic">
                Remember to bring your current medication list and 3-day blood pressure log.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => onNavigate('appointments')}
              className="w-full py-2.5 px-3 bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold text-xs rounded-xl transition-colors text-center"
            >
              Appointment Details & Prep
            </button>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Recent Account Activity</h3>
              <p className="text-xs text-slate-400">Demonstration history & interactions</p>
            </div>
            <span className="text-xs text-slate-400">Past 30 Days</span>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {recentActivities.map((act) => {
              const Icon = act.icon;
              return (
                <div key={act.id} className="py-3 flex items-start gap-3.5 first:pt-0 last:pb-0">
                  <div className={`p-2 rounded-xl shrink-0 ${act.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{act.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{act.time}</p>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    {act.type}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 bg-amber-50/70 p-3 rounded-xl border border-amber-200/70 text-xs text-amber-900 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Demonstration Prototype Note:</strong> CareConnect Health is built for patient education and navigation. Data displayed represents fictional demo records.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
