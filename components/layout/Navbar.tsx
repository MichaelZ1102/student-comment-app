'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';

const navItems = [
  { href: '/', label: '首页' },
  { href: '/single', label: '单个生成' },
  { href: '/batch', label: '批量生成' },
  { href: '/export', label: '导出' },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-lg font-semibold text-slate-900"
          >
            学生年终评语生成助手
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const active =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={active ? 'primary' : 'ghost'}
                    size="sm"
                    className="rounded-lg"
                  >
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
