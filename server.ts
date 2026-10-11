/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  patientRepository,
  appointmentRepository,
  clinicRepository,
  articleRepository,
  supportRequestRepository,
  feedbackRepository,
  analyticsRepository,
} from './server/repositories/index.js';
import {
  generateHealthChatResponse,
  simplifyDischargeInstructions,
} from './server/services/geminiService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Body parsing with safe size limit
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Basic security headers
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Simple in-memory rate limiter for AI endpoints (protects against rapid flooding)
const clientRequestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // 30 requests per minute

const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown-client';
  const now = Date.now();
  const record = clientRequestCounts.get(ip);

  if (!record || now > record.resetTime) {
    clientRequestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: 'Too many requests. Please wait a moment before sending another message.',
      retryAfterSeconds: Math.ceil((record.resetTime - now) / 1000),
    });
  }

  record.count++;
  next();
};

// -------------------------------------------------------------
// REST API ENDPOINTS
// -------------------------------------------------------------

// 1. Health check
app.get('/api/health', async (_req: Request, res: Response) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'CareConnect Health API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    aiStatus: hasGeminiKey ? 'active' : 'demo_mode_key_pending',
    persistence: 'in_memory_repository_postgres_ready',
  });
});

// 2. Patient Profile & Preferences
app.get('/api/profile', async (_req: Request, res: Response) => {
  try {
    const profile = await patientRepository.getProfile();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch patient profile' });
  }
});

app.put('/api/profile/preferences', async (req: Request, res: Response) => {
  try {
    const updated = await patientRepository.updatePreferences(req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// 3. AI Health Assistant Chat
app.post('/api/chat', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    if (message.length > 4000) {
      return res.status(400).json({ error: 'Message exceeds maximum length of 4000 characters.' });
    }

    analyticsRepository.incrementConversationCount();
    analyticsRepository.recordActivity({
      type: 'chat',
      summary: `User asked: "${message.slice(0, 60)}${message.length > 60 ? '...' : ''}"`,
    });

    const result = await generateHealthChatResponse(
      message.trim(),
      Array.isArray(history) ? history : []
    );

    res.json({
      reply: result.reply,
      isEmergencyAlert: result.isEmergencyAlert,
      suggestedFollowUps: result.suggestedFollowUps,
      disclaimer:
        'CareConnect Health provides general educational and patient-support information. It does not diagnose conditions, prescribe treatment, or replace advice from a qualified healthcare professional.',
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal chat processing error';
    console.error('API /api/chat error:', msg);
    res.status(500).json({
      error: 'Unable to process health assistant query. Please try again or contact human support.',
    });
  }
});

// 4. Simplify Discharge Instructions
app.post('/api/discharge/simplify', rateLimiter, async (req: Request, res: Response) => {
  try {
    const { instructions } = req.body;
    if (!instructions || typeof instructions !== 'string' || instructions.trim().length === 0) {
      return res.status(400).json({ error: 'Discharge instructions text is required.' });
    }

    if (instructions.length > 25000) {
      return res.status(400).json({ error: 'Instructions text exceeds maximum allowed size.' });
    }

    analyticsRepository.recordActivity({
      type: 'discharge',
      summary: 'Simplified discharge paperwork',
    });

    const result = await simplifyDischargeInstructions(instructions.trim());
    res.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Discharge simplification error';
    console.error('API /api/discharge/simplify error:', msg);
    res.status(500).json({
      error: 'Failed to process discharge instructions. Please verify your text and retry.',
    });
  }
});

// 5. Appointments
app.get('/api/appointments', async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string | undefined;
    const status = req.query.status as string | undefined;
    const appointments = await appointmentRepository.getAll({ search, status });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

app.get('/api/appointments/:id', async (req: Request, res: Response) => {
  try {
    const item = await appointmentRepository.getById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointment details' });
  }
});

// 6. Clinics
app.get('/api/clinics', async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string | undefined;
    const clinics = await clinicRepository.getAll({ search });
    res.json(clinics);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch clinics' });
  }
});

app.get('/api/clinics/:id', async (req: Request, res: Response) => {
  try {
    const item = await clinicRepository.getById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Clinic not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch clinic details' });
  }
});

// 7. Health Knowledge Articles
app.get('/api/articles', async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string | undefined;
    const category = req.query.category as string | undefined;
    const articles = await articleRepository.getAll({ search, category });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch health articles' });
  }
});

app.get('/api/articles/:id', async (req: Request, res: Response) => {
  try {
    const item = await articleRepository.getById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// 8. Support Requests
app.get('/api/support-requests', async (_req: Request, res: Response) => {
  try {
    const list = await supportRequestRepository.getAll();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch support requests' });
  }
});

app.post('/api/support-requests', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, category, subject, message, preferredContactMethod } = req.body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Please provide a valid full name.' });
    }
    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }
    const validCategories = [
      'appointment_question',
      'discharge_paperwork',
      'clinic_info',
      'technical_issue',
      'general_patient_support',
    ] as const;

    if (!category || !validCategories.includes(category)) {
      return res.status(400).json({ error: 'Please select a valid support category.' });
    }
    if (!subject || typeof subject !== 'string' || subject.trim().length < 4) {
      return res.status(400).json({ error: 'Please enter a clear subject line.' });
    }
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return res.status(400).json({ error: 'Please provide a message with at least 10 characters.' });
    }

    const created = await supportRequestRepository.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone ? String(phone).trim() : undefined,
      category: category as (typeof validCategories)[number],
      subject: subject.trim(),
      message: message.trim(),
      preferredContactMethod: preferredContactMethod || 'email',
    });

    analyticsRepository.recordActivity({
      type: 'support',
      summary: `New support ticket: ${created.id} (${created.subject.slice(0, 40)})`,
    });

    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create support request' });
  }
});

// 9. Feedback
app.post('/api/feedback', async (req: Request, res: Response) => {
  try {
    const { targetType, targetId, rating, comments } = req.body;
    if (!targetType || !rating || (rating !== 'helpful' && rating !== 'not_helpful')) {
      return res.status(400).json({ error: 'Invalid feedback submission.' });
    }

    const created = await feedbackRepository.record({
      targetType,
      targetId,
      rating,
      comments: comments ? String(comments).trim() : undefined,
    });

    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'Failed to record feedback' });
  }
});

// 10. Admin Analytics
app.get('/api/admin/analytics', async (_req: Request, res: Response) => {
  try {
    const metrics = await analyticsRepository.getAggregateMetrics();
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load analytics metrics' });
  }
});

// Centralized error handler
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'An unexpected server error occurred. Please try again later.',
  });
});

// -------------------------------------------------------------
// Vite middleware for Dev or Static files for Production
// -------------------------------------------------------------
async function startServer() {
  if (isProduction) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CareConnect Health server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting CareConnect Health server:', err);
});
