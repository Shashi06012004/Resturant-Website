import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { QuantitySelector } from '../components/QuantitySelector';

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();
  const navigate = useNavigate();

  const taxRate = 0.05; // 5% GST
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const grandTotal = Math.round((subtotal + tax + deliveryFee) * 100) / 100;

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-brand-card border border-brand-border flex items-center justify-center text-brand-gold shadow-gold">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-bold text-brand-ivory">Your Cart is Empty</h2>
          <p className="text-xs sm:text-sm text-brand-muted max-w-sm mx-auto">
            Looks like you haven't added any waffles, shakes, or treats to your cart yet.
          </p>
        </div>
        <Link
          to="/menu"
          className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-gold to-brand-goldHover text-brand-dark font-extrabold text-sm shadow-gold hover:scale-105 transition"
        >
          <span>Explore Restaurant Menu</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-ivory">
          Your Shopping <span className="gold-gradient-text">Cart</span>
        </h1>
        <button
          onClick={clearCart}
          className="text-xs text-rose-400 hover:underline flex items-center space-x-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Item Listing */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={`${item.productId}-${item.variantName}`}
              className="bg-brand-card border border-brand-border/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 transition hover:border-brand-gold/40"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.productImage || 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=400&q=80'}
                  alt={item.productName}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-brand-border shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.foodType === 'veg' ? 'bg-emerald-400' : 'bg-rose-400'
                      }`}
                    />
                    <h3 className="font-serif text-base font-bold text-brand-ivory">{item.productName}</h3>
                  </div>
                  <p className="text-xs text-brand-gold font-medium">Option: {item.variantName}</p>
                  <p className="text-xs text-brand-muted">₹{item.unitPrice} per unit</p>
                </div>
              </div>

              {/* Quantity Controls & Remove */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                <QuantitySelector
                  quantity={item.quantity}
                  onIncrease={() => updateQuantity(item.productId, item.variantName, 1)}
                  onDecrease={() => updateQuantity(item.productId, item.variantName, -1)}
                  size="sm"
                />

                <div className="text-right">
                  <span className="font-serif text-base font-bold text-brand-ivory block">
                    ₹{item.unitPrice * item.quantity}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.productId, item.variantName)}
                    className="text-brand-muted hover:text-rose-400 p-1 text-[10px] transition"
                    title="Remove Item"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <Link
            to="/menu"
            className="inline-flex items-center space-x-1.5 text-xs text-brand-gold hover:underline pt-2 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Order Summary Box */}
        <div className="bg-brand-card border border-brand-border/80 p-6 rounded-3xl space-y-6 h-fit backdrop-blur-md">
          <h2 className="font-serif text-xl font-bold text-brand-ivory border-b border-brand-border/60 pb-3">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between text-brand-muted">
              <span>Subtotal</span>
              <span className="font-semibold text-brand-ivory">₹{subtotal}</span>
            </div>

            <div className="flex items-center justify-between text-brand-muted">
              <span>GST (5%)</span>
              <span className="font-semibold text-brand-ivory">₹{tax}</span>
            </div>

            <div className="flex items-center justify-between text-brand-muted">
              <span>Delivery Fee</span>
              <span className="font-semibold text-brand-ivory">₹{deliveryFee}</span>
            </div>

            <div className="border-t border-brand-border/60 pt-3 flex items-center justify-between">
              <span className="text-sm font-bold text-brand-ivory">Grand Total</span>
              <span className="font-serif text-2xl font-extrabold gold-gradient-text">₹{grandTotal}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-gold to-brand-goldHover text-brand-dark font-extrabold text-sm shadow-gold hover:scale-[1.01] transition flex items-center justify-center space-x-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
