import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, User as UserIcon, Menu, X, Search, UtensilsCrossed, ShieldAlert, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-brand-dark/90 backdrop-blur-md border-b border-brand-border/60 shadow-xl py-3'
          : 'bg-gradient-to-b from-brand-dark/90 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-gold to-brand-goldHover flex items-center justify-center shadow-gold group-hover:scale-105 transition">
              <UtensilsCrossed className="w-5 h-5 text-brand-dark" />
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight gold-gradient-text">
                Draksha
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-brand-gold/80 font-medium">
                Dessert & Café
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors relative py-1 ${
                    isActive ? 'text-brand-gold' : 'text-brand-ivory/80 hover:text-brand-gold'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-gold to-brand-goldLight rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Controls */}
          <div className="flex items-center space-x-4">
            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative">
              <input
                type="text"
                placeholder="Search waffles, shakes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-brand-card/80 border border-brand-border/80 focus:border-brand-gold/80 text-brand-ivory text-xs rounded-full py-2 pl-4 pr-9 w-44 focus:w-60 transition-all outline-none placeholder:text-brand-muted"
              />
              <button type="submit" className="absolute right-3 text-brand-muted hover:text-brand-gold">
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 text-brand-ivory hover:text-brand-gold transition-colors group"
              title="View Cart"
            >
              <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-gold text-brand-dark font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-gold animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User / Admin Auth dropdown / Button */}
            {user ? (
              <div className="flex items-center space-x-3">
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1.5 bg-brand-gold/15 border border-brand-gold/40 hover:bg-brand-gold/25 text-brand-gold text-xs font-semibold px-3 py-1.5 rounded-full transition shadow-sm"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Admin Panel</span>
                  </Link>
                ) : (
                  <Link
                    to="/profile"
                    className="flex items-center space-x-1.5 text-xs text-brand-ivory hover:text-brand-gold px-3 py-1.5 rounded-full bg-brand-card/80 border border-brand-border/60 transition"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-brand-gold" />
                    <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-brand-muted hover:text-rose-400 p-2 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold bg-gradient-to-r from-brand-gold to-brand-goldHover hover:from-brand-goldHover hover:to-brand-gold text-brand-dark px-4 py-2 rounded-full transition shadow-gold"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-brand-ivory hover:text-brand-gold focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-brand-card/95 border-b border-brand-border/80 px-4 pt-4 pb-6 mt-3 backdrop-blur-xl shadow-2xl animate-fadeIn">
          <form onSubmit={handleSearchSubmit} className="flex items-center relative mb-4">
            <input
              type="text"
              placeholder="Search waffles, shakes, nuggets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-dark border border-brand-border text-brand-ivory text-sm rounded-xl py-2.5 pl-4 pr-10 outline-none"
            />
            <button type="submit" className="absolute right-3 text-brand-gold">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium py-2 px-3 rounded-lg transition ${
                  location.pathname === link.path
                    ? 'bg-brand-gold/15 text-brand-gold font-semibold'
                    : 'text-brand-ivory/90 hover:bg-brand-dark/50'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <hr className="border-brand-border/60 my-2" />

            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 text-sm text-brand-ivory py-2 px-3"
                >
                  <UserIcon className="w-4 h-4 text-brand-gold" />
                  <span>My Profile & Orders ({user.name})</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-sm text-brand-gold py-2 px-3 font-semibold bg-brand-gold/10 rounded-lg"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-sm text-rose-400 py-2 px-3 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="flex space-x-3 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center bg-brand-gold text-brand-dark font-bold text-sm py-2.5 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center bg-brand-dark border border-brand-border text-brand-ivory font-semibold text-sm py-2.5 rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
