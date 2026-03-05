# 🛍️ EShop — Authentication-Based E-Commerce Dashboard

A fully responsive e-commerce web application built with **React + Vite + TypeScript + Tailwind CSS v4**. Features authentication, session management, product browsing, cart management, dummy checkout with invoice, and profile editing — all without a backend.

---

## 🚀 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 6 | Build tool & dev server |
| TypeScript | 5 | Type safety |
| Tailwind CSS | v4 | Utility-first styling |
| React Router | v7 | Client-side routing |
| Lucide React | 0.263.1 | Icons |
| Fake Store API | — | Product data |

---

## ✨ Features

- 🔐 **Register & Login** — localStorage-based auth with validation
- ⏱️ **Session Timer** — Auto-logout after 5 minutes, live countdown in navbar
- 🏠 **Protected Dashboard** — All routes require login
- 📦 **Product Listing** — Responsive grid, loading skeletons, error handling
- 🛒 **Cart Management** — Add, remove, update quantity, subtotals, cart total
- 💳 **Dummy Checkout** — 3-step flow: Address → Payment → Invoice with Order ID
- 👤 **User Profile** — View and edit name, email, password
- 📱 **Fully Responsive** — Mobile, tablet, desktop
- 🌑 **Dark Luxury Theme** — Slate/charcoal + amber gold design system

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── ProtectedRoute.tsx
│   ├── cart/
│   │   └── CartItem.tsx
│   ├── layout/
│   │   ├── Layout.tsx
│   │   └── Navbar.tsx
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   └── ProductList.tsx
│   └── profile/
│       └── Profile.tsx
├── contexts/
│   ├── AuthContext.tsx
│   └── CartContext.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useCart.ts
│   └── useProducts.ts
├── pages/
│   ├── Dashboard.tsx
│   ├── Products.tsx
│   ├── CartPage.tsx
│   ├── CheckoutPage.tsx
│   └── Profile.tsx (via components)
├── types/
│   └── index.ts
├── App.tsx
└── main.tsx
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ecommerce-dashboard.git
cd ecommerce-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Tailwind CSS v4

```bash
npm install tailwindcss @tailwindcss/vite
```

### 4. Configure Vite

Update `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

### 5. Configure CSS

Replace everything in `src/index.css` with:

```css
@import "tailwindcss";
```

> ✅ No `tailwind.config.js` needed with Tailwind v4.

### 6. Install Lucide icons (specific version to avoid JSX type errors)

```bash
npm install lucide-react@0.263.1
```

### 7. Start the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🔐 Authentication Flow

### Register (`/register`)

```tsx
// Stores user in localStorage under key 'users'
const register = async (name: string, email: string, password: string): Promise<boolean> => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  if (users.some((u: User) => u.email === email)) return false; // duplicate check
  const newUser: User = { id: Date.now().toString(), name, email, password };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  return true;
};
```

### Login (`/login`)

```tsx
// Matches email + password, creates session
const login = async (email: string, password: string): Promise<boolean> => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const foundUser = users.find((u: User) => u.email === email && u.password === password);
  if (foundUser) {
    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    localStorage.setItem('sessionStart', Date.now().toString());
    startSessionTimer(SESSION_DURATION); // 5 minutes
    return true;
  }
  return false;
};
```

### Session Management

```tsx
const SESSION_DURATION = 5 * 60 * 1000; // 5 minutes in ms

// On app load, check if saved session is still valid
const elapsed = Date.now() - parseInt(sessionStart);
if (elapsed < SESSION_DURATION) {
  setUser(JSON.parse(savedUser));
  startSessionTimer(SESSION_DURATION - elapsed); // resume remaining time
} else {
  localStorage.removeItem('user');
  localStorage.removeItem('sessionStart');
}
```

### Protected Routes

```tsx
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};
```

---

## 🛒 Cart Management

### CartContext — Key Functions

```tsx
// Add to cart (prevents duplicates — increases quantity instead)
const addToCart = (product: Product) => {
  setCart(prevCart => {
    const existing = prevCart.find(item => item.id === product.id);
    if (existing) {
      return prevCart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    }
    return [...prevCart, { ...product, quantity: 1 }];
  });
};

// Update quantity (removes item if quantity < 1)
const updateQuantity = (productId: number, quantity: number) => {
  if (quantity < 1) { removeFromCart(productId); return; }
  setCart(prevCart =>
    prevCart.map(item => item.id === productId ? { ...item, quantity } : item)
  );
};

// Cart total
const getCartTotal = () =>
  cart.reduce((total, item) => total + item.price * item.quantity, 0);

// Item count (sum of all quantities)
const getItemCount = () =>
  cart.reduce((count, item) => count + item.quantity, 0);
```

### Cart persists per user

```tsx
// Saved under user-specific key so different users have separate carts
localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
```

---

## 💳 Checkout Flow (3 Steps)

### Step 1 — Shipping Address

Collects: Full Name, Phone, Street, City, State, ZIP, Country.

```tsx
const handleAddressNext = () => {
  if (Object.values(address).some(v => !v.trim())) {
    alert('Please fill all address fields.');
    return;
  }
  setStep(1);
};
```

### Step 2 — Payment Details

Accepts any dummy card number (16 digits), auto-formats as `0000 1111 2222 3333`, expiry auto-inserts `/`.

```tsx
// Card number formatter
const formatCard = (val: string) =>
  val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

// Expiry formatter
const formatExpiry = (val: string) => {
  const digits = val.replace(/\D/g, '').slice(0, 4);
  return digits.length >= 3 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits;
};

const handlePlaceOrder = () => {
  if (cardNumber.replace(/\s/g, '').length < 16) {
    alert('Enter a valid 16-digit card number.');
    return;
  }
  clearCart();
  setStep(2);
};
```

### Step 3 — Invoice

Generates a unique Order ID and displays a full invoice summary.

```tsx
// Unique Order ID generator
const generateOrderId = () =>
  'ORD-' + Date.now().toString(36).toUpperCase() + '-' +
  Math.random().toString(36).substring(2, 6).toUpperCase();
// Example: ORD-M2K4X9-AB3F

// Cart snapshot prevents blank invoice after clearCart()
const snapshot = useRef(cart.map(i => ({ ...i }))).current;

// Invoice totals
const subtotal   = getCartTotal();       // sum of all items
const tax        = subtotal * 0.08;      // 8% tax
const grandTotal = subtotal + tax;
```

---

## 📦 Product Listing

Products are fetched from the [Fake Store API](https://fakestoreapi.com/products).

```tsx
// hooks/useProducts.ts
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);
  return { products, loading, error, refetch: fetchProducts };
};
```

Loading state shows **8 skeleton cards**. Error state shows a retry button.

---

## 👤 User Profile

```tsx
const updateUser = (updatedUser: Partial<User>) => {
  if (!user) return;
  const updated = { ...user, ...updatedUser };
  setUser(updated);

  // Update in the users array
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex((u: User) => u.id === user.id);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updatedUser };
    localStorage.setItem('users', JSON.stringify(users));
  }
  localStorage.setItem('user', JSON.stringify(updated));
};
```

---

## 🗂️ Types

```tsx
// src/types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

export interface CartItem extends Product {
  quantity: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  sessionTimeRemaining: number | null;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}
```

---

## 🚦 Routes

```tsx
// App.tsx
<Routes>
  <Route path="/login"    element={<Login />} />
  <Route path="/register" element={<Register />} />

  <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
    <Route index           element={<Navigate to="/dashboard" replace />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="products"  element={<Products />} />
    <Route path="cart"      element={<CartPage />} />
    <Route path="checkout"  element={<CheckoutPage />} />
    <Route path="profile"   element={<Profile />} />
  </Route>

  <Route path="*" element={<Navigate to="/dashboard" replace />} />
</Routes>
```

---

## 🏗️ Build for Production

```bash
npm run build
```

Output goes to `dist/`. Preview locally:

```bash
npm run preview
```

---

## 🌐 Deploy

### Vercel

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo at [vercel.com](https://vercel.com) — Vite is auto-detected.

### Netlify

```bash
npm run build
# drag and drop the dist/ folder at netlify.com/drop
```

Or via CLI:

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

> ⚠️ For both platforms, add a redirect rule so React Router works on page refresh:
>
> **Vercel** — create `vercel.json`:
> ```json
> { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
> ```
>
> **Netlify** — create `public/_redirects`:
> ```
> /*  /index.html  200
> ```

---

## ⚠️ Known Limitations

- No real backend — all data lives in `localStorage`
- Passwords stored in plain text in localStorage (demo only)
- Session resets on hard page refresh if the 5-minute window has passed
- Checkout is dummy — no real payment processing

---

## 📄 License

This project was built as a React interview practical assignment.
