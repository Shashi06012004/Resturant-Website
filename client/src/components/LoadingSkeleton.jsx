import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-brand-card border border-brand-border/60 rounded-2xl overflow-hidden h-96 flex flex-col justify-between p-4 space-y-4">
      <div className="w-full h-44 rounded-xl skeleton-shimmer" />
      <div className="space-y-2">
        <div className="h-5 w-3/4 rounded skeleton-shimmer" />
        <div className="h-3 w-full rounded skeleton-shimmer" />
        <div className="h-3 w-5/6 rounded skeleton-shimmer" />
      </div>
      <div className="pt-3 border-t border-brand-border/40 flex items-center justify-between">
        <div className="h-6 w-16 rounded skeleton-shimmer" />
        <div className="h-8 w-20 rounded-xl skeleton-shimmer" />
      </div>
    </div>
  );
};

export const CategoryCardSkeleton = () => {
  return <div className="h-72 w-full rounded-3xl skeleton-shimmer" />;
};
