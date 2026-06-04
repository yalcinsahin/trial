# BookAirportRide — Complete Platform

Premium black car airport transportation platform. Jacksonville, FL → Nationwide → International.

## Repository Structure

```
bookairportride/
├── web/                    # Marketing & booking website (React + TypeScript + Vite)
├── supabase/
│   ├── migrations/         # SQL schema migrations
│   ├── functions/          # Edge functions (Deno)
│   └── seed.sql            # Seed data for initial setup
└── .env.example            # Root env reference
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript + Vite + Tailwind CSS |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| Backend | Supabase (auth, database, realtime, storage) |
| Payments | Stripe + Stripe Connect |
| Email | Resend |
| Push Notifications | Expo Push + Firebase |
| SEO | react-helmet-async |
| Hosting | Vercel |

## Quick Start — Web

```bash
cd web
cp .env.example .env.local
# Fill in your API keys
npm install
npm run dev
```

## Supabase Setup

1. Create a project at supabase.com
2. Run migrations in order:
   ```sql
   -- In Supabase SQL editor:
   -- Run migrations/001_initial_schema.sql
   -- Run migrations/002_rls_policies.sql
   -- Run seed.sql
   ```
3. Enable Realtime for `bookings`, `driver_locations` tables
4. Create storage bucket `driver-documents` with private access

## Environment Variables

Copy `.env.example` to `.env.local` and populate:

- `VITE_SUPABASE_URL` — Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` — Service role key (server-side only)
- `VITE_GOOGLE_MAPS_API_KEY` — Google Maps (Places, Directions, Geocoding enabled)
- `VITE_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key
- `STRIPE_SECRET_KEY` — Stripe secret key
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook endpoint secret
- `RESEND_API_KEY` — Resend email API key

## Pages

| Route | Page |
|-------|------|
| `/` | Homepage |
| `/reserve` | Booking form (4-step) |
| `/services` | Service catalog |
| `/cities` | Cities & airports |
| `/drive-with-us` | Driver application |
| `/travel-partners` | Agency affiliate form |
| `/about` | About & contact |
| `/booking-confirmation/:id` | Post-booking confirmation |
| `/terms` | Terms of Service |
| `/privacy` | Privacy Policy |
| `/cancellation` | Cancellation Policy |

## Pricing

| Vehicle | Passengers | Bags | Base | Per Mile | Minimum |
|---------|-----------|------|------|----------|---------|
| Executive SUV | 4 | 4 | $65 | $3.25 | $85 |
| First Class SUV | 6 | 6 | $85 | $4.00 | $110 |
| Executive Van | 10 | 8 | $95 | $4.50 | $125 |
| VIP Sprinter | 14 | 10 | $125 | $5.50 | $165 |

- Meet & Greet: +$25
- Platform fee: 20% (retained per completed ride)
- Cancellation: Full refund >24hr, 50% refund 12-24hr, no refund <12hr

## Edge Functions

Deploy all functions via `supabase functions deploy <name>`:

- `process-booking` — Creates booking, sends confirmation email
- `assign-driver` — Assigns driver, sends push notification
- `complete-ride` — Marks complete, queues driver payout
- `process-weekly-payouts` — Cron: Monday payouts via Stripe Connect
- `send-push-notification` — Expo push notification wrapper
- `flight-tracker` — Polls flight API, adjusts pickup times
- `stripe-webhook` — Handles Stripe payment events

## Launch Checklist

### Infrastructure
- [ ] Supabase project created and migrations run
- [ ] Supabase RLS policies enabled on all tables
- [ ] Stripe account verified and Connect enabled for driver payouts
- [ ] Google Maps API key restricted to production domain
- [ ] Resend domain verified for transactional email
- [ ] Vercel deployment connected to GitHub repository
- [ ] Custom domain bookairportride.com configured

### Content
- [ ] Homepage copy finalized
- [ ] Pricing configured for Jacksonville, FL
- [ ] Terms, Privacy, Cancellation pages live

### Operations
- [ ] Admin account created in Supabase with admin role
- [ ] First driver approved and account activated
- [ ] Test booking completed end-to-end with real Stripe payment
- [ ] Test payout processed through Stripe Connect
- [ ] All email templates tested across clients
- [ ] Flight tracker edge function tested with real flight number

## Brand

- **Primary Font**: Cinzel (headings, brand name)
- **Body Font**: Cormorant Garamond (subheadings, body)
- **UI Font**: Josefin Sans (labels, navigation, buttons)
- **Sea Salt**: `#e8ede8` — Primary background
- **Terra-Cotta**: `#c4623a` — Primary accent
- **Black**: `#161210` — Dark sections
- **Warm White**: `#fdfcfa` — Page background

## Contact

- Reservations: reservations@bookairportride.com
- General: info@bookairportride.com
- Website: bookairportride.com
