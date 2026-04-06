"use client";

import Link from "next/link";
import { ListChecks, Trophy } from "lucide-react";

import { ProgressMeter } from "@/components/progress-meter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProgressOverview } from "@/hooks/use-progress-overview";
import { categories, getChecklistByCategory } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export default function ProgressPage() {
  const progress = useProgressOverview();

  const totals = categories.reduce(
    (acc, category) => {
      const categoryProgress = progress[category.id];
      const checklist = getChecklistByCategory(category.id);
      const checklistTotal = checklist?.items.length ?? 0;
      const checklistChecked =
        checklist?.items.filter((item) => categoryProgress?.checkedChecklistItemIds.includes(item.id)).length ?? 0;

      return {
        answered: acc.answered + (categoryProgress?.answeredCount ?? 0),
        correct: acc.correct + (categoryProgress?.correctCount ?? 0),
        completed: acc.completed + (categoryProgress?.completed ? 1 : 0),
        checklistChecked: acc.checklistChecked + checklistChecked,
        checklistTotal: acc.checklistTotal + checklistTotal,
        checklistCompleted: acc.checklistCompleted + (categoryProgress?.checklistCompleted ? 1 : 0),
      };
    },
    { answered: 0, correct: 0, completed: 0, checklistChecked: 0, checklistTotal: 0, checklistCompleted: 0 },
  );

  const overallAccuracy = totals.answered === 0 ? 0 : (totals.correct / totals.answered) * 100;
  const checklistAccuracy = totals.checklistTotal === 0 ? 0 : (totals.checklistChecked / totals.checklistTotal) * 100;

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">回答済み</p>
            <p className="mt-1 text-2xl font-semibold">{totals.answered}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">正答率</p>
            <p className="mt-1 text-2xl font-semibold">{Math.round(overallAccuracy)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">クイズ完了</p>
            <p className="mt-1 text-2xl font-semibold">{totals.completed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">チェック完了</p>
            <p className="mt-1 text-2xl font-semibold">{totals.checklistCompleted}</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="space-y-2 p-4">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
              <Trophy className="size-4 text-primary" />
              クイズ全体
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              {totals.correct} / {totals.answered} 問正解
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-4">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
              <ListChecks className="size-4 text-primary" />
              チェック全体
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              {totals.checklistChecked} / {totals.checklistTotal} 項目確認済み
            </p>
            <p className="text-sm font-semibold text-foreground">{Math.round(checklistAccuracy)}%</p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        {categories.map((category) => {
          const categoryProgress = progress[category.id];
          const checklist = getChecklistByCategory(category.id);
          const answeredCount = categoryProgress?.answeredCount ?? 0;
          const correctCount = categoryProgress?.correctCount ?? 0;
          const checklistTotal = checklist?.items.length ?? 0;
          const checklistChecked =
            checklist?.items.filter((item) => categoryProgress?.checkedChecklistItemIds.includes(item.id)).length ?? 0;
          const percent = category.totalQuestions === 0 ? 0 : (answeredCount / category.totalQuestions) * 100;
          const accuracy = answeredCount === 0 ? 0 : (correctCount / answeredCount) * 100;
          const checklistPercent = checklistTotal === 0 ? 0 : (checklistChecked / checklistTotal) * 100;

          return (
            <Card key={category.id}>
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">{category.title}</CardTitle>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{category.description}</p>
                  </div>
                  {categoryProgress?.completed ? <Badge>完了</Badge> : null}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ProgressMeter
                  label="クイズ進捗"
                  value={percent}
                  helper={`${answeredCount} / ${category.totalQuestions} 問`}
                />
                <ProgressMeter
                  label="チェックリスト進捗"
                  value={checklistPercent}
                  helper={`${checklistChecked} / ${checklistTotal} 項目`}
                />
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-border/70 bg-white/82 p-3">
                    <p className="text-xs text-muted-foreground">正答率</p>
                    <p className="mt-1 text-lg font-semibold text-foreground">{Math.round(accuracy)}%</p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-white/82 p-3">
                    <p className="text-xs text-muted-foreground">最終確認</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {formatDate(categoryProgress?.lastChecklistViewedAt)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-white/82 p-3">
                    <p className="text-xs text-muted-foreground">最終学習</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{formatDate(categoryProgress?.lastPlayedAt)}</p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-white/82 p-3">
                    <p className="text-xs text-muted-foreground">チェック完了</p>
                    <p className="mt-1 text-lg font-semibold text-foreground">
                      {categoryProgress?.checklistCompleted ? "済" : "未"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button asChild className="flex-1">
                    <Link
                      href={
                        categoryProgress?.completed
                          ? `/results/${category.id}`
                          : `/quiz/${category.id}/${Math.min(answeredCount, category.totalQuestions - 1)}`
                      }
                    >
                      {categoryProgress?.answeredCount ? "続きから学ぶ" : "学習を開始"}
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1 bg-white/82">
                    <Link href={`/checklists/${category.id}`}>チェックリスト</Link>
                  </Button>
                </div>
                <Button asChild variant="ghost" className="w-full justify-center text-muted-foreground hover:text-foreground">
                  <Link href={`/categories/${category.id}`}>カテゴリ詳細を見る</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
