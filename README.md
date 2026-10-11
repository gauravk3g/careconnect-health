# CareConnect Health

**AI-Powered Patient Support and Healthcare Information Platform**

CareConnect Health is a full-stack, responsive web application engineered to bridge the gap between complex clinical documentation and patient understanding. The platform provides plain-language health education, simplifies discharge instructions, offers clinic and appointment navigation, and enables safe escalation to human support.

> **Important Healthcare Safety Notice:**  
> CareConnect Health is a demonstration prototype designed for general educational and patient-support information. It does **not** provide clinical diagnoses, prescribe medication dosages, or replace consultation with licensed healthcare professionals. In any medical emergency, users are instructed to dial **911** immediately.

---

## 1. Key Features

- **Personalized Patient Dashboard**:
  - Welcoming overview for demo patient Eleanor Vance.
  - Interactive "How Can We Help You?" quick-access tools.
  - Snapshot summary cards for appointments, support requests, saved articles, and AI consultations.
  - Recent activity feed with demonstration records.

- **AI Health Assistant (Gemini 3.8 Flash)**:
  - Server-side integration with the modern `@google/genai` TypeScript SDK.
  - Explains medical terms, appointment preparation routines, and general wellness at a 6th–8th grade reading level.
  - **Healthcare Safety Guardrails**: Strict non-diagnosis boundaries, zero prescription or dosage fabrication, and proactive emergency symptom detection (immediate 911 alerts for chest pain, shortness of breath, stroke signs, etc.).
  - Conversational message bubbles with timestamps, suggested follow-up prompts, copy tools, feedback collection, and conversation reset.

- **Discharge Instructions Simplifier**:
  - Dedicated tool to translate dense hospital paperwork into an organized action plan.
  - Organizes content into standardized sections:
    - **A. Simple Summary**: Everyday language overview.
    - **B. What I Need to Do**: Clear bulleted action checklist.
    - **C. Important Dates and Follow-Up**: Extracted appointments and timeframes.
    - **D. Medication Information**: Explicitly listed medications with verification notices.
    - **E. Warning Signs**: Red flags requiring immediate medical attention.
    - **F. Questions for My Healthcare Provider**: Clarification questions for the care team.
  - Built-in test cases (Post-Cholecystectomy, Congestive Heart Failure, Acute Ankle Sprain).
  - Print-friendly layout and one-click summary copying.
  - Prompt-injection containment treating clinical notes as untrusted data.

- **Appointments & Clinic Directory**:
  - Fictional demonstration appointment records with pre-visit preparation checklists.
  - Searchable directory of clinics, operating hours, departments, and wheelchair accessibility.
  - Explicit prototype labels clarifying that appointments cannot be altered without an electronic health record (EHR) connection.

- **Health Knowledge Center**:
  - Educational resource library with categorized guides (Appointment Prep, Medical Terminology, Discharge Paperwork, Preventive Care, Wellness).
  - Search, reading time indicators, key takeaways, and offline bookmarking saved in localStorage.

- **Human Support & Escalation**:
  - Accessible, validated patient inquiry form with category routing.
  - Generates unique demonstration tracking IDs (`REQ-2026-XXXX`).
  - Real-time display of recent support tickets with triage status (`Submitted`, `Under Review`, `Resolved`).

- **Healthcare Administration Analytics**:
  - Demonstration analytics view for clinic coordinators.
  - KPI metric cards (Total AI interactions, support volume, educational satisfaction score, AI service health).
  - Category breakdown and queue status distribution charts.

- **Patient Settings & Accessibility**:
  - Toggleable accessibility modes (Larger Text, High Contrast, Reduced Motion).
  - Language and notification preferences.
  - Transparent privacy and prototype disclosure.

---

## 2. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React icons.
- **Backend**: Node.js, Express, TypeScript (`tsx`).
- **AI Integration**: Google Gen AI SDK (`@google/genai`) using model `gemini-3.8-flash` on the server.
- **Data Architecture**: Modular repository pattern (`IPatientRepository`, `IAppointmentRepository`, `IClinicRepository`, `IArticleRepository`, `ISupportRequestRepository`, `IFeedbackRepository`, `IAnalyticsRepository`) ready for PostgreSQL integration.
- **Development Tooling**: Vite 8 with middleware mode for full-stack SPA development.

---

## 3. Project Structure

```text
├── index.html                   # HTML entry point with synchronized metadata & Google Fonts
├── metadata.json                # AI Studio application metadata & permissions
├── package.json                 # Dependencies and npm scripts
├── server.ts                    # Full-stack Express server with Vite middleware integration
├── server/
│   ├── data/
│   │   └── mockData.ts          # Realistic demonstration clinical datasets & samples
│   ├── repositories/
│   │   └── index.ts             # Modular data repository layer (PostgreSQL-ready interfaces)
│   └── services/
│       └── geminiService.ts     # Server-side Gemini 3.8 Flash logic & emergency detection
├── src/
│   ├── App.tsx                  # Main application orchestrator & accessibility layout
│   ├── index.css                # Tailwind CSS imports & global rules
│   ├── main.tsx                 # React DOM entry point
│   ├── components/
│   │   ├── common/
│   │   │   ├── DemoBadge.tsx    # Fictional prototype indicator & information modal
│   │   │   ├── EmergencyBanner.tsx # High-visibility 911 emergency banner
│   │   │   └── GlobalSearchModal.tsx # Universal Cmd+K search modal
│   │   └── layout/
│   │       ├── Navbar.tsx       # Top bar with notifications, search trigger, & profile
│   │       └── Sidebar.tsx      # Responsive desktop sidebar & mobile navigation drawer
│   ├── pages/
│   │   ├── AdminDashboardPage.tsx      # Demonstration analytics for healthcare admins
│   │   ├── AppointmentsPage.tsx        # Appointments list & clinic directory
│   │   ├── AssistantPage.tsx           # Conversational AI Health Assistant
│   │   ├── ContactSupportPage.tsx      # Patient support ticket form & queue tracking
│   │   ├── DashboardPage.tsx           # Welcoming home dashboard with summary widgets
│   │   ├── DischargeSimplifierPage.tsx # Clinical discharge instructions simplifier
│   │   ├── KnowledgeCenterPage.tsx     # Health knowledge articles library
│   │   └── ProfileSettingsPage.tsx     # Demo profile, accessibility, & privacy controls
│   ├── services/
│   │   └── api.ts               # Client REST API wrapper
│   └── types/
│       └── index.ts             # Shared TypeScript data models
└── tsconfig.json                # TypeScript compiler configuration
```

---

## 4. Setup and Local Execution

### Prerequisites
- Node.js (v20+ recommended)
- npm

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env` file based on `.env.example`:
```bash
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
PORT=3000
```
> In Google AI Studio, `GEMINI_API_KEY` is automatically injected from the Secrets panel. API keys remain exclusively on the server and are never exposed to the frontend bundle.

### Running the Application
```bash
# Start full-stack development server on port 3000:
npm run dev
```

### Production Build
```bash
# Compile frontend into /dist:
npm run build

# Start production server:
npm start
```

---

## 5. Testing and Validation Checklist

- [x] **Dashboard Navigation**: All summary cards and "How Can We Help You?" buttons route to functional pages.
- [x] **AI Health Assistant Input Validation**: Empty messages rejected, length capped at 4,000 characters, rate-limiting in place.
- [x] **Emergency Guidance**: Messages containing acute symptoms (chest pain, shortness of breath, stroke signs) trigger high-priority red alert cards directing the user to dial 911 immediately.
- [x] **Discharge Instruction Simplification**: Clinical notes parsed into Sections A through F without inventing missing medications or diagnoses.
- [x] **Support Form Validation**: Name, email format, subject, and message length validated before generating reference IDs (`REQ-2026-XXXX`).
- [x] **Appointments & Article Search**: Debounced real-time search across providers, clinics, and health articles.
- [x] **Empty States & Loading**: Skeletons, spinners, and informative empty state messages implemented across all tabs.
- [x] **Mobile Responsiveness**: Accessible slide-out navigation drawer and fluid card layouts on mobile and tablet screens.

---

## 6. Future AWS Deployment Architecture

CareConnect Health has been structured to facilitate future migration to enterprise cloud infrastructure on Amazon Web Services (AWS):

1. **Frontend Hosting**: Static assets built with `vite build` deployed to an **Amazon S3** bucket fronted by **Amazon CloudFront** for global low-latency CDN delivery and TLS termination.
2. **Backend Compute**: Express container hosted on **AWS App Runner** or **Amazon ECS (AWS Fargate)** with automatic autoscaling.
3. **Database**: Swap the in-memory repository layer for an **Amazon RDS for PostgreSQL** (or Aurora Serverless v2) instance managed with an ORM like Drizzle or Prisma.
4. **Authentication & Identity**: User identity, HIPAA-compliant access control, and Multi-Factor Authentication (MFA) via **Amazon Cognito User Pools**.
5. **Retrieval-Augmented Generation (RAG)**: Integration with **Amazon Bedrock Knowledge Bases** (or Gemini via VPC endpoints) grounded in verified clinical documents stored in encrypted S3 buckets.
6. **Secrets & Monitoring**: API keys and database credentials managed via **AWS Secrets Manager**, with application performance logging directed to **Amazon CloudWatch** and protected by **AWS WAF**.
