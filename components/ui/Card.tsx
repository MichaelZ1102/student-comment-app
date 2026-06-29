'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function Card({ children, className = '', title, subtitle, action }: CardProps) {
  return (
    <div className={`editorial-card ${className}`}>
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            )}
          </div>
          {action && <div className="ml-4">{action}</div>}
        </div>
      )}
      {title && <div className="editorial-divider" />}
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}
