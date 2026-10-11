/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PatientProfile {
  id: string;
  fullName: string;
  preferredName: string;
  mrn: string; // Medical Record Number (Demo)
  dob: string;
  email: string;
  phone: string;
  preferredLanguage: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  accessibilityPreferences: {
    largerText: boolean;
    highContrast: boolean;
    reduceMotion: boolean;
  };
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    appointmentReminders: boolean;
  };
}

export type AppointmentStatus = 'confirmed' | 'completed' | 'canceled' | 'rescheduled';

export interface Appointment {
  id: string;
  appointmentType: string;
  providerName: string;
  providerTitle: string;
  providerDepartment: string;
  clinicId: string;
  clinicName: string;
  dateTime: string;
  clinicAddress: string;
  contactPhone: string;
  status: AppointmentStatus;
  notes?: string;
  preparationInstructions: string[];
}

export interface Clinic {
  id: string;
  name: string;
  department: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  hours: Record<string, string>;
  generalServices: string[];
  wheelchairAccessible: boolean;
  parkingAvailable: boolean;
  telehealthAvailable: boolean;
}

export interface HealthArticle {
  id: string;
  title: string;
  category: 'Appointment Prep' | 'Medical Terminology' | 'Preventive Care' | 'Discharge Paperwork' | 'Patient Communication' | 'Wellness';
  shortDescription: string;
  readingTimeMinutes: number;
  author: string;
  publishedDate: string;
  contentMarkdown: string;
  keyTakeaways: string[];
  tags: string[];
}

export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
  isEmergencyAlert?: boolean;
  suggestedFollowUps?: string[];
  disclaimer?: string;
  error?: boolean;
}

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface MedicationItem {
  medName: string;
  simplifiedDirections: string;
  cautionaryNote?: string;
}

export interface DischargeSimplifiedResult {
  simpleSummary: string;
  whatINeedToDo: string[];
  importantDatesAndFollowUp: string[];
  medicationInformation: MedicationItem[];
  warningSigns: string[];
  questionsForProvider: string[];
  disclaimer: string;
  verificationNotice: string;
  rawInputSnippet?: string;
}

export type SupportCategory =
  | 'appointment_question'
  | 'discharge_paperwork'
  | 'clinic_info'
  | 'technical_issue'
  | 'general_patient_support';

export type SupportStatus = 'submitted' | 'under_review' | 'resolved';

export interface SupportRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  category: SupportCategory;
  subject: string;
  message: string;
  preferredContactMethod: 'email' | 'phone' | 'portal';
  status: SupportStatus;
  createdAt: string;
  estimatedResponseTime?: string;
  responseNotes?: string;
}

export interface UserFeedback {
  id: string;
  targetType: 'chat_response' | 'discharge_summary' | 'article';
  targetId?: string;
  rating: 'helpful' | 'not_helpful';
  comments?: string;
  createdAt: string;
}

export interface AdminAnalytics {
  totalConversations: number;
  totalSupportRequests: number;
  statusDistribution: {
    submitted: number;
    under_review: number;
    resolved: number;
  };
  categoryDistribution: Record<string, number>;
  feedbackStats: {
    helpfulCount: number;
    notHelpfulCount: number;
    satisfactionRate: number;
  };
  aiServiceStatus: {
    isOnline: boolean;
    latencyMs: number;
    model: string;
    lastChecked: string;
  };
  recentActivities: {
    id: string;
    type: 'chat' | 'discharge' | 'support' | 'appointment';
    summary: string;
    timestamp: string;
  }[];
  dataPeriod: string;
}
