/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  RotateCcw,
  Copy,
  Printer,
  Check,
  AlertTriangle,
  Calendar,
  Pill,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  ListChecks,
  CheckCircle2,
  FileCheck2,
} from 'lucide-react';
import { api } from '../services/api.js';
import { SAMPLE_DISCHARGE_TEXTS } from '../../server/data/mockData.js';
import { DischargeSimplifiedResult } from '../types/index.js';

export const DischargeSimplifierPage: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DischargeSimplifiedResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeSampleIndex, setActiveSampleIndex] = useState<number | null>(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);

  const handleLoadSample = (index: number) => {
    setActiveSampleIndex(index);
    setInputText(SAMPLE_DISCHARGE_TEXTS[index].text);
    setResult(null);
  };

  const handleSimplify = async () => {
    if (!inputText.trim() || loading) return;
    setLoading(true);
    try {
      const res = await api.simplifyDischarge(inputText.trim());
      setResult(res);
    } catch (err: unknown) {
      console.error('Failed to simplify:', err);
      alert('Unable to simplify instructions at this time. Please check your network or try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
    setActiveSampleIndex(null);
  };

  const handleCopySummary = () => {
    if (!result) return;
    const formatted = `CARECONNECT HEALTH - SIMPLIFIED DISCHARGE SUMMARY
--------------------------------------------------
A. SIMPLE SUMMARY:
${result.simpleSummary}

B. WHAT I NEED TO DO:
${result.whatINeedToDo.map((item, i) => `${i + 1}. ${item}`).join('\n')}

C. IMPORTANT DATES & FOLLOW-UP:
${result.importantDatesAndFollowUp.map((item) => `• ${item}`).join('\n')}

D. MEDICATION INFORMATION:
${result.medicationInformation
  .map(
    (m) =>
      `• ${m.medName}: ${m.simplifiedDirections}${
        m.cautionaryNote ? ` (Note: ${m.cautionaryNote})` : ''
      }`
  )
  .join('\n')}

E. WARNING SIGNS TO WATCH FOR:
${result.warningSigns.map((w) => `⚠ ${w}`).join('\n')}

F. QUESTIONS FOR MY HEALTHCARE PROVIDER:
${result.questionsForProvider.map((q) => `? ${q}`).join('\n')}

--------------------------------------------------
VERIFICATION NOTICE:
${result.verificationNotice}
`;
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-150">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Simplify Discharge Instructions
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Patient Safety Tool
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Transform complex hospital discharge packets and clinical jargon into an organized, easy-to-read recovery checklist.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              disabled={!inputText && !result}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Clinical Sample Selectors */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 mb-2">
            Try a fictional demonstration clinical note:
          </p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_DISCHARGE_TEXTS.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleLoadSample(idx)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all text-left flex items-center gap-1.5 cursor-pointer ${
                  activeSampleIndex === idx
                    ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold shadow-2xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <Sparkles className="w-3 h-3 text-blue-600 shrink-0" />
                <span>{sample.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
        <div>
          <label htmlFor="discharge-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Paste or Enter Discharge Paperwork Text:
          </label>
          <textarea
            id="discharge-input"
            rows={7}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setActiveSampleIndex(null);
            }}
            placeholder="Paste your hospital summary, aftercare orders, wound instructions, or medication directions here..."
            className="w-full p-4 text-xs sm:text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono leading-relaxed resize-y"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{inputText.length.toLocaleString()} characters</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
              <span>Prompt injection defense active</span>
            </span>
          </div>

          <button
            onClick={handleSimplify}
            disabled={!inputText.trim() || loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Simplifying Instructions...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>Simplify Instructions</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading Progress State */}
      {loading && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-2xs text-center space-y-4 animate-in fade-in">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Reading & Organizing Clinical Instructions</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Translating clinical terminology into 6th-grade reading level, extracting dates, isolating medication safety notices, and assembling warning signs.
            </p>
          </div>
          <div className="max-w-xs mx-auto w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full animate-indeterminate" />
          </div>
        </div>
      )}

      {/* Structured Results Display */}
      {result && !loading && (
        <div id="printable-summary" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 animate-in fade-in duration-200">
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                <FileCheck2 className="w-5 h-5" />
              </span>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">Simplified Patient Action Plan</h2>
                <p className="text-xs text-slate-500">Plain-language breakdown of supplied documentation</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySummary}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Copy entire summary"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
              </button>
              <button
                onClick={handleTriggerPrint}
                className="px-3.5 py-2 text-xs font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Print this plain language guide"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print-Friendly View</span>
              </button>
            </div>
          </div>

          {/* Section A: Simple Summary */}
          <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-100">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">A</span>
              <span>Simple Summary</span>
            </div>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              {result.simpleSummary}
            </p>
          </div>

          {/* Section B: What I Need to Do */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px]">B</span>
              <span>What I Need to Do (Action Checklist)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.whatINeedToDo.map((step, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-800 leading-snug">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section C: Important Dates and Follow-Up */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">C</span>
              <span>Important Dates and Follow-Up Care</span>
            </div>
            <div className="space-y-2">
              {result.importantDatesAndFollowUp.length > 0 ? (
                result.importantDatesAndFollowUp.map((dateItem, i) => (
                  <div key={i} className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-start gap-2.5 text-xs sm:text-sm text-indigo-950">
                    <Calendar className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{dateItem}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl">
                  No specific follow-up appointments were detected in the supplied text. Contact your provider's office to schedule your routine post-care checkup.
                </p>
              )}
            </div>
          </div>

          {/* Section D: Medication Information */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">D</span>
                <span>Medication Information (Explicitly Listed Only)</span>
              </div>
              <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                Verify with Pharmacist
              </span>
            </div>

            <div className="space-y-2.5">
              {result.medicationInformation.length > 0 ? (
                result.medicationInformation.map((med, i) => (
                  <div key={i} className="p-4 rounded-xl bg-purple-50/40 border border-purple-100/90 text-xs sm:text-sm space-y-1">
                    <div className="flex items-center gap-2 font-bold text-purple-900">
                      <Pill className="w-4 h-4 text-purple-600" />
                      <span>{med.medName}</span>
                    </div>
                    <p className="text-slate-700 pl-6 leading-relaxed">
                      {med.simplifiedDirections}
                    </p>
                    {med.cautionaryNote && (
                      <p className="text-amber-800 text-xs font-medium pl-6 pt-1">
                        ⚠ {med.cautionaryNote}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl">
                  No specific prescription medications were mentioned in the supplied text.
                </p>
              )}
            </div>
          </div>

          {/* Section E: Warning Signs */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px]">E</span>
              <span>Warning Signs & Red Flags (When to Seek Urgent Care)</span>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 space-y-2">
              {result.warningSigns.map((sign, i) => (
                <div key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{sign}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section F: Questions for My Healthcare Provider */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-cyan-700 text-white flex items-center justify-center text-[10px]">F</span>
              <span>Suggested Questions for Your Healthcare Provider</span>
            </div>
            <div className="space-y-2">
              {result.questionsForProvider.map((q, i) => (
                <div key={i} className="p-3 rounded-xl bg-cyan-50/50 border border-cyan-100 flex items-start gap-2.5 text-xs sm:text-sm text-cyan-950">
                  <HelpCircle className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mandatory Disclaimers */}
          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
            <p className="font-semibold text-slate-700 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>{result.verificationNotice}</span>
            </p>
            <p className="text-[11px] text-slate-400">
              {result.disclaimer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
