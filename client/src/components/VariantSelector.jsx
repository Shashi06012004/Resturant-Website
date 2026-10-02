import React from 'react';

export const VariantSelector = ({
  variants,
  selectedVariant,
  onSelectVariant,
}) => {
  if (!variants || variants.length <= 1) {
    return null;
  }

  return (
    <div className="space-y-2 my-3">
      <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider block">
        Choose Size / Option:
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {variants.map((v) => {
          const isSelected = selectedVariant?.name?.toLowerCase() === v.name.toLowerCase();
          return (
            <button
              key={v.name}
              type="button"
              onClick={() => onSelectVariant(v)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-to-r from-brand-gold to-brand-goldHover text-brand-dark border-brand-gold shadow-gold scale-[1.02]'
                  : 'bg-brand-dark/70 text-brand-ivory border-brand-border/80 hover:border-brand-gold/50 hover:bg-brand-dark'
              }`}
            >
              <span className="font-semibold">{v.name}</span>
              <span className={isSelected ? 'text-brand-dark font-bold' : 'text-brand-gold'}>
                ₹{v.price}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
