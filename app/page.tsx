import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function Home() {
  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            学生年终评语生成助手
          </h1>
          <p className="mt-4 text-base text-slate-600">
            帮助老师快速生成正式、自然的学生年终评语，支持单个生成与批量处理。
          </p>
          <div className="editorial-divider mt-6 mb-8" />
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/single">
              <Button size="lg" className="min-w-[160px]">
                单个生成
              </Button>
            </Link>
            <Link href="/batch">
              <Button variant="success" size="lg" className="min-w-[160px]">
                批量生成
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
