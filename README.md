# നമ്മുടെ ശബ്ദം / Nammude Shabdham

**Participatory Governance & Public Accountability Platform**

A lightweight digital governance platform enabling transparent communication between citizens and government. Report civic issues, track resolution progress, and foster accountability — all in real time.

---

## Features

- **Citizen Reporting** — Submit civic issues with title, description, category, photo evidence, and location
- **Authority Routing** — Assign complaints to the appropriate authority (MLA, MP, Ward Member, Panchayat, Municipality, Corporation, Water Authority, Electricity Board, others)
- **Real-time Tracking** — Follow complaint status through submitted → under review → in progress → resolved
- **Status History** — Every status change is logged with officer attribution and optional notes
- **Comments** — Citizens and officers can discuss complaints in threaded comments with real-time updates
- **Image Attachments** — Upload complaint photos via Cloudinary with image preview and lightbox viewer
- **Map View** — Interactive Leaflet map showing all complaints with location data
- **Super Admin Dashboard** — Overview of all complaints across all authority types with:
  - Per-authority stat cards (total, new, in progress, resolved)
  - Combined analytics charts (bar: by category, pie: by status)
  - Authority filter with expandable complaint lists
  - Full complaint registry table with case number, authority, status, date
  - Scoped status updates (officers can only update their own authority's complaints)
- **Pagination & Search** — Browse complaints with page navigation and keyword search
- **Malayalam i18n** — Full English and Malayalam locale support via i18next
- **Progressive Web App** — Installable with offline-ready manifest
- **Authentication** — Supabase Auth with role-based access (citizen, officer, admin)
- **Responsive Design** — Mobile-first neumorphism UI with Tailwind CSS v4
- **Email Notifications** — Automated email alerts via EmailJSON on complaint creation and status changes

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 + TypeScript 6 |
| **Build** | Vite 8 + SWC |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`) |
| **Animation** | Framer Motion 12 (page transitions) |
| **Routing** | React Router 7 |
| **Backend** | Supabase (Auth, Database, Storage, RLS) |
| **Images** | Cloudinary (upload + delivery) |
| **Maps** | Leaflet + React-Leaflet |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **i18n** | i18next + react-i18next |
| **PWA** | vite-plugin-pwa |
| **Notifications** | react-hot-toast |
| **Email** | EmailJSON API |
| **Lint** | Oxlint |

## Database Schema

### Tables

- `authorities` — Civic authority entities with type, jurisdiction, contact
- `profiles` — User profiles linked to `auth.users` with role and authority assignment
- `complaints` — Civic issue reports with case number, status, category, location, assignment
- `complaint_actions` — Status change audit log (who changed what, when)
- `comments` — User discussion on complaints

### Authority Types

`mla`, `mp`, `ward_member`, `panchayat`, `municipality`, `corporation`, `water_authority`, `electricity_board`, `other`

### Complaint Statuses

`submitted` → `under_review` → `in_progress` → `resolved`

### Case Number Format

`CB-YYYY-XXXXX` (CivicBridge prefix, year, 5-digit sequential number)

## Project Structure

```
src/
├── assets/            # Static assets
├── components/        # Reusable UI components
│   ├── CommentsSection.tsx   # Real-time comment threads
│   ├── ComplaintCard.tsx     # Complaint list card
│   ├── ErrorBoundary.tsx     # Error boundary with reload
│   ├── Footer.tsx            # App footer
│   ├── ImageLightbox.tsx     # Fullscreen image viewer
│   ├── ImageUpload.tsx       # Cloudinary uploader
│   ├── LanguageSwitcher.tsx  # EN/ML toggle
│   ├── LoadingSpinner.tsx    # Spinner component
│   ├── MapPicker.tsx         # Location picker map
│   ├── Navbar.tsx            # Responsive navigation
│   ├── SplashScreen.tsx      # Branded loading screen
│   └── StatusBadge.tsx       # Status indicator
├── hooks/
│   ├── useAuth.ts            # Auth + profile hook
│   └── useRealtime.ts        # Supabase real-time subscriptions
├── i18n/
│   ├── en.ts                 # English locale
│   ├── ml.ts                 # Malayalam locale
│   └── index.ts              # i18next configuration
├── lib/
│   └── supabase.ts           # Supabase/Cloudinary/EmailJSON config
├── pages/
│   ├── Admin.tsx             # Super-admin dashboard (charts, stats, registry)
│   ├── ComplaintDetails.tsx   # Single complaint view with timeline
│   ├── Complaints.tsx         # Public complaints list with search/pagination
│   ├── Dashboard.tsx          # User dashboard with personal stats
│   ├── Landing.tsx            # Landing page with hero/how-it-works
│   ├── Login.tsx              # Sign in / sign up
│   ├── MapView.tsx            # Interactive leaflet map
│   ├── NotFound.tsx           # 404 page
│   ├── Report.tsx             # Complaint submission form
│   └── Settings.tsx           # Profile editor
├── services/
│   ├── authorities.ts         # Authority CRUD
│   ├── comments.ts            # Comments CRUD
│   ├── complaints.ts          # Complaints CRUD + image upload
│   └── email.ts               # Email notification service
├── types/
│   └── index.ts               # TypeScript type definitions
├── utils/
│   └── animations.ts          # Framer Motion page variants
├── App.tsx                    # Root app with routes
├── index.css                  # Tailwind + neumorphism utilities
└── main.tsx                   # Entry point
```

## Getting Started

### Prerequisites

- Node.js 20+
- Supabase project (database + auth + storage)
- Cloudinary account (for image uploads)
- EmailJSON account (for email notifications)

### Setup

```bash
git clone https://github.com/sayyidrafidalhadi/nammudeshabdham.git
cd nammudeshabdham
npm install
```

### Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Cloudinary upload preset |
| `VITE_EMAILJSON_URL` | EmailJSON API endpoint |

> **Note:** The production build has Supabase credentials hardcoded in `src/lib/supabase.ts`. For local development, set them in `.env`.

### Database Setup

Run the SQL in `supabase-schema.sql` in your Supabase SQL Editor. This creates all tables, indexes, RLS policies, triggers, seed data, and a storage bucket.

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
npm run preview
```

### TypeScript Check

```bash
npx tsc --noEmit
```

## Security

- **Row Level Security** — All tables have RLS policies scoping access by role and authority
- **Role-based Access** — Citizens can create/update own complaints; officers can update assigned complaints; admins have full access
- **Authenticated Comments** — Only authenticated users can post comments
- **Storage Policies** — Complaint image bucket has public read + authenticated upload

## PWA

The app is installable as a Progressive Web App with:

- Service worker via `vite-plugin-pwa` (auto-update)
- Manifest with standalone display
- Apple touch icon support

## Design

**Neumorphism** style with a black/white/gray palette:

- Soft shadows (light top-left, dark bottom-right) on `#f3f4f6` base
- `neo-card` — extuded cards with 16px border-radius
- `neo-input` — inset shadow for pressed appearance
- `neo-btn` / `neo-btn-primary` — interactive buttons with shadow transitions
- `neo-badge` — inset pill badges

The brand font is **OffBit-Bold** (bundled as `public/OffBit-Bold.ttf`), used for the "Nammude Shabdham" wordmark.

## License

MIT
