import React from 'react';
import { useCart } from '../../contexts/CartContext';
import type { CartItem as CartItemType } from '../../types';
import { Trash2, Plus, Minus } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart();

  return (
    <div className="flex items-center gap-4 p-5 hover:bg-slate-800/30 transition-colors duration-150 group">
      {/* Image */}
      <div className="w-20 h-20 flex-shrink-0 bg-white/5 rounded-xl overflow-hidden border border-slate-700/50">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-contain p-2"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-slate-200 line-clamp-2 mb-1 leading-relaxed">
          {item.title}
        </h3>
        <p className="text-xs text-slate-500 capitalize mb-1">{item.category}</p>
        <p className="text-amber-400 font-bold text-sm">${item.price.toFixed(2)}</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-end gap-3 flex-shrink-0">
        {/* Quantity */}
        <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <Minus size={13} />
          </button>
          <span className="w-9 text-center text-sm font-bold text-white border-x border-slate-700">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <Plus size={13} />
          </button>
        </div>

        {/* Subtotal + remove */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-white">
            ${(item.price * item.quantity).toFixed(2)}
          </span>
          <button
            onClick={() => removeFromCart(item.id)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
            aria-label="Remove"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;