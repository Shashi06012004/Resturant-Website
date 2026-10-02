import React, { useState } from 'react';
import { X, ShoppingBag, Star, Flame, ShieldAlert } from 'lucide-react';
import { VariantSelector } from './VariantSelector';
import { QuantitySelector } from './QuantitySelector';
import { useCart } from '../context/CartContext';

export const ProductModal = ({ product, onClose }) => {
  if (!product) return null;

  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0] : { name: 'Regular', price: 0 }
  );
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!product.isAvailable) return;
    addToCart(product, selectedVariant, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-brand-card border border-brand-border/90 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-brand-dark/80 text-brand-ivory hover:text-brand-gold p-2 rounded-full border border-brand-border/60 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="md:w-1/2 relative h-64 md:h-auto bg-brand-dark">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-transparent to-transparent md:bg-gradient-to-r" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            <span
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border shadow-md ${
                product.foodType === 'veg'
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400'
                  : 'bg-rose-950/80 border-rose-500 text-rose-400'
              }`}
            >
              {product.foodType}
            </span>
            {product.isFeatured && (
              <span className="bg-brand-gold text-brand-dark px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center space-x-1">
                <Star className="w-3 h-3 fill-brand-dark" />
                <span>Featured</span>
              </span>
            )}
            {product.isPopular && !product.isFeatured && (
              <span className="bg-amber-500 text-brand-dark px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center space-x-1">
                <Flame className="w-3 h-3 fill-brand-dark" />
                <span>Popular</span>
              </span>
            )}
          </div>
        </div>

        {/* Product Details & Selectors */}
        <div className="md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between space-y-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-brand-ivory">{product.name}</h2>
            <p className="text-xs text-brand-muted mt-2 leading-relaxed">
              {product.scope || product.description || 'Prepared fresh upon order using premium ingredients and Belgian chocolate.'}
            </p>

            {/* Sizes / Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mt-4">
                <VariantSelector
                  variants={product.variants}
                  selectedVariant={selectedVariant}
                  onSelectVariant={setSelectedVariant}
                />
              </div>
            )}
          </div>

          {/* Price & Quantity & Add Button */}
          <div className="pt-4 border-t border-brand-border/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-brand-muted uppercase tracking-wider block">Total Price</span>
                <span className="font-serif text-2xl font-extrabold gold-gradient-text">
                  ₹{selectedVariant.price * quantity}
                </span>
              </div>

              <QuantitySelector
                quantity={quantity}
                onIncrease={() => setQuantity((q) => q + 1)}
                onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                size="lg"
              />
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.isAvailable}
              className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition shadow-lg ${
                product.isAvailable
                  ? 'bg-gradient-to-r from-brand-gold to-brand-goldHover text-brand-dark hover:shadow-gold hover:scale-[1.01]'
                  : 'bg-brand-dark text-brand-muted border border-brand-border cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{product.isAvailable ? 'Add to Cart' : 'Currently Unavailable'}</span>
            </button>

            {!product.isAvailable && (
              <p className="text-[11px] text-rose-400 text-center flex items-center justify-center space-x-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>This item is temporarily out of stock.</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
