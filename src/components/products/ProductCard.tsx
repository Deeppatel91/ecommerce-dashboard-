import React, { useState } from 'react';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { ShoppingBag, Star, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, cart } = useCart();
  const [added, setAdded] = useState(false);

  const isInCart = cart.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group relative bg-slate-900/80 border border-slate-800 hover:border-amber-500/30 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-1 flex flex-col">
      
      {/* Image area */}
      <div className="relative h-52 bg-white/5 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category badge */}
        <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm border border-slate-700 text-slate-400 text-xs font-medium px-2.5 py-1 rounded-full capitalize">
          {product.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-slate-200 line-clamp-2 mb-2 leading-relaxed">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                className={i < Math.round(product.rating.rate) ? 'text-amber-400 fill-amber-400' : 'text-slate-700 fill-slate-700'}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500">
            {product.rating.rate} ({product.rating.count})
          </span>
        </div>

        {/* Price + Button */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-2xl font-bold text-white">
            ${product.price.toFixed(2)}
          </span>

          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              added || isInCart
                ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            {added ? (
              <>
                <Check size={14} />
                Added
              </>
            ) : isInCart ? (
              <>
                <Check size={14} />
                In Cart
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;