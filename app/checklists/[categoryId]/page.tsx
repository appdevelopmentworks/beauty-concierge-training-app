"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowRight, CheckCircle2, Circle, ListChecks, RotateCcw } from "lucide-react";

import { ProgressMeter } from "@/components/progress-meter";
import { SourceLinks } from "@/components/source-links";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProgressOverview } from "@/hooks/use-progress-overview";
import { getCategory, getChecklistByCategory } from "@/lib/content";
import { recordChecklistViewed, resetChecklistProgress, toggleChecklistItem } from "@/lib/progress-storage";
import { formatDate } from "@/lib/utils";

export default function ChecklistPage() {
  const params = useParams<{ categoryId: string }>();
  const progress = useProgressOverview();
  const categoryId = params.categoryId;
  const category = getCategory(categoryId);
  const checklist = getChecklistByCategory(categoryId);

  useEffect(() => {
    if (!category || !checklist) {
      return;
    }

    recordChecklistViewed(category.id);
  }, [category, checklist]);

  if (!category || !checklist) {
    return (
      <Card>
        <CardContent className="space-y-4 p-5">
          <p className="text-sm leading-6 text-muted-foreground">チェックリスト情報が見つかりませんでした。</p>
          <Button asChild>
            <Link href="/categories">カテゴリ一覧へ戻る</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const categoryProgress = progress[category.id];
  const checkedItemIds = categoryProgress?.checkedChecklistItemIds ?? [];
  const checkedCount = checklist.items.filter((item) => checkedItemIds.includes(item.id)).length;
  const checklistProgressValue = checklist.items.length === 0 ? 0 : (checkedCount / checklist.items.length) * 100;
  const nextQuizHref = categoryProgress?.completed
    ? `/results/${category.id}`
    : `/quiz/${category.id}/${Math.min(categoryProgress?.answeredCount ?? 0, category.totalQuestions - 1)}`;

  return (
    <div className="space-y-5">
      <section>
        <Card
          className="overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${category.surface} 0%, rgba(255,255,255,0.96) 56%, white 100%)`,
            borderColor: category.border,
          }}
        >
          <CardContent className="space-y-5 p-5">
            <div className="space-y-3">
              <Badge className="w-fit">Checklist Learning</Badge>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">{checklist.title}</h2>
                <p className="text-sm leading-7 text-muted-foreground">{checklist.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/70 bg-white/82 p-4">
                <p className="text-xs text-muted-foreground">対象カテゴリ</p>
                <p className="mt-1 text-lg font-semibold text-foreground">{category.title}</p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/82 p-4">
                <p className="text-xs text-muted-foreground">最終確認</p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {formatDate(categoryProgress?.lastChecklistViewedAt)}
                </p>
              </div>
            </div>

            <ProgressMeter
              label="チェックリスト進捗"
              value={checklistProgressValue}
              helper={`${checkedCount} / ${checklist.items.length} 項目を確認済み`}
            />

            <div className="grid grid-cols-2 gap-3">
              <Button asChild className="flex-1">
                <Link href={nextQuizHref}>
                  クイズへ進む
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-white/80"
                onClick={() => resetChecklistProgress(category.id)}
              >
                <RotateCcw className="size-4" />
                確認状態をリセット
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <ListChecks className="size-4 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">確認項目</h3>
        </div>
        <div className="space-y-3">
          {checklist.items.map((item, index) => {
            const isChecked = checkedItemIds.includes(item.id);

            return (
              <Card key={item.id} className={isChecked ? "border-emerald-200 bg-emerald-50/70" : undefined}>
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <Badge variant="outline">CHECK {index + 1}</Badge>
                      <div className="space-y-1">
                        <h4 className="text-base font-semibold text-foreground">{item.title}</h4>
                        <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <Button
                      variant={isChecked ? "default" : "outline"}
                      className="shrink-0"
                      onClick={() =>
                        toggleChecklistItem({
                          categoryId: category.id,
                          itemId: item.id,
                          totalItems: checklist.items.length,
                        })
                      }
                    >
                      {isChecked ? <CheckCircle2 className="size-4" /> : <Circle className="size-4" />}
                      {isChecked ? "確認済み" : "確認する"}
                    </Button>
                  </div>
                  <SourceLinks sources={item.sources ?? []} compact />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
