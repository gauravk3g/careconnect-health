/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { EmergencyBanner } from './components/common/EmergencyBanner.js';
import { Navbar } from './components/layout/Navbar.js';
import { Sidebar } from './components/layout/Sidebar.js';
import { GlobalSearchModal } from './components/common/GlobalSearchModal.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { AssistantPage } from './pages/AssistantPage.js';
import { DischargeSimplifierPage } from './pages/DischargeSimplifierPage.js';
import { AppointmentsPage } from './pages/AppointmentsPage.js';
import { KnowledgeCenterPage } from './pages/KnowledgeCenterPage.js';
import { ContactSupportPage } from './pages/ContactSupportPage.js';
import { AdminDashboardPage } from './pages/AdminDashboardPage.js';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage.js';
import { PatientProfile } from './types/index.js';
import { api } from './services/api.js';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [savedArticleIds, setSavedArticleIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('careconnect_saved_articles');
      return saved ? JSON.parse(saved) : ['art-01', 'art-03'];
    } catch {
      return ['art-01', 'art-03'];
    }
  });

  // Load patient profile
  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await api.getProfile();
        setPatient(profile);
      } catch (err) {
        console.error('Failed to load patient profile:', err);
      }
    }
    loadProfile();
  }, []);

  // Keyboard shortcut Cmd+K or Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleSaveArticle = (articleId: string) => {
    setSavedArticleIds((prev) => {
      const updated = prev.includes(articleId)
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId];
      try {
        localStorage.setItem('careconnect_saved_articles', JSON.stringify(updated));
      } catch (err) {
        console.warn('Could not save to localStorage:', err);
      }
      return updated;
    });
  };

  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const accessibilityClasses = [
    patient?.accessibilityPreferences?.largerText ? 'text-base' : '',
    patient?.accessibilityPreferences?.highContrast ? 'contrast-125' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 text-slate-800 ${accessibilityClasses}`}>
      {/* High-Visibility Medical Emergency Banner */}
      <EmergencyBanner />

      {/* Main Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        patient={patient}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
        onOpenGlobalSearch={() => setIsSearchModalOpen(true)}
      />

      {/* Body Layout: Sidebar + Main Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          currentTab={currentTab}
          onNavigate={handleNavigate}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <DashboardPage
              onNavigate={handleNavigate}
              patient={patient}
              savedArticleIds={savedArticleIds}
            />
          )}

          {currentTab === 'assistant' && (
            <AssistantPage onNavigate={handleNavigate} />
          )}

          {currentTab === 'discharge' && (
            <DischargeSimplifierPage />
          )}

          {currentTab === 'appointments' && (
            <AppointmentsPage />
          )}

          {currentTab === 'knowledge' && (
            <KnowledgeCenterPage
              savedArticleIds={savedArticleIds}
              onToggleSaveArticle={handleToggleSaveArticle}
            />
          )}

          {currentTab === 'support' && (
            <ContactSupportPage patient={patient} />
          )}

          {currentTab === 'settings' && (
            <ProfileSettingsPage
              patient={patient}
              onUpdatePatient={setPatient}
            />
          )}

          {currentTab === 'admin' && (
            <AdminDashboardPage />
          )}
        </main>
      </div>

      {/* Global Quick Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="font-semibold text-slate-700">
              CareConnect Health • Patient Support & Healthcare Information Platform
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Prototype Demonstration. Educational content only — does not provide medical diagnoses or prescribe treatment.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              onClick={() => handleNavigate('settings')}
              className="hover:text-teal-700 transition-colors"
            >
              Privacy & Safeguards
            </button>
            <button
              onClick={() => handleNavigate('admin')}
              className="hover:text-teal-700 transition-colors"
            >
              Admin Metrics
            </button>
            <a
              href="tel:911"
              className="text-red-600 font-bold hover:underline"
            >
              Emergency: 911
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
