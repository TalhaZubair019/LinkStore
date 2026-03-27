# 🛍️ LinkStore - Premium Multi-Vendor Marketplace

![LinkStore Hero](file:///C:/Users/Talha/.gemini/antigravity/brain/1e7eabc6-a91d-4550-923f-4d487aa3cb95/linkstore_hero_1774610726025.png)

LinkStore is a high-end, multi-vendor e-commerce platform built with a modern tech stack. It features a sophisticated "Nexus Activation" luxury UI, comprehensive dashboards for Admins and Vendors, and a seamless shopping experience for customers.

---

## 🚀 Key Features

### 👤 Customer Experience
- **Premium Storefront**: High-contrast, minimalist design with smooth animations.
- **Smart Search & Filter**: Easily find products by category, price, and ratings.
- **Wishlist & Cart**: Persistent shopping state with Redux.
- **Secure Checkout**: Integrated with **Stripe** for seamless payments.
- **Order Tracking**: Real-time status updates and order history.
- **Reviews & Ratings**: Share feedback on purchased products.

### 🏪 Vendor Dashboard
- **Store Management**: Customize store profiles and branding.
- **Product Inventory**: Advanced bulk product assignment and individual adjustments.
- **Order Fulfillment**: Process orders, print invoices, and update shipping status.
- **Financial Analytics**: Track earnings, commissions, and outstanding COD balances.
- **Automated Billing**: Hourly commission invoice system for COD orders.

### 🛡️ Admin Suite
- **Marketplace Overview**: Global analytics and performance metrics.
- **Vendor Governance**: Approve/reject vendor registrations and manage store statuses.
- **Warehouse Management**: Enforced capacity limits and storage location tracking.
- **System Settings**: Configure global marketplace parameters and email templates.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Authentication**: JWT & HttpOnly Cookies
- **AI Integration**: [Google Gemini AI](https://ai.google.dev/)
- **Email**: [Resend](https://resend.com/) & [Nodemailer](https://nodemailer.com/)
- **Payments**: [Stripe](https://stripe.com/) & [PayPal](https://www.paypal.com/)

---

## 📁 Project Structure

LinkStore is organized as a monorepo for seamless development:

```text
linkstore/
├── frontend/          # Next.js Application (Storefront & Dashboards)
│   ├── src/app/       # App Router Routes (Admin, Vendor, Store, Auth)
│   └── src/components/# UI Components & Shared Logic
├── backend/           # Express API Server
│   ├── routes/        # API Endpoints (Role-based separation)
│   ├── lib/           # Database models, mailer, and utilities
│   └── server.js      # Main server entry point
└── data/              # Static assets and database seeds
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB account (Atlas or local)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/linkstore.git
   cd linkstore
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add the following keys:
   ```env
   # Backend
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   STRIPE_SECRET_KEY=your_stripe_secret
   
   # Frontend
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
   ```

### Running the Application

- **Development Mode**: runs both frontend and backend
  ```bash
  npm run dev
  ```
- **Frontend only**:
  ```bash
  npm run dev:frontend
  ```
- **Backend only**:
  ```bash
  npm run dev:backend
  ```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Created with ❤️ by the LinkStore Team.*
