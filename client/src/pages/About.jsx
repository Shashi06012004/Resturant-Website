import React from 'react';
import { Sparkles, Utensils, Heart, Award } from 'lucide-react';

export const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">Our Story & Passion</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-brand-ivory">
          Welcome to <span className="gold-gradient-text">Draksha</span>
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted max-w-xl mx-auto leading-relaxed">
          Where gourmet dessert craftsmanship meets a warm, chocolate-infused luxury café atmosphere.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="relative rounded-3xl overflow-hidden border border-brand-border/80 shadow-2xl h-80 sm:h-96">
          <img
            src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80"
            alt="Draksha Interior"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-brand-muted leading-relaxed">
          <h2 className="font-serif text-2xl font-bold text-brand-ivory">Crafted With Pure Belgian Chocolate</h2>
          <p>
            At Draksha, we believe every dessert should be a moment of pure bliss. From crispy Belgian waffles baked fresh on order to fudgy lava cakes and thick signature milkshakes, every recipe is crafted using premium imported ingredients.
          </p>
          <p>
            Whether you are stopping by for a midnight sweet craving, enjoying chocolate fountain dips, or enjoying crispy chicken savouries, our menu is designed to amaze your palate.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
        <div className="bg-brand-card border border-brand-border/70 p-6 rounded-2xl text-center space-y-2">
          <Utensils className="w-8 h-8 text-brand-gold mx-auto" />
          <h3 className="font-serif text-lg font-bold text-brand-ivory">Artisanal Craft</h3>
          <p className="text-xs text-brand-muted">Freshly prepared waffles and scoops crafted to perfection.</p>
        </div>

        <div className="bg-brand-card border border-brand-border/70 p-6 rounded-2xl text-center space-y-2">
          <Sparkles className="w-8 h-8 text-brand-gold mx-auto" />
          <h3 className="font-serif text-lg font-bold text-brand-ivory">Warm Ambience</h3>
          <p className="text-xs text-brand-muted">Dark chocolate & golden amber lighting for rich visual comfort.</p>
        </div>

        <div className="bg-brand-card border border-brand-border/70 p-6 rounded-2xl text-center space-y-2">
          <Award className="w-8 h-8 text-brand-gold mx-auto" />
          <h3 className="font-serif text-lg font-bold text-brand-ivory">Quality First</h3>
          <p className="text-xs text-brand-muted">Highest hygiene and finest ingredients guaranteed.</p>
        </div>
      </div>
    </div>
  );
};
