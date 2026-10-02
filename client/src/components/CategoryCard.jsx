import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/menu/${category.slug}`}
      className="group relative h-72 sm:h-80 rounded-3xl overflow-hidden border border-brand-border/80 hover:border-brand-gold/80 transition-all duration-500 shadow-xl hover:shadow-goldGlow flex flex-col justify-end p-6"
    >
      {/* Background Category Image */}
      <img
        src={category.image || 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80'}
        alt={category.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        loading="lazy"
      />

      {/* Dark Warm Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-transparent group-hover:via-brand-dark/40 transition-all duration-500" />

      {/* Content */}
      <div className="relative z-10 space-y-2">
        <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-brand-gold bg-brand-gold/15 px-3 py-1 rounded-full border border-brand-gold/30 backdrop-blur-md">
          Explore Category
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-ivory group-hover:text-brand-gold transition-colors">
          {category.name}
        </h3>
        <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
          {category.description || `Browse our gourmet ${category.name} menu.`}
        </p>

        <div className="pt-2 flex items-center text-xs font-bold text-brand-gold group-hover:translate-x-1.5 transition-transform">
          <span>Discover Menu</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </Link>
  );
};
