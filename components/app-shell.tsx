"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { AppHeader } from "@/components/app-header";
import { BottomNav } from "@/components/bottom-nav";

const sectionMeta = [
  {
    matcher: (pathname: string) => pathname === "/",
    title: "初月研修MVP",
    subtitle: "カテゴリを選んで、1問ずつ反復学習できるスマホ教材です。",
  },
  {
    matcher: (pathname: string) => pathname.startsWith("/categories"),
    title: "カテゴリ学習",
    subtitle: "受付からクレーム初期対応まで、実務の基本を短時間で確認します。",
  },
  {
    matcher: (pathname: string) => pathname.startsWith("/quiz"),
    title: "クイズ演習",
    subtitle: "答えた直後に解説を確認しながら、知識を定着させます。",
  },
  {
    matcher: (pathname: string) => pathname.startsWith("/scenario"),
    title: "会話シミュレーション",
    subtitle: "対応の順番や言い回しを、実務トーンで練習できます。",
  },
  {
    matcher: (pathname: string) => pathname.startsWith("/results"),
    title: "学習結果",
    subtitle: "正答率と振り返りポイントを見て、次の学習へつなげます。",
  },
  {
    matcher: (pathname: string) => pathname.startsWith("/progress"),
    title: "進捗ダッシュボード",
    subtitle: "どこまで学習できたかをカテゴリ別に一覧できます。",
  },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const current = sectionMeta.find((item) => item.matcher(pathname)) ?? sectionMeta[0];

  return (
    <div className="mx-auto min-h-screen max-w-md app-shell">
      <AppHeader title={current.title} subtitle={current.subtitle} />
      <main className="px-4 pb-28 pt-5">{children}</main>
      <BottomNav />
    </div>
  );
}
