/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  Calendar,
  Building2,
  BookOpen,
  Sparkles,
  X,
  ArrowRight,
} from 'lucide-react';
import { api } from '../../services/api.js';
import { Appointment, Clinic, HealthArticle } from '../../types/index.js';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string, state?: any) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [articles, setArticles] = useState<HealthArticle[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      return;
    }

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setAppointments([]);
      setClinics([]);
      setArticles([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [apts, clns, arts] = await Promise.all([
          api.getAppointments({ search: query }),
          api.getClinics({ search: query }),
          api.getArticles({ search: query }),
        ]);
        setAppointments(apts);
        setClinics(clns);
        setArticles(arts);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (tab: string, state?: any) => {
    onNavigate(tab, state);
    onClose();
  };

  const hasResults =
    appointments.length > 0 || clinics.length > 0 || articles.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Box */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-teal-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search appointments, clinics, articles, or medical topics..."
            className="w-full text-sm sm:text-base text-slate-800 focus:outline-none placeholder:text-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-slate-100 text-slate-500 rounded border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* Results area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {query.trim().length < 2 && (
            <div className="space-y-3 py-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Quick Navigation
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleSelect('assistant')}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-teal-50 hover:text-teal-900 text-left border border-slate-100 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <span>Ask AI Assistant</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => handleSelect('discharge')}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 hover:text-blue-900 text-left border border-slate-100 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>Simplify Discharge</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div className="p-8 text-center text-xs text-slate-400">Searching CareConnect Health...</div>
          )}

          {!loading && query.trim().length >= 2 && !hasResults && (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching records found for "{query}".
            </div>
          )}

          {/* Appointments Results */}
          {appointments.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                <span>Appointments ({appointments.length})</span>
              </span>
              <div className="space-y-1.5">
                {appointments.map((apt) => (
                  <button
                    key={apt.id}
                    onClick={() => handleSelect('appointments')}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-50 text-left border border-slate-100 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">{apt.appointmentType}</p>
                      <p className="text-[11px] text-slate-500">
                        {apt.providerName} • {apt.clinicName}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clinics Results */}
          {clinics.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Clinics ({clinics.length})</span>
              </span>
              <div className="space-y-1.5">
                {clinics.map((clinic) => (
                  <button
                    key={clinic.id}
                    onClick={() => handleSelect('appointments')}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-50 text-left border border-slate-100 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">{clinic.name}</p>
                      <p className="text-[11px] text-slate-500">{clinic.department}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Articles Results */}
          {articles.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                <span>Educational Articles ({articles.length})</span>
              </span>
              <div className="space-y-1.5">
                {articles.map((art) => (
                  <button
                    key={art.id}
                    onClick={() => handleSelect('knowledge')}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-50 text-left border border-slate-100 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">{art.title}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{art.shortDescription}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
