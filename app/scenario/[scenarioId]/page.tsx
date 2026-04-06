"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";

import { ScenarioCard } from "@/components/scenario-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCategory, getQuestionSources, getScenarioById, getStudyQuestionsByCategory } from "@/lib/content";
import { recordQuestionResult } from "@/lib/progress-storage";

export default function ScenarioPage() {
  const params = useParams<{ scenarioId: string }>();
  const searchParams = useSearchParams();
  const scenario = getScenarioById(params.scenarioId);
  const categoryId = searchParams.get("categoryId") ?? scenario?.categoryId ?? "";
  const questionIndex = Number.parseInt(searchParams.get("questionIndex") ?? "0", 10);
  const category = getCategory(categoryId);
  const questions = getStudyQuestionsByCategory(categoryId);
  const handledScenarioIdRef = useRef<string | null>(null);

  useEffect(() => {
    handledScenarioIdRef.current = null;
  }, [scenario?.id]);

  if (!scenario || !category) {
    return (
      <Card>
        <CardContent className="space-y-4 p-5">
          <p className="text-sm leading-6 text-muted-foreground">シナリオデータが見つかりませんでした。</p>
          <Button asChild>
            <Link href="/categories">カテゴリ一覧へ戻る</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const nextHref =
    questionIndex + 1 < questions.length ? `/quiz/${category.id}/${questionIndex + 1}` : `/results/${category.id}`;

  return (
    <div className="space-y-4">
      <section className="space-y-2">
        <Badge variant="outline">{category.title}</Badge>
        <p className="text-sm leading-6 text-muted-foreground">
          正しい対応を選ぶと次の会話へ進みます。誤った選択をした場合は、その場で振り返りに入ります。
        </p>
      </section>

      <ScenarioCard
        question={scenario}
        currentIndex={Number.isNaN(questionIndex) ? 0 : questionIndex}
        totalQuestions={questions.length}
        nextHref={nextHref}
        sources={getQuestionSources(scenario)}
        onCompleted={(isCorrect) => {
          if (handledScenarioIdRef.current === scenario.id) {
            return;
          }

          handledScenarioIdRef.current = scenario.id;
          recordQuestionResult({
            categoryId: category.id,
            questionId: scenario.id,
            isCorrect,
            totalQuestions: questions.length,
          });
        }}
      />
    </div>
  );
}
