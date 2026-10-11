/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AlertTriangle, PhoneCall, X } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white px-4 py-2.5 shadow-sm text-sm" role="alert">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 font-medium">
          <span className="p-1 bg-white/20 rounded-md shrink-0">
            <AlertTriangle className="w-4 h-4 text-white" />
          </span>
          <span className="text-xs sm:text-sm">
            <strong className="font-bold">Medical Emergency Notice:</strong> If you are experiencing chest pain, difficulty breathing, or severe sudden symptoms, call <span className="underline font-extrabold">911</span> immediately. Do not rely on AI for emergencies.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="tel:911"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white text-red-700 hover:bg-red-50 text-xs font-bold rounded-lg transition-colors shadow-xs"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call 911</span>
          </a>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss emergency notice"
            className="p-1 hover:bg-white/20 rounded-md transition-colors text-white/90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
