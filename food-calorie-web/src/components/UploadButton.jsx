import React from 'react';

export default function UploadButton({ label, caption, onClick, variant = 'primary' }) {
  const baseStyles =
    'group w-full rounded-2xl px-6 py-5 text-left transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent';
  const variants = {
    primary:
      'bg-brand-600 text-white shadow-soft hover:bg-brand-500 active:scale-[0.99] dark:bg-brand-500',
    secondary:
      'border border-slate-200 bg-white text-slate-800 shadow-soft backdrop-blur hover:bg-slate-50 active:scale-[0.99] dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20'
  };

  return (
    <button type="button" className={`${baseStyles} ${variants[variant]}`} onClick={onClick}>
      <div className="font-display text-xl font-semibold tracking-tight text-current">
        {label}
      </div>
      {caption ? (
        <div className="mt-2 text-xs font-medium text-slate-500 dark:text-white/70">
          {caption}
        </div>
      ) : null}
    </button>
  );
}
