# 🛍️ EShop — Authentication-Based E-Commerce Dashboard

A fully responsive e-commerce web application built without a backend. Features authentication, session management, product browsing, cart management, dummy checkout with invoice, and profile editing — all powered by `localStorage` and the Fake Store API.

---

## 🚀 Tech Stack

<p align="left">
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/React_Router_v7-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router" />
  <img src="https://img.shields.io/badge/Lucide_React-F56565?style=for-the-badge&logo=lucide&logoColor=white" alt="Lucide React" />
</p>

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19 | UI framework |
| **TypeScript** | 5 | Type safety |
| **Vite** | 6 | Build tool & dev server |
| **Tailwind CSS** | v4 | Utility-first styling |
| **React Router** | v7 | Client-side routing |
| **Lucide React** | 0.263.1 | Icon library |
| **Fake Store API** | — | Product data source |

---

## ✨ Features

- 🔐 **Register & Login** — `localStorage`-based auth with validation and duplicate-email detection
- ⏱️ **Session Timer** — Auto-logout after 5 minutes with a live countdown in the navbar
- 🏠 **Protected Routes** — All dashboard routes require an authenticated session
- 📦 **Product Listing** — Responsive grid with loading skeletons and error handling via Fake Store API
- 🛒 **Cart Management** — Add, remove, update quantities, per-user cart persisted to `localStorage`
- 💳 **Dummy Checkout** — 3-step flow: Shipping Address → Payment Details → Invoice with unique Order ID
- 👤 **User Profile** — View and edit name, email, and password
- 📱 **Fully Responsive** — Optimised for mobile, tablet, and desktop
- 🌑 **Dark Luxury Theme** — Slate/charcoal palette with amber gold accents

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── auth/          # Login, Register, ProtectedRoute
│   ├── cart/          # CartItem component
│   ├── layout/        # Layout wrapper and Navbar
│   ├── products/      # ProductCard and ProductList
│   └── profile/       # Profile view/edit
├── contexts/          # AuthContext and CartContext
├── hooks/             # useAuth, useCart, useProducts
├── pages/             # Dashboard, Products, CartPage, CheckoutPage, Profile
├── types/             # Shared TypeScript interfaces
├── App.tsx
└── main.tsx
```

---

## ⚙️ Setup & Installation

### Prerequisites

- Node.js 18+
- npm 9+

### Getting Started

**1. Clone the repository**

```bash
git clone https://github.com/your-username/ecommerce-dashboard.git
cd ecommerce-dashboard
```

**2. Install dependencies**

```bash
npm install
```

**3. Start the dev server**

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔐 Authentication Flow

Authentication is entirely client-side using `localStorage`.

- **Register** — Stores users in a `users` array in `localStorage`. Prevents duplicate email addresses.
- **Login** — Matches credentials against stored users, creates a session with a timestamp, and starts a 5-minute countdown timer.
- **Session Management** — On page load, the app checks the elapsed time against the stored session start. If the session is still valid, the user is restored automatically; otherwise they are logged out.
- **Protected Routes** — A `ProtectedRoute` wrapper redirects unauthenticated users to `/login`.

---

## 🛒 Cart Management

Cart state is managed via `CartContext` and persisted to `localStorage` under a user-specific key, so each user maintains their own separate cart.

Key behaviours:
- Adding a product already in the cart increases its quantity instead of creating a duplicate entry.
- Setting quantity to zero removes the item automatically.
- Cart total, subtotal, and item count are derived from state on the fly.

---

## 💳 Checkout Flow

The checkout is a 3-step wizard:

1. **Shipping Address** — Collects full name, phone, street, city, state, ZIP, and country. All fields are required.
2. **Payment Details** — Accepts any dummy 16-digit card number (auto-formatted as `0000 1111 2222 3333`). Expiry auto-inserts the `/` separator.
3. **Invoice** — Displays a full order summary with a generated Order ID (e.g. `ORD-M2K4X9-AB3F`), itemised cart snapshot, 8% tax, and grand total.

> The cart is cleared on order placement. The invoice uses a snapshot of cart contents so it remains populated after clearing.

---

## 📦 Product Data

Products are fetched from the [Fake Store API](https://fakestoreapi.com/products) via a `useProducts` custom hook. The hook manages loading, error, and refetch states. While loading, **8 skeleton cards** are displayed. On error, a retry button is shown.

---

## 🗂️ Key Types

The app uses shared TypeScript interfaces for `User`, `Product`, `CartItem`, `AuthContextType`, and `CartContextType`, all defined in `src/types/index.ts`.

---

## 🚦 Routes

| Path | Component | Protected |
|---|---|---|
| `/login` | Login | ❌ |
| `/register` | Register | ❌ |
| `/dashboard` | Dashboard | ✅ |
| `/products` | Products | ✅ |
| `/cart` | CartPage | ✅ |
| `/checkout` | CheckoutPage | ✅ |
| `/profile` | Profile | ✅ |

All unmatched routes redirect to `/dashboard`.

---

## 🏗️ Build for Production

```bash
npm run build
```

Output goes to `dist/`. Preview the production build locally:

```bash
npm run preview
```

---

## 🌐 Deploy

### Vercel

Connect your GitHub repo at [vercel.com](https://vercel.com) — Vite is auto-detected. Add a `vercel.json` at the root to ensure React Router handles page refreshes:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

### Netlify

Drag and drop the `dist/` folder at [netlify.com/drop](https://app.netlify.com/drop), or deploy via CLI. Add a `public/_redirects` file for client-side routing:

```
/*  /index.html  200
```

---

## ⚠️ Known Limitations

- No real backend — all data lives in `localStorage`
- Passwords are stored in plain text (demo/interview purposes only)
- Session resets on hard page refresh if the 5-minute window has already passed
- Checkout is simulated — no real payment processing

---

## 📄 License

Built as a React interview practical assignment.
