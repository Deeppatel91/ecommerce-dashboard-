import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import {
  ShoppingBag,
  LayoutDashboard,
  Package,
  User,
  LogOut,
  Menu,
  X,
  Clock,
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout, sessionTimeRemaining } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatTime = (seconds: number | null) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/products', label: 'Products', icon: Package },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const itemCount = getItemCount();
  const timeIsLow = sessionTimeRemaining !== null && sessionTimeRemaining < 60;

  return (
    <>
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-all duration-300">
                <ShoppingBag size={16} className="text-slate-900" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-display">
                E<span className="text-amber-400">Shop</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            {user && (
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(to)
                        ? 'bg-amber-500/20 text-amber-400 shadow-inner'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon size={15} />
                    {label}
                  </Link>
                ))}

                {/* Cart */}
                <Link
                  to="/cart"
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/cart')
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <ShoppingBag size={15} />
                  Cart
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
                      {itemCount}
                    </span>
                  )}
                </Link>
              </div>
            )}

            {/* Right side */}
            {user && (
              <div className="hidden md:flex items-center gap-3">
                {/* Session timer */}
                <div className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full border ${
                  timeIsLow
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  <Clock size={11} />
                  {formatTime(sessionTimeRemaining)}
                </div>

                {/* User pill */}
                <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-3 py-1.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs font-bold text-slate-900">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-slate-300 max-w-[100px] truncate">{user.name}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            {user && (
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {user && mobileOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-4 space-y-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive(to)
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
            <Link
              to="/cart"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive('/cart')
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ShoppingBag size={16} />
              Cart
              {itemCount > 0 && (
                <span className="ml-auto bg-amber-400 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs font-bold text-slate-900">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-slate-300">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 font-medium"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;