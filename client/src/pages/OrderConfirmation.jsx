import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Clock, MapPin, ShoppingBag, Utensils, RefreshCw, ChefHat, Bike, HomeIcon } from 'lucide-react';
import api from '../services/api';

export const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    if (!orderId) return;
    try {
      setLoading(true);
      const res = await api.get(`/orders/${orderId}`);
      if (res.data.success) {
        setOrder(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 10000); // Auto refresh status every 10 sec
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-brand-muted">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-brand-ivory">Order Not Found</h2>
        <p className="text-xs text-brand-muted">We could not find an order matching ID #{orderId}.</p>
        <Link to="/menu" className="inline-block text-xs font-bold text-brand-gold hover:underline">
          Back to Menu
        </Link>
      </div>
    );
  }

  const statusSteps = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered'];
  const currentStepIndex = statusSteps.indexOf(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header Banner */}
      <div className="text-center space-y-3 bg-brand-card/90 border border-brand-border/80 p-8 rounded-3xl backdrop-blur-md shadow-2xl">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950/80 border border-emerald-500 flex items-center justify-center text-emerald-400 shadow-lg">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-ivory">
          Order Received!
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted">
          Thank you <span className="text-brand-ivory font-semibold">{order.customerName}</span>. Your order ID is{' '}
          <span className="text-brand-gold font-mono font-bold">#{order._id.substring(order._id.length - 8)}</span>.
        </p>

        <div className="pt-2 inline-flex items-center space-x-2 text-xs text-brand-goldLight bg-brand-gold/10 px-4 py-1.5 rounded-full border border-brand-gold/20">
          <Clock className="w-3.5 h-3.5" />
          <span>Estimated Delivery Time: 30–45 Mins</span>
        </div>
      </div>

      {/* Live Order Status Timeline */}
      <div className="bg-brand-card border border-brand-border/80 p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-brand-ivory">Live Order Status Tracker</h2>
          <button
            onClick={fetchOrder}
            className="flex items-center space-x-1 text-xs text-brand-gold hover:underline"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="relative pt-4">
          <div className="grid grid-cols-6 gap-2 text-center">
            {statusSteps.map((step, idx) => {
              const isPassed = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step} className="flex flex-col items-center space-y-2">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md ${
                      isCurrent
                        ? 'bg-brand-gold text-brand-dark ring-4 ring-brand-gold/30 scale-110 shadow-gold'
                        : isPassed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-brand-dark text-brand-muted border border-brand-border'
                    }`}
                  >
                    {idx === 0 && <Clock className="w-4 h-4" />}
                    {idx === 1 && <CheckCircle2 className="w-4 h-4" />}
                    {idx === 2 && <ChefHat className="w-4 h-4" />}
                    {idx === 3 && <Utensils className="w-4 h-4" />}
                    {idx === 4 && <Bike className="w-4 h-4" />}
                    {idx === 5 && <HomeIcon className="w-4 h-4" />}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-medium hidden sm:block ${
                      isCurrent ? 'text-brand-gold font-bold' : isPassed ? 'text-brand-ivory' : 'text-brand-muted'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 bg-brand-dark/70 rounded-2xl border border-brand-border/60 text-center">
          <span className="text-xs text-brand-muted uppercase tracking-wider block">Current Status</span>
          <span className="font-serif text-lg font-bold gold-gradient-text">{order.orderStatus}</span>
        </div>
      </div>

      {/* Order Details Breakdown */}
      <div className="bg-brand-card border border-brand-border/80 p-6 sm:p-8 rounded-3xl space-y-6">
        <h2 className="font-serif text-xl font-bold text-brand-ivory border-b border-brand-border/60 pb-3">
          Order Summary & Breakdown
        </h2>

        <div className="space-y-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between border-b border-brand-border/40 pb-3 text-xs">
              <div>
                <span className="font-semibold text-brand-ivory block text-sm">{item.productName}</span>
                <span className="text-brand-gold">Size/Option: {item.variantName}</span>
                <span className="text-brand-muted block">Qty: {item.quantity} x ₹{item.unitPrice}</span>
              </div>
              <span className="font-serif text-base font-bold text-brand-ivory">₹{item.totalPrice}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2 pt-2 text-xs">
          <div className="flex justify-between text-brand-muted">
            <span>Subtotal</span>
            <span>₹{order.subtotal}</span>
          </div>
          <div className="flex justify-between text-brand-muted">
            <span>GST Tax</span>
            <span>₹{order.tax}</span>
          </div>
          <div className="flex justify-between text-brand-muted">
            <span>Delivery Fee</span>
            <span>₹{order.deliveryFee}</span>
          </div>
          <div className="border-t border-brand-border/60 pt-3 flex justify-between items-center text-sm font-bold text-brand-ivory">
            <span>Grand Total Amount</span>
            <span className="font-serif text-xl gold-gradient-text">₹{order.totalAmount}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-brand-border/60 text-xs text-brand-muted space-y-1">
          <p className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-brand-gold shrink-0" />
            <span><strong className="text-brand-ivory">Delivery Address:</strong> {order.deliveryAddress}</span>
          </p>
          <p className="flex items-center space-x-2">
            <ShoppingBag className="w-4 h-4 text-brand-gold shrink-0" />
            <span><strong className="text-brand-ivory">Payment Method:</strong> {order.paymentMethod.toUpperCase()} ({order.paymentStatus})</span>
          </p>
        </div>
      </div>
    </div>
  );
};
