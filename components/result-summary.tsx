import { Award, RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

interface ResultSummaryProps {
  categoryTitle: string;
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  completedAt?: string | null;
  onRetry?: () => void;
}

export function ResultSummary({
  categoryTitle,
  totalQuestions,
  answeredCount,
  correctCount,
  completedAt,
  onRetry,
}: ResultSummaryProps) {
  const percent = totalQuestions === 0 ? 0 : Math.round((correctCount / totalQuestions) * 100);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-4 border-b border-border/60 bg-white/82">
        <Badge className="w-fit">学習結果</Badge>
        <div className="space-y-2">
          <CardTitle className="text-xl">{categoryTitle}</CardTitle>
          <CardDescription>今回の学習セッションの結果を確認できます。</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 p-5">
        <div className="rounded-[28px] border border-primary/15 bg-primary/5 p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-white text-primary">
              <Award className="size-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">正答率</p>
              <p className="text-3xl font-semibold tracking-tight text-foreground">{percent}%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-border/70 bg-white/82 p-3 text-center">
            <p className="text-xs text-muted-foreground">正答</p>
            <p className="mt-1 text-xl font-semibold">{correctCount}</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-white/82 p-3 text-center">
            <p className="text-xs text-muted-foreground">回答</p>
            <p className="mt-1 text-xl font-semibold">{answeredCount}</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-white/82 p-3 text-center">
            <p className="text-xs text-muted-foreground">総数</p>
            <p className="mt-1 text-xl font-semibold">{totalQuestions}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-white/82 px-4 py-3 text-sm leading-6 text-muted-foreground">
          最終学習: {formatDate(completedAt)}
        </div>

        {onRetry ? (
          <Button onClick={onRetry} variant="outline" className="w-full bg-white/82">
            <RotateCcw className="size-4" />
            もう一度最初から
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
