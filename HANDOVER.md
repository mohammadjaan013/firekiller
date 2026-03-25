# FireKiller E-Commerce Platform — Handover Documentation

> **Last updated:** 25 March 2026  
> **Repository:** `mohammadjaan013/firekiller` (branch: `main`)  
> **Purpose:** Complete reference for any developer or AI agent continuing work on this project.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Getting Started](#3-getting-started)
4. [Project Structure](#4-project-structure)
5. [Design System & Theming](#5-design-system--theming)
6. [Page Routes](#6-page-routes)
7. [API Endpoints](#7-api-endpoints)
8. [Database Schema](#8-database-schema)
9. [Authentication & Authorization](#9-authentication--authorization)
10. [Product Data](#10-product-data)
11. [State Management](#11-state-management)
12. [Third-Party Integrations](#12-third-party-integrations)
13. [Key Workflows](#13-key-workflows)
14. [Component Inventory](#14-component-inventory)
15. [Admin Panel](#15-admin-panel)
16. [Build & Deployment](#16-build--deployment)
17. [Environment Variables](#17-environment-variables)
18. [Known Conventions & Gotchas](#18-known-conventions--gotchas)
19. [Recent Changes Log](#19-recent-changes-log)
20. [System Architecture Diagram](#20-system-architecture-diagram)

---

## 1. Project Overview

**FireKiller** is an Indian e-commerce platform selling compact fire safety products:

- **FireKiller** — Portable fire extinguisher balls/units for home & car safety.
- **PanSafe** — Kitchen fire suppression sachets (patented).

The site includes a storefront, blog, admin dashboard, payment processing (Razorpay), shipping integration (Shiprocket), WhatsApp notifications (Interakt), and email confirmations.

**Business owner:** OustFire (brand parent company), led by CEO Shaikh Sir.

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Framework** | Next.js (App Router, Turbopack) | 16.1.6 |
| **UI** | React | 19.2.3 |
| **Language** | TypeScript | 5 |
| **Styling** | Tailwind CSS v4 (`@theme` syntax) | 4 |
| **Database** | PostgreSQL (hosted on Neon) | — |
| **ORM** | Prisma with `@prisma/adapter-pg` | 7.4.2 |
| **Auth** | NextAuth (Auth.js) v5 beta | 5.0.0-beta.30 |
| **Payments** | Razorpay | 2.9.6 |
| **Shipping** | Shiprocket API v2 | REST API |
| **WhatsApp** | Interakt API | REST API |
| **Email** | Nodemailer (Gmail SMTP) | 7.0.13 |
| **Animations** | Framer Motion | 12.34.4 |
| **Animations (adv.)** | GSAP | 3.14.2 |
| **Icons** | Lucide React | 0.576.0 |
| **Markdown** | React Markdown | 10.1.0 |
| **Accessible UI** | Headless UI | 2.2.9 |
| **Password hashing** | Bcryptjs | 3.0.3 |

---

## 3. Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database (or Neon cloud DB)
- Razorpay test/production keys
- Gmail App Password for SMTP

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/mohammadjaan013/firekiller.git
cd firekiller

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env.local
# Edit .env.local with your keys (see Section 17)

# 4. Generate Prisma client
npx prisma generate

# 5. Apply database migrations
npx prisma migrate deploy

# 6. (Optional) Seed the database
npx tsx prisma/seed.ts

# 7. Start dev server
npm run dev
# → http://localhost:3000
```

### Key Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Production build (`prisma generate && next build`) |
| `npm start` | Start production server |
| `npm run lint` | ESLint check |
| `npx prisma studio` | Open Prisma database GUI |
| `npx prisma migrate dev` | Create new migration |

---

## 4. Project Structure

```
firekiller-X/
├── prisma/
│   ├── schema.prisma              # Database schema (all models)
│   ├── seed.ts                    # DB seed script
│   └── migrations/                # SQL migrations
│
├── public/
│   ├── images/
│   │   ├── brand/                 # Logo, CEO.jpeg, brand assets
│   │   ├── products/              # Product photos
│   │   ├── hero/                  # Hero banner images
│   │   ├── blog/                  # Blog cover images
│   │   ├── clients/               # Client logos
│   │   └── categories/            # Category thumbnails
│   └── videos/                    # Product demo MP4s
│       ├── firekiller-d1.mp4
│       ├── firekiller-d2.mp4
│       ├── pansafe-d1.mp4
│       ├── pansafe-d2.mp4
│       └── pansafe-advt.mp4       # PanSafe celebrity ad
│
├── src/
│   ├── middleware.ts              # Edge-safe route protection
│   │
│   ├── app/
│   │   ├── globals.css            # Tailwind theme + typography
│   │   ├── layout.tsx             # Root layout (providers, fonts, nav, footer)
│   │   ├── page.tsx               # Homepage
│   │   │
│   │   ├── shop/                  # Product pages
│   │   │   ├── page.tsx           # Shop listing with filters
│   │   │   └── [slug]/page.tsx    # Product detail (tabs, videos, cart)
│   │   │
│   │   ├── blog/                  # Blog pages
│   │   │   ├── page.tsx           # Blog listing with categories
│   │   │   └── [slug]/page.tsx    # Blog post (Medium-style prose)
│   │   │
│   │   ├── about/page.tsx         # About Us (CEO photo, team, patents)
│   │   ├── contact/page.tsx       # Contact form
│   │   ├── faqs/page.tsx          # FAQs with accordion
│   │   ├── how-it-works/page.tsx  # Product usage guide
│   │   ├── vendor-enquiry/page.tsx# Vendor inquiry form
│   │   │
│   │   ├── login/page.tsx         # Login/Register page
│   │   ├── account/page.tsx       # User profile (protected)
│   │   ├── cart/page.tsx          # Shopping cart
│   │   ├── checkout/page.tsx      # Checkout (Razorpay + COD)
│   │   ├── orders/page.tsx        # Order history (protected)
│   │   ├── order-confirmation/page.tsx
│   │   ├── wishlist/page.tsx      # Wishlist (protected)
│   │   │
│   │   ├── admin/                 # Admin panel (ADMIN role only)
│   │   │   ├── layout.tsx         # Sidebar navigation
│   │   │   ├── page.tsx           # Dashboard overview
│   │   │   ├── products/          # Product CRUD
│   │   │   ├── orders/            # Order management
│   │   │   ├── blogs/             # Blog CRUD + BlogEditor.tsx
│   │   │   ├── categories/        # Category management
│   │   │   ├── coupons/           # Coupon management
│   │   │   ├── users/             # User management
│   │   │   ├── cod-orders/        # COD verification
│   │   │   └── whatsapp-logs/     # WhatsApp notification logs
│   │   │
│   │   └── api/                   # 30 API routes (see Section 7)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx         # Top navigation bar
│   │   │   └── Footer.tsx         # Site footer
│   │   ├── providers/
│   │   │   ├── AuthProvider.tsx   # NextAuth SessionProvider
│   │   │   └── ThemeProvider.tsx  # Theme context
│   │   └── home/                  # 13 homepage section components
│   │       ├── HeroSection.tsx
│   │       ├── TrustBar.tsx
│   │       ├── CategoriesSection.tsx
│   │       ├── HowItWorks.tsx
│   │       ├── WhyFireKiller.tsx
│   │       ├── VideoShowcase.tsx  # PanSafe celebrity ad video
│   │       ├── TestimonialsSection.tsx
│   │       ├── FeaturedProducts.tsx
│   │       ├── ClientsSection.tsx
│   │       ├── ExpertArticles.tsx
│   │       ├── ProblemStats.tsx
│   │       ├── SocialProof.tsx
│   │       └── CTASection.tsx
│   │
│   ├── context/
│   │   ├── CartContext.tsx        # Shopping cart (React Context)
│   │   └── ToastContext.tsx       # Toast notifications
│   │
│   ├── lib/
│   │   ├── auth.ts               # NextAuth full config (Node.js only)
│   │   ├── auth.config.ts        # Edge-safe auth config (middleware)
│   │   ├── auth-utils.ts         # getCurrentUser, requireAuth, requireAdmin
│   │   ├── db.ts                 # Prisma client singleton
│   │   ├── email.ts              # Nodemailer SMTP service
│   │   ├── razorpay.ts           # Razorpay SDK init
│   │   ├── shiprocket.ts         # Shiprocket API helpers
│   │   ├── interakt.ts           # WhatsApp via Interakt API
│   │   ├── scraper.ts            # RSS feed scraper for blog articles
│   │   └── products.ts           # Static product data & interface
│   │
│   ├── types/
│   │   └── next-auth.d.ts        # NextAuth type extensions
│   │
│   └── data/
│       └── blogPosts.ts          # Hardcoded sample blog data
│
├── next.config.ts                 # Images: firekiller.in, unsplash
├── tsconfig.json                  # TS strict, @/* path alias
├── postcss.config.mjs             # Tailwind v4 plugin
├── eslint.config.mjs              # Next.js + TS rules
└── package.json
```

---

## 5. Design System & Theming

### Color Palette (Light Mode Only — no dark mode)

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#CC1F1F` | Brand red, buttons, links, accents |
| `primary-dark` | `#A51A1A` | Hover states |
| `primary-light` | `#fecaca` | Light red backgrounds |
| `accent` | `#FF4444` | Alerts, badges |
| `secondary` | `#1e293b` | Dark text, headings |
| `background` | `#fafafa` | Page background |
| `foreground` | `#171717` | Body text |
| `muted` | `#f1f5f9` | Muted backgrounds |
| `muted-foreground` | `#64748b` | Secondary text |
| `border` | `#e2e8f0` | Borders |
| `card` | `#ffffff` | Card backgrounds |

### Typography

| Usage | Font | Variable |
|---|---|---|
| Headings | Space Grotesk | `--font-heading` / `font-heading` class |
| Body | Inter | `--font-sans` |
| Blog prose | Lora (serif) | `--font-lora` / `.prose-blog` class |

### Tailwind v4 Notes

- Uses `@theme` directive in `globals.css` (NOT `tailwind.config.js`)
- Gradient syntax: `bg-linear-to-br` (NOT `bg-gradient-to-br`)
- Colors available as: `text-primary`, `bg-muted`, `border-border`, etc.
- Plugin: `@tailwindcss/typography` for blog prose

### UI Style

- **Rounded corners:** `rounded-2xl` to `rounded-3xl` (curvy aesthetic)
- **Animations:** Framer Motion `motion.div` with `whileInView`
- **Shadows:** Subtle `shadow-sm` to `shadow-lg`, colored shadows `shadow-primary/20`
- **Cards:** White background, border, hover lift effect
- **Buttons:** Pill-shaped (`rounded-full`), primary red with white text

---

## 6. Page Routes

### Public Pages

| Route | File | Description |
|---|---|---|
| `/` | `app/page.tsx` | Homepage (hero, products, testimonials, video) |
| `/shop` | `app/shop/page.tsx` | Product listing with category filters |
| `/shop/[slug]` | `app/shop/[slug]/page.tsx` | Product detail (images, features tabs, videos, cart) |
| `/blog` | `app/blog/page.tsx` | Blog listing with category filter |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Blog article (Medium-style typography) |
| `/about` | `app/about/page.tsx` | About Us (CEO, team, PanSafe patent) |
| `/contact` | `app/contact/page.tsx` | Contact form |
| `/faqs` | `app/faqs/page.tsx` | FAQs with accordion |
| `/how-it-works` | `app/how-it-works/page.tsx` | Product usage guide |
| `/vendor-enquiry` | `app/vendor-enquiry/page.tsx` | Vendor inquiry form |
| `/login` | `app/login/page.tsx` | Login & registration |

### Protected Pages (require authentication)

| Route | File | Description |
|---|---|---|
| `/account` | `app/account/page.tsx` | User profile & addresses |
| `/cart` | `app/cart/page.tsx` | Shopping cart |
| `/checkout` | `app/checkout/page.tsx` | Checkout (address, payment) |
| `/orders` | `app/orders/page.tsx` | Order history |
| `/order-confirmation` | `app/order-confirmation/page.tsx` | Post-purchase confirmation |
| `/wishlist` | `app/wishlist/page.tsx` | Saved products |

### Admin Pages (require ADMIN role)

| Route | File | Description |
|---|---|---|
| `/admin` | `app/admin/page.tsx` | Dashboard overview |
| `/admin/products` | `app/admin/products/page.tsx` | Manage products |
| `/admin/products/new` | `app/admin/products/new/page.tsx` | Add product |
| `/admin/products/[id]/edit` | `app/admin/products/[id]/edit/page.tsx` | Edit product |
| `/admin/orders` | `app/admin/orders/page.tsx` | View & process orders |
| `/admin/orders/[id]` | `app/admin/orders/[id]/page.tsx` | Order details |
| `/admin/blogs` | `app/admin/blogs/page.tsx` | Manage blog posts |
| `/admin/blogs/new` | `app/admin/blogs/new/page.tsx` | Create blog post |
| `/admin/blogs/[id]` | `app/admin/blogs/[id]/page.tsx` | Edit blog post |
| `/admin/categories` | `app/admin/categories/page.tsx` | Manage categories |
| `/admin/coupons` | `app/admin/coupons/page.tsx` | Manage coupons |
| `/admin/users` | `app/admin/users/page.tsx` | User management |
| `/admin/cod-orders` | `app/admin/cod-orders/page.tsx` | COD verification |
| `/admin/whatsapp-logs` | `app/admin/whatsapp-logs/page.tsx` | WhatsApp logs |

---

## 7. API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `GET/POST` | `/api/auth/[...nextauth]` | NextAuth handler (login, logout, session) |
| `POST` | `/api/auth/register` | User registration (email, password, name) |

### Products
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | List products (query: category, search, sort, featured, page, limit) |
| `GET` | `/api/products/[slug]` | Get single product by slug |

### Cart & Wishlist
| Method | Endpoint | Description |
|---|---|---|
| `GET/POST/DELETE` | `/api/cart` | Cart CRUD (synced to DB for logged-in users) |
| `GET/POST/DELETE` | `/api/wishlist` | Wishlist CRUD |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/orders` | Create new order |
| `POST` | `/api/orders/cod-verify` | Verify COD order |
| `POST` | `/api/orders/cod-confirm` | Confirm COD payment |
| `POST` | `/api/checkout` | Process checkout |

### Payments (Razorpay)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/razorpay/order` | Create Razorpay payment order |
| `POST` | `/api/razorpay/verify` | Verify payment signature |
| `POST` | `/api/razorpay/webhook` | Razorpay webhook handler |

### Shipping (Shiprocket)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/shiprocket/ship` | Create new shipment |
| `GET` | `/api/shiprocket/track` | Track shipment by AWB code |

### Blog
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/blog` | List/filter blog posts |
| `GET` | `/api/blog/[slug]` | Get blog by slug |
| `POST` | `/api/blog/scrape` | Scrape fire-safety articles from RSS feeds |

### Admin APIs
| Method | Endpoint | Description |
|---|---|---|
| `GET/POST` | `/api/admin/products` | Admin product CRUD |
| `GET/PUT/DELETE` | `/api/admin/products/[id]` | Admin product update/delete |
| `GET/POST` | `/api/admin/blogs` | Admin blog CRUD |
| `GET/PUT/DELETE` | `/api/admin/blogs/[id]` | Admin blog update/delete |
| `GET/POST` | `/api/admin/categories` | Manage categories |
| `POST` | `/api/admin/cod-orders` | COD verification |
| `GET` | `/api/admin/orders/[id]` | Order details |

### Other
| Method | Endpoint | Description |
|---|---|---|
| `GET/POST` | `/api/reviews` | Product reviews |
| `POST` | `/api/coupons/validate` | Validate coupon code |
| `GET` | `/api/account/last-address` | Last used shipping address |
| `POST` | `/api/contact` | Contact form submission |
| `POST` | `/api/vendor-enquiry` | Vendor inquiry form |

---

## 8. Database Schema

### Models Overview

```
User ─────────┬── Address (1:N)
              ├── Order (1:N) ──── OrderItem (1:N)
              ├── CartItem (1:N)
              ├── WishlistItem (1:N)
              └── Review (1:N)

Category ─── Product (1:N) ──┬── ProductImage (1:N)
                              ├── Review (1:N)
                              ├── CartItem (1:N)
                              ├── WishlistItem (1:N)
                              └── OrderItem (1:N)

BlogPost (standalone)
ContactMessage (standalone)
VendorEnquiry (standalone)
Coupon (standalone)
WhatsappLog ─── Order (N:1)
```

### Key Models

**User** — `id, name, email (unique), password, phone, avatar, role (CUSTOMER|ADMIN|VENDOR)`

**Product** — `id, name, slug (unique), sku (unique), price, originalPrice, gstRate (0.18), stock, description, shortDesc, longDescription, badge, isFeatured, isActive, weight, dimensions, packSize, features (String[]), specifications (Json), video, productLine (firekiller|pansafe), categoryLabel, categoryId`

**Order** — `id, orderNumber (unique), status (enum), subtotal, shipping, discount, total, paymentMethod, paymentId, razorpayOrderId, paymentStatus, shiprocketOrderId, shiprocketShipmentId, awbCode, trackingUrl, codVerified, userId, addressId`

**BlogPost** — `id, title, slug (unique), excerpt, content (Markdown), coverImage, category, readTime, isPublished, isScraped, sourceUrl, source, publishedAt`

**Coupon** — `id, code (unique), discountType (percentage|fixed), discountValue, minOrder, maxUsage, usageCount, expiryDate, isActive`

**Order Statuses:** `PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED` (or `CANCELLED`, `REFUNDED`)

---

## 9. Authentication & Authorization

### Architecture

```
Middleware (Edge Runtime)          API Routes (Node.js Runtime)
├── auth.config.ts (edge-safe)     ├── auth.ts (full config + Prisma)
├── JWT strategy, 30-day maxAge    ├── Credentials provider
├── Route protection               ├── Password verification (bcryptjs)
└── Role checking                  └── Session/JWT callbacks
```

### Protected Route Matcher

```typescript
// middleware.ts
matcher: ["/account/:path*", "/orders/:path*", "/wishlist/:path*", "/admin/:path*"]
```

- `/account`, `/orders`, `/wishlist` → redirects to `/login` if unauthenticated
- `/admin/*` → requires `role === "ADMIN"`, otherwise redirects to `/`

### Auth Helpers (`src/lib/auth-utils.ts`)

```typescript
getCurrentUser()   // Returns session user or null
requireAuth()      // Redirects to /login if not authenticated
requireAdmin()     // Redirects to / if not ADMIN
```

### Session Shape

```typescript
session.user = {
  id: string;       // User's DB id
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN" | "VENDOR";
}
```

---

## 10. Product Data

Products exist in **two places** (historical reason — migration in progress):

1. **Static data** — `src/lib/products.ts` — 6 hardcoded products used by the storefront
2. **Database** — Prisma `Product` model — used by admin CRUD

### Static Products (storefront-facing)

| # | Product | Slug | Price | Line |
|---|---|---|---|---|
| 1 | FireKiller - 1 Unit | `firekiller-1` | ₹799 | firekiller |
| 2 | FireKiller - 2 Units | `firekiller-2` | ₹1,598 | firekiller |
| 3 | FireKiller - 3 Units | `firekiller-3` | ₹2,397 | firekiller |
| 4 | PanSafe - 1 Pc | `pansafe-1` | ₹899 | pansafe |
| 5 | PanSafe - 3 Pcs | `pansafe-3` | ₹2,427 | pansafe |
| 6 | PanSafe - 5 Pcs | `pansafe-5` | ₹3,820 | pansafe |

### Product Interface

```typescript
interface Product {
  id: number;
  slug: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  badge: string;
  categories: string[];            // "home", "car", "kitchen"
  categoryLabel: string;
  description: string;
  longDescription: string;
  features: string[];
  specifications: Record<string, string>;
  images: string[];                // /public/images/products/*
  videos?: { src: string; label: string }[];  // local MP4 files
  inStock: boolean;
}
```

### Video Assets

| File | Product | Type |
|---|---|---|
| `/videos/firekiller-d1.mp4` | FireKiller | Demo 1 |
| `/videos/firekiller-d2.mp4` | FireKiller | Demo 2 |
| `/videos/pansafe-d1.mp4` | PanSafe | Demo 1 |
| `/videos/pansafe-d2.mp4` | PanSafe | Demo 2 |
| `/videos/pansafe-advt.mp4` | PanSafe | Celebrity advertisement |

---

## 11. State Management

### Cart Context (`src/context/CartContext.tsx`)

React Context wrapping the entire app. Manages:

```typescript
// State
items: CartItem[]          // { id, slug, name, price, originalPrice, image, quantity }
totalItems: number
subtotal: number
savings: number
discount: number
appliedCoupon: { code, discount } | null

// Methods
addItem(item, qty?)        // Add/increment cart item
removeItem(id)             // Remove from cart
updateQuantity(id, qty)    // Set quantity
clearCart()                 // Empty cart
isInCart(id)                // Check if product in cart
applyCoupon(code, discount)
removeCoupon()
```

Cart syncs to database for logged-in users via `/api/cart`.

### Toast Context (`src/context/ToastContext.tsx`)

Simple notification system:

```typescript
showToast(message: string)  // Shows 3-second auto-dismiss toast
dismiss(id: number)         // Manual dismiss
```

Uses Framer Motion `AnimatePresence` for enter/exit animations.

---

## 12. Third-Party Integrations

### Razorpay (Payments)

- **SDK:** `razorpay` npm package
- **Flow:** Create order → Frontend Checkout modal → Verify signature → Update DB
- **Webhook:** `/api/razorpay/webhook` for async payment events
- **Config:** `src/lib/razorpay.ts`
- **Client key:** `NEXT_PUBLIC_RAZORPAY_KEY_ID` (exposed to browser)

### Shiprocket (Shipping)

- **API:** REST API v2 with token auth
- **Token caching:** 9-day cache for auth token
- **Flow:** Create shipment → Get AWB code → Track shipment
- **Config:** `src/lib/shiprocket.ts`
- **Features:** Shipment creation, AWB tracking, tracking URL generation

### Interakt (WhatsApp)

- **API:** REST API with API key auth
- **Messages:** Template-based WhatsApp messages
- **Logging:** All messages logged to `WhatsappLog` model
- **Config:** `src/lib/interakt.ts`

### Email (Nodemailer)

- **SMTP:** Gmail with App Password
- **Templates:** Order confirmation emails to customer + admin
- **Config:** `src/lib/email.ts`

### Blog Scraper

- **Source:** Google News RSS feeds
- **Queries:** "fire accident India", "fire safety India", etc.
- **Storage:** Scraped articles saved to `BlogPost` with `isScraped: true`
- **Config:** `src/lib/scraper.ts`

---

## 13. Key Workflows

### Purchase Flow

```
Browse /shop → View /shop/[slug] → Add to Cart (CartContext)
    → /cart → /checkout → Choose payment:
        ├── Razorpay: /api/razorpay/order → Checkout modal → /api/razorpay/verify
        └── COD: /api/orders/cod-verify → /api/orders/cod-confirm
    → Order created in DB → Email sent → WhatsApp sent
    → /order-confirmation
    → Admin ships via Shiprocket → /api/shiprocket/ship
    → Customer tracks via /orders
```

### Blog Creation

```
Admin → /admin/blogs/new → BlogEditor.tsx (Markdown toolbar)
    → POST /api/admin/blogs → Stored in BlogPost table
    → Visible on /blog and /blog/[slug]
```

### Blog Scraping

```
Admin triggers → POST /api/blog/scrape
    → RSS feeds parsed → Articles deduplicated by URL
    → Stored with isScraped: true → Visible on /blog
```

---

## 14. Component Inventory

### Layout Components

| Component | File | Description |
|---|---|---|
| `Navbar` | `components/layout/Navbar.tsx` | Top navigation, mobile menu, cart icon with count |
| `Footer` | `components/layout/Footer.tsx` | Site footer with links, social, newsletter |

### Homepage Sections (render order on `/`)

| # | Component | File | Description |
|---|---|---|---|
| 1 | `HeroSection` | `components/home/HeroSection.tsx` | Hero banner with CTA |
| 2 | `TrustBar` | `components/home/TrustBar.tsx` | Certification & trust badges |
| 3 | `CategoriesSection` | `components/home/CategoriesSection.tsx` | Product category cards |
| 4 | `HowItWorks` | `components/home/HowItWorks.tsx` | 3-step usage guide |
| 5 | `WhyFireKiller` | `components/home/WhyFireKiller.tsx` | Product benefits |
| 6 | `VideoShowcase` | `components/home/VideoShowcase.tsx` | PanSafe celebrity ad (full-width video) |
| 7 | `TestimonialsSection` | `components/home/TestimonialsSection.tsx` | Customer review slideshow |
| 8 | `ExpertArticles` | `components/home/ExpertArticles.tsx` | Featured blog posts |

> **Note:** `FeaturedProducts`, `ClientsSection`, `ProblemStats`, `SocialProof`, `CTASection` exist in `components/home/` but are not currently rendered on the homepage.

### Admin Components

| Component | File | Description |
|---|---|---|
| `BlogEditor` | `app/admin/blogs/BlogEditor.tsx` | Full Markdown editor with toolbar (bold, italic, lists, headings, links, images, code, tables) |
| `DeleteBlogButton` | `app/admin/blogs/DeleteBlogButton.tsx` | Blog post delete confirmation button |

---

## 15. Admin Panel

### Dashboard (`/admin`)

Overview stats: total orders, revenue, products, users.

### Products (`/admin/products`)

- List all products with search
- Create/Edit with all fields (name, slug, SKU, price, GST, stock, description, features, specs, images)
- Image upload support

### Orders (`/admin/orders`)

- List with status filters
- Order detail view
- Status updates
- Shiprocket integration (create shipment, track)

### Blogs (`/admin/blogs`)

- List all posts (published/draft)
- Create/Edit via `BlogEditor.tsx` component
- Markdown toolbar (headings, bold, italic, lists, links, images, code blocks, tables, horizontal rules)
- Live preview toggle
- Cover image, category, read time, excerpt fields

### Other Admin Pages

- **Categories** — CRUD product categories
- **Coupons** — Create/manage discount codes (percentage/fixed, min order, expiry, usage limits)
- **Users** — View all users, roles
- **COD Orders** — Verify cash-on-delivery payments
- **WhatsApp Logs** — View sent WhatsApp notification history

---

## 16. Build & Deployment

### Production Build

```bash
npm run build
# Internally runs: prisma generate && next build
```

### Vercel Deployment

- `.vercel/` folder present — ready for Vercel
- All environment variables must be set in Vercel dashboard
- Edge middleware is compatible (`auth.config.ts` is edge-safe)

### Required Environment Variables for Deployment

See Section 17 below for the complete list.

### Database

- PostgreSQL on **Neon** (cloud)
- Connection pooling via `@prisma/adapter-pg`
- Migrations applied via `npx prisma migrate deploy`

---

## 17. Environment Variables

```bash
# ─── Database ────────────────────────────────────────────
DATABASE_URL="postgresql://user:pass@host:5432/firekiller?schema=public"

# ─── NextAuth ────────────────────────────────────────────
AUTH_SECRET="random-secret-key"
AUTH_TRUST_HOST=true
NEXTAUTH_URL="http://localhost:3000"      # or production URL
NEXTAUTH_SECRET="same-as-AUTH_SECRET"

# ─── Razorpay ────────────────────────────────────────────
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="..."
RAZORPAY_WEBHOOK_SECRET="..."
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."   # Browser-exposed

# ─── Shiprocket ──────────────────────────────────────────
SHIPROCKET_EMAIL="your@email.com"
SHIPROCKET_PASSWORD="your_password"

# ─── Interakt (WhatsApp) ─────────────────────────────────
INTERAKT_API_KEY="your_api_key"

# ─── Email (SMTP) ────────────────────────────────────────
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your@gmail.com"
SMTP_PASS="gmail_app_password"
SMTP_FROM="\"FireKiller\" <your@gmail.com>"
```

---

## 18. Known Conventions & Gotchas

### Tailwind v4

- **DO:** Use `@theme` directive in `globals.css` for color/font tokens
- **DO:** Use `bg-linear-to-br` for gradients (NOT `bg-gradient-to-br`)
- **DO:** Use `@plugin "@tailwindcss/typography"` in CSS (no JS config)
- **DON'T:** Use a `tailwind.config.js` — it doesn't exist

### Styling Conventions

- Rounded corners: `rounded-2xl` / `rounded-3xl`
- Pill buttons: `rounded-full`
- Shadows: `shadow-sm` to `shadow-lg`, colored `shadow-primary/20`
- Motion: `framer-motion` `motion.div` with `whileInView` for scroll reveals
- Hover: `hover:bg-primary-dark`, `hover:shadow-lg`, `hover:-translate-y-1`

### Product Page (`/shop/[slug]`)

- Features shown as **vertical bullet list** in a "Features" tab (NOT horizontal pills, NOT accordion)
- Three tabs below product info: **Features** (default) → Specifications → Reviews
- Price displayed **above** the quantity/Add to Cart section
- Product demo videos rendered as `<video>` elements (local MP4, NOT YouTube)
- Pack selector: horizontal scroll of related products in the same product line

### Blog Editor

- Uses a **custom markdown toolbar** (NOT a rich text editor)
- Content stored as raw Markdown in the database
- Blog articles rendered with `.prose-blog` class (Lora serif font, Medium-style)
- No auto-format feature — plain markdown editing only

### Auth Split

- `auth.config.ts` → Edge-safe (NO Prisma, NO bcrypt) — used by middleware
- `auth.ts` → Node.js only (Prisma + bcrypt) — used by API routes
- Always use `getCurrentUser()` / `requireAuth()` / `requireAdmin()` from `auth-utils.ts`

### CEO & Branding

- CEO photo: `/images/brand/CEO.jpeg`
- About page shows CEO (Shaikh Sir) first, then team info
- Brand parent company: OustFire
- PanSafe has a patent section on the About page

---

## 19. Recent Changes Log

### Session: March 2026

**Completed changes (in order):**

1. ✅ Footer — added informational links (How It Works, FAQs, Vendor Enquiry)
2. ✅ FAQs page — created `/faqs` with accordion UI
3. ✅ Blog categories — added category filter to blog listing
4. ✅ Blog admin CRUD — full create/edit/delete with BlogEditor.tsx
5. ✅ About Us — added CEO photo (Shaikh Sir), team info, PanSafe patent
6. ✅ Pricing display — show MRP with strikethrough + discount badge
7. ✅ Reviews — testimonial slideshow on homepage
8. ✅ PanSafe patent — dedicated section on About page
9. ✅ Expert articles — blog posts section on homepage
10. ✅ Medium-style blog — serif typography, author bylines, read time
11. ✅ Product page UI refresh — curvy corners, pill features, minimalist
12. ✅ Product demo videos — local MP4 files (FireKiller d1/d2, PanSafe d1/d2/advt)
13. ✅ CEO photo — added to About Us page (`CEO.jpeg`)
14. ✅ Homepage VideoShowcase — PanSafe celebrity ad, light background, full-width
15. ✅ Product features — reverted to vertical bullet list in Features tab (below product info)
16. ✅ Blog editor — auto-format feature removed (reverted)

---

## 20. System Architecture Diagram

See the Mermaid diagram rendered alongside this document. The architecture follows this pattern:

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│  Next.js App Router (React 19, Tailwind v4, Framer Motion)     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────────┐│
│  │ Storefront│ │ Blog     │ │ User     │ │ Admin Dashboard    ││
│  │ /shop/*   │ │ /blog/*  │ │ /account │ │ /admin/*           ││
│  └──────────┘ └──────────┘ │ /cart     │ └────────────────────┘│
│                             │ /checkout │                       │
│                             └──────────┘                       │
├─────────────────────────────────────────────────────────────────┤
│                 MIDDLEWARE (Edge Runtime)                        │
│  auth.config.ts → Route protection, role checking               │
├─────────────────────────────────────────────────────────────────┤
│                   API LAYER (/api/*)                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────┐ ┌────────────┐ │
│  │ Auth    │ │ Products│ │ Orders  │ │ Blog │ │ Admin APIs │ │
│  │ NextAuth│ │ CRUD    │ │ Cart    │ │ CRUD │ │ Products   │ │
│  │ Register│ │ Search  │ │ Pay     │ │Scrape│ │ Orders     │ │
│  └─────────┘ └─────────┘ └─────────┘ └──────┘ │ Categories │ │
│                                                 │ Coupons    │ │
│                                                 └────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                     SERVICE LAYER (src/lib/)                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │ auth.ts  │ │ db.ts    │ │email.ts  │ │ scraper.ts       │  │
│  │ Prisma + │ │ Prisma   │ │Nodemailer│ │ RSS feed parser  │  │
│  │ Bcrypt   │ │ Singleton│ │ SMTP     │ └──────────────────┘  │
│  └──────────┘ └──────────┘ └──────────┘                        │
├─────────────────────────────────────────────────────────────────┤
│                   EXTERNAL SERVICES                             │
│  ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │ Neon     │ │ Razorpay  │ │Shiprocket│ │ Interakt         │ │
│  │PostgreSQL│ │ Payments  │ │ Shipping │ │ WhatsApp         │ │
│  └──────────┘ └───────────┘ └──────────┘ └──────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```
