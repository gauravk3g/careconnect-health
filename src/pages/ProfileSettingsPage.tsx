/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  User,
  Settings,
  Shield,
  Eye,
  Bell,
  CheckCircle2,
  Lock,
  Globe,
  Sliders,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { PatientProfile } from '../types/index.js';
import { api } from '../services/api.js';

interface ProfileSettingsPageProps {
  patient: PatientProfile | null;
  onUpdatePatient: (updated: PatientProfile) => void;
}

export const ProfileSettingsPage: React.FC<ProfileSettingsPageProps> = ({
  patient,
  onUpdatePatient,
}) => {
  const [preferredLanguage, setPreferredLanguage] = useState(
    patient?.preferredLanguage || 'English'
  );
  const [largerText, setLargerText] = useState(
    patient?.accessibilityPreferences.largerText || false
  );
  const [highContrast, setHighContrast] = useState(
    patient?.accessibilityPreferences.highContrast || false
  );
  const [reduceMotion, setReduceMotion] = useState(
    patient?.accessibilityPreferences.reduceMotion || false
  );
  const [emailNotif, setEmailNotif] = useState(
    patient?.notificationPreferences.email ?? true
  );
  const [smsNotif, setSmsNotif] = useState(
    patient?.notificationPreferences.sms ?? true
  );
  const [reminderNotif, setReminderNotif] = useState(
    patient?.notificationPreferences.appointmentReminders ?? true
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async () => {
    try {
      const updated = await api.updatePreferences({
        preferredLanguage,
        accessibilityPreferences: {
          largerText,
          highContrast,
          reduceMotion,
        },
        notificationPreferences: {
          email: emailNotif,
          sms: smsNotif,
          appointmentReminders: reminderNotif,
        },
      });
      onUpdatePatient(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update preferences:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-150">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-900 text-white shadow-md shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Patient Profile & Settings
              </h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                Fictional Demo Account
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Manage your demonstration preferences, accessibility adjustments, and view privacy notices.
            </p>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Preferences updated successfully in this demonstration session!</span>
        </div>
      )}

      {/* Demonstration Profile Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="font-bold text-slate-900 text-sm">Demo Patient Information</h2>
          <span className="font-mono text-xs text-slate-400 font-semibold">
            {patient?.mrn || 'MRN-DEMO-849201'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-slate-400 font-medium">Full Legal Name</span>
            <p className="font-bold text-slate-900">{patient?.fullName || 'Eleanor J. Vance'}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-slate-400 font-medium">Preferred Name</span>
            <p className="font-bold text-slate-900">{patient?.preferredName || 'Eleanor'}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-slate-400 font-medium">Demonstration Email</span>
            <p className="font-bold text-slate-900">{patient?.email || 'eleanor.vance@example-patient.org'}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-slate-400 font-medium">Emergency Contact</span>
            <p className="font-bold text-slate-900">
              {patient?.emergencyContact?.name || 'Marcus Vance'} ({patient?.emergencyContact?.relationship || 'Spouse'})
            </p>
          </div>
        </div>
      </div>

      {/* Language & Accessibility Preferences */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Eye className="w-4 h-4 text-teal-600" />
            <span>Accessibility & Display Options</span>
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Preferred Language
            </label>
            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              className="w-full sm:w-64 px-3.5 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish (Español)</option>
              <option value="Vietnamese">Vietnamese (Tiếng Việt)</option>
              <option value="Arabic">Arabic (العربية)</option>
              <option value="Mandarin">Mandarin (普通话)</option>
            </select>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100/50 transition-colors">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Larger Text Mode</span>
                <span className="text-[11px] text-slate-500">
                  Increases typography scale across the portal for enhanced readability.
                </span>
              </div>
              <input
                type="checkbox"
                checked={largerText}
                onChange={(e) => setLargerText(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100/50 transition-colors">
              <div>
                <span className="text-xs font-bold text-slate-900 block">High Contrast Mode</span>
                <span className="text-[11px] text-slate-500">
                  Sharpens card borders and deepens text colors for visual clarity.
                </span>
              </div>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100/50 transition-colors">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Reduce Motion</span>
                <span className="text-[11px] text-slate-500">
                  Disables page transition animations and bouncing indicators.
                </span>
              </div>
              <input
                type="checkbox"
                checked={reduceMotion}
                onChange={(e) => setReduceMotion(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Bell className="w-4 h-4 text-teal-600" />
            <span>Communication & Reminders</span>
          </h2>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100/50 transition-colors">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Appointment Reminders</span>
              <span className="text-[11px] text-slate-500">
                Receive notifications 48 hours and 2 hours before scheduled clinic visits.
              </span>
            </div>
            <input
              type="checkbox"
              checked={reminderNotif}
              onChange={(e) => setReminderNotif(e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100/50 transition-colors">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Email Summaries</span>
              <span className="text-[11px] text-slate-500">
                Receive plain-language summaries of support ticket replies and new articles.
              </span>
            </div>
            <input
              type="checkbox"
              checked={emailNotif}
              onChange={(e) => setEmailNotif(e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
            />
          </label>
        </div>

        <div className="pt-2">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Save Preferences
          </button>
        </div>
      </div>

      {/* Privacy Notice & AI Disclaimer */}
      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 space-y-3 text-xs text-slate-600 leading-relaxed">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Lock className="w-4 h-4 text-slate-600" />
          <span>Privacy & Responsible AI Framework</span>
        </h3>
        <p>
          <strong>Demonstration Status:</strong> CareConnect Health is currently running in a prototype evaluation environment. No real electronic protected health information (ePHI) is requested, required, or stored.
        </p>
        <p>
          <strong>Responsible AI Boundaries:</strong> The AI Health Assistant operates strictly on general public health literature and patient education guidelines. It will never provide an official diagnosis or recommend drug dosages.
        </p>
      </div>
    </div>
  );
};
