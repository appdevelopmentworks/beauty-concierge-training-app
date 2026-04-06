import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3 } from "lucide-react";

import { ProgressMeter } from "@/components/progress-meter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCategoryIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/content";
import type { CategoryProgress } from "@/types/progress";

interface CategoryCardProps {
  category: Category;
  progress?: CategoryProgress;
}

export function CategoryCard({ category, progress }: CategoryCardProps) {
  const Icon = getCategoryIcon(category.icon);
  const answeredCount = progress?.answeredCount ?? 0;
  const progressValue = category.totalQuestions === 0 ? 0 : (answeredCount / category.totalQuestions) * 100;
  const primaryHref = progress?.completed
    ? `/results/${category.id}`
    : `/quiz/${category.id}/${Math.min(answeredCount, category.totalQuestions - 1)}`;
  const primaryLabel = progress?.completed ? "結果を見る" : answeredCount > 0 ? "続きから学ぶ" : "学習をはじめる";

  return (
    <Card
      className="overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${category.surface} 0%, rgba(255,255,255,0.95) 48%, white 100%)`,
        borderColor: category.border,
      }}
    >
      <CardContent className="space-y-5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/70 bg-white/85"
              style={{ color: category.accent }}
            >
              <Icon className="size-6" />
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold text-foreground">{category.title}</h2>
                {progress?.completed ? (
                  <Badge className="gap-1 bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="size-3.5" />
                    完了
                  </Badge>
                ) : null}
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{category.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/70 bg-white/80 p-3">
            <p className="text-xs text-muted-foreground">問題数</p>
            <p className="mt-1 text-lg font-semibold text-foreground">{category.totalQuestions}問</p>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/80 p-3">
            <p className="text-xs text-muted-foreground">想定時間</p>
            <p className="mt-1 inline-flex items-center gap-2 text-lg font-semibold text-foreground">
              <Clock3 className="size-4 text-muted-foreground" />
              {category.estimatedMinutes}分
            </p>
          </div>
        </div>

        <ProgressMeter
          label="学習進捗"
          value={progressValue}
          helper={`${answeredCount} / ${category.totalQuestions} 問を学習済み`}
        />

        <div className="flex gap-3">
          <Button asChild className="flex-1">
            <Link href={primaryHref} className="inline-flex items-center justify-center">
              {primaryLabel}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className={cn("flex-1 bg-white/72")}>
            <Link href={`/categories/${category.id}`}>詳細を見る</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
