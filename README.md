# Abdullah.div — Advanced Personal Portfolio

> 🌐 A bilingual (Arabic/English) personal portfolio & CMS powered by **Next.js 16**, **Prisma 7**, and **Supabase**.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🌍 **Bilingual i18n** | Full Arabic (RTL) & English support via `next-intl` |
| 🎨 **Theme Switching** | Dark/Light mode with CSS custom properties |
| 📱 **Responsive Design** | Optimized for mobile, tablet, and desktop |
| 🛠️ **Admin CMS** | Full CRUD dashboard (Projects, Timeline, Social Links, Messages, Survey) |
| 📤 **Image Upload** | Upload images to Supabase Storage with drag & drop |
| 🖼️ **2.5D Parallax Hero** | Animated parallax hero section with floating text |
| 🃏 **Card Shuffle** | Interactive featured projects carousel |
| 📊 **Survey System** | Visitor survey popup with analytics |
| 📧 **Contact Form** | Email notifications via Resend |
| 🔒 **Auth & Security** | Supabase Auth with admin-only routes |
| ⚡ **Rate Limiting** | API protection via Upstash Redis |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **UI** | React 19, Framer Motion, Tailwind CSS 4 |
| **Database** | PostgreSQL (Supabase) |
| **ORM** | Prisma 7 with `@prisma/adapter-pg` |
| **Auth** | Supabase Auth (SSR) |
| **Storage** | Supabase Storage |
| **Email** | Resend |
| **Rate Limiting** | Upstash Redis |
| **i18n** | next-intl |
| **Analytics** | Vercel Analytics |
| **Testing** | Vitest |

---

## 📁 Project Structure

```
abdullah-div/
├── prisma/
│   ├── schema.prisma          # Database schema (6 models)
│   └── migrations/            # SQL migrations
├── prisma.config.ts           # Prisma 7 config (DB connection)
├── src/
│   ├── app/
│   │   ├── [locale]/          # Public pages (i18n)
│   │   │   ├── page.tsx       # Home (Hero + Featured Projects)
│   │   │   ├── portfolio/     # Projects listing + detail
│   │   │   ├── journey/       # Timeline page
│   │   │   ├── contact/       # Contact form
│   │   │   └── layout.tsx     # Locale layout (Navbar + Footer)
│   │   ├── admin/             # Admin CMS dashboard
│   │   │   ├── projects/      # CRUD projects
│   │   │   ├── timeline/      # CRUD timeline entries
│   │   │   ├── social-links/  # CRUD social links
│   │   │   ├── messages/      # View messages
│   │   │   ├── survey/        # Survey management
│   │   │   ├── login/         # Admin login
│   │   │   └── layout.tsx     # Admin layout + auth guard
│   │   ├── api/
│   │   │   ├── admin/         # Protected admin APIs
│   │   │   │   ├── projects/  # CRUD + image management
│   │   │   │   ├── timeline/  # CRUD timeline
│   │   │   │   ├── social-links/ # CRUD social links
│   │   │   │   ├── messages/  # Messages management
│   │   │   │   ├── survey/    # Survey management
│   │   │   │   ├── upload/    # File upload to Supabase Storage
│   │   │   │   └── export/    # Data export
│   │   │   ├── auth/          # Auth endpoints (login/signup)
│   │   │   └── public/        # Public APIs (projects, timeline, etc.)
│   │   ├── globals.css        # Global styles + CSS variables
│   │   └── fonts.ts           # Font configuration
│   ├── components/
│   │   ├── hero/              # HeroSection, FloatingText, ParallaxCharacter
│   │   ├── home/              # CardShuffle (featured projects)
│   │   ├── portfolio/         # PortfolioList, ProjectDetail
│   │   ├── journey/           # Timeline
│   │   ├── contact/           # ContactForm
│   │   ├── survey/            # SurveyPopup
│   │   ├── admin/             # ImageUpload
│   │   └── shared/            # Navbar, Footer, ThemeProvider, PageTransition
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── auth/              # require-admin middleware
│   │   ├── supabase/          # Supabase clients (server, client, admin)
│   │   ├── resend/            # Email client & templates
│   │   └── rate-limit.ts      # Upstash rate limiter
│   ├── i18n/                  # i18n routing config
│   ├── messages/              # Translation files (ar.json, en.json)
│   ├── types/                 # Shared TypeScript interfaces
│   └── middleware.ts          # Next.js middleware (i18n routing)
└── .env.local                 # Environment variables
```

---

## 🗃️ Database Schema

```
┌─────────────────┐     ┌─────────────────┐
│   Project       │     │  ProjectImage   │
│─────────────────│     │─────────────────│
│ id              │◄────│ projectId       │
│ slug (unique)   │     │ url             │
│ titleAr/En      │     │ altAr/En        │
│ summaryAr/En    │     │ order           │
│ bodyAr/En       │     └─────────────────┘
│ previewUrl      │
│ skills[]        │     ┌─────────────────┐
│ buildTime       │     │  SocialLink     │
│ isPublished     │     │─────────────────│
│ isFeatured      │     │ platform        │
│ order           │     │ url             │
└─────────────────┘     │ labelAr/En      │
                        │ isActive        │
┌─────────────────┐     │ order           │
│ TimelineEntry   │     └─────────────────┘
│─────────────────│
│ date            │     ┌─────────────────┐
│ age             │     │ SurveyQuestion  │
│ titleAr/En      │     │─────────────────│
│ storyAr/En      │     │ textAr/En       │
│ imageUrl        │     │ type            │
│ order           │     │ optionsAr/En[]  │
└─────────────────┘     │ isActive        │
                        └─────────────────┘
┌─────────────────┐
│    Message      │     ┌─────────────────┐
│─────────────────│     │ SurveyResponse  │
│ senderName      │     │─────────────────│
│ senderEmail     │     │ questionId      │
│ serviceType     │     │ visitorId       │
│ budget          │     │ answer          │
│ body            │     │ locale          │
│ emailStatus     │     └─────────────────┘
│ isRead          │
└─────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Supabase** account (database + auth + storage)
- **Upstash Redis** account (rate limiting)
- **Resend** account (email notifications)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/abdullah-div.git
cd abdullah-div
npm install
```

### 2. Environment Variables

Create `.env.local` in the project root:

```env
# ── Supabase ──
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ── Database ──
DATABASE_URL=postgresql://user:password@host:port/dbname?sslmode=require
DIRECT_URL=postgresql://user:password@host:port/dbname?sslmode=require

# ── Upstash Redis ──
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# ── Resend ──
RESEND_API_KEY=re_your-api-key
ADMIN_EMAIL=your-admin@email.com
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy
```

### 4. Supabase Storage Setup

1. Go to **Supabase Dashboard** → **Storage**
2. Create a bucket named **`uploads`**
3. Enable **"Public bucket"** ✅

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## 🔐 Admin Dashboard

Access the admin panel at: `/admin/login`

### Admin Features

| Section | Functionality |
|---------|--------------|
| **Projects** | Create, edit, delete, publish/unpublish, feature/unfeature, upload cover images |
| **Timeline** | Add/edit life journey entries with date, age, story, and images |
| **Social Links** | Manage social media links (auto-detected icons in Footer) |
| **Messages** | View contact form submissions, mark as read |
| **Survey** | Manage survey questions, view visitor responses |

### Supported Social Platforms (Auto-icon)

LinkedIn, GitHub, WhatsApp, Twitter/X, Instagram, Facebook, YouTube, Telegram, Dribbble, Behance, Email, Mostaql, Khamsat

---

## 🌍 Internationalization

The site supports **Arabic (RTL)** and **English (LTR)**:

- Routes: `/ar/...` and `/en/...`
- Translation files: `src/messages/ar.json` and `src/messages/en.json`
- Auto-detection via `Accept-Language` header
- Language switcher in the footer

---

## 📡 API Reference

### Public Endpoints (No Auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/public/projects` | List published projects |
| `GET` | `/api/public/projects/[slug]` | Get project by slug |
| `GET` | `/api/public/social-links` | List active social links |
| `GET` | `/api/public/timeline` | List timeline entries |
| `GET` | `/api/public/survey/questions` | Get active survey questions |
| `POST` | `/api/public/survey/responses` | Submit survey response |
| `POST` | `/api/public/messages` | Send contact message |

### Admin Endpoints (Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET/POST` | `/api/admin/projects` | List/Create projects |
| `PUT/DELETE` | `/api/admin/projects/[id]` | Update/Delete project |
| `GET/POST` | `/api/admin/timeline` | List/Create entries |
| `PUT/DELETE` | `/api/admin/timeline/[id]` | Update/Delete entry |
| `GET/POST` | `/api/admin/social-links` | List/Create links |
| `PUT/DELETE` | `/api/admin/social-links/[id]` | Update/Delete link |
| `GET` | `/api/admin/messages` | List messages |
| `PUT` | `/api/admin/messages/[id]` | Mark message as read |
| `POST` | `/api/admin/upload` | Upload image to storage |

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch
```

---

## 📦 Build & Deploy

```bash
# Production build
npm run build

# Start production server
npm start
```

### Deploy to Vercel

1. Push to GitHub
2. Connect repo in [Vercel Dashboard](https://vercel.com)
3. Add all environment variables
4. Deploy ✅

---

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |
| `npx prisma generate` | Generate Prisma client |
| `npx prisma migrate dev` | Create new migration |
| `npx prisma studio` | Open Prisma Studio (DB GUI) |

---

## 📜 License

Private project. All rights reserved.
