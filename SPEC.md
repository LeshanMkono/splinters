# SPLINTERS BASKETBALL — CLAUDE CODE BUILD SPEC
# Save this file as SPEC.md in your project root
# Then run: claude in your terminal inside the project folder

## WHAT YOU ARE BUILDING
A full-stack basketball community web app for Splinters Basketball, Nairobi Kenya.
Hosted on Vercel. Domain: splinters.co.ke

## TECH STACK — DO NOT DEVIATE
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Postgres + Auth + Storage + Realtime)
- NextAuth v5 (Google OAuth + email/password)
- Resend (transactional email)
- Zod (validation)
- date-fns (date utilities)

## BRAND COLORS
- Navy:  #1B2B6B (headings, nav, footer background)
- Orange: #F4622A (buttons, accents, CTAs)
- White: #FFFFFF (backgrounds)
- Mid: #555555 (body text)

## FONTS
- Bebas Neue (display/headings) — Google Fonts
- Inter (body) — Google Fonts
- Space Mono (labels/eyebrows) — Google Fonts

---

## ENVIRONMENT VARIABLES NEEDED
Create .env.local with these (user will fill values):

```
NEXTAUTH_URL=https://splinters.co.ke
NEXTAUTH_SECRET=                        
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
ADMIN_SECURITY_EMAIL=mkonodigital@gmail.com
ADMIN_GENERAL_EMAIL=basketballsplinter@gmail.com
NEXT_PUBLIC_APP_URL=https://splinters.co.ke
NEXT_PUBLIC_WHATSAPP_GROUP_LINK=https://chat.whatsapp.com/E7QXYugRtYACCBkssPtGKS
NEXT_PUBLIC_MPESA_PAYBILL=880100
NEXT_PUBLIC_MPESA_ACCOUNT=payslinters25
NEXT_PUBLIC_MEMBERSHIP_FEE=2000
CRON_SECRET=
```

---

## DATABASE — SUPABASE SCHEMA
Create file: supabase-schema.sql

Tables needed:

### users
- id (uuid, PK, references auth.users)
- email (text, unique)
- nickname (text, unique, case-insensitive index)
- full_name (text)
- avatar_url (text)
- role (text: 'admin' | 'premium' | 'exclusive' | 'guest')
- membership_status (text: 'active' | 'pending_payment' | 'suspended' | 'guest')
- membership_expires_at (timestamptz)
- nickname_set (boolean, default false)
- phone_number (text)
- whatsapp_requested (boolean, default false)
- whatsapp_approved (boolean, default false)
- instagram_handle (text)
- tiktok_handle (text)
- twitter_handle (text)
- social_ads_consent (boolean, default false)
- mpesa_reference (text)
- created_at (timestamptz, default now())

### payments
- id (uuid, PK)
- user_id (uuid, FK → users)
- mpesa_reference (text)
- screenshot_url (text) — stored in Supabase Storage bucket 'payment-screenshots'
- amount (integer, default 2000)
- month (text) — format "2025-06"
- status (text: 'pending' | 'confirmed' | 'rejected')
- confirmed_by (uuid, FK → users, nullable)
- confirmed_at (timestamptz, nullable)
- notes (text)
- created_at (timestamptz, default now())

### polls
- id (uuid, PK)
- week_id (text, unique) — format "2025-W24-SAT" or "2025-W24-SUN"
- title (text)
- day (text: 'saturday' | 'sunday')
- venue (text)
- venue_address (text)
- game_time (text)
- poll_date (date)
- is_active (boolean, default true)
- requires_exclusive (boolean, default false)
- created_at (timestamptz, default now())

### votes
- id (uuid, PK)
- user_id (uuid, FK → users)
- poll_id (uuid, FK → polls)
- choice (text: 'yes' | 'no' | 'maybe')
- voted_at (timestamptz, default now())
- UNIQUE constraint on (user_id, poll_id)

### login_attempts
- id (uuid, PK)
- ip_hash (text, unique)
- email_tried (text)
- attempt_count (integer, default 0)
- locked_until (timestamptz, nullable)
- alert_sent (boolean, default false)
- created_at (timestamptz, default now())

### honeypot_hits
- id (uuid, PK)
- ip_hash (text)
- path_hit (text)
- user_agent (text)
- alert_sent (boolean, default false)
- hit_at (timestamptz, default now())

### soc_events
- id (uuid, PK)
- user_id (uuid, FK → users, nullable)
- event_type (text)
- ip_hash (text)
- path (text)
- method (text, default 'GET')
- status_code (integer, default 200)
- anomaly_score (integer, default 0, check 0-10)
- metadata (jsonb, default '{}')
- occurred_at (timestamptz, default now())

Enable Row Level Security on ALL tables.
Enable Realtime on the votes table.
Create Supabase Storage bucket called 'payment-screenshots' (private).

---

## PAGES TO BUILD

### 1. Public Homepage — /
White background (#FFFFFF), navy + orange brand colors.
Sections in order:

**Navigation:**
- Fixed, white background, blends into page
- Logo: Splintersbasketball.png from /public/ + "Splinters" text in navy Bebas Neue
- Desktop links: Courts, Schedule, Community, About
- Links have orange underline on hover
- CTA buttons: "Sign In" (ghost border) + "Join Free" (orange solid)
- Mobile: hamburger (3 lines, navy) → slides in right sidebar with same links
- Nav gets subtle border-bottom only when scrolled

**Hero Slider:**
- Image zone: 1920×800px images (hero-1.jpg, hero-2.jpg, hero-3.jpg from /public/images/)
- background-size: cover, background-position: center center
- Left/right arrows centered vertically ON the image zone only
- Slide dots centered at bottom of image zone
- Auto-advances every 8 seconds with 1.2s dissolve fade
- Touch swipe supported on mobile
- Pause on hover

Slide labels (orange text, Space Mono font, shown BELOW image in navy content zone):
- Slide 1: "Olive Crescent · Kileleshwa · Saturday 5PM"
- Slide 2: "NIS Lavington · Parklands Sports Club · Sunday 6PM"  
- Slide 3: "Splinters Basketball · Nairobi · Every Weekend"

Label fades out/in when slide changes.

**Navy content zone below hero image:**
- Orange eyebrow label (syncs with slide)
- "FIND YOUR" white + "COURT." orange — Bebas Neue
- Body text: "31 verified basketball courts across Nairobi..."
- Two buttons: "Join Free →" (orange solid) + "Sign In" (white outline)

**Orange ticker strip:**
- Navy background, scrolling text mentioning Saturday 5PM, Sunday 6PM, KES 2000, Paybill 880100, KBF

**About Section:**
- Left: eyebrow, "WE CONNECT PEOPLE TO BASKETBALL COURTS NEAR THEM" (navy Bebas Neue, COURTS in orange), body text, "Register for Free" button + Google OAuth button
- Right: 2×2 stats grid — 31 Courts, 8 Districts, 2 Runs/Weekend, 2025 Est.

**Schedule Strip:**
- Navy background
- Two cards side by side:
  - Saturday: 5:00 PM — Olive Crescent International School, Kileleshwa
  - Sunday: 6:00 PM — Parklands Sports Club / NIS Lavington (rotating weekly)

**Gallery — "Where We Play":**
- 3 portrait images (court-1.jpg, court-2.jpg, court-3.jpg) from /public/images/
- 3 columns, gap: 3px
- Images: aspect-ratio 3/4, background-size: cover, background-position: center center
- On hover: dark overlay fades in from bottom, court name + district appears
- On mobile: single column, aspect-ratio 16/9

**KBF Community Section:**
- Light grey background
- Left: text about Kenya Basketball Federation, Jr. NBA programme, NBA Africa 100 courts
- Right: 4 info cards with navy left border (KBF programs)
- Link to kenyabasketballfederation.org

**CTA Section:**
- White background, centered
- "LOG IN AND FIND A PICKUP GAME." in navy + orange
- Two buttons: "Log In →" (orange) + "Create Account" (navy outline)

**Footer:**
- Navy background
- Logo + tagline + social icons (Instagram, TikTok, WhatsApp)
- 3 link columns: Courts, Community, Kenya Basketball
- Bottom bar: copyright + M-Pesa paybill 880100 / payslinters25 / KES 2,000

---

### 2. Register — /auth/register
White background, clean form.

Fields:
- Full Name
- Gmail address (validate @gmail.com only)
- Password (min 8 chars)
- Confirm Password
- Phone number (Kenyan format, normalize to +2547XXXXXXXX)
- Checkbox: Request WhatsApp group access
- Instagram handle (@)
- TikTok handle (@)
- Twitter/X handle (@)
- Checkbox: "I consent to Splinters using my social handles for promotional purposes"
- M-Pesa transaction code (auto-uppercase)
- Checkbox: Terms & Privacy consent (required)

Also show Google OAuth button at top.

On success → redirect to /auth/payment

---

### 3. Post-Registration Payment — /auth/payment
Show immediately after registration/email verify.

Show:
- Progress steps: Create Account ✓ → Verify Email ✓ → Activate Membership (current) → Pick Nickname
- M-Pesa payment details (paybill 880100, account payslinters25, amount KES 2,000) with copy buttons
- 5-step guide (Open M-Pesa → Lipa na M-Pesa → Business No → Account → Pay)
- Green WhatsApp button: pre-filled message to confirm payment
- Drag-and-drop screenshot upload (stores to Supabase Storage 'payment-screenshots' bucket)
- Transaction code input (auto-uppercase, min 8 chars)
- Submit button (enabled only when BOTH screenshot + code are filled)
- On submit → POST /api/payment/submit → creates payment record → redirect to /auth/setup
- Skip link → /auth/setup

---

### 4. Nickname Setup — /auth/setup
Shown on first login only (when nickname_set = false).

- "PICK YOUR NAME" heading
- Text input for nickname (2-20 chars, letters/numbers/spaces/hyphens only)
- Quick-pick suggestions: Buckets, Flash, The Worm, Splash, Ice, Reign, Murk, Blade
- On submit → POST /api/user/set-nickname → update session → redirect /dashboard?welcome=1

---

### 5. Login — /auth/login
- Google OAuth button
- Email + password form
- On each failed attempt → POST /api/security/login-fail
- Show warning when ≤5 attempts left
- On attempt 10 → IP locked, show lockout message
- Link to /auth/register

---

### 6. Member Dashboard — /dashboard
Server component (auth-gated).

- Nav: logo + nickname avatar top right + sign out
- Welcome banner (shows on ?welcome=1): "WELCOME BACK, [NICKNAME]!" with dismiss
- If membership pending: show M-Pesa payment reminder card
- Stats row: Total Weekends Played / This Month / Membership Status
- Play Calendar: month view, weekends where user voted "yes" highlighted orange, today highlighted white, nav prev/next month
- Current weekend polls: two cards (Saturday + Sunday) linking to /poll/[weekId]
- Recent payments table with status badges

---

### 7. Weekend Poll — /poll/[weekId]
Works for both logged-in and anonymous users.

- Shows poll for that weekId
- If not Saturday/Sunday: show countdown to next poll + past results
- Vote options: Yes ✅ / Maybe ❓ / No ❌
- Each option shows: progress bar + vote count + percentage
- "Yes" voters shown as avatar row (max 8, +N overflow)
- Real-time updates via Supabase Realtime subscription on votes table
- Anonymous users: see results but "Log in to vote" prompt
- Members: can vote and change vote
- Share button: copies current URL to clipboard
- Shareable link format: splinters.co.ke/poll/2025-W24-SAT

---

### 8. Admin Dashboard — /admin
Only accessible if role = 'admin'.

Tabs:
**Members tab:**
- Table: name, email, nickname, status, joined date, last payment
- Filter by status (active/pending/suspended)
- Click member → expand row with action buttons: Confirm Payment / Reject / Suspend / Approve WhatsApp

**Payments tab:**
- Table: member name, M-Pesa ref, amount, month, status, submitted date
- Click row → view screenshot (from Supabase Storage)
- Buttons: Confirm (→ activates member + sends WhatsApp link email) / Reject (→ sends rejection email)

**Polls tab:**
- List of all polls with vote counts
- Create new poll form
- Toggle poll active/inactive

**SOC Monitor tab:**
- Live event feed: timestamp, event type (color coded), description, severity badge
- Filter by event type
- Login attempts table with IP hash + attempt counts
- Honeypot hits table

---

## API ROUTES TO BUILD

### Auth
- POST /api/auth/register — create Supabase auth user + profile + pending payment record + send welcome email
- GET|POST /api/auth/[...nextauth] — NextAuth handler

### User
- POST /api/user/set-nickname — update nickname, set nickname_set=true
- GET /api/user/profile — return current user profile

### Payment
- POST /api/payment/submit — upload screenshot to Supabase Storage, create payment record
- POST /api/admin/payment/confirm — confirm payment, activate member, send WhatsApp link email
- POST /api/admin/payment/reject — reject payment, send rejection email

### Poll & Votes
- POST /api/vote — upsert vote (yes/no/maybe), one per user per poll

### Security
- POST /api/security/login-fail — record failed attempt, check threshold, send alert
- POST /api/security/login-success — clear attempts for IP
- POST /api/security/check-lock — return whether IP is locked
- POST /api/security/honeypot — record honeypot hit + send alert email

### Cron (Vercel Cron Jobs)
- GET /api/cron/create-poll — runs Saturday 00:01 EAT, creates SAT + SUN polls, emails all active members
- GET /api/cron/payment-reminders — runs 28th of month, emails members with pending/no payment
- GET /api/cron/check-expiry — runs every Saturday, downgrades unpaid members to guest

---

## SECURITY REQUIREMENTS

### Middleware (src/middleware.ts)
- Honeypot paths: /wp-admin, /wp-login.php, /phpmyadmin, /admin/login, /.env, /config.php, /xmlrpc.php, /.git/config — return fake 200, log hit, send alert
- Rate limiting: auth routes 10 req/min, general API 60 req/min per IP
- Auth protection: /dashboard, /courts, /api/vote, /api/user require session
- Admin protection: /admin, /api/admin require role=admin
- Redirect logged-in users away from /auth/* to /dashboard (unless nickname_set=false → /auth/setup)

### Brute Force (src/lib/security.ts)
- Track failed logins per IP hash (SHA-256 + NEXTAUTH_SECRET salt)
- Attempt 10: lock IP for 1 hour + email alert to mkonodigital@gmail.com via Resend
- Alert email includes: IP hash, email targeted, attempt count, timestamp

### Row Level Security (Supabase)
- Users can only read/update their own profile
- Users CANNOT update their own role field
- Members can insert/update only their own votes
- Payments: users see only their own, admin sees all
- Security tables (login_attempts, honeypot_hits, soc_events): admin only + service role

---

## EMAIL TEMPLATES (src/lib/emails.ts via Resend)
FROM: Splinters Basketball <hello@splinters.co.ke>

1. Welcome email — after registration: show M-Pesa paybill details, link to dashboard
2. Payment confirmed — activate message + WhatsApp group link
3. Payment reminder — 28th of month: M-Pesa details, urgency based on days left
4. Poll live — Saturday morning: links to both SAT + SUN polls
5. Account suspended — membership lapsed notice with reactivation instructions
6. Security alert — brute force/honeypot: IP hash, details, timestamp

---

## VERCEL CONFIG (vercel.json)
Three cron jobs:
- /api/cron/create-poll: "1 22 * * 5" (Saturday 00:01 EAT = Friday 22:01 UTC)
- /api/cron/payment-reminders: "0 5 28 * *" (28th of month 8AM EAT)
- /api/cron/check-expiry: "0 0 * * 6" (Saturday midnight)

---

## FILE STRUCTURE TO CREATE
```
splinters/
├── public/
│   ├── Splintersbasketball.png    (logo — already exists)
│   └── images/
│       ├── hero-1.jpg             (Olive Crescent header, 1920×800)
│       ├── hero-2.jpg             (NIS header, 1920×800)
│       ├── hero-3.jpg             (Parklands header, 1920×800)
│       ├── court-1.jpg            (Olive Crescent gallery, 800×1067)
│       ├── court-2.jpg            (NIS gallery, 800×1067)
│       └── court-3.jpg            (Parklands gallery, 800×1067)
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx               (public homepage)
│   │   ├── globals.css
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── payment/page.tsx
│   │   │   ├── setup/page.tsx
│   │   │   └── error/page.tsx
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── DashboardClient.tsx
│   │   │   └── payment/page.tsx
│   │   ├── poll/
│   │   │   └── [weekId]/page.tsx
│   │   ├── admin/
│   │   │   └── page.tsx
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── [...nextauth]/route.ts
│   │       │   └── register/route.ts
│   │       ├── user/
│   │       │   ├── set-nickname/route.ts
│   │       │   └── profile/route.ts
│   │       ├── payment/
│   │       │   └── submit/route.ts
│   │       ├── vote/route.ts
│   │       ├── admin/
│   │       │   ├── payment/confirm/route.ts
│   │       │   └── payment/reject/route.ts
│   │       ├── security/
│   │       │   ├── login-fail/route.ts
│   │       │   ├── login-success/route.ts
│   │       │   ├── check-lock/route.ts
│   │       │   └── honeypot/route.ts
│   │       └── cron/
│   │           ├── create-poll/route.ts
│   │           ├── payment-reminders/route.ts
│   │           └── check-expiry/route.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── PublicNav.tsx
│   │   │   ├── DashboardNav.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── home/
│   │   │   ├── HeroSlider.tsx
│   │   │   ├── Ticker.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── ScheduleStrip.tsx
│   │   │   ├── Gallery.tsx
│   │   │   ├── KBFSection.tsx
│   │   │   └── CTASection.tsx
│   │   ├── poll/
│   │   │   ├── PollCard.tsx
│   │   │   └── VoteOption.tsx
│   │   ├── dashboard/
│   │   │   ├── PlayCalendar.tsx
│   │   │   ├── StatsRow.tsx
│   │   │   └── PaymentStatus.tsx
│   │   ├── admin/
│   │   │   ├── MembersTab.tsx
│   │   │   ├── PaymentsTab.tsx
│   │   │   ├── PollsTab.tsx
│   │   │   └── SOCMonitor.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Badge.tsx
│   │       └── Toast.tsx
│   ├── lib/
│   │   ├── auth.ts                (NextAuth config)
│   │   ├── supabase.ts            (browser + server + service clients)
│   │   ├── security.ts            (brute force, honeypots, SOC logging, rate limiting)
│   │   ├── emails.ts              (all Resend email templates)
│   │   └── utils.ts               (cn, phone normalizer, week ID, date helpers)
│   ├── types/
│   │   └── index.ts               (all TypeScript interfaces)
│   └── middleware.ts               (honeypots, rate limiting, auth protection)
├── supabase-schema.sql
├── vercel.json
├── .env.example
├── .env.local                     (user fills this, never commit)
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## HOW TO RUN CLAUDE CODE

After saving this file as SPEC.md in your project folder, run:

```bash
claude
```

Then paste this prompt:

"Read SPEC.md and build the complete Splinters Basketball web application exactly as specified. 
Build every file listed in the file structure. 
Start with: package.json, tsconfig.json, tailwind.config.js, next.config.js, .env.example, supabase-schema.sql, then src/middleware.ts, then src/lib/ files, then src/types/index.ts, then src/components/, then src/app/ pages and API routes, then vercel.json.
Ask me before installing any packages not listed in the spec.
After each major phase (lib files done, components done, pages done) confirm with me before continuing.
Do not skip any file. Do not summarize — write the complete code for every file."

---

## AFTER CLAUDE CODE FINISHES

1. Run: npm install
2. Run: npm run dev  
3. Open http://localhost:3000 to verify
4. Push to GitHub
5. Connect repo to Vercel
6. Add all .env.local values to Vercel dashboard → Environment Variables
7. Deploy

## MAKE YOURSELF ADMIN
After first login on the live site:
- Supabase dashboard → Table Editor → users → find your row → set role = 'admin'
