'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const sizeClasses: Record<string, string> = {
  sm: 'h-5 w-5 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-3',
};

export function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={[
          'inline-block animate-spin rounded-full border-slate-300 border-t-slate-900',
          sizeClasses[size],
        ].join(' ')}
        role="status"
        aria-label="加载中"
      />
      {text && <p className="text-sm text-slate-500">{text}</p>}
    </div>
  );
}
