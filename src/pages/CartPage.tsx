import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import CartItem from '../components/cart/CartItem';
import { ShoppingBag, Package, Trash2, ArrowRight } from 'lucide-react';

const CartPage: React.FC = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const total = getCartTotal();
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-slate-800 border border-slate-700 rounded-3xl flex items-center justify-center mb-5">
          <ShoppingBag size={32} className="text-slate-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
        <p className="text-slate-500 mb-8 max-w-sm">Add some products to your cart and they'll show up here.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/25"
        >
          <Package size={16} />
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/20 rounded-xl flex items-center justify-center">
            <ShoppingBag size={22} className="text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Shopping Cart</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} · ${total.toFixed(2)} total
            </p>
          </div>
        </div>
        <button
          onClick={clearCart}
          className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 hover:bg-red-500/10 px-4 py-2 rounded-xl font-medium transition-all duration-200"
        >
          <Trash2 size={14} />
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-700/50 rounded-2xl overflow-hidden divide-y divide-slate-800">
          {cart.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Order summary */}
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 h-fit space-y-5 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold text-white">Order Summary</h2>

          <div className="space-y-2.5">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-slate-400 truncate pr-3 max-w-[160px]">
                  {item.title}
                  <span className="text-slate-600 ml-1">×{item.quantity}</span>
                </span>
                <span className="text-slate-300 font-medium whitespace-nowrap">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-400 text-sm">Subtotal</span>
              <span className="text-white font-semibold">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-400 text-sm">Shipping</span>
              <span className="text-emerald-400 text-sm font-medium">Free</span>
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-800">
              <span className="text-white font-semibold">Total</span>
              <span className="text-2xl font-bold text-amber-400">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5"
          >
            Proceed to Checkout <ArrowRight size={16} />
          </button>

          <Link
            to="/products"
            className="block text-center text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;