'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export function Input({ label, error, helpText, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900',
          'placeholder:text-slate-400',
          'focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10',
          'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
          error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : '',
          className,
        ].join(' ')}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-rose-600">{error}</p>}
      {helpText && !error && <p className="mt-1.5 text-sm text-slate-500">{helpText}</p>}
    </div>
  );
}
