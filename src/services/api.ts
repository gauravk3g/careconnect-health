/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  PatientProfile,
  Appointment,
  Clinic,
  HealthArticle,
  SupportRequest,
  AdminAnalytics,
  DischargeSimplifiedResult,
} from '../types/index.js';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error || `Server responded with status ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}

export const api = {
  // Health
  checkHealth: () => fetchJson<{ status: string; aiStatus: string; service: string }>('/api/health'),

  // Profile
  getProfile: () => fetchJson<PatientProfile>('/api/profile'),
  updatePreferences: (updates: Partial<PatientProfile>) =>
    fetchJson<PatientProfile>('/api/profile/preferences', {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  // AI Chat
  sendChatMessage: (message: string, history: Array<{ role: 'user' | 'assistant'; content: string }>) =>
    fetchJson<{
      reply: string;
      isEmergencyAlert: boolean;
      suggestedFollowUps: string[];
      disclaimer: string;
      timestamp: string;
    }>('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    }),

  // Discharge Simplification
  simplifyDischarge: (instructions: string) =>
    fetchJson<DischargeSimplifiedResult>('/api/discharge/simplify', {
      method: 'POST',
      body: JSON.stringify({ instructions }),
    }),

  // Appointments
  getAppointments: (params?: { search?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    return fetchJson<Appointment[]>(`/api/appointments?${query.toString()}`);
  },
  getAppointmentById: (id: string) => fetchJson<Appointment>(`/api/appointments/${id}`),

  // Clinics
  getClinics: (params?: { search?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    return fetchJson<Clinic[]>(`/api/clinics?${query.toString()}`);
  },
  getClinicById: (id: string) => fetchJson<Clinic>(`/api/clinics/${id}`),

  // Articles
  getArticles: (params?: { search?: string; category?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.category) query.set('category', params.category);
    return fetchJson<HealthArticle[]>(`/api/articles?${query.toString()}`);
  },
  getArticleById: (id: string) => fetchJson<HealthArticle>(`/api/articles/${id}`),

  // Support Requests
  getSupportRequests: () => fetchJson<SupportRequest[]>('/api/support-requests'),
  createSupportRequest: (data: {
    name: string;
    email: string;
    phone?: string;
    category: string;
    subject: string;
    message: string;
    preferredContactMethod: string;
  }) =>
    fetchJson<SupportRequest>('/api/support-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Feedback
  submitFeedback: (feedback: {
    targetType: 'chat_response' | 'discharge_summary' | 'article';
    targetId?: string;
    rating: 'helpful' | 'not_helpful';
    comments?: string;
  }) =>
    fetchJson<{ id: string }>('/api/feedback', {
      method: 'POST',
      body: JSON.stringify(feedback),
    }),

  // Admin Analytics
  getAnalytics: () => fetchJson<AdminAnalytics>('/api/admin/analytics'),
};
