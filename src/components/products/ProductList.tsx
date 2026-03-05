import React from 'react';
import ProductCard from './ProductCard';
import { useProducts } from '../../hooks/useProducts';
import { RefreshCw, PackageX } from 'lucide-react';

const SkeletonCard = () => (
  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-52 bg-slate-800" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-slate-800 rounded-lg w-3/4" />
      <div className="h-4 bg-slate-800 rounded-lg w-1/2" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-7 bg-slate-800 rounded-lg w-16" />
        <div className="h-9 bg-slate-800 rounded-xl w-20" />
      </div>
    </div>
  </div>
);

const ProductList: React.FC = () => {
  const { products, loading, error, refetch } = useProducts();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-4">
          <PackageX size={28} className="text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">Failed to load products</h3>
        <p className="text-slate-500 text-sm mb-6">{error}</p>
        <button
          onClick={refetch}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold px-5 py-2.5 rounded-xl transition-all duration-200"
        >
          <RefreshCw size={15} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;