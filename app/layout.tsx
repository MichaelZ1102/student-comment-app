import type { Metadata, Viewport } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import '@/app/globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: '学生年终评语生成助手',
  description: '帮助老师快速生成正式、自然的学生年终评语',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="bg-slate-50">
      <body className="min-h-screen bg-slate-50 antialiased text-slate-900">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">{children}</main>
      </body>
    </html>
  );
}
