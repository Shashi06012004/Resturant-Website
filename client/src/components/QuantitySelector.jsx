import React from 'react';
import { Minus, Plus } from 'lucide-react';

export const QuantitySelector = ({
  quantity,
  onIncrease,
  onDecrease,
  size = 'md',
}) => {
  const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5';
  const padding = size === 'sm' ? 'p-1' : size === 'lg' ? 'p-2' : 'p-1.5';
  const textClass = size === 'sm' ? 'text-xs w-6' : size === 'lg' ? 'text-base w-10' : 'text-sm w-8';

  return (
    <div className="inline-flex items-center bg-brand-dark/90 border border-brand-border/90 rounded-xl p-1 shadow-inner">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= 1}
        className={`${padding} rounded-lg text-brand-muted hover:text-brand-ivory hover:bg-brand-card disabled:opacity-30 disabled:hover:bg-transparent transition`}
      >
        <Minus className={iconSize} />
      </button>
      <span className={`${textClass} text-center font-bold text-brand-ivory select-none`}>
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        className={`${padding} rounded-lg text-brand-gold hover:text-brand-goldLight hover:bg-brand-card transition`}
      >
        <Plus className={iconSize} />
      </button>
    </div>
  );
};
