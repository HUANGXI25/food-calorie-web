import React from 'react';

export default function FoodCard({ item, isRecommended, labels }) {
  return (
    <article
      className={`rounded-3xl border px-6 py-5 shadow-card transition ${
        isRecommended
          ? 'border-brand-300 bg-brand-50/70 dark:border-brand-500/40 dark:bg-brand-500/10'
          : 'border-white/10 bg-white/90 dark:bg-slate-900/70'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
            {item.name}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
            {labels.portion}: {item.portion}
          </p>
        </div>
        {isRecommended ? (
          <span className="rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold text-brand-700 dark:text-brand-200">
            {labels.recommendedBadge}
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-display text-4xl font-bold text-brand-700 dark:text-brand-300">
          {Math.round(item.calories)}
        </span>
        <span className="text-sm font-medium text-slate-500 dark:text-slate-300">
          {labels.calories}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4 text-sm">
        <div>
          <div className="font-semibold text-slate-900 dark:text-white">{item.protein}g</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{labels.protein}</div>
        </div>
        <div>
          <div className="font-semibold text-slate-900 dark:text-white">{item.carbs}g</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{labels.carbs}</div>
        </div>
        <div>
          <div className="font-semibold text-slate-900 dark:text-white">{item.fat}g</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{labels.fat}</div>
        </div>
      </div>
    </article>
  );
}
