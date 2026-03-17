# 🖨️ PrintNest — Modern Print-on-Demand E-Commerce Store

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.3-blue?logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?logo=mongodb)](https://mongoosejs.com)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey?logo=express)](https://expressjs.com)
[![Stripe](https://img.shields.io/badge/Stripe-Payment-blue?logo=stripe)](https://stripe.com)
[![PayPal](https://img.shields.io/badge/PayPal-Payment-blue?logo=paypal)](https://paypal.com)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.11-purple?logo=redux)](https://redux-toolkit.js.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-cyan?logo=tailwindcss)](https://tailwindcss.com)

A professional, full-stack monorepo e-commerce platform for custom print-on-demand products. Featuring a hybrid architecture with a **Next.js 16** frontend and a dedicated **Express.js** backend, integrated with Stripe/PayPal, advanced AI (Llama 4 Scout), and comprehensive admin tools.

---

## ✨ Key Features

### 🛒 E-Commerce & Payments

- **Multi-Gateway Checkout**: Secure payments via **Stripe** (Cards) and **PayPal** (Express Checkout).
- **Product Catalog**: Advanced quick view, comparison tools, and persistent wishlist.
- **Smart Shopping Cart**: Real-time quantity management with **Redux Persist** (LocalStorage sync).
- **Dynamic Categories**: Tailored experiences for T-shirts, Business Cards, Hoodies, and Packaging.
- **Review System**: User-generated ratings and verified purchase comments.

### 🔐 Security & User Management

- **Monorepo Backend**: Dedicated Express server with **Helmet** security, **CORS** protection, and **Express Rate Limiting**.
- **Secure Auth**: JWT-based authentication with HTTP-only cookies and bcrypt password hashing.
- **Role-based Access**: Differentiated views for Admin and Customer accounts.
- **Guest Experience**: Full support for guest checkout with optional account creation.

### 🛠️ High-Performance Admin Panel (`/admin`)

- **Real-time Analytics**: Interactive charts for revenue, order velocity, and top-selling products.
- **Inventory Control**: Comprehensive CRUD operations for products and categories.
- **Order Lifecycle**: End-to-end management from "Processing" to "Delivered".
- **AI Tooling**: Auto-generate SEO-rich descriptions in seconds.
- **Media Center**: Integrated file uploads via **Multer**.

### 🤖 Advanced AI Integration (Groq)

- **Multimodal SEO Generation**: Uses **Meta Llama 4 Scout (17B)** to analyze product images and generate detailed, visual-first descriptions.
- **Semantic SEO**: Default fallback to **Llama 3.3 (70B)** for text-based semantic description generation.
- **Conversion-Focused**: Descriptions follow Google's "Helpful Content" guidelines, focusing on search intent and user benefit.

### 📧 Premium Communication

- **Automated Emails**: HTML-rich order confirmations and status updates via **Nodemailer**.
- **Admin Alerts**: Instant notifications for new orders and low stock alerts.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Detailed Technical Deep Dive](#-detailed-technical-deep-dive)
- [Package Installation](#-package-installation-commands)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Architecture](#-api-architecture)
- [Database & Models](#-database--models)
- [Redux State](#-redux-state)
- [Development Workflow](#-development-workflow)
- [Deployment](#-deployment)

---

## 🛠️ Tech Stack

| Category       | Technology                                        |
| -------------- | ------------------------------------------------- |
| **Frontend**   | Next.js 16.1.6 (App Router), React 19.2.3         |
| **Backend**    | Express.js 4.x (Node.js)                          |
| **Language**   | TypeScript 5.x                                    |
| **Database**   | MongoDB via Mongoose 8.x                          |
| **Payments**   | Stripe API, PayPal API                            |
| **Styling**    | Tailwind CSS 4.x, clsx, tailwind-merge            |
| **Animations** | Framer Motion 12.x                                |
| **State**      | Redux Toolkit, Redux Persist                      |
| **AI Models**  | Llama 4 Scout (Vision), Llama 3.3 (Text) via Groq |
| **Security**   | Helmet, Express Rate Limit, JWT, Bcrypt           |

---

## 🔍 Detailed Technical Deep Dive

### 🏗️ 1. Hybrid Monorepo Architecture

PrintNest has evolved from a unified Next.js app into a sophisticated **full-stack monorepo**, separating concerns for maximum scalability.

- **Frontend (`/frontend`)**: A **Next.js 16** (App Router) powerhouse. It handles the complete user journey, dynamic SEO rendering, and complex client-side interactions.
- **Backend (`/backend`)**: A robust **Express.js** engine. This dedicated server manages the "heavy lifting"—database transactions, payment gateway handshakes, AI orchestration, and secure authentication.
- **Parallel Execution**: Using root-level orchestration, both layers launch concurrently with a single `npm run dev` command, providing a seamless DX (Developer Experience).

### 💳 2. Enterprise-Grade Payment Integrations

The platform integrates the world's leading financial gateways with a "Security-First" approach:

- **Stripe**: Handles global card payments by generating encrypted **Checkout Sessions**. This ensures that sensitive PCI data never touches our servers, drastically reducing security overhead.
- **PayPal**: Integrated via the **Express Checkout API**, offering users a familiar, one-click payment experience using their PayPal balance or linked accounts.
- **Integrity**: Every transaction undergoes server-side validation to prevent price manipulation and ensure order consistency.

### 🤖 3. Next-Gen AI Integration (Llama 4 Scout)

PrintNest leverages state-of-the-art multimodal AI to transform product management:

- **Llama 4 Scout (17B)**: When an image is uploaded, this vision-capable model analyzes the visual data. It identifies specific colors, checkered/floral patterns, and material textures (e.g., "matte finish" vs "glossy").
- **Llama 3.3 (70B)**: Serves as a high-parameter fallback for deep semantic text generation.
- **SEO Powerhouse**: Descriptions aren't just fluff; they are semantically optimized for Google’s **Helpful Content** guidelines, naturally incorporating LSI keywords based on real visual attributes.

### 🔐 4. Hardened Backend Security

Our Express.js backend is guarded by an industry-standard security stack:

- **Helmet.js**: Automatically sets security-related HTTP headers to block XSS, clickjacking, and other common attack vectors.
- **Rate Limiting**: Protects against Brute Force and DDoS attacks by capping the number of requests per IP in a sliding 15-minute window.
- **CORS & CSRF Protection**: Strict origin-sharing policies and **HTTP-only cookies** ensure that user sessions are immune to client-side script theft.

### 🏪 5. Durable State with Redux Persist

We believe shopping should be uninterrupted. By integrating **Redux Persist**:

- **Durability**: The entire Redux state (Cart, Wishlist, Auth) is automatically mirrored to the browser's **LocalStorage**.
- **User Continuity**: A user can add items to their cart on Monday, close their browser, and return on Friday to find their shopping session exactly as they left it.

### 📊 6. Professional Admin Intelligence

The `/admin` dashboard is more than a control panel—it's a business intelligence tool:

- **Real-time Analytics**: Interactive charts (Recharts/Chart.js) visualize daily revenue trends, order velocity (peak shopping hours), and category performance.
- **Sentiment Logic**: The system doesn't just store reviews; it categorizes product sentiment (Good vs. Bad) to help admins make data-driven decisions on inventory.

### 📧 7. Premium Communication Stack

Communication is a cornerstone of the PrintNest experience:

- **Nodemailer (SMTP)**: Configured for high-deliverability via Gmail.
- **Rich HTML Receipts**: Customers receive pixel-perfect receipts featuring product thumbnails, itemized pricing tables, and dynamic tracking links.
- **Admin Alerts**: Instant, automated notifications for every new order to ensure rapid fulfillment.

### 🗄️ 8. Optimized Database Schema (MongoDB)

Our data architecture is built on a high-availability MongoDB cluster using Mongoose:

- **User Model**: Manages secure credentials, saved cards, and administrative privileges.
- **Order Model**: Tracks the full lifecycle of an order, including multi-gateway payment metadata.
- **Product & Review Models**: Linked via relational-style object IDs to provide instant feedback loops between customer reviews and product ratings.

---

## 📦 Package Installation Commands

### Monorepo Setup (Root)

```bash
npm install
```

### Key Production Dependencies

#### Frontend & UI

```bash
# Core
npm install next@16.1.6 react@19.2.3 react-dom@19.2.3
# State & Animations
npm install @reduxjs/toolkit react-redux redux-persist framer-motion
# Styling
npm install lucide-react clsx tailwind-merge
```

#### Backend & API

```bash
# Core Server
npm install express mongoose cors dotenv helmet cookie-parser express-rate-limit
# Payments & Auth
npm install stripe jsonwebtoken bcryptjs node-fetch@2
# Utilities
npm install nodemailer multer
```

#### AI SDK

```bash
npm install @google/generative-ai   # Optional: Google AI integration
```

### Development Tools

```bash
npm install -D nodemon typescript tailwindcss @tailwindcss/postcss eslint
```

---

## 📁 Project Structure

```
printnest/
├── backend/                              # Express.js Server
│   ├── lib/                              # DB Connection & Mongoose Models
│   │   ├── models/                       # User, Product, Order, Review
│   ├── middleware/                       # Auth, Admin, and Upload guards
│   ├── routes/                           # API Modules
│   │   ├── admin/                        # Stats, AI, and management
│   │   ├── public/                       # Storefront data & reviews
│   │   ├── auth.js                       # JWT session handling
│   │   ├── stripe.js                     # Card payments
│   │   ├── paypal.js                     # PayPal Express
│   │   └── upload.js                     # Media handling
│   └── server.js                         # Entry point (Port 5000)
│
├── frontend/                             # Next.js 16 Client
│   ├── src/
│   │   ├── app/                          # App Router (Pages & API Handlers)
│   │   ├── components/                   # Sections (Hero, Blog) & UI Library
│   │   ├── lib/                          # Client-side env & utils
│   │   └── redux/                        # Store, Persistor, and Slices
│   ├── public/                           # Optimized images & assets
│   └── tailwind.config.ts                # Modern styling configuration
│
├── data/                                 # Shared schemas & seed data
├── .env                                  # Unified environment file
├── package.json                          # Orchestration scripts
└── README.md
```

---

## 🚀 Getting Started

### Installation

1. **Clone & Setup**

   ```bash
   git clone <repo-url>
   cd printnest
   npm install
   ```

2. **Environment Configuration**
   Populate the root `.env` (see below).

3. **Launch Monorepo**

   ```bash
   npm run dev
   ```

   - **Frontend**: `http://localhost:3000`
   - **Backend**: `http://localhost:5000`

### Monorepo Scripts

| Command                | Description                            |
| ---------------------- | -------------------------------------- |
| `npm run dev`          | Runs frontend and backend concurrently |
| `npm run dev:frontend` | Runs Next.js only                      |
| `npm run dev:backend`  | Runs Express with Nodemon              |
| `npm run build`        | Compiles Next.js for production        |

---

## 🔐 Environment Variables

One `.env` file in the root directory manages both layers:

```env
# Database
MONGODB_URI=mongodb+srv://...

# Security
JWT_SECRET=your_32_char_secret

# Payments
STRIPE_SECRET_KEY=sk_test_...
PAYPAL_CLIENT_ID=...
PAYPAL_SECRET=...

# AI & Third-Party
GROQ_API_KEY=gsk_...
EMAIL_USER=...
EMAIL_PASS=...

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📡 API Architecture

### Unified Backend Endpoints (`/api`)

| Prefix    | Scope          | Key Features                            |
| --------- | -------------- | --------------------------------------- |
| `/auth`   | Authentication | Signup, Login, Password Hashing         |
| `/public` | Storefront     | Categories, Reviews, Ordering           |
| `/admin`  | Dashboard      | Charts, User Promotion, AI Descriptions |
| `/stripe` | Payments       | Checkout Session Creation               |
| `/paypal` | Payments       | Order Capture & Auth                    |
| `/upload` | Assets         | Product Image Processing                |

---

## 🗄️ Database & Models

### Mongoose Schemas (`backend/lib/models`)

- **User**: Profiles with `isAdmin` flags and `savedCards`.
- **Product**: Catalog items with legacy `id` mapping for frontend compatibility.
- **Order**: Detailed history with `PaymentGateway` metadata.
- **Review**: Star ratings with associated `productId`.

---

## 🏪 Redux State

The frontend uses **Redux Persist** to ensure the shopping experience remains uninterrupted across sessions.

- **Cart Slice**: Handles atomic quantity updates and total calculations.
- **Wishlist Slice**: Manages product IDs with optimized lookups.
- **Auth Slice**: Persists user session state and JWT availability.

---

## 📄 Pages & Routes

### Storefront

- `/` - Dynamic Landing Page
- `/shop` - Infinite-scroll Product Grid
- `/product/[slug]` - Detail + AI Proofing + Reviews
- `/cart` & `/checkout` - Step-based fulfillment flow

### User & Admin

- `/account` - Dashboard, Order tracking, Saved Cards
- `/admin/dashboard` - Visual data via Chart.js/Recharts
- `/admin/products` - AI-assisted Inventory Manager

---

## 🌐 Deployment

### Recommended: Vercel + Railway

- **Frontend**: Deploy `frontend/` to Vercel. Set `NEXT_PUBLIC_API_URL` to your backend.
- **Backend**: Deploy `backend/` to Railway/Render. Ensure CORS allows your Vercel URL.
- **Database**: MongoDB Atlas.

---

**Happy printing!** 🖨️✨
