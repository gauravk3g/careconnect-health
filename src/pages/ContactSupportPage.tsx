/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  LifeBuoy,
  Send,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  FileQuestion,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { api } from '../services/api.js';
import { SupportRequest, PatientProfile } from '../types/index.js';

interface ContactSupportPageProps {
  patient: PatientProfile | null;
}

export const ContactSupportPage: React.FC<ContactSupportPageProps> = ({ patient }) => {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [submittedReq, setSubmittedReq] = useState<SupportRequest | null>(null);

  // Form State
  const [name, setName] = useState(patient?.fullName || 'Eleanor Vance');
  const [email, setEmail] = useState(patient?.email || 'eleanor.vance@example-patient.org');
  const [phone, setPhone] = useState(patient?.phone || '(555) 234-8901');
  const [category, setCategory] = useState<string>('appointment_question');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState<'email' | 'phone' | 'portal'>('email');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadRequests() {
      try {
        const res = await api.getSupportRequests();
        if (isMounted) setRequests(res);
      } catch (err) {
        console.error('Failed to load support requests:', err);
      }
    }
    loadRequests();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!subject.trim()) {
      setFormError('Please provide a subject line for your request.');
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      setFormError('Please enter a message with at least 10 characters.');
      return;
    }

    setLoading(true);
    try {
      const created = await api.createSupportRequest({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        category,
        subject: subject.trim(),
        message: message.trim(),
        preferredContactMethod,
      });

      setSubmittedReq(created);
      setRequests((prev) => [created, ...prev]);
      setSubject('');
      setMessage('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit request';
      setFormError(msg);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Submitted (In Queue)
          </span>
        );
      case 'under_review':
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            Under Review
          </span>
        );
      case 'resolved':
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Resolved
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-150">
      {/* Non-Emergency Notice */}
      <div className="bg-red-50 border border-red-200 p-4 rounded-2xl text-xs text-red-900 flex items-start gap-3 shadow-2xs">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Not Monitored for Medical Emergencies:</strong> This patient support form is intended exclusively for non-urgent clinic questions, discharge paperwork assistance, and administrative guidance. If you are experiencing acute medical symptoms, call <span className="underline font-bold">911</span> or seek immediate emergency care.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Support Submission Form (Left 2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-start gap-3.5 pb-4 border-b border-slate-100">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/20 shrink-0">
              <LifeBuoy className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Contact Human Support
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Reach out to care coordinators and patient navigators for assistance with scheduling, clinic services, or paperwork.
              </p>
            </div>
          </div>

          {/* Success Banner if newly submitted */}
          {submittedReq && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Support Request Submitted Successfully!</span>
              </div>
              <p className="text-xs text-emerald-800">
                Your demonstration request has been assigned Reference ID{' '}
                <strong className="font-mono font-bold bg-white/70 px-1.5 py-0.5 rounded border border-emerald-300">
                  {submittedReq.id}
                </strong>
                . Typical response time is within 1 business day.
              </p>
              <button
                onClick={() => setSubmittedReq(null)}
                className="text-xs font-semibold text-emerald-700 hover:underline pt-1 block"
              >
                Submit another inquiry
              </button>
            </div>
          )}

          {formError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Contact Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 000-0000"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Support Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer"
                >
                  <option value="appointment_question">Appointment Question</option>
                  <option value="discharge_paperwork">Understanding Discharge Paperwork</option>
                  <option value="clinic_info">Clinic Information & Accessibility</option>
                  <option value="technical_issue">Technical Issue with Platform</option>
                  <option value="general_patient_support">General Patient-Support Question</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Subject Line *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of your question..."
                required
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Message & Question Details *
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe how we can assist you..."
                required
                className="w-full p-3.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 leading-relaxed resize-y"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Preferred Contact Method
              </label>
              <div className="flex gap-4">
                {(['email', 'phone', 'portal'] as const).map((method) => (
                  <label key={method} className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="contactMethod"
                      value={method}
                      checked={preferredContactMethod === method}
                      onChange={() => setPreferredContactMethod(method)}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span className="capitalize">{method}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md shadow-purple-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Submitting In Demonstration Queue...</span>
                ) : (
                  <>
                    <span>Submit Support Request</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Recent Support Requests List (Right Col) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Your Support Requests</h3>
              <p className="text-xs text-slate-400">Track current status & tickets</p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
              {requests.length}
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {requests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2 text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-800">{req.id}</span>
                  {getStatusBadge(req.status)}
                </div>

                <p className="font-semibold text-slate-900 line-clamp-1">{req.subject}</p>
                <p className="text-slate-500 text-[11px] line-clamp-2">{req.message}</p>

                {req.responseNotes && (
                  <div className="p-2 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-600">
                    <span className="font-bold text-slate-800">Update: </span>
                    {req.responseNotes}
                  </div>
                )}

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                  <span>{req.estimatedResponseTime || 'Estimated 1 day'}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 bg-amber-50/60 p-3 rounded-xl border border-amber-200/60 text-amber-900 flex items-start gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Note:</strong> Requests are maintained within this demonstration environment for training and evaluation.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
