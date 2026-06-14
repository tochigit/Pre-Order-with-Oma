# Preorder With Oma ✨

A luxury boutique e-commerce website with WhatsApp preorder integration, built with Next.js and Supabase.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-green?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwindcss)

---

## Overview

**Preorder With Oma** is a luxury fashion preorder service based in Nigeria, specializing in authentic handbags, shoes, and accessories sourced directly from China. This website allows customers to browse the collection, view product details, and place preorders via WhatsApp — all managed through a custom admin dashboard.

---

## Features

### Customer-Facing
- 🛍️ **Product Catalog** — Browse by category (Handbags, Shoes, Accessories, New Arrivals)
- 🔍 **Quick View Modal** — Click any product for details, pricing, and description
- 💬 **WhatsApp Preorder** — One-tap preorder button with pre-filled message including product name and price
- 📱 **Floating WhatsApp Button** — Always-visible green FAB for instant contact
- 📲 **Fully Responsive** — Optimized for mobile, tablet, and desktop
- ✨ **Luxury Animations** — Smooth Framer Motion transitions and hover effects

### Admin Dashboard
- 🔐 **Password-Protected Login** — Secure admin access at `/admin/login`
- 📊 **Dashboard Stats** — Total products, published, drafts, and category breakdown
- ➕ **Product CRUD** — Create, edit, delete products with live preview
- 📸 **Image Upload** — Upload product images directly to Supabase Storage
- 🏷️ **Badge System** — Mark products as Bestseller, New, or Limited
- 🔄 **Live/Draft Toggle** — Publish or unpublish products with one click
- 📋 **Category Management** — Assign products to Handbags, Shoes, Accessories, or New Arrivals

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4 + Custom Luxury Theme |
| **Database** | Supabase PostgreSQL |
| **ORM** | Prisma |
| **Storage** | Supabase Storage (product images) |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Notifications** | Sonner (toast) |
| **Fonts** | Cormorant Garamond (serif), Jost (sans) |

---

## Project Structure

```
preorder-with-oma/
├── prisma/
│   ├── schema.prisma          # Database schema (PostgreSQL)
│   └── seed.ts                # Demo product seeder (12 products)
├── public/
│   ├── products/              # Default product images
│   ├── hero-image.jpg         # Hero section background
│   └── logo.svg               # Site logo
├── src/
│   ├── app/
│   │   ├── page.tsx           # Homepage
│   │   ├── layout.tsx         # Root layout + fonts + metadata
│   │   ├── globals.css        # Custom luxury theme + animations
│   │   ├── admin/
│   │   │   ├── login/         # Admin login page
│   │   │   └── dashboard/     # Admin product management
│   │   └── api/
│   │       ├── products/      # Public GET (published products)
│   │       └── admin/
│   │           ├── auth/      # Admin password validationik
│   │           ├── products/  # Admin CRUD endpoints
│   │           └── upload/    # Supabase Storage image upload
│   ├── components/
│   │   ├── oma/               # Custom boutique components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductModal.tsx
│   │   │   ├── CategoryCard.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   ├── FAB.tsx        # Floating WhatsApp button
│   │   │   └── SkeletonCard.tsx
│   │   └── ui/                # shadcn/ui components
│   ├── lib/
│   │   ├── db.ts              # Prisma client singleton
│   │   ├── utils.ts           # Utility functions
│   │   └── supabase/
│   │       ├── server.ts      # Server-side Supabase client
│   │       └── client.ts      # Browser-side Supabase client
│   └── hooks/
│       ├── use-mobile.ts
│       └── use-toast.ts
├── supabase-setup.sql         # SQL script for storage bucket + RLS
├── .env                       # Environment variables (NOT committed)
└── package.json
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- A [Supabase](https://supabase.com) account and project
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/preorder-with-oma.git
cd preorder-with-oma
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Set Up Environment Variables

Create a `.env` file in the project root:

```env
# ── Supabase ──
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ── Database ──
# Pooled connection (port 6543) — used by the running app
DATABASE_URL=postgresql://postgres.your-ref:YOUR-PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true

# Direct connection (port 5432) — used by Prisma for migrations
DIRECT_URL=postgresql://postgres.your-ref:YOUR-PASSWORD@db.your-ref.supabase.co:5432/postgres?sslmode=require

# ── Admin ──
ADMIN_PASSWORD=YourAdminPassword

# ── Contact Info ──
NEXT_PUBLIC_WHATSAPP_NUMBER=234XXXXXXXXXX
NEXT_PUBLIC_INSTAGRAM_HANDLE=your-instagram-handle
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Where to find your Supabase keys:**
> - Project URL + API keys → **Supabase Dashboard → Settings → API**
> - Database connection strings → **Supabase Dashboard → Database → Connection string → URI**

### 4. Set Up Supabase Storage

In your Supabase Dashboard, go to **SQL Editor → New Query**, paste the contents of `supabase-setup.sql`, and click **Run**. This creates the `product-images` storage bucket with public read access and admin upload permissions.

### 5. Push Database Schema

```bash
npx prisma generate
npx prisma db push
```

Type `y` when prompted to confirm.

### 6. Seed Demo Products

```bash
npx prisma db seed
```

This loads 12 demo products across 4 categories.

### 7. Start the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the site.

---

## Usage

### Customer Flow
1. Visit the homepage
2. Browse products by category (click category cards or filter pills)
3. Click a product for the quick-view modal
4. Tap **"Preorder on WhatsApp"** to send a pre-filled message

### Admin Flow
1. Navigate to `/admin/login`
2. Enter the admin password (set in `.env` as `ADMIN_PASSWORD`)
3. View dashboard with product stats
4. Add, edit, or delete products
5. Upload product images from your device
6. Toggle products between Live and Draft

---

## Customization

### Theme Colors

The luxury theme is defined in `src/app/globals.css`:

| Token | Color | Usage |
|-------|-------|-------|
| `cream` | `#F5F0E8` | Background |
| `deep-brown` | `#2C1A0E` | Text, headers |
| `gold` | `#C4962A` | Accents, highlights |
| `champagne` | `#D4C5A9` | Borders, dividers |
| `warm-white` | `#FAF8F4` | Card backgrounds |
| `mid-brown` | `#6B4C2E` | Secondary text |

### WhatsApp Number

Update `NEXT_PUBLIC_WHATSAPP_NUMBER` in your `.env` file. Format: country code + number without `+` (e.g., `2347079430805`).

### Admin Password

Update `ADMIN_PASSWORD` in your `.env` file. This is used for both login and API authentication.

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Add all `.env` variables in Vercel's **Settings → Environment Variables**
4. Deploy — Vercel auto-detects Next.js

> **Important:** Add `?sslmode=require` to your `DIRECT_URL` if deploying to Vercel.

### Other Platforms

This is a standard Next.js application. Any platform that supports Next.js 16 will work (Netlify, Railway, etc.).

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is proprietary. All rights reserved.

---

<p align="center">
  <strong>Preorder With Oma</strong> — Luxury Handbags, Shoes & Accessories Delivered To You
</p>
