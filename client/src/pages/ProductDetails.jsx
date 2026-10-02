import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ShoppingBag, Star, Flame, ShieldAlert } from 'lucide-react';
import api from '../services/api';
import { VariantSelector } from '../components/VariantSelector';
import { QuantitySelector } from '../components/QuantitySelector';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';

export const ProductDetails = () => {
  const { productSlug } = useParams();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productSlug) return;
      try {
        setLoading(true);
        const res = await api.get(`/products/${productSlug}`);
        if (res.data.success) {
          const currentProd = res.data.data;
          setProduct(currentProd);
          if (currentProd.variants && currentProd.variants.length > 0) {
            setSelectedVariant(currentProd.variants[0]);
          }

          // Fetch related products in same category
          const catId = typeof currentProd.categoryId === 'object' ? currentProd.categoryId._id : currentProd.categoryId;
          const relatedRes = await api.get(`/products?categoryId=${catId}`);
          if (relatedRes.data.success) {
            setRelatedProducts(
              relatedRes.data.data.filter((p) => p._id !== currentProd._id).slice(0, 3)
            );
          }
        }
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productSlug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-brand-muted">
        Loading item details...
      </div>
    );
  }

  if (!product || !selectedVariant) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-brand-ivory">Product Not Found</h2>
        <p className="text-xs text-brand-muted">The food item you requested could not be located.</p>
        <Link to="/menu" className="inline-block text-xs font-bold text-brand-gold hover:underline">
          Return to Menu
        </Link>
      </div>
    );
  }

  const categoryName = typeof product.categoryId === 'object' ? product.categoryId.name : 'Category';
  const categorySlug = typeof product.categoryId === 'object' ? product.categoryId.slug : '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-brand-muted">
        <Link to="/" className="hover:text-brand-gold">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/menu" className="hover:text-brand-gold">Menu</Link>
        {categorySlug && (
          <>
            <ChevronRight className="w-3 h-3" />
            <Link to={`/menu/${categorySlug}`} className="hover:text-brand-gold">{categoryName}</Link>
          </>
        )}
        <ChevronRight className="w-3 h-3" />
        <span className="text-brand-gold font-semibold truncate">{product.name}</span>
      </div>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Product Image */}
        <div className="relative rounded-3xl overflow-hidden border border-brand-border/80 bg-brand-card shadow-2xl">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            className="w-full h-96 sm:h-[450px] object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80';
            }}
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            <span
              className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border shadow-md ${
                product.foodType === 'veg'
                  ? 'bg-emerald-950/90 border-emerald-500 text-emerald-400'
                  : 'bg-rose-950/90 border-rose-500 text-rose-400'
              }`}
            >
              {product.foodType}
            </span>
            {product.isFeatured && (
              <span className="bg-brand-gold text-brand-dark px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center space-x-1">
                <Star className="w-3.5 h-3.5 fill-brand-dark" />
                <span>Featured</span>
              </span>
            )}
            {product.isPopular && !product.isFeatured && (
              <span className="bg-amber-500 text-brand-dark px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center space-x-1">
                <Flame className="w-3.5 h-3.5 fill-brand-dark" />
                <span>Popular</span>
              </span>
            )}
          </div>
        </div>

        {/* Right: Details & Variant Selection */}
        <div className="space-y-6 bg-brand-card/70 border border-brand-border/80 p-8 rounded-3xl backdrop-blur-md">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
              {categoryName}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-ivory mt-1">
              {product.name}
            </h1>
            <p className="text-xs sm:text-sm text-brand-muted mt-3 leading-relaxed">
              {product.scope || product.description || 'Prepared fresh with high quality Belgian chocolate and rich butter.'}
            </p>
          </div>

          {/* Sizes Selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="pt-4 border-t border-brand-border/60">
              <VariantSelector
                variants={product.variants}
                selectedVariant={selectedVariant}
                onSelectVariant={setSelectedVariant}
              />
            </div>
          )}

          {/* Price & Quantity & Add Button */}
          <div className="pt-6 border-t border-brand-border/60 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-brand-muted uppercase tracking-wider block">Selected Price</span>
                <span className="font-serif text-3xl font-extrabold gold-gradient-text">
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
              onClick={() => addToCart(product, selectedVariant, quantity)}
              disabled={!product.isAvailable}
              className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-xl ${
                product.isAvailable
                  ? 'bg-gradient-to-r from-brand-gold to-brand-goldHover text-brand-dark hover:shadow-gold hover:scale-[1.01]'
                  : 'bg-brand-dark text-brand-muted border border-brand-border cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>{product.isAvailable ? 'Add To Shopping Cart' : 'Currently Unavailable'}</span>
            </button>

            {!product.isAvailable && (
              <p className="text-xs text-rose-400 text-center flex items-center justify-center space-x-1">
                <ShieldAlert className="w-4 h-4" />
                <span>This item is temporarily unavailable for ordering.</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-brand-border/60">
          <h3 className="font-serif text-2xl font-bold text-brand-ivory">
            You Might Also <span className="gold-gradient-text">Love</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
