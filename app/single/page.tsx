'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

type Tone = 'formal' | 'warm' | 'plain';

export default function SinglePage() {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [rawNotes, setRawNotes] = useState('');
  const [tone, setTone] = useState<Tone>('formal');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setComment('');

    if (!name.trim()) {
      setError('请输入学生姓名');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/comments/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: name.trim(),
          tone,
          highlights: rawNotes,
          improvements: '',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '生成失败');
      }

      setComment(data.comment ?? '');
      setSuccess('已生成评语，可继续编辑后导出');
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!comment) return;
    await navigator.clipboard.writeText(comment);
    setSuccess('已复制到剪贴板');
  };

  const handleExport = async () => {
    if (!comment) return;
    try {
      const res = await fetch('/api/export/docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${name.trim()}年终评语`,
          comments: [{ studentName: name.trim(), content: comment }],
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
      a.download = `${name.trim()}年终评语.docx`;
      a.click();
      URL.revokeObjectURL(url);
      setSuccess('Word 已开始下载');
    } catch (err) {
      setError(err instanceof Error ? err.message : '导出失败，请稍后重试');
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card title="单个学生评语生成" subtitle="填写学生信息，生成个性化年终评语">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="学生姓名"
              placeholder="请输入姓名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={error && !name.trim() ? '请输入学生姓名' : undefined}
            />
            <div className="w-full">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">性别</label>
              <select
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">请选择</option>
                <option value="male">男</option>
                <option value="female">女</option>
                <option value="unknown">未知</option>
              </select>
            </div>
          </div>

          <div className="w-full">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">语气风格</label>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              value={tone}
              onChange={(e) => setTone(e.target.value as Tone)}
            >
              <option value="formal">正式稳重</option>
              <option value="warm">温暖鼓励</option>
              <option value="plain">简洁朴实</option>
            </select>
          </div>

          <Textarea
            label="老师原始评语要点"
            placeholder="请输入学生的课堂表现、优缺点、典型事例等..."
            rows={5}
            value={rawNotes}
            onChange={(e) => setRawNotes(e.target.value)}
          />

          <Button type="submit" loading={loading} className="w-full sm:w-auto">
            {loading ? '生成中...' : '生成评语'}
          </Button>
        </form>
      </Card>

      {loading && (
        <Card>
          <LoadingSpinner size="md" text="正在生成评语，请稍候..." />
        </Card>
      )}

      {(error || success) && !loading && (
        <Card>
          <p className={`text-sm ${error ? 'text-rose-600' : 'text-emerald-600'}`}>{error || success}</p>
        </Card>
      )}

      {comment && !loading && !error && (
        <Card title="生成结果" subtitle="可直接编辑后再导出">
          <Textarea
            rows={8}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="editorial-divider my-4" />
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="secondary" onClick={handleCopy}>
              复制到剪贴板
            </Button>
            <Button variant="success" onClick={handleExport}>
              导出 Word
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
