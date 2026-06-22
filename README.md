# Preorder With Oma — Luxury Boutique Platform

> A custom-built e-commerce platform for a luxury fashion boutique, featuring WhatsApp preorder integration and a full admin dashboard.

![Status](https://img.shields.io/badge/Status-Live-success)
![License](https://img.shields.io/badge/License-Proprietary-red)

---

## About

A bespoke web platform built for **Preorder With Oma**, a Nigerian luxury boutique specializing in authentic handbags, shoes, and accessories sourced directly from China. The platform enables customers to browse the curated collection and place preorders via WhatsApp, while providing the boutique owner with a full admin dashboard to manage products, pricing, and imagery — no coding required.

This is a **client project** and is **not open for cloning or redistribution**. The code is shared here as a portfolio showcase of the engineering work.

---

## Live Demo

🌐 **[View Live Site](https://preorder-withoma-blush.vercel.app)**

---

## Features

### Customer Experience
- **Curated Catalog** — Browse products by category (Handbags, Shoes, Accessories, New Arrivals)
- **Quick View Modal** — Instant product details with pricing and description
- **WhatsApp Preorder** — One-tap preorder with pre-filled message including product name and price
- **Floating Action Button** — Always-available WhatsApp contact button
- **Luxury Animations** — Smooth Framer Motion transitions throughout
- **Fully Responsive** — Optimized across mobile, tablet, and desktop

### Admin Dashboard
- **Password-Protected Access** — Secure login at `/admin/login`
- **Product Management** — Full CRUD operations (Create, Read, Update, Delete)
- **Image Upload** — Direct file upload to cloud storage with live preview
- **Live/Draft Toggle** — Publish or unpublish products with one click
- **Badge System** — Tag products as Bestseller, New, or Limited Edition
- **Dashboard Stats** — Real-time overview of catalog by category and status

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Styling** | Tailwind CSS 4, Custom Luxury Theme |
| **Database** | Supabase PostgreSQL |
| **ORM** | Prisma |
| **Storage** | Supabase Storage (product images) |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Notifications** | Sonner |
| **Typography** | Cormorant Garamond + Jost |
| **Deployment** | Vercel |

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Customer      │     │   Admin         │     │   Supabase      │
│   Frontend      │────▶│   Dashboard     │────▶│   Postgres      │
│                 │     │                 │     │                 │
│ • Browse        │     │ • CRUD          │     │ • Product table │
│ • Quick View    │     │ • Image Upload  │     │ • Storage bucket│
│ • WhatsApp CTA  │     │ • Stats         │     │ • RLS policies  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │                       │
         └───────────────────────┴───────────────────────┘
                    Next.js API Routes (REST)
```

---

## Highlights

### Dynamic Product Management
Every product on the site — name, price, description, image, category, badge — is managed through the admin dashboard. Changes appear on the live site instantly. No rebuilds, no deploys, no developer involvement needed for day-to-day operations.

### WhatsApp-First Checkout
Built for the Nigerian market where WhatsApp is the primary communication channel. Each product's preorder button opens WhatsApp with a pre-filled message containing the product name and price, streamlining the ordering process for both customer and boutique owner.

### Luxury Aesthetic
Custom theme with cream, deep brown, and gold palette. Serif/sans typography pairing (Cormorant Garamond + Jost) for an editorial feel. Subtle animations and hover effects throughout — no off-the-shelf template look.

### Cloud-Native Storage
Product images are uploaded directly to Supabase Storage with automatic public URL generation. RLS policies ensure only authorized admin uploads while keeping images publicly readable.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── admin/                # Admin dashboard & login
│   └── api/                  # REST endpoints (products, auth, upload)
├── components/
│   ├── oma/                  # Custom boutique components
│   └── ui/                   # shadcn/ui primitives
├── lib/
│   ├── db.ts                 # Prisma client
│   └── supabase/             # Supabase server & browser clients
└── hooks/                    # Custom React hooks
```

---

## Security

- Admin routes protected by token-based authentication
- Supabase Row Level Security (RLS) policies on storage bucket
- Environment variables for all sensitive credentials
- Service role key used only server-side (never exposed to client)

---

## License & Usage

© 2026 Preorder With Oma. All rights reserved.

This software is **proprietary and confidential**. The code is published here solely as a portfolio showcase. You may **not**:

- ❌ Clone, copy, or redistribute this codebase
- ❌ Use the "Preorder With Oma" brand name, logo, or business identity
- ❌ Deploy this code for another business without explicit permission
- ❌ Remove or alter copyright notices

If you'd like to discuss licensing, a similar build for your own business, or have other inquiries, please reach out.

---

## Developer

Built with care for a small business owner. If you're interested in a similar platform for your own boutique or business, feel free to reach out.

📧 **Contact**: [https://wa.me/qr/AQ45VC73BHUTI1]

---

<p align="center">
  <em>Luxury Handbags, Shoes & Accessories — Delivered To You</em>
</p>
