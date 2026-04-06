"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, MessageSquareQuote, XCircle } from "lucide-react";

import { KnowledgeBadge } from "@/components/knowledge-badge";
import { SourceLinks } from "@/components/source-links";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ScenarioQuestion, SourceLink } from "@/types/content";

interface ScenarioCardProps {
  question: ScenarioQuestion;
  currentIndex: number;
  totalQuestions: number;
  nextHref: string;
  sources: SourceLink[];
  onCompleted: (isCorrect: boolean) => void;
}

export function ScenarioCard({
  question,
  currentIndex,
  totalQuestions,
  nextHref,
  sources,
  onCompleted,
}: ScenarioCardProps) {
  const [currentStepId, setCurrentStepId] = useState(question.steps[0]?.id ?? "");
  const [resolved, setResolved] = useState<{
    isCorrect: boolean;
    feedback?: string;
  } | null>(null);

  useEffect(() => {
    setCurrentStepId(question.steps[0]?.id ?? "");
    setResolved(null);
  }, [question.id, question.steps]);

  const currentStep = useMemo(
    () => question.steps.find((step) => step.id === currentStepId) ?? question.steps[0],
    [currentStepId, question.steps],
  );

  const currentStepNumber = question.steps.findIndex((step) => step.id === currentStep?.id) + 1;

  const handleSelect = (choiceId: string) => {
    if (!currentStep || resolved) {
      return;
    }

    const choice = currentStep.choices.find((item) => item.id === choiceId);
    if (!choice) {
      return;
    }

    const isCorrectChoice = choice.id === currentStep.correctChoiceId;

    if (isCorrectChoice && choice.nextStepId) {
      setCurrentStepId(choice.nextStepId);
      return;
    }

    const outcome = {
      isCorrect: isCorrectChoice,
      feedback: choice.feedback,
    };

    setResolved(outcome);
    onCompleted(outcome.isCorrect);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-4 border-b border-border/60 bg-white/82">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="outline">
            {currentIndex + 1} / {totalQuestions}
          </Badge>
          <div className="flex flex-wrap justify-end gap-2">
            <KnowledgeBadge knowledgeType={question.knowledgeType} />
            <Badge>STEP {resolved ? question.steps.length : currentStepNumber}</Badge>
          </div>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-xl">{question.title}</CardTitle>
          <CardDescription className="text-sm leading-6">{question.situation}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-5">
        {!resolved && currentStep ? (
          <>
            <div className="rounded-[24px] border border-primary/12 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-white text-primary">
                  <MessageSquareQuote className="size-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {currentStep.speaker}
                  </p>
                  <p className="text-sm leading-6 text-foreground">{currentStep.message}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">{currentStep.prompt}</p>
              <p className="text-xs leading-5 text-muted-foreground">
                正しい対応を選ぶと次の会話へ進みます。誤った対応はその場で振り返ります。
              </p>
            </div>

            <div className="space-y-3">
              {currentStep.choices.map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => handleSelect(choice.id)}
                  className="w-full rounded-[22px] border border-border bg-white/82 px-4 py-4 text-left transition hover:border-primary/40 hover:bg-accent/60"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-white text-sm font-semibold text-muted-foreground">
                      {choice.label}
                    </div>
                    <p className="text-sm leading-6 text-foreground">{choice.text}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : null}

        {resolved ? (
          <div
            className={cn(
              "space-y-4 rounded-[24px] border p-4",
              resolved.isCorrect ? "border-emerald-200 bg-emerald-50/80" : "border-rose-200 bg-rose-50/80",
            )}
          >
            <div className="flex items-start gap-3">
              {resolved.isCorrect ? (
                <CheckCircle2 className="mt-0.5 size-5 text-emerald-600" />
              ) : (
                <XCircle className="mt-0.5 size-5 text-rose-600" />
              )}
              <div className="space-y-1">
                <p className="font-semibold text-foreground">
                  {resolved.isCorrect ? "会話の運び方がよいです" : "初動を見直してみましょう"}
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {resolved.isCorrect ? question.feedbackCorrect : question.feedbackIncorrect}
                </p>
              </div>
            </div>
            {resolved.feedback ? (
              <p className="rounded-2xl bg-white/80 px-4 py-3 text-sm leading-6 text-muted-foreground">
                選択の振り返り: {resolved.feedback}
              </p>
            ) : null}
            <p className="text-sm leading-6 text-muted-foreground">{question.explanation}</p>
            <SourceLinks sources={sources} compact />
            <Button asChild className="w-full">
              <Link href={nextHref}>
                次へ進む
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
