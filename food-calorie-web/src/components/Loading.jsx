import React from 'react';

export default function Loading({ label }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur">
      <div className="w-[min(90%,360px)] rounded-3xl bg-white/90 p-6 text-center shadow-soft dark:bg-slate-900/90">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-brand-300 border-t-brand-600" />
        <p className="mt-4 font-display text-base font-semibold text-slate-900 dark:text-white">
          {label}
        </p>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-brand-500" />
        </div>
      </div>
    </div>
  );
}
