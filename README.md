# IdeaSpark — AI YouTube Idea Generator SaaS

A full-stack SaaS application for generating viral YouTube ideas using Claude AI.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database + Auth**: Supabase (PostgreSQL + Row Level Security)
- **AI**: Anthropic Claude claude-sonnet-4-20250514
- **Payments**: Stripe (subscriptions)
- **Deploy**: Vercel-ready

## Features

- 🎯 AI-powered YouTube idea generation (titles, hooks, thumbnails)
- 🌐 Arabic (RTL) + English support  
- 💾 Idea library with search + filter
- 📊 Dashboard with usage analytics
- 📤 CSV export
- 💳 Stripe subscription tiers (Free/Pro/Agency)
- 🔐 Email + Google OAuth via Supabase

## Quick Start

### 1. Clone and install

```bash
cd ideaspark
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run `supabase-schema.sql`
3. Enable Google OAuth in Authentication > Providers
4. Copy your project URL and keys

### 3. Set up Stripe

1. Create account at [stripe.com](https://stripe.com)
2. Create two products: "Pro" ($9/month) and "Agency" ($29/month)
3. Note the Price IDs
4. Set up webhook endpoint: `https://your-domain.com/api/stripe/webhook`
5. Add events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

### 4. Configure environment variables

```bash
cp .env.example .env.local
# Fill in all values
```

### 5. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000`

## Project Structure

```
ideaspark/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── generator/page.tsx          # Idea generator
│   ├── dashboard/page.tsx          # User dashboard
│   ├── auth/page.tsx               # Sign in/up
│   ├── pricing/page.tsx            # Pricing page
│   └── api/
│       ├── generate/route.ts       # Claude AI generation
│       ├── ideas/route.ts          # CRUD for ideas
│       ├── export/route.ts         # CSV export
│       └── stripe/
│           ├── checkout/route.ts   # Stripe checkout
│           └── webhook/route.ts    # Stripe webhooks
├── lib/
│   ├── supabase.ts                 # Supabase clients
│   └── utils.ts                   # Helpers
├── types/index.ts                  # TypeScript types
├── middleware.ts                   # Auth protection
├── supabase-schema.sql             # Database schema
└── .env.example                    # Environment template
```

## Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Add all environment variables in Vercel dashboard.

## Database Schema

```sql
users: id, email, plan, generations_used, created_at
ideas: id, user_id, niche, audience, goal, language, ideas_json, created_at
subscriptions: id, user_id, stripe_customer_id, stripe_subscription_id, plan, status
```

## Roadmap (Phase 5 from your map)

- [ ] SEO blog with niche idea articles
- [ ] Affiliate program
- [ ] Notion/Trello integration
- [ ] Chrome Extension (ideas from YouTube watch page)
- [ ] Trending analysis dashboard

## License

MIT
