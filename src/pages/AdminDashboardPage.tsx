/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  BotMessageSquare,
  LifeBuoy,
  ThumbsUp,
  Server,
  Activity,
  ShieldCheck,
  Calendar,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api.js';
import { AdminAnalytics } from '../types/index.js';

export const AdminDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    let isMounted = true;
    async function loadMetrics() {
      try {
        const res = await api.getAnalytics();
        if (isMounted) {
          setMetrics(res);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load admin analytics:', err);
        if (isMounted) setLoading(false);
      }
    }
    loadMetrics();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading || !metrics) {
    return (
      <div className="p-12 text-center text-xs text-slate-400">
        Loading demonstration administrator analytics...
      </div>
    );
  }

  const categoryLabels: Record<string, string> = {
    appointment_question: 'Appointment Questions',
    discharge_paperwork: 'Discharge Paperwork',
    clinic_info: 'Clinic Information',
    technical_issue: 'Technical Issue',
    general_patient_support: 'General Patient Support',
  };

  const totalStatus =
    metrics.statusDistribution.submitted +
    metrics.statusDistribution.under_review +
    metrics.statusDistribution.resolved;

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-slate-800 to-teal-900 text-white shadow-md shrink-0">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Healthcare Support Administration
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  Analytics & Telemetry
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Demonstration platform aggregate volume, AI availability, and support queue metrics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
              {(['7d', '30d', 'all'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    dateRange === range
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : 'All Time'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-amber-800 bg-amber-50/70 p-3 rounded-xl border border-amber-200/60">
          <strong>Demonstration Safeguard Notice:</strong> All metrics represent fictional aggregated simulation statistics. No individual patient chat records, protected health information (PHI), or confidential clinical histories are stored or exposed.
        </div>
      </div>

      {/* Aggregate KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total AI Interactions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              AI Conversations
            </span>
            <div className="p-2 bg-teal-50 text-teal-700 rounded-xl">
              <BotMessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900">
              {metrics.totalConversations}
            </p>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
              <span>+18% from previous period</span>
            </p>
          </div>
        </div>

        {/* Support Requests */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Support Requests
            </span>
            <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
              <LifeBuoy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900">
              {metrics.totalSupportRequests}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Avg resolution: 1.2 business days
            </p>
          </div>
        </div>

        {/* User Satisfaction */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Educational Rating
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <ThumbsUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-900">
              {metrics.feedbackStats.satisfactionRate}%
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {metrics.feedbackStats.helpfulCount} helpful / {metrics.feedbackStats.notHelpfulCount} unhelpful
            </p>
          </div>
        </div>

        {/* AI Service Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              AI Service Status
            </span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${metrics.aiServiceStatus.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="font-bold text-slate-900 text-sm">
                {metrics.aiServiceStatus.isOnline ? 'Operational' : 'Demo Active'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Model: {metrics.aiServiceStatus.model} ({metrics.aiServiceStatus.latencyMs}ms)
            </p>
          </div>
        </div>
      </div>

      {/* Two-Column Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Support Request Categories Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">
              Inquiry Categories Breakdown
            </h3>
            <span className="text-xs text-slate-400">Total: {metrics.totalSupportRequests}</span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(metrics.categoryDistribution).map(([catKey, count]) => {
              const label = categoryLabels[catKey] || catKey;
              const percentage = metrics.totalSupportRequests > 0
                ? Math.round((count / metrics.totalSupportRequests) * 100)
                : 0;
              return (
                <div key={catKey} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                    <span>{label}</span>
                    <span className="font-bold text-slate-900">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Support Queue Status Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">
              Support Queue Processing Status
            </h3>
            <span className="text-xs text-slate-400">Resolution Health</span>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-center">
              <span className="text-xs font-semibold text-blue-700">Submitted</span>
              <p className="text-2xl font-extrabold text-blue-900 mt-1">
                {metrics.statusDistribution.submitted}
              </p>
              <span className="text-[10px] text-blue-600 block mt-0.5">In triage queue</span>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 text-center">
              <span className="text-xs font-semibold text-amber-800">Under Review</span>
              <p className="text-2xl font-extrabold text-amber-900 mt-1">
                {metrics.statusDistribution.under_review}
              </p>
              <span className="text-[10px] text-amber-700 block mt-0.5">Assigned staff</span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
              <span className="text-xs font-semibold text-emerald-800">Resolved</span>
              <p className="text-2xl font-extrabold text-emerald-900 mt-1">
                {metrics.statusDistribution.resolved}
              </p>
              <span className="text-[10px] text-emerald-700 block mt-0.5">Completed</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
            <div className="flex items-center justify-between">
              <span>Average Time to Initial Review:</span>
              <span className="font-bold text-slate-800">4.2 hours</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Patient Follow-Up Completion Rate:</span>
              <span className="font-bold text-emerald-700">98.4%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Demonstration System Activity Stream */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Real-Time Administrative Log Stream</h3>
            <p className="text-xs text-slate-400">Anonymized event trigger feed</p>
          </div>
          <span className="text-xs text-slate-400">Live</span>
        </div>

        <div className="divide-y divide-slate-100">
          {metrics.recentActivities.map((act) => (
            <div key={act.id} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                <span className="font-medium text-slate-800">{act.summary}</span>
              </div>
              <span className="text-slate-400 text-[11px]">
                {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
