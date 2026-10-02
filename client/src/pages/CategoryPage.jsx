import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Filter } from 'lucide-react';
import api from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { ProductCardSkeleton } from '../components/LoadingSkeleton';

export const CategoryPage = () => {
  const { categorySlug } = useParams();

  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [activeSubcategoryId, setActiveSubcategoryId] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [foodTypeFilter, setFoodTypeFilter] = useState('all');

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      if (!categorySlug) return;
      try {
        setLoading(true);
        // 1. Get Category
        const catRes = await api.get(`/categories/${categorySlug}`);
        if (catRes.data.success) {
          const currentCat = catRes.data.data;
          setCategory(currentCat);

          // 2. Fetch subcategories for this category
          const subRes = await api.get(`/subcategories?categoryId=${currentCat._id}`);
          if (subRes.data.success) {
            setSubcategories(subRes.data.data);
          }

          // 3. Fetch products for this category
          const prodRes = await api.get(`/products?categoryId=${currentCat._id}`);
          if (prodRes.data.success) {
            setProducts(prodRes.data.data);
          }
        }
      } catch (error) {
        console.error('Failed to load category page:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [categorySlug]);

  const filteredProducts = products.filter((p) => {
    // Subcategory check
    if (activeSubcategoryId !== 'all') {
      const subId = typeof p.subcategoryId === 'object' ? p.subcategoryId?._id : p.subcategoryId;
      if (subId !== activeSubcategoryId) return false;
    }
    // Food type check
    if (foodTypeFilter !== 'all' && p.foodType !== foodTypeFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-10 pb-16">
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />

      {/* Category Hero / Banner */}
      <section className="relative h-64 sm:h-80 flex items-end pb-8 px-4 sm:px-6 lg:px-8 bg-brand-card">
        <img
          src={category?.image || 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=1600&q=80'}
          alt={category?.name}
          className="absolute inset-0 w-full h-full object-cover filter brightness-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/70 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto w-full space-y-2">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-xs text-brand-muted">
            <Link to="/" className="hover:text-brand-gold">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/menu" className="hover:text-brand-gold">Menu</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-brand-gold font-semibold">{category?.name || 'Category'}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-brand-ivory">
            {category?.name}
          </h1>

          <p className="text-xs sm:text-sm text-brand-muted max-w-2xl">
            {category?.description || `Explore our freshly prepared ${category?.name}.`}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Filters & Subcategories Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-border/60 pb-4">
          {/* Subcategories Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <button
              onClick={() => setActiveSubcategoryId('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeSubcategoryId === 'all'
                  ? 'bg-brand-gold text-brand-dark font-bold shadow-gold'
                  : 'bg-brand-card text-brand-ivory border border-brand-border hover:border-brand-gold/50'
              }`}
            >
              All Items
            </button>
            {subcategories.map((sub) => (
              <button
                key={sub._id}
                onClick={() => setActiveSubcategoryId(sub._id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  activeSubcategoryId === sub._id
                    ? 'bg-brand-gold text-brand-dark font-bold shadow-gold'
                    : 'bg-brand-card text-brand-ivory border border-brand-border hover:border-brand-gold/50'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>

          {/* Veg / Non-Veg Toggle Filter */}
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs text-brand-muted font-medium flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </span>
            <button
              onClick={() => setFoodTypeFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                foodTypeFilter === 'all' ? 'bg-brand-card border-brand-gold text-brand-gold' : 'border-brand-border text-brand-muted'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFoodTypeFilter('veg')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                foodTypeFilter === 'veg' ? 'bg-emerald-950 border-emerald-500 text-emerald-400 font-bold' : 'border-brand-border text-brand-muted'
              }`}
            >
              Veg
            </button>
            <button
              onClick={() => setFoodTypeFilter('non-veg')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                foodTypeFilter === 'non-veg' ? 'bg-rose-950 border-rose-500 text-rose-400 font-bold' : 'border-brand-border text-brand-muted'
              }`}
            >
              Non-Veg
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <ProductCardSkeleton key={n} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-brand-card/60 rounded-3xl border border-brand-border space-y-3">
            <p className="text-brand-ivory font-serif text-lg font-semibold">
              No items available in this category selection.
            </p>
            <p className="text-xs text-brand-muted">Try resetting filters or choose another subcategory.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={setSelectedProduct}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
