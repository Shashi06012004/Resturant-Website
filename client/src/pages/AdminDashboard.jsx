import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Users, ShoppingBag, IndianRupee, AlertCircle, ArrowUpRight, TrendingUp } from 'lucide-react';
import api from '../services/api';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/dashboard/stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-16 text-brand-muted text-xs">Loading admin KPIs analytics...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-brand-ivory">Dashboard Overview</h1>
        <p className="text-xs text-brand-muted mt-1">Live metrics and recent activity for Draksha Café</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Revenue */}
        <div className="bg-brand-card border border-brand-border/80 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-brand-muted uppercase tracking-wider">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <span className="font-serif text-2xl font-extrabold text-brand-ivory block">
            ₹{stats?.totalRevenue?.toLocaleString() || 0}
          </span>
          <span className="text-[10px] text-emerald-400 flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>Active orders revenue</span>
          </span>
        </div>

        {/* Total Orders */}
        <div className="bg-brand-card border border-brand-border/80 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-brand-muted uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <span className="font-serif text-2xl font-extrabold text-brand-ivory block">{stats?.totalOrders || 0}</span>
          <span className="text-[10px] text-brand-goldLight">
            {stats?.todayOrdersCount || 0} orders placed today
          </span>
        </div>

        {/* Menu Items */}
        <div className="bg-brand-card border border-brand-border/80 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-brand-muted uppercase tracking-wider">Menu Products</span>
            <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <span className="font-serif text-2xl font-extrabold text-brand-ivory block">{stats?.totalProducts || 0}</span>
          <span className="text-[10px] text-brand-muted">
            {stats?.activeProducts || 0} active ({stats?.outOfStockProducts || 0} unavailable)
          </span>
        </div>

        {/* Customers */}
        <div className="bg-brand-card border border-brand-border/80 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-brand-muted uppercase tracking-wider">Total Customers</span>
            <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <span className="font-serif text-2xl font-extrabold text-brand-ivory block">{stats?.totalCustomers || 0}</span>
          <span className="text-[10px] text-brand-muted">Registered customer accounts</span>
        </div>
      </div>

      {/* Out of Stock Alert Banner if any */}
      {(stats?.outOfStockProducts || 0) > 0 && (
        <div className="p-4 bg-amber-950/40 border border-amber-600/40 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3 text-amber-300 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
            <span>
              <strong>Inventory Alert:</strong> You have {stats?.outOfStockProducts} menu product(s) marked as unavailable.
            </span>
          </div>
          <Link
            to="/admin/products"
            className="text-xs font-bold text-amber-400 hover:underline shrink-0"
          >
            Manage Products
          </Link>
        </div>
      )}

      {/* Recent Orders Table */}
      <div className="bg-brand-card border border-brand-border/80 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-brand-border/60 pb-4">
          <h2 className="font-serif text-lg font-bold text-brand-ivory">Recent Orders</h2>
          <Link to="/admin/orders" className="text-xs text-brand-gold hover:underline flex items-center space-x-1 font-semibold">
            <span>View All Orders</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {!stats?.recentOrders || stats.recentOrders.length === 0 ? (
          <p className="text-xs text-brand-muted py-4">No recent orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-brand-border/60 text-brand-muted uppercase text-[10px]">
                  <th className="py-3 px-2">Order ID</th>
                  <th className="py-3 px-2">Customer</th>
                  <th className="py-3 px-2">Items</th>
                  <th className="py-3 px-2">Total</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/40 text-brand-ivory">
                {stats.recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-brand-dark/50">
                    <td className="py-3 px-2 font-mono font-bold text-brand-gold">
                      #{ord._id.substring(ord._id.length - 8)}
                    </td>
                    <td className="py-3 px-2">{ord.customerName}</td>
                    <td className="py-3 px-2">{ord.items.length} items</td>
                    <td className="py-3 px-2 font-bold">₹{ord.totalAmount}</td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-gold/15 text-brand-gold border border-brand-gold/30">
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-brand-muted">
                      {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
