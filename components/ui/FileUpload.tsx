'use client';

import React, { useCallback } from 'react';

interface FileUploadProps {
  accept?: string;
  onChange: (file: File | null) => void;
  value?: File | null;
  disabled?: boolean;
  helpText?: string;
}

export function FileUpload({ accept, onChange, value, disabled, helpText }: FileUploadProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      onChange(file);
    },
    [onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files?.[0] || null;
      if (file) onChange(file);
    },
    [onChange],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={[
          'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition',
          'hover:border-slate-400 hover:bg-slate-50',
          disabled ? 'cursor-not-allowed opacity-60' : '',
          value
            ? 'border-emerald-500 bg-emerald-50'
            : 'border-slate-300 bg-white',
        ].join(' ')}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
          id="file-upload-input"
        />
        <label htmlFor="file-upload-input" className="flex cursor-pointer flex-col items-center gap-2">
          <svg
            className="h-8 w-8 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="text-sm font-medium text-slate-700">
            {value ? value.name : '点击或拖拽上传文件'}
          </span>
          {accept && (
            <span className="text-xs text-slate-500">支持格式：{accept.replace('.', '')}</span>
          )}
        </label>
      </div>
      {helpText && <p className="mt-2 text-sm text-slate-500">{helpText}</p>}
    </div>
  );
}
