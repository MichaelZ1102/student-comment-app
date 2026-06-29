'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

type ExportFormat = 'docx';

export default function ExportPage() {
  const [format, setFormat] = useState<ExportFormat>('docx');
  const [exporting, setExporting] = useState(false);

  const handleDownload = async () => {
    setExporting(true);
    try {
      const res = await fetch('/api/export/docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: '学生年终评语',
          comments: [],
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '导出失败');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '学生年终评语.docx';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : '导出失败，请稍后重试');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card title="导出评语" subtitle="选择格式并下载文件">
        <div className="space-y-4">
          <div className="w-full">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">导出格式</label>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              value={format}
              onChange={(e) => setFormat(e.target.value as ExportFormat)}
            >
              <option value="docx">Word (.docx)</option>
            </select>
          </div>
          <Button onClick={handleDownload} loading={exporting} className="w-full sm:w-auto">
            {exporting ? '导出中...' : '下载文件'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
