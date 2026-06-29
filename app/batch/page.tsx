'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FileUpload } from '@/components/ui/FileUpload';
import { Textarea } from '@/components/ui/Textarea';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

type StudentRow = {
  name: string;
  className: string;
  rawNotes: string;
  finalComment?: string;
};

type StudentRowRaw = Partial<StudentRow> & {
  [key: string]: unknown;
};

export default function BatchPage() {
  const [file, setFile] = useState<File | null>(null);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpload = async (uploaded: File | null) => {
    setError('');
    setSuccess('');
    setStudents([]);
    setFile(uploaded);

    if (!uploaded) return;

    setLoading(true);
    try {
      const text = await uploaded.text();
      const ext = uploaded.name.split('.').pop()?.toLowerCase();

      let rows: StudentRow[] = [];

      if (ext === 'csv') {
        const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
        const header = lines[0].split(',').map((item) => item.trim().toLowerCase());
        const nameIdx = header.findIndex((item) => /姓名|name/.test(item));
        const classIdx = header.findIndex((item) => /班级|class/.test(item));
        const notesIdx = header.findIndex((item) => /要点|备注|评语|notes|remark/.test(item));

        if (nameIdx < 0) {
          throw new Error('CSV 缺少“姓名”列');
        }

        rows = lines.slice(1).map((line) => {
          const cols = line.split(',');
          return {
            name: (cols[nameIdx] || '').trim(),
            className: classIdx >= 0 ? (cols[classIdx] || '').trim() : '',
            rawNotes: notesIdx >= 0 ? (cols[notesIdx] || '').trim() : '',
          };
        });
      } else {
        const XLSX = await import('xlsx');
        const workbook = XLSX.read(text, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json<StudentRowRaw>(sheet);

        if (!json.length) {
          throw new Error('Excel 文件为空');
        }

        const keys = Object.keys(json[0] ?? {});
        const nameKey = keys.find((key) => /姓名|name/.test(key));
        const classKey = keys.find((key) => /班级|class/.test(key));
        const notesKey = keys.find((key) => /要点|备注|评语|notes|remark/.test(key));

        if (!nameKey) {
          throw new Error('Excel 缺少“姓名”列');
        }

        rows = json.map((row) => ({
          name: (row[nameKey] ?? '').toString().trim(),
          className: classKey ? (row[classKey] ?? '').toString().trim() : '',
          rawNotes: notesKey ? (row[notesKey] ?? '').toString().trim() : '',
        }));
      }

      const validRows = rows.filter((row) => row.name.length > 0);
      if (!validRows.length) {
        throw new Error('未读取到有效学生数据');
      }

      setStudents(validRows);
      setSuccess(`已导入 ${validRows.length} 条数据`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '解析文件失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setProcessing(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/comments/generate-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: students.map((item) => ({
            studentName: item.name,
            tone: 'formal',
            highlights: item.rawNotes,
            improvements: '',
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '批量生成失败');
      }

      const results = (data.items ?? []).map((item: { studentName?: string; comment?: string; error?: string }, index: number) => ({
        ...students[index],
        finalComment: item.error ? `[生成失败: ${item.error}]` : item.comment ?? '',
      }));

      setStudents(results);
      setSuccess('批量生成完成，可在表格中逐条修改');
    } catch (err) {
      setError(err instanceof Error ? err.message : '批量生成失败，请稍后重试');
    } finally {
      setProcessing(false);
    }
  };

  const handleCommentChange = (index: number, value: string) => {
    setStudents((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], finalComment: value };
      return next;
    });
  };

  const handleExportAll = async () => {
    const comments = students
      .filter((item) => item.finalComment && item.finalComment.trim().length > 0 && !item.finalComment.startsWith('[生成失败'))
      .map((item) => ({
        studentName: item.name,
        content: item.finalComment as string,
      }));

    if (!comments.length) {
      alert('没有可导出的有效评语');
      return;
    }

    try {
      const res = await fetch('/api/export/docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: '学生年终评语',
          comments,
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
      setSuccess('Word 已开始下载');
    } catch (err) {
      setError(err instanceof Error ? err.message : '导出失败，请稍后重试');
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Card title="批量导入与生成" subtitle="上传 Excel 或 CSV，一键批量生成评语">
        <div className="space-y-4">
          <FileUpload
            accept=".xlsx,.csv"
            onChange={handleUpload}
            value={file}
            helpText="建议模板包含：姓名、班级、原始要点"
          />
          {file && (
            <p className="text-sm text-slate-600">
              已选择：<span className="font-medium text-slate-900">{file.name}</span>
            </p>
          )}
        </div>
      </Card>

      {(loading || processing) && (
        <Card>
          <LoadingSpinner size="md" text={loading ? '正在解析文件，请稍候...' : '正在批量生成，请稍候...'} />
        </Card>
      )}

      {(error || success) && !loading && !processing && (
        <Card>
          <p className={`text-sm ${error ? 'text-rose-600' : 'text-emerald-600'}`}>{error || success}</p>
        </Card>
      )}

      {students.length > 0 && !loading && !processing && (
        <Card
          title={`共 ${students.length} 条记录`}
          action={
            <Button variant="success" onClick={handleGenerate}>
              批量生成评语
            </Button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="p-2 text-left border-b border-slate-200">姓名</th>
                  <th className="p-2 text-left border-b border-slate-200">班级</th>
                  <th className="p-2 text-left border-b border-slate-200">原始要点</th>
                  <th className="p-2 text-left border-b border-slate-200">生成结果</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="p-2 text-slate-900">{s.name}</td>
                    <td className="p-2 text-slate-700">{s.className}</td>
                    <td className="p-2 text-slate-600">{s.rawNotes}</td>
                    <td className="p-2 text-slate-700">
                      <Textarea
                        rows={3}
                        value={s.finalComment || ''}
                        onChange={(e) => handleCommentChange(i, e.target.value)}
                        className="min-w-[220px]"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="editorial-divider my-4" />
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="secondary" onClick={handleExportAll}>
              导出全部 Word
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
