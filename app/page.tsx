"use client";

import Link from "next/link";
import { ArrowRight, BookMarked, CircleCheckBig, ListChecks, PlayCircle } from "lucide-react";

import { CategoryCard } from "@/components/category-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProgressOverview } from "@/hooks/use-progress-overview";
import { categories, getTotalQuestionCount } from "@/lib/content";

export default function HomePage() {
  const progress = useProgressOverview();
  const totalQuestions = getTotalQuestionCount();
  const answeredQuestions = categories.reduce((sum, category) => sum + (progress[category.id]?.answeredCount ?? 0), 0);
  const completedCategories = categories.filter((category) => progress[category.id]?.completed).length;
  const featuredCategories = [...categories]
    .sort((left, right) => (progress[left.id]?.answeredCount ?? 0) - (progress[right.id]?.answeredCount ?? 0))
    .slice(0, 2);

  return (
    <div className="space-y-5">
      <section className="space-y-4">
        <Card className="overflow-hidden border-none bg-transparent shadow-none">
          <CardContent className="space-y-5 rounded-[32px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,247,244,0.98)_0%,rgba(255,255,255,0.96)_48%,rgba(255,250,247,0.98)_100%)] p-6">
            <div className="space-y-3">
              <Badge className="w-fit">スマホ完結型の初月研修</Badge>
              <div className="space-y-2">
                <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                  1問ずつ積み上げる、
                  <br />
                  SBCコンシェルジュ研修MVP
                </h2>
                <p className="text-sm leading-7 text-muted-foreground">
                  受付、カウンセリング、施術知識、会計、問い合わせ、個人情報とクレーム初動までを
                  ダミーデータで反復学習できます。
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/70 bg-white/82 p-3 text-center">
                <p className="text-xs text-muted-foreground">カテゴリ</p>
                <p className="mt-1 text-2xl font-semibold">{categories.length}</p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/82 p-3 text-center">
                <p className="text-xs text-muted-foreground">問題数</p>
                <p className="mt-1 text-2xl font-semibold">{totalQuestions}</p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/82 p-3 text-center">
                <p className="text-xs text-muted-foreground">完了</p>
                <p className="mt-1 text-2xl font-semibold">{completedCategories}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button asChild className="flex-1">
                <Link href="/categories">
                  学習を始める
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 bg-white/80">
                <Link href="/progress">進捗を見る</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="space-y-2 p-4">
            <BookMarked className="size-5 text-primary" />
            <p className="text-xs text-muted-foreground">学習済み</p>
            <p className="text-lg font-semibold text-foreground">{answeredQuestions}問</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-4">
            <PlayCircle className="size-5 text-primary" />
            <p className="text-xs text-muted-foreground">次の一歩</p>
            <p className="text-sm font-semibold text-foreground">カテゴリから再開</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-4">
            <CircleCheckBig className="size-5 text-primary" />
            <p className="text-xs text-muted-foreground">保存先</p>
            <p className="text-sm font-semibold text-foreground">LocalStorage</p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">おすすめカテゴリ</h3>
            <p className="text-sm leading-6 text-muted-foreground">まだ学習量が少ないカテゴリから始められます。</p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/categories">すべて見る</Link>
          </Button>
        </div>
        <div className="space-y-4">
          {featuredCategories.map((category) => (
            <CategoryCard key={category.id} category={category} progress={progress[category.id]} />
          ))}
        </div>
      </section>

      <section>
        <Card>
          <CardContent className="space-y-3 p-5">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
              <ListChecks className="size-4 text-primary" />
              このMVPでできること
            </div>
            <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
              <li>カテゴリ別に 1 問ずつ学習できる</li>
              <li>会話シミュレーションをカテゴリごとに 1 問以上収録</li>
              <li>回答結果と進捗を端末内に保存できる</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
