import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, Banknote } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

export const Checkout = () => {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const taxRate = 0.05;
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const deliveryFee = 40;
  const grandTotal = Math.round((subtotal + tax + deliveryFee) * 100) / 100;

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!customerName || !customerPhone || !customerEmail || !deliveryAddress) {
      showToast('Please fill out all required contact and delivery fields', 'error');
      return;
    }

    try {
      setIsSubmitting(true);

      const orderPayload = {
        items: cart.map((item) => ({
          productId: item.productId,
          variantName: item.variantName,
          quantity: item.quantity,
        })),
        customerName,
        customerPhone,
        customerEmail,
        deliveryAddress,
        customerNotes,
        paymentMethod,
      };

      const res = await api.post('/orders', orderPayload);

      if (res.data.success) {
        showToast('Order placed successfully!', 'success');
        clearCart();
        navigate(`/order-confirmation/${res.data.data._id}`);
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to submit order. Please try again.';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-ivory">
        Checkout & <span className="gold-gradient-text">Delivery</span>
      </h1>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact & Delivery Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Details Box */}
          <div className="bg-brand-card border border-brand-border/80 p-6 rounded-3xl space-y-4">
            <h2 className="font-serif text-xl font-bold text-brand-ivory flex items-center space-x-2">
              <Truck className="w-5 h-5 text-brand-gold" />
              <span>Delivery Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-brand-muted mb-1 font-medium">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-brand-dark border border-brand-border focus:border-brand-gold text-brand-ivory rounded-xl p-3 outline-none"
                />
              </div>

              <div>
                <label className="block text-brand-muted mb-1 font-medium">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-brand-dark border border-brand-border focus:border-brand-gold text-brand-ivory rounded-xl p-3 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-brand-muted mb-1 font-medium">Email Address *</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-brand-dark border border-brand-border focus:border-brand-gold text-brand-ivory rounded-xl p-3 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-brand-muted mb-1 font-medium">Complete Delivery Address *</label>
                <textarea
                  required
                  rows={3}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Flat/House No., Street Name, Landmark, Area, Pincode"
                  className="w-full bg-brand-dark border border-brand-border focus:border-brand-gold text-brand-ivory rounded-xl p-3 outline-none resize-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-brand-muted mb-1 font-medium">Special Cooking / Delivery Notes (Optional)</label>
                <input
                  type="text"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="e.g. Extra chocolate drizzle, ring bell twice"
                  className="w-full bg-brand-dark border border-brand-border focus:border-brand-gold text-brand-ivory rounded-xl p-3 outline-none"
                />
              </div>
            </div>
          </div>
          </div>

          {/* Payment Method Selection */}
         {/* <div className="bg-brand-card border border-brand-border/80 p-6 rounded-3xl space-y-4">
            <h2 className="font-serif text-xl font-bold text-brand-ivory flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-brand-gold" />
              <span>Select Payment Option</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border cursor-pointer flex items-center space-x-3 transition ${
                  paymentMethod === 'cod'
                    ? 'bg-brand-gold/15 border-brand-gold text-brand-ivory'
                    : 'bg-brand-dark border-brand-border text-brand-muted'
                }`}
              >
                <Banknote className="w-5 h-5 text-brand-gold" />
                <div>
                  <span className="font-bold text-xs block text-brand-ivory">Cash On Delivery</span>
                  <span className="text-[10px] text-brand-muted">Pay cash when food arrives</span>
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod('online')}
                className={`p-4 rounded-2xl border cursor-pointer flex items-center space-x-3 transition ${
                  paymentMethod === 'online'
                    ? 'bg-brand-gold/15 border-brand-gold text-brand-ivory'
                    : 'bg-brand-dark border-brand-border text-brand-muted'
                }`}
              >
                <CreditCard className="w-5 h-5 text-brand-gold" />
                <div>
                  <span className="font-bold text-xs block text-brand-ivory">UPI / Online Payment</span>
                  <span className="text-[10px] text-brand-muted">Instant payment simulation</span>
                </div>
              </label>
            </div>
          </div>
        </div>   */}

        {/* Order Summary & Submit Button */}
        <div className="bg-brand-card border border-brand-border/80 p-6 rounded-3xl space-y-6 h-fit backdrop-blur-md">
          <h2 className="font-serif text-xl font-bold text-brand-ivory border-b border-brand-border/60 pb-3">
            Review Order ({cart.length} items)
          </h2>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={`${item.productId}-${item.variantName}`} className="flex justify-between text-xs">
                <div>
                  <span className="font-semibold text-brand-ivory">{item.productName}</span>
                  <span className="text-brand-muted block text-[10px]">
                    {item.variantName} x {item.quantity}
                  </span>
                </div>
                <span className="font-bold text-brand-ivory">₹{item.unitPrice * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-brand-border/60 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-brand-muted">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-brand-muted">
              <span>GST (5%)</span>
              <span>₹{tax}</span>
            </div>
            <div className="flex justify-between text-brand-muted">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>

            <div className="border-t border-brand-border/60 pt-3 flex justify-between items-center">
              <span className="text-sm font-bold text-brand-ivory">Total Pay</span>
              <span className="font-serif text-2xl font-extrabold gold-gradient-text">₹{grandTotal}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-gold to-brand-goldHover text-brand-dark font-extrabold text-sm shadow-gold hover:scale-[1.01] transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>{isSubmitting ? 'Verifying & Placing Order...' : 'Confirm & Place Order'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
