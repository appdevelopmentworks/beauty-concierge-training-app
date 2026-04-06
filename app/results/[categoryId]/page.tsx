"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { ResultSummary } from "@/components/result-summary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProgressOverview } from "@/hooks/use-progress-overview";
import { getCategory, getStudyQuestionsByCategory } from "@/lib/content";
import { getSessionResult, resetCategoryProgress } from "@/lib/progress-storage";

export default function ResultsPage() {
  const params = useParams<{ categoryId: string }>();
  const router = useRouter();
  const progress = useProgressOverview();
  const category = getCategory(params.categoryId);
  const questions = getStudyQuestionsByCategory(params.categoryId);
  const [completedAt, setCompletedAt] = useState<string | null>(null);

  useEffect(() => {
    const sessionResult = getSessionResult(params.categoryId);
    setCompletedAt(sessionResult?.completedAt ?? progress[params.categoryId]?.lastPlayedAt ?? null);
  }, [params.categoryId, progress]);

  if (!category) {
    return (
      <Card>
        <CardContent className="space-y-4 p-5">
          <p className="text-sm leading-6 text-muted-foreground">結果を表示できるカテゴリが見つかりません。</p>
          <Button asChild>
            <Link href="/categories">カテゴリ一覧へ戻る</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const categoryProgress = progress[category.id];
  const answeredCount = categoryProgress?.answeredCount ?? 0;
  const correctCount = categoryProgress?.correctCount ?? 0;
  const percent = questions.length === 0 ? 0 : Math.round((correctCount / questions.length) * 100);
  const message =
    percent >= 80
      ? "かなり安定しています。次は別カテゴリへ広げていく流れがおすすめです。"
      : percent >= 50
        ? "基本は押さえられています。解説を見直して、もう一度同カテゴリを回すと定着しやすくなります。"
        : "最初の1周としては十分です。カテゴリ詳細から論点を確認して、もう一度解いてみましょう。";

  return (
    <div className="space-y-5">
      <ResultSummary
        categoryTitle={category.title}
        totalQuestions={questions.length}
        answeredCount={answeredCount}
        correctCount={correctCount}
        completedAt={completedAt}
        onRetry={() => {
          resetCategoryProgress(category.id);
          router.push(`/quiz/${category.id}/0`);
        }}
      />

      <Card>
        <CardContent className="space-y-3 p-5">
          <Badge>振り返りメモ</Badge>
          <p className="text-sm leading-7 text-muted-foreground">{message}</p>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button asChild className="flex-1">
          <Link href="/categories">別カテゴリへ</Link>
        </Button>
        <Button asChild variant="outline" className="flex-1 bg-white/82">
          <Link href="/progress">進捗を見る</Link>
        </Button>
      </div>
    </div>
  );
}
