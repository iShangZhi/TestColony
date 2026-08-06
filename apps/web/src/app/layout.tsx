import type { Metadata } from 'next';
import '@/styles/globals.css';
import { AppShell } from '@/components/layout/AppShell';
import { Providers } from './providers';
import { ThemeScript } from './theme-script';
import { ThemeInitializer } from './theme-initializer';

export const metadata: Metadata = {
  title: 'TestColony - AI-Native Testing Platform',
  description: '基于多 Agent 协作的 AI 原生测试平台',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <ThemeInitializer />
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
