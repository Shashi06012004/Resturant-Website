import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Award, Utensils, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import { CategoryCard } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { CategoryCardSkeleton, ProductCardSkeleton } from '../components/LoadingSkeleton';

export const Home = () => {
  const [categories, setCategories] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?isPopular=true'),
        ]);

        if (catRes.data.success) {
          setCategories(catRes.data.data);
        }
        if (prodRes.data.success) {
          setPopularProducts(prodRes.data.data.slice(0, 6));
        }
      } catch (error) {
        console.error('Failed to fetch home page content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="space-y-20 pb-16">
      {/* Quick View Modal */}
      <ProductModal
        product={selectedQuickViewProduct}
        onClose={() => setSelectedQuickViewProduct(null)}
      />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Background Image with Dark Warm Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1920&q=80"
            alt="Draksha Ambiance"
            className="w-full h-full object-cover scale-105 filter brightness-50 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/70 to-brand-dark/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/20 via-transparent to-transparent" />
        </div>

        {/* Hero Banner Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 pt-12">
          <div className="inline-flex items-center space-x-2 bg-brand-gold/15 border border-brand-gold/40 text-brand-goldLight text-xs font-semibold px-4 py-1.5 rounded-full backdrop-blur-md shadow-lg animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to Draksha Gourmet Dessert & Café</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-ivory leading-tight">
            Made Fresh. <br />
            <span className="gold-gradient-text">Served With Love.</span>
          </h1>

          <p className="text-sm sm:text-lg text-brand-muted max-w-2xl mx-auto font-light leading-relaxed">
            Indulge in artisanal Belgian waffles, warm fudgy brownies, signature thick milkshakes, and crispy gourmet savouries.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/menu"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-gold to-brand-goldHover text-brand-dark font-extrabold text-sm shadow-gold hover:shadow-goldGlow hover:scale-105 transition-all flex items-center justify-center space-x-2"
            >
              <span>Explore Our Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => navigate('/menu')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-card/90 hover:bg-brand-card border border-brand-border/80 text-brand-ivory font-bold text-sm backdrop-blur-md hover:border-brand-gold/50 transition-all flex items-center justify-center space-x-2"
            >
              <Utensils className="w-4 h-4 text-brand-gold" />
              <span>Order Online Now</span>
            </button>
          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES SECTION (MAIN CATEGORIES ONLY) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
            Menu Collections
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-ivory">
            Explore Categories
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted max-w-xl mx-auto">
            Select a category to view its signature delights, size options, and custom choices.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <CategoryCardSkeleton key={n} />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 bg-brand-card rounded-3xl border border-brand-border">
            <p className="text-brand-muted text-sm">No menu categories available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <CategoryCard key={cat._id} category={cat} />
            ))}
          </div>
        )}
      </section>

      {/* POPULAR / RECOMMENDED ITEMS SECTION */}
      {popularProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
                Chef's Recommendations
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-ivory mt-1">
                Popular Hits
              </h2>
            </div>
            <Link
              to="/menu"
              className="text-xs font-bold text-brand-gold hover:underline flex items-center space-x-1 mt-3 md:mt-0"
            >
              <span>View Full Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <ProductCardSkeleton key={n} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularProducts.map((prod) => (
                <ProductCard
                  key={prod._id}
                  product={prod}
                  onQuickView={setSelectedQuickViewProduct}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* WHY CHOOSE US */}
      <section className="bg-brand-card/60 border-y border-brand-border/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
              The Draksha Promise
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-ivory">
              Why Choose Us
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-brand-card border border-brand-border/70 p-6 rounded-2xl space-y-3 hover:border-brand-gold/40 transition">
              <div className="w-12 h-12 rounded-xl bg-brand-gold/15 flex items-center justify-center text-brand-gold">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-brand-ivory">Fresh Ingredients</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                We source rich Belgian cocoa, pure dairy butter, fresh fruits, and premium dry nuts daily.
              </p>
            </div>

            <div className="bg-brand-card border border-brand-border/70 p-6 rounded-2xl space-y-3 hover:border-brand-gold/40 transition">
              <div className="w-12 h-12 rounded-xl bg-brand-gold/15 flex items-center justify-center text-brand-gold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-brand-ivory">Made Fresh</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Every waffle is iron-baked to order, and every shake is whipped right before serving.
              </p>
            </div>

            <div className="bg-brand-card border border-brand-border/70 p-6 rounded-2xl space-y-3 hover:border-brand-gold/40 transition">
              <div className="w-12 h-12 rounded-xl bg-brand-gold/15 flex items-center justify-center text-brand-gold">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-brand-ivory">Delicious Flavours</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                From Lotus Biscoff to spicy chicken pops, experience an unforgettable culinary fusion.
              </p>
            </div>

            <div className="bg-brand-card border border-brand-border/70 p-6 rounded-2xl space-y-3 hover:border-brand-gold/40 transition">
              <div className="w-12 h-12 rounded-xl bg-brand-gold/15 flex items-center justify-center text-brand-gold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-brand-ivory">Quality You Can Taste</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Strict food hygiene standard guarantees clean, delicious, and consistent quality every time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 bg-gradient-to-r from-amber-950/80 via-brand-card to-brand-card border border-brand-gold/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-ivory">
              Craving Something <span className="gold-gradient-text">Delicious?</span>
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted max-w-lg">
              Order your favorite desserts and savoury snacks online for fast pickup or delivery.
            </p>
          </div>

          <Link
            to="/menu"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-gold to-brand-goldHover text-brand-dark font-extrabold text-sm shadow-gold hover:scale-105 transition-all shrink-0"
          >
            Explore Full Menu
          </Link>
        </div>
      </section>
    </div>
  );
};
