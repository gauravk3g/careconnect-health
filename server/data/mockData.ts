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

export const DEMO_PATIENT: PatientProfile = {
  id: 'pat-9901',
  fullName: 'Eleanor J. Vance',
  preferredName: 'Eleanor',
  mrn: 'MRN-DEMO-849201',
  dob: '1968-04-12',
  email: 'eleanor.vance@example-patient.org',
  phone: '(555) 234-8901',
  preferredLanguage: 'English',
  emergencyContact: {
    name: 'Marcus Vance',
    relationship: 'Spouse',
    phone: '(555) 234-8909',
  },
  accessibilityPreferences: {
    largerText: false,
    highContrast: false,
    reduceMotion: false,
  },
  notificationPreferences: {
    email: true,
    sms: true,
    appointmentReminders: true,
  },
};

export const DEMO_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    appointmentType: 'Cardiology Follow-Up',
    providerName: 'Dr. Sarah Jenkins, MD',
    providerTitle: 'Cardiologist & Clinical Specialist',
    providerDepartment: 'Department of Cardiovascular Medicine',
    clinicId: 'cln-01',
    clinicName: 'CareConnect Metro Specialty Clinic',
    dateTime: '2026-10-18T10:30:00',
    clinicAddress: '420 Health Sciences Blvd, Suite 300, Metropolis, ST 10024',
    contactPhone: '(555) 890-4100',
    status: 'confirmed',
    notes: 'Routine 6-month blood pressure and medication evaluation. Bring current medication list.',
    preparationInstructions: [
      'Bring your current medication bottles or an updated list.',
      'Log blood pressure readings for 3 consecutive days prior to the visit.',
      'Check in at Suite 300 15 minutes before your scheduled appointment.',
    ],
  },
  {
    id: 'apt-102',
    appointmentType: 'Comprehensive Wellness Exam',
    providerName: 'Dr. Michael Chen, MD',
    providerTitle: 'Primary Care Physician',
    providerDepartment: 'Family & Internal Medicine',
    clinicId: 'cln-02',
    clinicName: 'Westside Community Health Center',
    dateTime: '2026-10-29T14:15:00',
    clinicAddress: '1280 West Elm St, Building B, Metropolis, ST 10028',
    contactPhone: '(555) 890-5200',
    status: 'confirmed',
    notes: 'Annual preventative physical exam and routine blood panel order review.',
    preparationInstructions: [
      'Fasting is not required for the initial physical, but morning labs may be ordered.',
      'Write down any preventative screening questions or vaccine history inquiries.',
    ],
  },
  {
    id: 'apt-103',
    appointmentType: 'Physical Therapy Assessment',
    providerName: 'Rachel Adams, DPT',
    providerTitle: 'Doctor of Physical Therapy',
    providerDepartment: 'Rehabilitation & Orthopedics',
    clinicId: 'cln-03',
    clinicName: 'Pinecrest Physical Therapy & Mobility',
    dateTime: '2026-11-04T09:00:00',
    clinicAddress: '88 Valley View Rd, Floor 1, Metropolis, ST 10032',
    contactPhone: '(555) 890-7300',
    status: 'confirmed',
    notes: 'Knee rehabilitation strengthening regimen and gait analysis review.',
    preparationInstructions: [
      'Wear comfortable loose-fitting athletic clothing and supportive sneakers.',
      'Allow 60 minutes for the assessment and initial home exercise guidance.',
    ],
  },
  {
    id: 'apt-104',
    appointmentType: 'Routine Metabolic Panel & Lipid Labs',
    providerName: 'Metro Diagnostic Laboratory Team',
    providerTitle: 'Clinical Pathology Services',
    providerDepartment: 'Outpatient Diagnostic Labs',
    clinicId: 'cln-01',
    clinicName: 'CareConnect Metro Specialty Clinic',
    dateTime: '2026-09-20T08:00:00',
    clinicAddress: '420 Health Sciences Blvd, Floor 1 Lab, Metropolis, ST 10024',
    contactPhone: '(555) 890-4155',
    status: 'completed',
    notes: 'Results forwarded to Dr. Michael Chen. Normal ranges observed.',
    preparationInstructions: [
      'Fast for 8 hours prior to blood draw (water permitted).',
    ],
  },
];

export const DEMO_CLINICS: Clinic[] = [
  {
    id: 'cln-01',
    name: 'CareConnect Metro Specialty Clinic',
    department: 'Specialty Care (Cardiology, Endocrinology, Pulmonology)',
    address: '420 Health Sciences Blvd, Suites 200-400',
    city: 'Metropolis',
    state: 'ST',
    zip: '10024',
    phone: '(555) 890-4100',
    email: 'metro-specialty@careconnect-demo.org',
    hours: {
      'Monday - Friday': '7:30 AM - 5:30 PM',
      'Saturday': '8:00 AM - 1:00 PM (Urgent Lab Only)',
      'Sunday': 'Closed',
    },
    generalServices: [
      'Cardiology Consultations & Echocardiograms',
      'On-site Outpatient Phlebotomy & Diagnostic Lab',
      'Pulmonary Function Testing',
      'Preventive Health Counseling',
    ],
    wheelchairAccessible: true,
    parkingAvailable: true,
    telehealthAvailable: true,
  },
  {
    id: 'cln-02',
    name: 'Westside Community Health Center',
    department: 'Primary Care & Family Medicine',
    address: '1280 West Elm St, Building B',
    city: 'Metropolis',
    state: 'ST',
    zip: '10028',
    phone: '(555) 890-5200',
    email: 'westside@careconnect-demo.org',
    hours: {
      'Monday - Friday': '8:00 AM - 6:00 PM',
      'Saturday': '9:00 AM - 2:00 PM',
      'Sunday': 'Closed',
    },
    generalServices: [
      'Adult & Pediatric Primary Care',
      'Annual Wellness Examinations',
      'Immunizations & Preventative Screenings',
      'Chronic Condition Care Management',
    ],
    wheelchairAccessible: true,
    parkingAvailable: true,
    telehealthAvailable: true,
  },
  {
    id: 'cln-03',
    name: 'Pinecrest Physical Therapy & Mobility',
    department: 'Rehabilitation & Orthopedic Wellness',
    address: '88 Valley View Rd, Floor 1',
    city: 'Metropolis',
    state: 'ST',
    zip: '10032',
    phone: '(555) 890-7300',
    email: 'pinecrest-pt@careconnect-demo.org',
    hours: {
      'Monday - Thursday': '7:00 AM - 6:30 PM',
      'Friday': '7:00 AM - 4:00 PM',
      'Saturday - Sunday': 'Closed',
    },
    generalServices: [
      'Post-Surgical Joint Rehabilitation',
      'Neurological & Gait Conditioning',
      'Ergonomic Work Assessment',
      'Manual Therapy & Ultrasound',
    ],
    wheelchairAccessible: true,
    parkingAvailable: true,
    telehealthAvailable: false,
  },
  {
    id: 'cln-04',
    name: 'Hopewell Urgent Care & Express Health',
    department: 'Walk-In Urgent Care Services',
    address: '510 North Beacon Ave',
    city: 'Metropolis',
    state: 'ST',
    zip: '10035',
    phone: '(555) 890-9900',
    email: 'hopewell-urgent@careconnect-demo.org',
    hours: {
      'Monday - Sunday': '8:00 AM - 8:00 PM (365 Days)',
    },
    generalServices: [
      'Minor Illness & Infection Treatment',
      'Laceration Repair & Minor Fracture Splinting',
      'Point-of-Care Rapid Testing (Flu, Strep, COVID)',
      'Digital X-Ray on Site',
    ],
    wheelchairAccessible: true,
    parkingAvailable: true,
    telehealthAvailable: true,
  },
];

export const DEMO_ARTICLES: HealthArticle[] = [
  {
    id: 'art-01',
    title: 'Organizing Your Questions Before a Doctor’s Visit',
    category: 'Appointment Prep',
    shortDescription: 'Practical tips to prioritize your health concerns, bring relevant logs, and maximize the time you have with your healthcare provider.',
    readingTimeMinutes: 4,
    author: 'CareConnect Health Education Editorial',
    publishedDate: '2026-09-15',
    keyTakeaways: [
      'Write down your top three concerns in order of priority before your visit.',
      'Bring all current prescription bottles, supplements, and recent health logs.',
      'Take notes or ask a trusted loved one to join you if you feel overwhelmed.',
      'Never hesitate to ask: "Could you please explain that in simpler words?"',
    ],
    tags: ['Doctor Visit', 'Preparation', 'Communication', 'Advocacy'],
    contentMarkdown: `## Making the Most of Your Clinic Visit

Many patients feel rushed or forget crucial questions during routine medical appointments. Clinical visits typically last between 15 to 30 minutes, so arriving with an organized plan empowers you to take charge of your wellness.

### 1. The "Top Three" Rule
Before stepping into the examination room, write down the three most important symptoms or questions you want to discuss. If you present ten different issues at once, there may not be sufficient time to examine each thoroughly. Prioritizing ensures your primary distress is addressed first.

### 2. Prepare an Accurate Medication and Supplement List
Over-the-counter vitamins, herbal supplements, and occasional painkillers can interact with prescription medications. Rather than relying on memory, either bring the physical bottles in a clean bag or snap clear photos of the labels displaying dosage and frequency.

### 3. Track Specific Symptoms with Details
Instead of stating "I haven't been feeling well lately," keep a brief 3-day log:
- **When does it happen?** (e.g., "Sharp pain in right knee after walking down stairs for 10 minutes")
- **What helps or hurts?** (e.g., "Ice relieves it; prolonged standing worsens it")
- **Severity scale:** Rate the intensity on a scale of 1 to 10.

### 4. Practice the "Teach-Back" Method
Before concluding the visit, summarize instructions back to your doctor: *"Just to make sure I understand, I will take the blue tablet once daily in the morning with food, and call your office if my blood pressure remains above 140/90 after two weeks. Is that correct?"*

---
*Disclaimer: This educational article provides general guidance and does not replace medical consultation with your licensed provider.*`,
  },
  {
    id: 'art-02',
    title: 'Decoding Common Medical Abbreviations and Terminology',
    category: 'Medical Terminology',
    shortDescription: 'A straightforward guide to understanding shorthand, acronyms, and lab terminology often found on patient portals and discharge summaries.',
    readingTimeMinutes: 5,
    author: 'CareConnect Clinical Documentation Team',
    publishedDate: '2026-08-28',
    keyTakeaways: [
      'Medical shorthand frequently derives from Latin (e.g., "PRN" means as needed, "PO" means by mouth).',
      'Diagnostic lab results often list reference ranges that vary between testing facilities.',
      '"WNL" stands for Within Normal Limits.',
      'Always request plain-language clarification from your care team if an acronym is confusing.',
    ],
    tags: ['Medical Jargon', 'Patient Portal', 'Lab Results', 'Terminology'],
    contentMarkdown: `## Breaking Down Clinical Jargon

When opening your electronic health records, it is common to encounter clinical acronyms that look like a foreign language. Understanding basic terms helps ease unnecessary worry.

### Common Medication Shorthand
- **PO (Per Os):** Taken orally by mouth.
- **QD / Daily:** Once a day (doctors avoid "QD" due to handwriting errors, preferring "daily").
- **BID (Bis in Die):** Twice a day (usually every 12 hours).
- **TID (Ter in Die):** Three times a day.
- **PRN (Pro Re Nata):** Taken only as needed (e.g., for breakthrough pain or fever), not on a fixed schedule.
- **NPO (Nil Per Os):** Nothing by mouth (used before surgical procedures or certain imaging).

### Common Lab & Exam Phrases
- **CBC (Complete Blood Count):** Evaluates red blood cells, white blood cells, and platelets.
- **BMP / CMP:** Basic or Comprehensive Metabolic Panel, assessing electrolytes, kidney function, and liver enzymes.
- **WNL:** Within Normal Limits. This indicates the result fell within the standard expected reference bracket for healthy individuals.
- **Dx:** Diagnosis.
- **Rx:** Prescription.
- **Hx:** Patient medical history.

---
*Disclaimer: Reference intervals and interpretations vary between clinical labs. Discuss specific results with your ordering clinician.*`,
  },
  {
    id: 'art-03',
    title: 'Understanding Your Discharge Paperwork: A Step-by-Step Guide',
    category: 'Discharge Paperwork',
    shortDescription: 'How to break down hospital or emergency room discharge instructions to ensure a safe, smooth recovery at home.',
    readingTimeMinutes: 6,
    author: 'CareConnect Patient Safety Advisory',
    publishedDate: '2026-09-02',
    keyTakeaways: [
      'Discharge paperwork outlines wound care, activity limitations, medication changes, and follow-ups.',
      'Pay close attention to "Red Flag" or warning symptoms requiring immediate medical attention.',
      'Reconciliation: Compare hospital discharge medications against medications you took before admission.',
      'Schedule follow-up appointments within the exact timeframe recommended.',
    ],
    tags: ['Hospital Discharge', 'Recovery', 'Patient Safety', 'Medication Safety'],
    contentMarkdown: `## Transitioning Safely from Hospital to Home

Leaving the hospital or outpatient surgical suite can be exhausting. Patients often receive stapled packets filled with complex instructions while still recovering from anesthesia or acute illness.

### Key Sections to Highlight in Your Packet
1. **Activity Restrictions:**
   - Are you on bed rest, light walking, or weight-bearing limits (e.g., no lifting over 10 lbs)?
   - When can you resume showering or bathing? (Soaking an unhealed incision in a bath or pool is usually prohibited).
   - Can you drive? (Never drive while taking prescription opioid pain medications).

2. **Medication Changes:**
   - Hospitals often adjust existing prescriptions or start temporary antibiotics, blood thinners, or pain medications.
   - Clarify whether you should continue your pre-hospital medications or stop them.
   - If a medication looks unfamiliar or duplicated, contact your community pharmacist before swallowing both.

3. **Incision and Wound Monitoring:**
   - Look for changes in redness, increasing swelling, warmth to the touch, foul-smelling drainage, or wound separation.

4. **Emergency Warning Signs vs. Expected Healing:**
   - Normal: Mild soreness, minor swelling, gradual recovery.
   - Warning Signs: High fever (>101°F), sudden chest tightness, shortness of breath, severe calf pain, inability to keep fluids down.

---
*Disclaimer: Always follow the tailored discharge orders signed by your attending physician.*`,
  },
  {
    id: 'art-04',
    title: 'Preventive Health Screenings by Age: What to Expect',
    category: 'Preventive Care',
    shortDescription: 'Overview of standard preventative screenings, including blood pressure, lipid panels, cancer screenings, and vaccines.',
    readingTimeMinutes: 5,
    author: 'CareConnect Preventive Medicine Group',
    publishedDate: '2026-07-19',
    keyTakeaways: [
      'Preventive care helps identify potential health challenges early when they are most manageable.',
      'Annual blood pressure and wellness checks are foundational for all adults.',
      'Screening guidelines for mammograms, colonoscopies, and bone density are based on age and personal risk factors.',
      'Discuss your family medical history with your primary care clinician to personalize your schedule.',
    ],
    tags: ['Preventative Care', 'Screenings', 'Wellness', 'Vaccines'],
    contentMarkdown: `## Proactive Health: Investing in Tomorrow

Preventive healthcare focuses on stopping illnesses before they start or catching them in early stages when treatments are most effective and least invasive.

### Everyday Basics for All Adults
- **Blood Pressure Screening:** At least annually; more frequently if elevated.
- **Cholesterol & Lipid Panel:** Every 3 to 5 years starting at age 20 for average risk, or annually if managing cardiovascular conditions.
- **Blood Sugar / Hemoglobin A1c:** Screened starting at age 35 for adults who are overweight, or based on risk indicators.
- **Dental & Vision Exams:** Routine dental cleanings every 6 months; comprehensive eye checks every 1-2 years.

### Age-Based Milestones
- **Age 45+:** Colorectal cancer screening begins for average-risk adults (options include colonoscopy, stool DNA, or FIT testing).
- **Age 40-50+:** Mammography screening discussions based on shared decision-making with your physician.
- **Age 65+:** Bone mineral density testing (DEXA scan) to evaluate osteoporosis risk.

---
*Disclaimer: Screening guidelines reflect national health recommendations for general populations. Your personal history may require tailored timing.*`,
  },
  {
    id: 'art-05',
    title: 'How to Safely Track and Review Your Daily Medications',
    category: 'Wellness',
    shortDescription: 'Simple habits to prevent accidental missed doses, manage refills, and avoid harmful drug interactions.',
    readingTimeMinutes: 4,
    author: 'CareConnect Pharmacy Services',
    publishedDate: '2026-08-10',
    keyTakeaways: [
      'Use a 7-day pill organizer or smartphone reminders to maintain consistency.',
      'Keep an updated paper list in your wallet or purse for emergency personnel.',
      'Never alter, split, or stop prescribed medications without consulting your prescribing provider.',
      'Know what to do if you accidentally miss a dose (ask your pharmacist in advance).',
    ],
    tags: ['Medications', 'Safety', 'Pharmacy', 'Routine'],
    contentMarkdown: `## Daily Medication Management Made Simple

Managing multiple daily medications can quickly become confusing. Here are practical strategies to keep your regimen safe.

### Strategies That Work
1. **Anchor to Daily Habits:** Pair taking your medicine with an established daily routine, like brushing your teeth or eating breakfast (if food is required).
2. **Dedicated Pill Organizers:** Weekly organizers (AM/PM slots) offer visual confirmation of whether you took today's dose, preventing double-dosing.
3. **Single Pharmacy Strategy:** Whenever possible, fill all prescriptions through the same pharmacy chain or local independent pharmacy. Their dispensing software automatically checks for dangerous drug-drug interactions between different prescribing doctors.

---
*Disclaimer: For specific questions regarding missed doses or side effects, contact your dispensing pharmacy or prescribing clinician immediately.*`,
  },
  {
    id: 'art-06',
    title: 'Communicating Effectively with Your Healthcare Team',
    category: 'Patient Communication',
    shortDescription: 'How to build a collaborative, trusting relationship with your doctors, nurses, and care coordinators.',
    readingTimeMinutes: 3,
    author: 'CareConnect Patient Experience Advisory',
    publishedDate: '2026-06-22',
    keyTakeaways: [
      'You are the most important member of your healthcare team.',
      'Be candid about financial constraints, fear of side effects, or lifestyle challenges.',
      'Utilize patient portal messaging for non-urgent questions between visits.',
      'Ask for written educational summaries or interpretation services when needed.',
    ],
    tags: ['Communication', 'Advocacy', 'Patient Rights', 'Trust'],
    contentMarkdown: `## Building a True Healthcare Partnership

Modern medicine is a collaborative partnership between you and your care team. Your doctors understand physiology and pharmacology, but you are the foremost expert on your own body, lifestyle, and values.

### Honest Conversations Yield Better Care
- If a prescribed medication is too expensive to fill, inform your doctor immediately. Affordable therapeutic alternatives or generic equivalents are frequently available.
- If you stopped taking a medication because it made you feel nauseous or fatigued, do not hide it out of embarrassment. Clinicians need factual information to adjust therapies safely.
- You have the right to request professional medical interpretation services in your native language free of charge at any certified healthcare institution.

---
*Disclaimer: Educational resource provided for informational purposes only.*`,
  },
];

export const DEMO_SUPPORT_REQUESTS: SupportRequest[] = [
  {
    id: 'REQ-2026-1042',
    name: 'Eleanor Vance',
    email: 'eleanor.vance@example-patient.org',
    phone: '(555) 234-8901',
    category: 'appointment_question',
    subject: 'Need to clarify arrival time for Cardiology follow-up',
    message: 'Hello, my appointment card states 10:30 AM on Oct 18, but does that include the 15-minute prior check-in for vitals? Please confirm if I should arrive at 10:15 AM.',
    preferredContactMethod: 'email',
    status: 'under_review',
    createdAt: '2026-10-10T14:22:00',
    estimatedResponseTime: 'Within 1 business day',
    responseNotes: 'Assigned to Metro Specialty Clinic front desk coordinator.',
  },
  {
    id: 'REQ-2026-0988',
    name: 'Eleanor Vance',
    email: 'eleanor.vance@example-patient.org',
    phone: '(555) 234-8901',
    category: 'discharge_paperwork',
    subject: 'Assistance interpreting post-op wound dressing interval',
    message: 'I reviewed my previous surgical notes and would like clarification on whether gauze dressing should be dry or moistened with saline during changes.',
    preferredContactMethod: 'portal',
    status: 'resolved',
    createdAt: '2026-09-22T09:15:00',
    estimatedResponseTime: 'Completed',
    responseNotes: 'Patient educational nurse reviewed discharge packet orders and clarified sterile dry dressing instructions.',
  },
  {
    id: 'REQ-2026-1130',
    name: 'Eleanor Vance',
    email: 'eleanor.vance@example-patient.org',
    category: 'clinic_info',
    subject: 'Wheelchair access ramp location at Pinecrest Clinic',
    message: 'Does the Pinecrest clinic have designated accessible parking directly adjacent to the main elevator entrance?',
    preferredContactMethod: 'email',
    status: 'submitted',
    createdAt: '2026-10-11T11:05:00',
    estimatedResponseTime: 'Within 2 business days',
    responseNotes: 'Pending review by patient navigation staff.',
  },
];

export const SAMPLE_DISCHARGE_TEXTS = [
  {
    title: 'Post-Laparoscopic Cholecystectomy (Gallbladder Surgery)',
    text: `PATIENT DISCHARGE INSTRUCTIONS
PATIENT: Vance, Eleanor | MRN: 849201 | DATE OF SERVICE: Oct 02, 2026
ATTENDING PHYSICIAN: Dr. Kenneth Reed, MD | SERVICE: General Surgery

DIAGNOSIS: Acute cholecystitis status-post uncomplicated laparoscopic cholecystectomy.

1. ACTIVITY:
- May shower after 48 hours. Gently pat incisions dry with clean towel. Do not submerge incisions in bathtub, hot tub, or swimming pool for 3 weeks.
- Strictly no lifting greater than 10 lbs (4.5 kg) for 4 weeks to prevent incisional hernia.
- Ambulate 4 times daily indoors to prevent DVT (deep vein thrombosis).
- No driving while taking prescription narcotic analgesics.

2. DIET:
- Resume regular diet as tolerated. Recommend low-fat diet for the first 2-3 weeks to minimize bloating and diarrhea. Drink 6-8 glasses of water daily.

3. MEDICATIONS:
- Acetaminophen 500mg: Take 1-2 tablets by mouth every 6 hours PRN mild to moderate pain. Max 3,000mg in 24 hours.
- Ibuprofen 400mg: Take 1 tablet by mouth every 8 hours with food for inflammation/pain PRN.
- Oxycodone 5mg: Take 1 tablet by mouth every 6 hours PRN for severe breakthrough pain only. Do not exceed 4 tablets/day.
- Docusate Sodium 100mg (Colace): Take 1 capsule twice daily while taking oxycodone to prevent opioid-induced constipation.
- Resume home blood pressure medication (Lisinopril 10mg daily) starting tomorrow morning.

4. WOUND CARE:
- Steri-strips over umbilical and abdominal port sites will curl and fall off spontaneously in 7-10 days. Do not rip off.

5. FOLLOW-UP:
- Clinic appointment scheduled with Dr. Reed at Westside Surgery Suite 202 in 14 days (Oct 16, 2026 at 11:00 AM). Call (555) 890-5240 to confirm.

6. WARNING SIGNS / WHEN TO CALL:
Call clinic or proceed to nearest emergency room immediately if experiencing:
- Fever greater than 101.0°F (38.3°C) or shaking chills.
- Persistent nausea or vomiting unable to retain oral fluids for >12 hours.
- Increasing abdominal pain not relieved by medications or abdominal rigidity.
- Redness spreading more than 1 inch around incision sites or purulent yellow/green drainage.
- Jaundice (yellowing of skin or whites of eyes).
- Sudden shortness of breath, chest pain, or swollen, painful calf.`,
  },
  {
    title: 'Congestive Heart Failure (CHF) Hospital Discharge',
    text: `DISCHARGE SUMMARY & EDUCATION RECORD
PATIENT: Eleanor Vance | ADMISSION DIAGNOSIS: Acute on chronic systolic heart failure exacerbation
DISCHARGE DATE: Sep 14, 2026 | CARDIOLOGY SERVICE

DIETARY & FLUID RESTRICTIONS:
- Sodium intake strictly limited to 2,000 mg (2 grams) per day. Read all nutrition labels.
- Fluid restriction: Maximum 1.5 to 2.0 Liters total fluid in 24 hours (including soups, coffee, and water).

DAILY MONITORING ORDERS:
- Weigh yourself every single morning after your first urination, before breakfast, wearing similar light clothing.
- Record weights in your daily log binder.
- If you gain 3 or more pounds in 1 day, or 5 pounds in 1 week, notify the Heart Failure clinic nurse immediately.

MEDICATIONS:
- Furosemide (Lasix) 40mg: Take 1 tablet by mouth every morning at 8:00 AM. Do not take after 4:00 PM to avoid nighttime urination.
- Potassium Chloride 20 mEq: Take 1 tablet by mouth daily with meals.
- Carvedilol 12.5mg: Take 1 tablet by mouth twice daily with breakfast and dinner. Check resting pulse; hold if pulse < 55 bpm.
- Spironolactone 25mg: Take 1 tablet by mouth once daily.

FOLLOW-UP CARE:
- Follow-up with Dr. Sarah Jenkins (Cardiology) in 7-10 days.
- Outpatient lab draw for Basic Metabolic Panel (electrolytes & creatinine) in 5 days on Sep 19.

RED FLAGS / CALL 911:
- Call 911 immediately if experiencing crushing chest pressure, sudden severe breathlessness at rest, coughing pink frothy sputum, or fainting.
- Call cardiology office if you notice increased swelling in feet, ankles, or abdomen, or if you need extra pillows to breathe at night.`,
  },
  {
    title: 'Emergency Department - Acute Ankle Sprain',
    text: `EMERGENCY ROOM AFTERCARE SUMMARY
CHIEF COMPLAINT: Right ankle inversion injury.
DIAGNOSIS: Grade II Lateral Ankle Sprain. Negative for fracture on 3-view X-ray.

HOME TREATMENT INSTRUCTIONS (R.I.C.E.):
- REST: Limit walking on right foot for 48 hours. Use crutches provided. Partial weight bearing as tolerated with lace-up brace.
- ICE: Apply ice pack wrapped in clean towel for 15-20 minutes every 3-4 hours while awake for next 48 hours. Do not apply ice directly to bare skin.
- COMPRESSION: Keep elastic compression bandage snug but not overly tight. If toes turn pale, cold, or tingle, loosen immediately.
- ELEVATION: Keep right foot elevated above heart level on pillows whenever resting.

MEDICATIONS:
- Naproxen 220mg: Take 1-2 tablets by mouth twice daily with food as needed for pain and swelling. Max 440mg per 12 hours. Do not take with other NSAIDs.

FOLLOW-UP:
- Primary care follow-up or sports medicine evaluation in 7 to 10 days if unable to bear weight or if swelling fails to improve.

RETURN TO EMERGENCY DEPARTMENT IF:
- Numbness or inability to move toes.
- Severe throbbing pain unrelieved by elevation and medication.
- Calf swelling or pain in the back of the lower leg.`,
  },
];
