"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

import { QuizCard } from "@/components/quiz-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCategory, getQuestionByIndex, getQuestionSources, getStudyQuestionsByCategory } from "@/lib/content";
import { recordQuestionResult } from "@/lib/progress-storage";
import type { QuizQuestion } from "@/types/content";

export default function QuizPage() {
  const params = useParams<{ categoryId: string; questionIndex: string }>();
  const router = useRouter();
  const categoryId = params.categoryId;
  const questionIndex = Number.parseInt(params.questionIndex, 10);
  const category = getCategory(categoryId);
  const questions = getStudyQuestionsByCategory(categoryId);
  const question = Number.isNaN(questionIndex) ? null : getQuestionByIndex(categoryId, questionIndex);
  const handledQuestionIdRef = useRef<string | null>(null);

  useEffect(() => {
    handledQuestionIdRef.current = null;
  }, [question?.id]);

  useEffect(() => {
    if (question?.type === "scenario") {
      router.replace(`/scenario/${question.id}?categoryId=${categoryId}&questionIndex=${questionIndex}`);
    }
  }, [categoryId, question, questionIndex, router]);

  if (!category || Number.isNaN(questionIndex)) {
    return (
      <Card>
        <CardContent className="space-y-4 p-5">
          <p className="text-sm leading-6 text-muted-foreground">問題のURLが正しくありません。</p>
          <Button asChild>
            <Link href="/categories">カテゴリ一覧へ戻る</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!question) {
    return (
      <Card>
        <CardContent className="space-y-4 p-5">
          <p className="text-sm leading-6 text-muted-foreground">
            このカテゴリの問題はここまでです。結果画面から振り返りできます。
          </p>
          <Button asChild>
            <Link href={`/results/${category.id}`}>結果を見る</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (question.type === "scenario") {
    return (
      <Card>
        <CardContent className="space-y-3 p-5">
          <Badge>会話シミュレーションへ移動中</Badge>
          <p className="text-sm leading-6 text-muted-foreground">シナリオ専用画面へ切り替えています。</p>
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
          タップするとすぐ正誤と解説が表示されます。最後まで進むと結果画面へ移動します。
        </p>
      </section>

      <QuizCard
        question={question as QuizQuestion}
        currentIndex={questionIndex}
        totalQuestions={questions.length}
        nextHref={nextHref}
        sources={getQuestionSources(question as QuizQuestion)}
        onAnswered={(isCorrect) => {
          if (handledQuestionIdRef.current === question.id) {
            return;
          }

          handledQuestionIdRef.current = question.id;
          recordQuestionResult({
            categoryId: category.id,
            questionId: question.id,
            isCorrect,
            totalQuestions: questions.length,
          });
        }}
      />
    </div>
  );
}
