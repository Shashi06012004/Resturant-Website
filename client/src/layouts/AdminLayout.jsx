import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderTree,
  ListTree,
  Utensils,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Store,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Subcategories', path: '/admin/subcategories', icon: ListTree },
    { name: 'Menu Items', path: '/admin/products', icon: Utensils },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#0F0D0C] text-brand-ivory flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-brand-card border-r border-brand-border/80 p-5 justify-between">
        <div className="space-y-8">
          {/* Logo & Header */}
          <Link to="/admin" className="flex items-center space-x-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-gold to-brand-goldHover flex items-center justify-center shadow-gold">
              <Store className="w-5 h-5 text-brand-dark" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold gold-gradient-text">Draksha</span>
              <span className="block text-[9px] uppercase tracking-widest text-brand-gold font-bold">
                Admin SaaS Suite
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-brand-gold text-brand-dark font-bold shadow-gold'
                      : 'text-brand-ivory/80 hover:bg-brand-dark hover:text-brand-gold'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="pt-4 border-t border-brand-border/60 space-y-3">
          <div className="px-2">
            <span className="text-[10px] text-brand-muted uppercase tracking-wider block">Logged in as</span>
            <span className="text-xs font-semibold text-brand-ivory truncate block">{user?.email}</span>
          </div>

          <Link
            to="/"
            target="_blank"
            className="flex items-center space-x-2 text-xs text-brand-gold hover:underline px-2"
          >
            <Store className="w-3.5 h-3.5" />
            <span>View Live Customer Site</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="lg:hidden bg-brand-card border-b border-brand-border/80 px-4 py-3 flex items-center justify-between">
          <Link to="/admin" className="flex items-center space-x-2">
            <Store className="w-5 h-5 text-brand-gold" />
            <span className="font-serif font-bold text-lg gold-gradient-text">Draksha Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-brand-ivory hover:text-brand-gold"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-brand-dark/90 backdrop-blur-md flex">
            <div className="w-64 bg-brand-card border-r border-brand-border p-5 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold gold-gradient-text">Draksha SaaS</span>
                  <button onClick={() => setSidebarOpen(false)} className="text-brand-muted">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                          location.pathname === item.path
                            ? 'bg-brand-gold text-brand-dark font-bold'
                            : 'text-brand-ivory/80 hover:bg-brand-dark'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-rose-400 text-sm font-semibold p-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
