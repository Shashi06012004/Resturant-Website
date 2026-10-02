import React, { useState } from 'react';
import { ShoppingBag, Star, Flame, Eye } from 'lucide-react';
import { VariantSelector } from './VariantSelector';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product, onQuickView }) => {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0] : { name: 'Regular', price: 0 }
  );

  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!product.isAvailable) return;
    addToCart(product, selectedVariant, 1);
  };

  return (
    <div
      onClick={() => onQuickView && onQuickView(product)}
      className="group relative bg-brand-card hover:bg-brand-cardHover border border-brand-border/70 hover:border-brand-gold/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-gold/20 flex flex-col justify-between cursor-pointer"
    >
      {/* Product Image & Badges Container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-brand-dark/50">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Veg / Non-Veg Indicator */}
          <div
            className={`px-2 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1.5 backdrop-blur-md shadow-md ${
              product.foodType === 'veg'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400'
                : 'bg-rose-950/80 border-rose-500 text-rose-400'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                product.foodType === 'veg' ? 'bg-emerald-400' : 'bg-rose-400'
              }`}
            />
            <span>{product.foodType}</span>
          </div>

          {/* Featured / Popular Badge */}
          <div className="flex space-x-1">
            {product.isFeatured && (
              <span className="bg-brand-gold text-brand-dark px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm flex items-center space-x-1">
                <Star className="w-3 h-3 fill-brand-dark" />
                <span>Featured</span>
              </span>
            )}
            {product.isPopular && !product.isFeatured && (
              <span className="bg-amber-500/90 text-brand-dark px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm flex items-center space-x-1">
                <Flame className="w-3 h-3 fill-brand-dark" />
                <span>Popular</span>
              </span>
            )}
          </div>
        </div>

        {/* Quick view icon overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-brand-dark/40 backdrop-blur-[2px]">
          <span className="bg-brand-gold/90 text-brand-dark p-2.5 rounded-full shadow-gold transform scale-90 group-hover:scale-100 transition-transform flex items-center space-x-1 font-semibold text-xs">
            <Eye className="w-4 h-4" />
            <span>Quick View</span>
          </span>
        </div>

        {/* Currently Unavailable Overlay */}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-brand-dark/85 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-rose-950/90 border border-rose-600/50 text-rose-300 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
              Currently Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between">
            <h3 className="font-serif text-lg font-bold text-brand-ivory group-hover:text-brand-gold transition-colors line-clamp-1">
              {product.name}
            </h3>
          </div>

          <p className="text-xs text-brand-muted mt-1 line-clamp-2 leading-relaxed">
            {product.scope || product.description || 'Deliciously prepared with premium ingredients.'}
          </p>

          {/* Size / Variant Selector Buttons */}
          {product.variants && product.variants.length > 1 && (
            <div onClick={(e) => e.stopPropagation()}>
              <VariantSelector
                variants={product.variants}
                selectedVariant={selectedVariant}
                onSelectVariant={setSelectedVariant}
              />
            </div>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 mt-2 border-t border-brand-border/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-brand-muted uppercase tracking-wider block">Price</span>
            <span className="font-serif text-xl font-extrabold gold-gradient-text">
              ₹{selectedVariant.price}
            </span>
          </div>

          <button
            type="button"
            disabled={!product.isAvailable}
            onClick={handleAddToCart}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
              product.isAvailable
                ? 'bg-gradient-to-r from-brand-gold to-brand-goldHover text-brand-dark hover:shadow-gold hover:scale-105 active:scale-95'
                : 'bg-brand-dark/50 text-brand-muted border border-brand-border cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
