import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import api from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { ProductCardSkeleton } from '../components/LoadingSkeleton';

export const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [foodTypeFilter, setFoodTypeFilter] = useState('all');
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products'),
        ]);

        if (catRes.data.success) {
          setCategories(catRes.data.data);
        }
        if (prodRes.data.success) {
          setProducts(prodRes.data.data);
        }
      } catch (error) {
        console.error('Error loading menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products based on search, category tab, veg/non-veg
  const filteredProducts = products.filter((p) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = p.name.toLowerCase().includes(q);
      const descMatch = p.description?.toLowerCase().includes(q);
      if (!nameMatch && !descMatch) return false;
    }

    // Category
    if (selectedCategoryId !== 'all') {
      const catId = typeof p.categoryId === 'object' ? p.categoryId._id : p.categoryId;
      if (catId !== selectedCategoryId) return false;
    }

    // Food Type
    if (foodTypeFilter !== 'all' && p.foodType !== foodTypeFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <ProductModal
        product={selectedQuickViewProduct}
        onClose={() => setSelectedQuickViewProduct(null)}
      />

      {/* Header & Search */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-brand-ivory">
            Our Gourmet <span className="gold-gradient-text">Menu</span>
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted max-w-xl mx-auto">
            Discover our complete offering of waffles, thick milkshakes, fudge brownies, ice cream scoops, and crispy savouries.
          </p>
        </div>

        {/* Global Menu Search Bar */}
        <div className="max-w-2xl mx-auto relative pt-4">
          <input
            type="text"
            placeholder="Search for Oreo Waffles, Chicken Nuggets, KitKat Shake..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchParams(e.target.value ? { search: e.target.value } : {});
            }}
            className="w-full bg-brand-card border border-brand-border/90 focus:border-brand-gold text-brand-ivory rounded-2xl py-3.5 pl-12 pr-4 shadow-xl outline-none transition placeholder:text-brand-muted text-sm"
          />
          <Search className="w-5 h-5 text-brand-gold absolute left-4 top-7" />
        </div>
      </div>

      {/* Categories Tabs & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-border/60 pb-4">
        {/* Category Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <button
            onClick={() => setSelectedCategoryId('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategoryId === 'all'
                ? 'bg-brand-gold text-brand-dark font-bold shadow-gold'
                : 'bg-brand-card text-brand-ivory border border-brand-border hover:border-brand-gold/50'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategoryId(cat._id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategoryId === cat._id
                  ? 'bg-brand-gold text-brand-dark font-bold shadow-gold'
                  : 'bg-brand-card text-brand-ivory border border-brand-border hover:border-brand-gold/50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Veg / Non-Veg Toggle */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs text-brand-muted font-medium flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5 text-brand-gold" />
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
            No products matched your search or filter.
          </p>
          <p className="text-xs text-brand-muted">Try searching with a different term like "Oreo" or "Brownie".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickView={setSelectedQuickViewProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};
