/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Info, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const DemoBadge: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
        title="Click to view demonstration details & disclaimer"
      >
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
        <span>Prototype Demo</span>
        <Info className="w-3 h-3 text-amber-600" />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-150">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Prototype Demonstration Notice</h3>
                <p className="text-xs text-slate-500">CareConnect Health Educational Platform</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-600 leading-relaxed mb-6">
              <p>
                <strong>CareConnect Health</strong> is an interactive demonstration prototype designed to explore how generative AI can simplify healthcare communication, explain medical concepts, and guide patients to support resources.
              </p>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Fictional Demonstration Data:</strong> All patient records, appointments, clinic locations, and support requests are fictional samples.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Non-Diagnostic Scope:</strong> This tool does not provide clinical diagnoses, prescribe treatments, or replace licensed physicians.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Privacy:</strong> Do not enter real Protected Health Information (PHI) or personal identifiable information.</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm rounded-xl transition-colors shadow-xs"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
