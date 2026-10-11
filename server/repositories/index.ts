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
  UserFeedback,
  AdminAnalytics
} from '../../src/types/index.js';
import {
  DEMO_PATIENT,
  DEMO_APPOINTMENTS,
  DEMO_CLINICS,
  DEMO_ARTICLES,
  DEMO_SUPPORT_REQUESTS
} from '../data/mockData.js';

// --- Modular Repository Interfaces (Architecture ready for PostgreSQL/Drizzle) ---

export interface IPatientRepository {
  getProfile(): Promise<PatientProfile>;
  updatePreferences(prefs: Partial<PatientProfile>): Promise<PatientProfile>;
}

export interface IAppointmentRepository {
  getAll(filter?: { search?: string; status?: string }): Promise<Appointment[]>;
  getById(id: string): Promise<Appointment | null>;
}

export interface IClinicRepository {
  getAll(filter?: { search?: string; department?: string }): Promise<Clinic[]>;
  getById(id: string): Promise<Clinic | null>;
}

export interface IArticleRepository {
  getAll(filter?: { search?: string; category?: string }): Promise<HealthArticle[]>;
  getById(id: string): Promise<HealthArticle | null>;
}

export interface ISupportRequestRepository {
  getAll(): Promise<SupportRequest[]>;
  create(data: Omit<SupportRequest, 'id' | 'createdAt' | 'status'>): Promise<SupportRequest>;
  getById(id: string): Promise<SupportRequest | null>;
}

export interface IFeedbackRepository {
  record(feedback: Omit<UserFeedback, 'id' | 'createdAt'>): Promise<UserFeedback>;
  getAll(): Promise<UserFeedback[]>;
}

export interface IAnalyticsRepository {
  getAggregateMetrics(): Promise<AdminAnalytics>;
  incrementConversationCount(): void;
  recordActivity(activity: { type: 'chat' | 'discharge' | 'support' | 'appointment'; summary: string }): void;
}

// --- In-Memory Demonstration Repository Implementation ---

class DemoPatientRepository implements IPatientRepository {
  private patient: PatientProfile = { ...DEMO_PATIENT };

  async getProfile(): Promise<PatientProfile> {
    return { ...this.patient };
  }

  async updatePreferences(updates: Partial<PatientProfile>): Promise<PatientProfile> {
    this.patient = {
      ...this.patient,
      ...updates,
      accessibilityPreferences: {
        ...this.patient.accessibilityPreferences,
        ...(updates.accessibilityPreferences || {}),
      },
      notificationPreferences: {
        ...this.patient.notificationPreferences,
        ...(updates.notificationPreferences || {}),
      },
    };
    return { ...this.patient };
  }
}

class DemoAppointmentRepository implements IAppointmentRepository {
  private appointments: Appointment[] = [...DEMO_APPOINTMENTS];

  async getAll(filter?: { search?: string; status?: string }): Promise<Appointment[]> {
    let list = [...this.appointments];
    if (filter?.status && filter.status !== 'all') {
      list = list.filter((a) => a.status.toLowerCase() === filter.status?.toLowerCase());
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (a) =>
          a.appointmentType.toLowerCase().includes(q) ||
          a.providerName.toLowerCase().includes(q) ||
          a.clinicName.toLowerCase().includes(q) ||
          a.notes?.toLowerCase().includes(q)
      );
    }
    return list;
  }

  async getById(id: string): Promise<Appointment | null> {
    const item = this.appointments.find((a) => a.id === id);
    return item ? { ...item } : null;
  }
}

class DemoClinicRepository implements IClinicRepository {
  private clinics: Clinic[] = [...DEMO_CLINICS];

  async getAll(filter?: { search?: string; department?: string }): Promise<Clinic[]> {
    let list = [...this.clinics];
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.department.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q) ||
          c.generalServices.some((s) => s.toLowerCase().includes(q))
      );
    }
    return list;
  }

  async getById(id: string): Promise<Clinic | null> {
    const item = this.clinics.find((c) => c.id === id);
    return item ? { ...item } : null;
  }
}

class DemoArticleRepository implements IArticleRepository {
  private articles: HealthArticle[] = [...DEMO_ARTICLES];

  async getAll(filter?: { search?: string; category?: string }): Promise<HealthArticle[]> {
    let list = [...this.articles];
    if (filter?.category && filter.category !== 'All') {
      list = list.filter((a) => a.category.toLowerCase() === filter.category?.toLowerCase());
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.shortDescription.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)) ||
          a.contentMarkdown.toLowerCase().includes(q)
      );
    }
    return list;
  }

  async getById(id: string): Promise<HealthArticle | null> {
    const item = this.articles.find((a) => a.id === id);
    return item ? { ...item } : null;
  }
}

class DemoSupportRequestRepository implements ISupportRequestRepository {
  private requests: SupportRequest[] = [...DEMO_SUPPORT_REQUESTS];

  async getAll(): Promise<SupportRequest[]> {
    return [...this.requests].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async create(data: Omit<SupportRequest, 'id' | 'createdAt' | 'status'>): Promise<SupportRequest> {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newReq: SupportRequest = {
      ...data,
      id: `REQ-2026-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      status: 'submitted',
      estimatedResponseTime: 'Within 1 business day',
      responseNotes: 'Logged in demonstration queue for patient navigation review.',
    };
    this.requests.unshift(newReq);
    return { ...newReq };
  }

  async getById(id: string): Promise<SupportRequest | null> {
    const item = this.requests.find((r) => r.id === id);
    return item ? { ...item } : null;
  }
}

class DemoFeedbackRepository implements IFeedbackRepository {
  private feedbacks: UserFeedback[] = [
    {
      id: 'fb-01',
      targetType: 'chat_response',
      rating: 'helpful',
      comments: 'Clear explanation of blood pressure numbers.',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: 'fb-02',
      targetType: 'discharge_summary',
      rating: 'helpful',
      comments: 'Simplified my gallbladder recovery diet restrictions wonderfully.',
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
    {
      id: 'fb-03',
      targetType: 'article',
      targetId: 'art-01',
      rating: 'helpful',
      comments: 'Helped me organize my visit with Dr. Chen.',
      createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    },
  ];

  async record(feedback: Omit<UserFeedback, 'id' | 'createdAt'>): Promise<UserFeedback> {
    const newFb: UserFeedback = {
      ...feedback,
      id: `fb-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.feedbacks.unshift(newFb);
    return { ...newFb };
  }

  async getAll(): Promise<UserFeedback[]> {
    return [...this.feedbacks];
  }
}

class DemoAnalyticsRepository implements IAnalyticsRepository {
  private totalConversationsCount = 42;
  private recentActivities = [
    {
      id: 'act-1',
      type: 'chat' as const,
      summary: 'Patient asked about normal fasting blood sugar ranges',
      timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    },
    {
      id: 'act-2',
      type: 'discharge' as const,
      summary: 'Simplified post-cholecystectomy discharge instructions',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      id: 'act-3',
      type: 'support' as const,
      summary: 'Support ticket submitted regarding cardiology arrival time (REQ-2026-1042)',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      id: 'act-4',
      type: 'appointment' as const,
      summary: 'Patient reviewed upcoming cardiology evaluation details',
      timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    },
  ];

  constructor(
    private supportRepo: ISupportRequestRepository,
    private feedbackRepo: IFeedbackRepository
  ) {}

  incrementConversationCount(): void {
    this.totalConversationsCount += 1;
  }

  recordActivity(activity: { type: 'chat' | 'discharge' | 'support' | 'appointment'; summary: string }): void {
    this.recentActivities.unshift({
      id: `act-${Date.now()}`,
      ...activity,
      timestamp: new Date().toISOString(),
    });
    if (this.recentActivities.length > 20) {
      this.recentActivities.pop();
    }
  }

  async getAggregateMetrics(): Promise<AdminAnalytics> {
    const supportRequests = await this.supportRepo.getAll();
    const feedbacks = await this.feedbackRepo.getAll();

    const statusCounts = {
      submitted: 0,
      under_review: 0,
      resolved: 0,
    };
    const categoryCounts: Record<string, number> = {
      appointment_question: 0,
      discharge_paperwork: 0,
      clinic_info: 0,
      technical_issue: 0,
      general_patient_support: 0,
    };

    for (const r of supportRequests) {
      if (statusCounts[r.status] !== undefined) {
        statusCounts[r.status]++;
      }
      categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
    }

    const helpful = feedbacks.filter((f) => f.rating === 'helpful').length;
    const notHelpful = feedbacks.filter((f) => f.rating === 'not_helpful').length;
    const totalRated = helpful + notHelpful;
    const satisfactionRate = totalRated > 0 ? Math.round((helpful / totalRated) * 100) : 96;

    const hasApiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 5);

    return {
      totalConversations: this.totalConversationsCount,
      totalSupportRequests: supportRequests.length,
      statusDistribution: statusCounts,
      categoryDistribution: categoryCounts,
      feedbackStats: {
        helpfulCount: helpful,
        notHelpfulCount: notHelpful,
        satisfactionRate,
      },
      aiServiceStatus: {
        isOnline: hasApiKey,
        latencyMs: 380,
        model: 'gemini-3.8-flash',
        lastChecked: new Date().toISOString(),
      },
      recentActivities: [...this.recentActivities],
      dataPeriod: 'Active Demonstration Environment (30-Day Snapshot)',
    };
  }
}

// Instantiate repositories
export const patientRepository = new DemoPatientRepository();
export const appointmentRepository = new DemoAppointmentRepository();
export const clinicRepository = new DemoClinicRepository();
export const articleRepository = new DemoArticleRepository();
export const supportRequestRepository = new DemoSupportRequestRepository();
export const feedbackRepository = new DemoFeedbackRepository();
export const analyticsRepository = new DemoAnalyticsRepository(
  supportRequestRepository,
  feedbackRepository
);
