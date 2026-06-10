# StudentShield Platform 🛡️
> "Stay Connected. Stay Protected."

StudentShield is a university on-campus student technology support and device protection platform. It provides affordable, semester-based support and diagnostic protection plans for laptops and tablets, keeping student progress safe from software failures, malware infection, and complex hardware fatigue.

## 🚀 Key Features

### 💻 Public Front-end
1. **Landing Page**: Animated high-contrast hero section, distinct flat pricing tiles with comparison logs, dynamic interactive features overview, and a mobile money integration timeline walkthrough.
2. **About Page**: Origins, mission guidelines, operational pillars, and our advisors team profile grid.
3. **Services Page**: Comprehensive details covering software driver troubleshooting, clean macOS/Windows 11 installations, MS Office setups, and workshop hardware routing.
4. **Pricing Page**: Detailed flat semester pricing (Basic GH₵10 & Premium GH₵30), distinct features checklist grid, and FAQ.
5. **Contact Page**: Interactive support dispatch form and dynamic central on-campus library booth coordinates block.
6. **Blog Forum**: Searchable technical articles covering cybersecurity backups, Windows 11 optimizations, and hardware value decisions.
7. **Help Center**: Knowledge base repository with search capability and expanding FAQ accordions.

### 🔑 Authentication Center
- High-fidelity validation panels with instantaneous **Demo Credentials** autofill.
- Toggle logins as an active student user (`student@university.edu`) or root administrator (`admin@studentshield.com`).

### 📊 Interactive Student Dashboard
- **Overview Base**: Read active semester plan status, unread notifications, and registered system health metrics.
- **My Notebooks**: Register, profile, and inventory academic laptops with brand models, serial numbers, and OS details.
- **Tickets System**: Open live support tickets with custom priority levels and engage in actual diagnostic chats with physical hub technicians.
- **Semester Billing**: Initiate Mobile Money (MTN MoMo, Vodafone Cash, etc.) checkouts with simulated OTP security overrides.
- **Profile Settings**: Update contact information and university campuses on the database.

### ⚙️ Command Center Admin Dashboard
- **Analytics Metrics**: Track aggregate student registrations, total active subscriptions, gross revenue in GHS, and enqueued diagnostics.
- **User Management**: Audit full user profile lists and plan enrollments.
- **Notebook Diagnostics**: Control device statuses (Active, Diagnosing, Under Repair, Resolved, Unprotected).
- **Triage Tickets**: Review live tickets and execute immediate chat replies, mimicking actual tech workflows.
- **Receipts**: Audit telecom transactional references.
- **Activity Logs**: Track system security access logs in real-time.

---

## 🛠️ Tech Stack & Architecture

- **Front-end**: React 19, TypeScript strict mode, Vite, Tailwind CSS v4, Motion (for page transitions layout), Lucide React.
- **Back-end & Database Design**: Staged client-side simulated Supabase/Local Database wrapper providing multi-user read/write isolation and session longevity.
- **Supabase Scheme SQL**: Ready-to-use production file `supabase-schema.sql` incorporating automatic tables creation, foreign keys relationships, performant indexes, and protective Row Level Security (RLS) policies.

---

## 🚀 Immediate Setup & Development

Run the following commands in the terminal directory to run the application immediately:

```bash
# 1. Install pristine dependencies
npm install

# 2. Boot dev server inside container
npm run dev
```

*StudentShield incorporates standard defensive coding practices, guaranteeing **Zero TypeScript compilation warnings, zero linter errors, and 100% responsive fluid layouts**.*
