"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, CircleHelp, XCircle } from "lucide-react";

import { KnowledgeBadge } from "@/components/knowledge-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/types/content";

interface QuizCardProps {
  question: QuizQuestion;
  currentIndex: number;
  totalQuestions: number;
  nextHref: string;
  onAnswered: (isCorrect: boolean) => void;
}

export function QuizCard({ question, currentIndex, totalQuestions, nextHref, onAnswered }: QuizCardProps) {
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSelectedChoiceId(null);
    setSubmitted(false);
  }, [question.id]);

  const isCorrect = selectedChoiceId === question.correctAnswer;

  const handleSelect = (choiceId: string) => {
    if (submitted) {
      return;
    }

    setSelectedChoiceId(choiceId);
    setSubmitted(true);
    onAnswered(choiceId === question.correctAnswer);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-4 border-b border-border/60 bg-white/80">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="outline">
            {currentIndex + 1} / {totalQuestions}
          </Badge>
          <div className="flex flex-wrap justify-end gap-2">
            <KnowledgeBadge knowledgeType={question.knowledgeType} />
            <Badge>{question.type === "true-false" ? "○×" : question.type === "order" ? "順序" : "選択式"}</Badge>
          </div>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-xl">{question.title}</CardTitle>
          <CardDescription className="text-sm">{question.prompt}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-5">
        {question.choices.map((choice) => {
          const isSelected = selectedChoiceId === choice.id;
          const showCorrect = submitted && choice.id === question.correctAnswer;
          const showIncorrect = submitted && isSelected && choice.id !== question.correctAnswer;

          return (
            <button
              key={choice.id}
              type="button"
              onClick={() => handleSelect(choice.id)}
              className={cn(
                "w-full rounded-[22px] border px-4 py-4 text-left transition",
                "min-h-16 bg-white/80",
                !submitted && "hover:border-primary/40 hover:bg-accent/60",
                isSelected && !submitted && "border-primary/60 bg-accent/80",
                showCorrect && "border-emerald-300 bg-emerald-50",
                showIncorrect && "border-rose-300 bg-rose-50",
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
                    showCorrect
                      ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                      : showIncorrect
                        ? "border-rose-300 bg-rose-100 text-rose-700"
                        : "border-border bg-white text-muted-foreground",
                  )}
                >
                  {choice.label}
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm leading-6 text-foreground">{choice.text}</p>
                  {submitted && isSelected ? (
                    <p className="text-xs leading-5 text-muted-foreground">
                      {showCorrect ? "この選択で正解です。" : "今回の選択は不正解です。"}
                    </p>
                  ) : null}
                </div>
              </div>
            </button>
          );
        })}

        {submitted ? (
          <div
            className={cn(
              "space-y-4 rounded-[24px] border p-4",
              isCorrect ? "border-emerald-200 bg-emerald-50/80" : "border-rose-200 bg-rose-50/80",
            )}
          >
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle2 className="mt-0.5 size-5 text-emerald-600" />
              ) : (
                <XCircle className="mt-0.5 size-5 text-rose-600" />
              )}
              <div className="space-y-1">
                <p className="font-semibold text-foreground">{isCorrect ? "正解です" : "もう一歩です"}</p>
                <p className="text-sm leading-6 text-muted-foreground">{question.explanation}</p>
              </div>
            </div>
            <Button asChild className="w-full">
              <Link href={nextHref}>
                次へ進む
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-border bg-white/70 p-4">
            <div className="flex items-start gap-3">
              <CircleHelp className="mt-0.5 size-5 text-primary" />
              <p className="text-sm leading-6 text-muted-foreground">
                選択肢をタップすると、その場で正誤と解説を確認できます。
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
