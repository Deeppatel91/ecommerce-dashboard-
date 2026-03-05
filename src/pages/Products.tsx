import React from 'react';
import ProductList from '../components/products/ProductList';
import { Package } from 'lucide-react';

const Products: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/20 rounded-xl flex items-center justify-center">
          <Package size={22} className="text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-slate-400 text-sm mt-0.5">Browse our curated collection of premium items</p>
        </div>
      </div>

      <ProductList />
    </div>
  );
};

export default Products;