# 🛍️ LinkStore - Premium Multi-Vendor Marketplace

![LinkStore Hero](C:\Users\Talha\.gemini\antigravity\brain\1e7eabc6-a91d-4550-923f-4d487aa3cb95\linkstore_hero_1774610726025.png)

LinkStore is a high-end, multi-vendor e-commerce platform built with a modern tech stack. It features a sophisticated "Nexus Activation" luxury UI, comprehensive dashboards for Admins and Vendors, and a seamless shopping experience for customers.

---

## 🚀 Key Features

### 👤 Customer Experience
- **Premium Storefront**: High-contrast, minimalist design with smooth animations.
- **Smart Search & Filter**: Easily find products by category, price, and ratings.
- **Wishlist & Cart**: Persistent shopping state with Redux.
- **Secure Checkout**: Integrated with **Stripe** for seamless payments.
- **Order Tracking**: Real-time status updates and order history.

### 🏪 Vendor Dashboard
- **Store Management**: Customize store profiles and branding.
- **Product Inventory**: Advanced bulk product assignment and warehouse capacity enforcement.
- **Financial Analytics**: Track earnings, commissions, and outstanding COD balances.
- **AI-Powered**: Generate SEO-optimized product descriptions using Gemini AI.

### 🛡️ Admin Suite
- **Marketplace Overview**: Global analytics and vendor governance.
- **Security Logs**: Monitor user activity and system health.
- **System Settings**: Configure global marketplace parameters and email templates.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, TypeScript)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) + [Redux Persist](https://github.com/rt2zz/redux-persist)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **AI Integration**: [Google Gemini AI](https://ai.google.dev/) (via `@google/generative-ai`)
- **Email**: [Resend](https://resend.com/) & [Nodemailer](https://nodemailer.com/)
- **Payments**: [Stripe](https://stripe.com/) & [PayPal](https://www.paypal.com/)

---

## 📡 API Reference

### 🔓 Public Endpoints (`/api/public`)
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/products` | `GET` | Fetch all active products |
| `/products/:id` | `GET` | Get product details |
| `/stores` | `GET` | List all vetted vendor stores |
| `/categories` | `GET` | Fetch marketplace categories |
| `/reviews/:productId` | `GET` | Get reviews for a product |

### 🔐 User & Auth (`/api/auth`, `/api/user`)
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/auth/register` | `POST` | Create a new user account |
| `/auth/login` | `POST` | Authenticate and get JWT cookie |
| `/user/profile` | `GET` | Get current user's profile |
| `/user/orders` | `GET` | Fetch user's order history |
| `/stripe/create-session`| `POST` | Initialize Stripe checkout |

### 🏪 Vendor Routes (`/api/vendor`)
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/products/create` | `POST` | List a new product |
| `/orders/manage` | `GET` | View orders placed for vendor's products |
| `/stats/overview` | `GET` | Fetch earnings and sales statistics |
| `/ai/generate-desc` | `POST` | Generate AI product descriptions |
| `/warehouses` | `GET/POST`| Manage storage locations and capacity |

### 🛡️ Admin Routes (`/api/admin`)
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/users/manage` | `GET` | List and moderate all users |
| `/vendors/verify` | `PUT` | Approve/Reject vendor applications |
| `/stats/global` | `GET` | Total marketplace revenue and growth |
| `/logs/activity` | `GET` | View system and security logs |

---

## 🧠 Core Business Logic

### 💳 COD Commission Billing
LinkStore implements a unique automated billing system for Cash on Delivery (COD) orders:
- **Tracking**: When a COD order is placed, the platform's commission is tracked as `outstandingCommission` in the vendor's profile.
- **Automation**: An hourly cron job (`backend/server.js`) scans for vendors with debt and generates automated email invoices via Resend/Nodemailer.
- **Enforcement**: Vendors must settle their commission balance within a defined grace period to maintain store visibility.

### 📦 Order Restocking Logic
To ensure inventory accuracy:
- **Cancellation**: When an order is cancelled, the system automatically restores stock levels to the respective vendor's inventory.
- **Validation**: Restocking logic is integrated into the multi-vendor status engine to prevent data inconsistencies in mixed-vendor orders.

### 🏗️ Warehouse Capacity Management
- **Enforcement**: Vendors cannot assign products to a warehouse if the total volume/item count exceeds the defined `maxCapacity`.
- **Alerts**: Real-time validation occurs during inventory adjustments and bulk product listings.

---

## 📂 Project Structure

```text
linkstore/
├── frontend/           # Next.js Application
│   ├── src/app/        # Role-based App Router groups ((admin), (vendor), etc.)
│   ├── src/components/ # Atomic design components (Cards, Modals, Nav)
│   └── src/redux/      # State management (slices for Cart, Wishlist, Auth)
├── backend/            # Express API Server
│   ├── routes/         # Modular controllers (index.js mounts all modules)
│   ├── middleware/     # Auth (protect), Rate-Limit (apiLimiter), etc.
│   └── lib/            # Models (models.js), DB (db.js), Mailer (mailer.js)
├── data/               # Seed data and static assets
└── .env                # Global configuration
```

---

## 🛡️ Security & Performance

- **Rate Limiting**: `express-rate-limit` prevents brute-force attacks on API routes.
- **Security Headers**: `helmet` is used to secure Express apps by setting various HTTP headers.
- **State Persistence**: Redux state is persisted across sessions using `redux-persist` for a seamless UX.
- **Anti-Caching**: Custom middleware on `/api` routes ensures dynamic data (like stock levels) is never stale.


---

## 🗄️ Database Schema

LinkStore uses a flexible MongoDB schema designed for scalability:

- **Users**: Handles authentication for Customers, Vendors, and Admins. Stores profiles, addresses, and multi-factor preferences.
- **Vendors**: Tracks store-specific data, including verification status, `outstandingCommission` for COD orders, and banking info for payouts.
- **Products**: Contains detailed item metadata, pricing, categorical associations, and relationship to the originating Vendor.
- **Orders**: A complex model handling multi-vendor line items, real-time status tracking (Pending → Processing → Shipped), and payment metadata.
- **Reviews**: Linked to both Users and Products, featuring a verification flag for "Confirmed Purchases".
- **Warehouses**: Manages storage locations with `maxCapacity` triggers for inventory safety.

---

## ⚙️ Setup & Installation

1. **Install Dependencies**: `npm install` (Root handles both frontend and backend)
2. **Setup .env**: Use the keys listed in the root `.env.example` (or the implementation plan).
3. **Run Dev Mode**: `npm run dev` (Starts backend on `:5000` and frontend on `:3000`).

---
*Created with ❤️ by the LinkStore Team.*
