<div align="center">

# 🛍️ EShop

### Authentication-Based E-Commerce Dashboard

A fully responsive e-commerce web app — featuring auth, session management, product browsing, cart, checkout & invoicing — all without a backend.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Site-F59E0B?style=for-the-badge)](https://ecommerce-dashboard-pig5.vercel.app/login)

</div>

---

## 🚀 Tech Stack

<div align="center">

[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![React Router](https://img.shields.io/badge/React_Router_v7-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com)
[![Lucide](https://img.shields.io/badge/Lucide_React-F97316?style=for-the-badge&logo=lucide&logoColor=white)](https://lucide.dev)

</div>

| Technology | Version | Role |
|:---|:---:|:---|
| **React** | 19 | UI framework |
| **TypeScript** | 5 | Type safety |
| **Vite** | 6 | Build tool & dev server |
| **Tailwind CSS** | v4 | Utility-first styling |
| **React Router** | v7 | Client-side routing |
| **Lucide React** | 0.263.1 | Icon library |
| **Fake Store API** | — | Product data source |

---

## ✨ Features

| | Feature | Description |
|:---:|:---|:---|
| 🔐 | **Register & Login** | `localStorage`-based auth with validation and duplicate-email detection |
| ⏱️ | **Session Timer** | Auto-logout after 5 minutes with a live countdown in the navbar |
| 🏠 | **Protected Routes** | All dashboard routes require an authenticated session |
| 📦 | **Product Listing** | Responsive grid with loading skeletons and error handling |
| 🛒 | **Cart Management** | Add, remove, update quantities — cart persisted per user |
| 💳 | **Dummy Checkout** | 3-step flow: Address → Payment → Invoice with unique Order ID |
| 👤 | **User Profile** | View and edit name, email, and password |
| 📱 | **Fully Responsive** | Optimised for mobile, tablet, and desktop |
| 🌑 | **Dark Luxury Theme** | Slate/charcoal palette with amber gold accents |

---

## 📁 Project Structure

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

## ⚙️ Getting Started

> **Prerequisites:** Node.js 18+ and npm 9+

```bash
# 1. Clone the repo
git clone https://github.com/your-username/ecommerce-dashboard.git
cd ecommerce-dashboard

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) 🎉

---

## 🔐 Authentication Flow

Authentication is entirely client-side using `localStorage`.

> **Register →** Stores users in a `users` array. Prevents duplicate email addresses.
>
> **Login →** Matches credentials, creates a timestamped session, and starts a 5-minute countdown.
>
> **Session →** On page load, elapsed time is checked. Valid sessions restore the user automatically; expired ones log them out.
>
> **Protected Routes →** A `ProtectedRoute` wrapper redirects unauthenticated users to `/login`.

---

## 🛒 Cart Management

Cart state lives in `CartContext` and is persisted to `localStorage` under a **user-specific key** — so every user maintains their own separate cart.

- Adding an existing product **increments its quantity** rather than duplicating it
- Setting quantity to zero **removes the item** automatically
- Total, subtotal, and item count are **derived from state** on the fly

---

## 💳 Checkout Flow

```
[ 1. Shipping Address ] ──► [ 2. Payment Details ] ──► [ 3. Invoice ]
```

1. **Shipping Address** — Full name, phone, street, city, state, ZIP, country (all required)
2. **Payment Details** — Any 16-digit dummy card, auto-formatted as `0000 1111 2222 3333`
3. **Invoice** — Unique Order ID (e.g. `ORD-M2K4X9-AB3F`), itemised snapshot, 8% tax, grand total

> The cart clears on order placement. The invoice uses a **snapshot** of cart contents captured before clearing, so it stays populated.

---

## 📦 Product Data

Products are fetched from the [Fake Store API](https://fakestoreapi.com/products) via a `useProducts` custom hook that handles loading, error, and refetch states.

- **Loading** → 8 animated skeleton cards
- **Error** → Retry button with error message

---

## 🚦 Routes

```
/login          →  Login page         (public)
/register       →  Register page      (public)
/dashboard      →  Home dashboard     (protected)
/products       →  Product listing    (protected)
/cart           →  Shopping cart      (protected)
/checkout       →  Checkout wizard    (protected)
/profile        →  User profile       (protected)
*               →  Redirect to /dashboard
```

---

## 🏗️ Build & Deploy

```bash
# Production build
npm run build

# Preview build locally
npm run preview
```

### ▲ Deploy to Vercel

Connect your GitHub repo at [vercel.com](https://vercel.com) — Vite is auto-detected. Add a `vercel.json` for SPA routing:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

### ◆ Deploy to Netlify

Drag and drop the `dist/` folder at [netlify.com/drop](https://app.netlify.com/drop). Add `public/_redirects` for SPA routing:

```
/*  /index.html  200
```

---

## ⚠️ Known Limitations

> This is a demo/interview project. Please be aware of the following:

- 🗄️ No real backend — all data lives in `localStorage`
- 🔑 Passwords stored in plain text (demo only — never do this in production)
- ⏳ Session resets on hard refresh if the 5-minute window has passed
- 💳 Checkout is simulated — no real payment processing occurs

---

## 📄 License

Built as a React interview practical assignment.

---

<div align="center">

Made with ❤️ using React + TypeScript + Vite

[![Try It Live](https://img.shields.io/badge/Try_It_Live-ecommerce--dashboard-F59E0B?style=flat-square&logo=vercel&logoColor=white)](https://ecommerce-dashboard-pig5.vercel.app/login)

</div>