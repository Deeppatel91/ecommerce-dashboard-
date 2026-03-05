import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Address {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface CardDetails {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const generateOrderId = () =>
  'ORD-' + Date.now().toString(36).toUpperCase() + '-' +
  Math.random().toString(36).substring(2, 6).toUpperCase();

const formatCard = (val: string) =>
  val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

const formatExpiry = (val: string) => {
  const digits = val.replace(/\D/g, '').slice(0, 4);
  return digits.length >= 3 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits;
};

const maskCard = (num: string) => {
  const digits = num.replace(/\s/g, '');
  return '**** **** **** ' + digits.slice(-4);
};

// ─── Reusable field ───────────────────────────────────────────────────────────
const Field: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  maxLength?: number;
}> = ({ label, value, onChange, placeholder, type = 'text', maxLength }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-slate-300">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className="w-full bg-slate-800/60 border border-slate-700 hover:border-slate-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200"
    />
  </div>
);

// ─── Step bar ─────────────────────────────────────────────────────────────────
const STEPS = ['Address', 'Payment', 'Invoice'];

const StepBar: React.FC<{ current: number }> = ({ current }) => (
  <div className="flex items-center justify-center mb-8">
    {STEPS.map((label, i) => {
      const done   = i < current;
      const active = i === current;
      return (
        <React.Fragment key={label}>
          <div className="flex flex-col items-center gap-1.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              done   ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' :
              active ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/30' :
                       'bg-slate-800 border border-slate-700 text-slate-500'
            }`}>
              {done ? '✓' : i + 1}
            </div>
            <span className={`text-xs font-medium ${
              active ? 'text-amber-400' : done ? 'text-emerald-400' : 'text-slate-500'
            }`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-0.5 w-12 sm:w-20 mx-2 mb-5 rounded-full transition-all duration-500 ${
              done ? 'bg-emerald-500' : 'bg-slate-700'
            }`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const CheckoutPage: React.FC = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep]   = useState(0);
  const [orderId]         = useState(generateOrderId);
  const [orderDate]       = useState(new Date().toLocaleString());
  // Snapshot cart before it gets cleared
  const snapshot          = useRef(cart.map(i => ({ ...i }))).current;

  const [address, setAddress] = useState<Address>({
    fullName: user?.name || '',
    phone: '', street: '', city: '', state: '', zip: '', country: '',
  });

  const [card, setCard] = useState<CardDetails>({
    cardName: user?.name || '',
    cardNumber: '', expiry: '', cvv: '',
  });

  const subtotal   = getCartTotal();
  const tax        = subtotal * 0.08;
  const grandTotal = subtotal + tax;

  // ── Address handlers (stable, no re-mount) ───────────────────────────────
  const setAddr = (key: keyof Address) => (v: string) =>
    setAddress(prev => ({ ...prev, [key]: v }));

  const setCardField = (key: keyof CardDetails) => (v: string) =>
    setCard(prev => ({ ...prev, [key]: v }));

  const handleAddressNext = () => {
    if (Object.values(address).some(v => !v.trim())) {
      alert('Please fill all address fields.');
      return;
    }
    setStep(1);
  };

  const handlePlaceOrder = () => {
    const { cardName, cardNumber, expiry, cvv } = card;
    if (!cardName || !cardNumber || !expiry || !cvv) {
      alert('Please fill all payment fields.');
      return;
    }
    if (cardNumber.replace(/\s/g, '').length < 16) {
      alert('Enter a valid 16-digit card number.');
      return;
    }
    clearCart();
    setStep(2);
  };

  // ── Empty cart guard ──────────────────────────────────────────────────────
  if (cart.length === 0 && step < 2) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-5xl mb-4">🛒</div>
        <h2 className="text-xl font-bold text-white mb-2">Your cart is empty</h2>
        <p className="text-slate-500 text-sm mb-6">Add items before checking out.</p>
        <Link to="/products"
          className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold px-6 py-3 rounded-xl text-sm transition-all">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">

      {/* Page title */}
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl px-6 py-4 flex items-center gap-3">
        <span className="text-lg">💳</span>
        <h1 className="text-xl font-bold text-white">Checkout</h1>
      </div>

      {/* Main card */}
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 sm:p-8">
        <StepBar current={step} />

        {/* ── STEP 0: Address ─────────────────────────────────────────────── */}
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-white">📍 Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Full Name" value={address.fullName}
                  onChange={setAddr('fullName')} placeholder="John Doe" />
              </div>
              <div className="sm:col-span-2">
                <Field label="Phone Number" value={address.phone} type="tel"
                  onChange={setAddr('phone')} placeholder="+1 234 567 8900" />
              </div>
              <div className="sm:col-span-2">
                <Field label="Street Address" value={address.street}
                  onChange={setAddr('street')} placeholder="123 Main Street, Apt 4B" />
              </div>
              <Field label="City" value={address.city}
                onChange={setAddr('city')} placeholder="New York" />
              <Field label="State / Province" value={address.state}
                onChange={setAddr('state')} placeholder="NY" />
              <Field label="ZIP / Postal Code" value={address.zip}
                onChange={setAddr('zip')} placeholder="10001" />
              <Field label="Country" value={address.country}
                onChange={setAddr('country')} placeholder="United States" />
            </div>
            <button
              onClick={handleAddressNext}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/25 hover:-translate-y-0.5 mt-2"
            >
              Continue to Payment →
            </button>
          </div>
        )}

        {/* ── STEP 1: Payment ─────────────────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-white">💳 Payment Details</h2>

            {/* Card preview */}
            <div className="relative h-40 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 p-5 overflow-hidden select-none">
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full translate-x-10 -translate-y-10 blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-x-8 translate-y-8 blur-2xl pointer-events-none" />
              <div className="relative">
                <div className="flex justify-between items-start mb-5">
                  <span className="text-xs text-slate-400 font-medium tracking-widest uppercase">E-Shop Pay</span>
                  <div className="flex">
                    <div className="w-7 h-7 rounded-full bg-amber-500/60" />
                    <div className="w-7 h-7 rounded-full bg-amber-300/40 -ml-3" />
                  </div>
                </div>
                <p className="text-white font-mono text-lg tracking-widest mb-1">
                  {card.cardNumber ? maskCard(card.cardNumber) : '**** **** **** ****'}
                </p>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-400">{card.cardName || 'CARD HOLDER'}</span>
                  <span className="text-xs text-slate-400">{card.expiry || 'MM/YY'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Field label="Name on Card" value={card.cardName}
                onChange={setCardField('cardName')} placeholder="John Doe" />
              <Field
                label="Card Number (any 16 digits)"
                value={card.cardNumber}
                onChange={(v) => setCardField('cardNumber')(formatCard(v))}
                placeholder="0000 1111 2222 3333"
                maxLength={19}
              />
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Expiry (MM/YY)"
                  value={card.expiry}
                  onChange={(v) => setCardField('expiry')(formatExpiry(v))}
                  placeholder="12/27"
                  maxLength={5}
                />
                <Field
                  label="CVV"
                  value={card.cvv}
                  onChange={(v) => setCardField('cvv')(v.replace(/\D/g, '').slice(0, 4))}
                  placeholder="123"
                  type="password"
                  maxLength={4}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(0)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 font-medium text-sm transition-all duration-200"
              >
                ← Back
              </button>
              <button
                onClick={handlePlaceOrder}
                className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/25 hover:-translate-y-0.5"
              >
                Place Order ✓
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Invoice ──────────────────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Success */}
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mb-3 text-3xl">
                ✅
              </div>
              <h2 className="text-2xl font-bold text-white">Order Placed!</h2>
              <p className="text-slate-400 text-sm mt-1">Thank you for your purchase. Here's your invoice.</p>
            </div>

            {/* Invoice */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl overflow-hidden">

              {/* Header */}
              <div className="bg-gradient-to-r from-amber-500/10 to-transparent border-b border-slate-700 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center text-slate-900">
                    🛍️
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Invoice from</p>
                    <p className="text-sm font-bold text-white">E<span className="text-amber-400">Shop</span></p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Order ID</p>
                  <p className="text-sm font-mono font-bold text-amber-400">{orderId}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{orderDate}</p>
                </div>
              </div>

              {/* Bill to / Ship to */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 py-4 border-b border-slate-700">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Bill To</p>
                  <p className="text-sm font-semibold text-white">{address.fullName}</p>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                  <p className="text-xs text-slate-400">{address.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Ship To</p>
                  <p className="text-sm text-slate-300">{address.street}</p>
                  <p className="text-xs text-slate-400">{address.city}, {address.state} {address.zip}</p>
                  <p className="text-xs text-slate-400">{address.country}</p>
                </div>
              </div>

              {/* Payment */}
              <div className="px-6 py-3 border-b border-slate-700 flex items-center gap-2">
                <span className="text-xs text-slate-500">💳</span>
                <span className="text-xs text-slate-400">Paid via</span>
                <span className="text-xs font-medium text-slate-300 font-mono">{maskCard(card.cardNumber)}</span>
              </div>

              {/* Items from snapshot */}
              <div className="px-6 py-4">
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Items</p>
                <div className="space-y-3">
                  {snapshot.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-10 h-10 object-contain bg-white/5 rounded-lg p-1 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-300 line-clamp-1">{item.title}</p>
                        <p className="text-xs text-slate-500">${item.price.toFixed(2)} × {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-white whitespace-nowrap">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="px-6 pb-5 space-y-2 border-t border-slate-700 pt-4">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Shipping</span><span className="text-emerald-400">Free</span>
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Tax (8%)</span><span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-700 mt-2">
                  <span>Total Paid</span>
                  <span className="text-amber-400 text-lg">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-slate-900/50 px-6 py-3 border-t border-slate-700">
                <p className="text-xs text-slate-500 text-center">
                  This is a demo invoice. No real transaction was made. Thank you for using EShop!
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/products"
                className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/25 text-sm">
                🛍️ Continue Shopping
              </Link>
              <Link to="/dashboard"
                className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium py-3 rounded-xl transition-all duration-200 text-sm">
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Mini order summary (steps 0 & 1 only) */}
      {step < 2 && (
        <div className="bg-slate-900/40 border border-slate-700/30 rounded-2xl px-6 py-4">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Order Summary</p>
          <div className="space-y-2">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-slate-400 truncate pr-4 max-w-[240px]">
                  {item.title} <span className="text-slate-600">×{item.quantity}</span>
                </span>
                <span className="text-slate-300 font-medium whitespace-nowrap">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-base font-bold text-white border-t border-slate-700 mt-3 pt-3">
            <span>Total (incl. 8% tax)</span>
            <span className="text-amber-400">${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;