# TradeX pre-launch Founding Waitlist Landing Page

TradeX is an early-stage startup building AI-assisted market intelligence and behavioral decision support tools for intentional market participants. 

This repository contains a production-quality, high-converting pre-launch landing page matching the sleek, premium technical aesthetic of high-end dashboards like Linear, TradingView, and Keldrón (emerald-accented dark mode).

---

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion (only, for elegant, lightweight UI interactions)
- **Forms & Validation**: React Hook Form + Zod (for strict type-safety)
- **Database**: Neon Serverless PostgreSQL (`@neondatabase/serverless`)
- **Analytics**: Mocked & configured PostHog events tracker
- **Email notifications**: Configured Resend transactional template triggers
- **Effects**: HTML5 Canvas (60fps reactive nodes) & Canvas Confetti

---

## Project Architecture

```text
├── app/
│   ├── api/
│   │   ├── feedback/           # Collects co-design feedback submissions
│   │   ├── terminal/           # Saves command prompt terminal questions
│   │   ├── traction/           # Feeds dynamic count metrics to counters
│   │   └── waitlist/           # Enqueues registrations, referral links & Resend API
│   ├── globals.css             # Tailwind v4 theme, dot grids & custom scrollbar
│   ├── layout.tsx              # Font loader (Inter + JetBrains Mono) & SEO tags
│   └── page.tsx                # Page builder structure
├── components/
│   ├── Navbar.tsx              # Shrinking floating glass navbar
│   ├── Hero.tsx                # Canvas 60fps Decision -> Insight node mesh
│   ├── WhyTradeX.tsx           # Scroll-animated propositions
│   ├── ProductPreview.tsx      # Simulated mock workspace tabs
│   ├── WaitlistSection.tsx     # Multi-step survey & Persisted Referral status
│   ├── CommunitySection.tsx    # "Build with Us" expandable paths drawer
│   ├── BuildInPublic.tsx       # Auto-expandable builder roadmap timeline
│   ├── LiveTraction.tsx        # Viewport count-up metric trackers
│   ├── Newsletter.tsx          # Minimal opt-in cards
│   ├── DecisionTerminal.tsx    # Fully interactive Linux prompt question terminal
│   └── Footer.tsx              # Minimal footer links
├── db/
│   └── schema.sql              # Clean PostgreSQL table schemas
├── hooks/
│   └── useAnalytics.ts         # Hook capturing scroll depths, CTRs & CTA clicks
├── lib/
│   ├── db.ts                   # Neon Postgres client service + localStorage mock
│   └── schemas.ts              # Zod validation models
├── ENV.example                 # Variables template
└── package.json
```

---

## ⚡ Robust Local Fallback Model

If database environmental credentials (`DATABASE_URL`) are omitted during local operations or preview tests, **TradeX gracefully falls back to dynamic client-side `localStorage` caching and server-side in-memory mock repositories**.
- The pre-launch page is **100% interactive out-of-the-box** without configuration.
- Users can test waitlist submissions, referral milestones, feedback drawers, and command terminals immediately.
- Persistent local caching keeps users logged into their custom referral dashboard even on page reloads.

--- 

## Production Deployment Checklist

### Vercel Integration
This codebase is ready for zero-overhead, highly optimized deployment on Vercel:
1. Connect this repository to your **Vercel Dashboard**.
2. Navigate to **Environment Variables** in project settings and add:
   - `DATABASE_URL` (From your Neon Postgres console)
   - `RESEND_API_KEY` (From your Resend dashboard)
   - `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` (From PostHog)
   - `NEXT_PUBLIC_APP_URL` (Set to your live production domain, e.g., `https://tradex.ai`)
3. Click **Deploy**. Vercel will automatically compile TypeScript, build optimal Static and Serverless routes, and deploy to their global Edge network.
