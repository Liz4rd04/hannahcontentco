# HannahContentCo — Social Media Management Platform

A Next.js app for managing social media content for local food & drink clients. Upload photos/videos, organize into albums, and share secure review links with clients.

## What You Get

- **Marketing website** — Home, Services, About, Contact pages
- **Admin dashboard** — Manage clients, albums, upload/edit media, generate client review links
- **Client portal** — Token-secured gallery where clients can view and download their content

---

## Quick Start (15 minutes)

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free project
2. Once created, go to **Settings → API** and copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

### 2. Set Up the Database

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the entire contents of `supabase/migration.sql`
4. Click **Run** — this creates all tables, indexes, and security policies

### 3. Create Storage Buckets

1. Go to **Storage** in Supabase Dashboard
2. Create bucket: **`client-media`**
   - Public: **OFF**
   - File size limit: 100MB
3. Create bucket: **`public-assets`**
   - Public: **ON**
   - File size limit: 10MB

### 4. Create Your Admin Account

1. Go to **Authentication → Users** in Supabase Dashboard
2. Click **Add User → Create New User**
3. Enter your email and a strong password
4. Click **Create User** — this is your admin login

### 5. Set Up the App

```bash
# Clone/download the project
cd social-media-platform

# Install dependencies
npm install

# Copy the env file and fill in your values
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
TOKEN_SECRET=generate-with-openssl-rand-hex-32
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Generate TOKEN_SECRET:
```bash
openssl rand -hex 32
```

### 6. Run It

```bash
npm run dev
```

Visit:
- **Marketing site:** http://localhost:3000
- **Admin dashboard:** http://localhost:3000/admin (log in with your Supabase user)

---

## How to Use

### Managing Clients

1. Go to `/admin` → **Clients** → **New Client**
2. Enter the business name, slug (auto-generated), and contact info
3. Click Save

### Uploading Photos & Videos

1. Go to a client → **New Album** → give it a title
2. Open the album → **drag & drop** photos/videos into the upload area
3. Click **Upload** — files go to your private Supabase storage
4. Hover over any image to **edit the caption** or **delete it**

### Sharing with Clients

1. Go to a client → **Access Link** tab
2. Click **Generate Link** — a secure URL is created
3. **Copy the link** and send to your client (email, text, etc.)
4. Client can view all **published** albums and download files
5. Click **Rotate** to invalidate the old link and create a new one

### Publishing Albums

Albums start as **drafts**. To make them visible in the client portal:
1. Open the album → click **Edit Album**
2. Toggle **Published** on → Save
3. Now the album shows up in the client's portal

---

## Customizing Your Site

### Branding & Content (No Code Needed!)

Open `src/lib/site-config.ts` — this is the **one file** you edit to change:

- **Business name & tagline**
- **Contact info** (email, phone, address)
- **Social media links**
- **Services list** (with descriptions and icons)
- **About page content**
- **Testimonials**
- **Brand colors** (if you want to customize the color theme)

### Changing Colors

Edit `tailwind.config.ts` to change:
- **`brand`** — Your primary color (buttons, links, accents). Currently a warm amber.
- **`surface`** — Your neutral/gray tones for text and backgrounds.

Use [Tailwind CSS Color Generator](https://uicolors.app/) to generate a custom palette, then paste the values in.

---

## Deploying to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **Import Project** → select your repo
3. Add **Environment Variables** (same ones from `.env.local`)
4. Click **Deploy**
5. Set up a custom domain in Vercel's domain settings

---

## Project Structure

```
src/
├── app/
│   ├── (marketing)/     # Public pages (home, services, about, contact)
│   ├── (auth)/login/    # Admin login
│   ├── admin/           # Dashboard (clients, albums, media, audit)
│   ├── c/[slug]/        # Client portal (token-gated)
│   └── api/             # API routes (admin CRUD + client portal)
├── components/
│   ├── admin/           # MediaGrid, MediaUploader, ClientForm, etc.
│   ├── marketing/       # Navbar, Footer
│   ├── portal/          # Lightbox
│   └── ui/              # Spinner, Modal
├── lib/
│   ├── supabase/        # Client, server, admin, middleware helpers
│   ├── tokens.ts        # Token generation, hashing, cookie signing
│   ├── validations.ts   # Zod schemas
│   ├── audit.ts         # Audit logging
│   ├── site-config.ts   # ← EDIT THIS to customize your site
│   ├── types.ts         # TypeScript types
│   └── utils.ts         # Helpers (cn, formatDate, formatFileSize)
└── middleware.ts         # Auth protection + portal token handling
```

---

## Security Notes

- **Client portal** uses hashed tokens (SHA-256) — raw tokens are never stored
- **Media files** are in a private bucket — accessed only via short-lived signed URLs (60 min)
- **Admin routes** are protected by Supabase Auth middleware
- **Token rotation** immediately invalidates old links
- **RLS policies** ensure only authenticated admins can read/write data
- **Service role key** is only used server-side, never exposed to the browser

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| **Next.js 14** (App Router) | Framework |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **Supabase** | Auth, Postgres, Storage |
| **Zod** | Validation |
| **nanoid** | Token generation |
| **react-dropzone** | File upload UI |
| **sonner** | Toast notifications |
| **lucide-react** | Icons |
