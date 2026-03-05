import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { getItemCount, getCartTotal } = useCart();

  const stats = [
    {
      name: 'Items in Cart',
      value: getItemCount(),
      emoji: '🛍️',
      color: 'from-amber-500/20 to-amber-600/10',
      border: 'border-amber-500/20',
      badge: getItemCount() > 0 ? 'Active' : 'Empty',
      badgeColor: getItemCount() > 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-400',
    },
    {
      name: 'Cart Total',
      value: `$${getCartTotal().toFixed(2)}`,
      emoji: '💰',
      color: 'from-emerald-500/20 to-emerald-600/10',
      border: 'border-emerald-500/20',
      badge: 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-400',
    },
  ];

  const links = [
    {
      to: '/products',
      emoji: '📦',
      title: 'Browse Products',
      desc: 'Explore our curated collection of premium items',
      gradient: 'from-blue-500/10 to-blue-600/5',
      border: 'border-blue-500/20 hover:border-blue-400/40',
      iconBg: 'bg-blue-500/20',
    },
    {
      to: '/cart',
      emoji: '🛒',
      title: 'View Cart',
      desc: 'Review your selections and proceed to checkout',
      gradient: 'from-amber-500/10 to-amber-600/5',
      border: 'border-amber-500/20 hover:border-amber-400/40',
      iconBg: 'bg-amber-500/20',
    },
    {
      to: '/profile',
      emoji: '👤',
      title: 'Edit Profile',
      desc: 'Update your personal information and preferences',
      gradient: 'from-purple-500/10 to-purple-600/5',
      border: 'border-purple-500/20 hover:border-purple-400/40',
      iconBg: 'bg-purple-500/20',
    },
  ];

  return (
    <div className="space-y-6">

      {/* Welcome hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-3xl p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-amber-400 text-sm">✨</span>
            <span className="text-amber-400 text-sm font-medium tracking-wide uppercase">Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
            Welcome back, <span className="text-amber-400">{user?.name?.split(' ')[0]}</span>!
          </h1>
          <p className="text-slate-400 max-w-lg">
            Manage your shopping experience. Browse products, track your cart, and update your profile all from one place.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 mt-6 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 text-sm"
          >
            Shop Now →
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className={`relative overflow-hidden bg-gradient-to-br ${stat.color} border ${stat.border} rounded-2xl p-6 shadow-lg`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">{stat.name}</p>
                <p className="text-4xl font-bold text-white tracking-tight">{stat.value}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="w-10 h-10 rounded-xl bg-slate-800/60 flex items-center justify-center text-xl">
                  {stat.emoji}
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.badgeColor}`}>
                  {stat.badge}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-lg font-semibold text-slate-300 mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {links.map(({ to, emoji, title, desc, gradient, border, iconBg }) => (
            <Link
              key={to}
              to={to}
              className={`group bg-gradient-to-br ${gradient} border ${border} rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform duration-200`}>
                {emoji}
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              <div className="flex items-center gap-1 mt-4 text-xs font-medium text-slate-500 group-hover:text-slate-300 transition-colors duration-200">
                Go there →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;