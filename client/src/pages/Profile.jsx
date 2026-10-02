import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Phone, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const Profile = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-ivory">
        My Account & <span className="gold-gradient-text">Orders</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Account Details Box */}
        <div className="bg-brand-card border border-brand-border/80 p-6 rounded-3xl space-y-4 h-fit">
          <div className="flex items-center space-x-3 border-b border-brand-border/60 pb-4">
            <div className="w-12 h-12 rounded-full bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-brand-ivory">{user?.name}</h2>
              <span className="text-[10px] text-brand-gold uppercase tracking-wider font-semibold">
                Customer Profile
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-brand-muted">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-brand-gold" />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-brand-gold" />
              <span>{user?.phone || 'No phone added'}</span>
            </div>
          </div>
        </div>

        {/* Previous Orders History */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="font-serif text-xl font-bold text-brand-ivory flex items-center justify-between">
            <span>Order History</span>
            <span className="text-xs text-brand-muted font-normal">{orders.length} orders placed</span>
          </h2>

          {loading ? (
            <div className="text-center py-10 text-brand-muted text-xs">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="bg-brand-card/60 border border-brand-border p-8 rounded-3xl text-center space-y-3">
              <p className="text-brand-ivory font-serif text-base">You haven't placed any orders yet.</p>
              <Link to="/menu" className="inline-block text-xs text-brand-gold hover:underline font-bold">
                Browse Restaurant Menu
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-brand-card border border-brand-border/80 rounded-2xl p-5 space-y-3 hover:border-brand-gold/40 transition"
                >
                  <div className="flex items-center justify-between border-b border-brand-border/60 pb-3 text-xs">
                    <div>
                      <span className="font-mono font-bold text-brand-gold">
                        #{order._id.substring(order._id.length - 8)}
                      </span>
                      <span className="text-brand-muted block text-[10px]">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-600/40'
                          : order.orderStatus === 'Cancelled'
                          ? 'bg-rose-950 text-rose-400 border border-rose-600/40'
                          : 'bg-amber-950 text-amber-400 border border-amber-600/40'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  {/* Items summary */}
                  <div className="space-y-1 text-xs">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-brand-ivory">
                        <span>
                          {item.productName} ({item.variantName}) x {item.quantity}
                        </span>
                        <span className="font-semibold">₹{item.totalPrice}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-brand-border/60 flex items-center justify-between text-xs">
                    <span className="font-bold text-brand-ivory">Total Amount: ₹{order.totalAmount}</span>
                    <Link
                      to={`/order-confirmation/${order._id}`}
                      className="text-brand-gold hover:underline flex items-center space-x-1 font-semibold"
                    >
                      <span>Track Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
