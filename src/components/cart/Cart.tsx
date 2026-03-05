import React from 'react';
import { Link } from 'react-router-dom';
import CartItem from './CartItem';
import { useCart } from '../../contexts/CartContext';

const Cart: React.FC = () => {
  const { cart, getCartTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-12 max-w-md w-full">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
          <Link
            to="/products"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors duration-200"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const total = getCartTotal();
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-500 mt-1">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:text-red-700 font-medium border border-red-200 hover:border-red-400 px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
          {cart.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-6 h-fit space-y-4 sticky top-6">
          <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

          <div className="space-y-2 text-sm text-gray-600">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className="truncate pr-2 max-w-[160px]">
                  {item.title} <span className="text-gray-400">×{item.quantity}</span>
                </span>
                <span className="font-medium text-gray-800 whitespace-nowrap">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-indigo-600">${total.toFixed(2)}</span>
          </div>

          <button
            onClick={() => alert('Checkout functionality coming soon!')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
          >
            Proceed to Checkout
          </button>

          <Link
            to="/products"
            className="block text-center text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;