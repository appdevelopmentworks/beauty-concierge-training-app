"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, Blend, ListChecks, RotateCcw, Sparkles } from "lucide-react";

import { KnowledgeBadge } from "@/components/knowledge-badge";
import { ProgressMeter } from "@/components/progress-meter";
import { SourceLinks } from "@/components/source-links";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProgressOverview } from "@/hooks/use-progress-overview";
import {
  getCategory,
  getCategoryContent,
  getQuestionSources,
  getQuestionTypeLabel,
  getStudyQuestionsByCategory,
} from "@/lib/content";
import { resetCategoryProgress } from "@/lib/progress-storage";

export default function CategoryDetailPage() {
  const params = useParams<{ categoryId: string }>();
  const router = useRouter();
  const progress = useProgressOverview();
  const categoryId = params.categoryId;
  const category = getCategory(categoryId);
  const content = getCategoryContent(categoryId);

  if (!category || !content) {
    return (
      <Card>
        <CardContent className="space-y-4 p-5">
          <p className="text-sm leading-6 text-muted-foreground">カテゴリ情報が見つかりませんでした。</p>
          <Button asChild>
            <Link href="/categories">カテゴリ一覧へ戻る</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const categoryProgress = progress[category.id];
  const studyQuestions = getStudyQuestionsByCategory(category.id);
  const answeredCount = categoryProgress?.answeredCount ?? 0;
  const checklistItems = content.checklist.items;
  const checkedChecklistCount = checklistItems.filter((item) =>
    categoryProgress?.checkedChecklistItemIds.includes(item.id),
  ).length;
  const progressValue = category.totalQuestions === 0 ? 0 : (answeredCount / category.totalQuestions) * 100;
  const checklistProgressValue =
    checklistItems.length === 0 ? 0 : (checkedChecklistCount / checklistItems.length) * 100;
  const nextHref = categoryProgress?.completed
    ? `/results/${category.id}`
    : `/quiz/${category.id}/${Math.min(answeredCount, category.totalQuestions - 1)}`;
  const typeCounts = studyQuestions.reduce(
    (acc, question) => {
      acc[question.type] = (acc[question.type] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  const knowledgeCounts = studyQuestions.reduce(
    (acc, question) => {
      acc[question.knowledgeType] += 1;
      return acc;
    },
    {
      "sbc-specific": 0,
      general: 0,
    } as Record<"sbc-specific" | "general", number>,
  );
  const totalWeight = category.knowledgeMix.sbcSpecific + category.knowledgeMix.general;
  const sbcRatio = Math.round((category.knowledgeMix.sbcSpecific / totalWeight) * 100);
  const generalRatio = Math.round((category.knowledgeMix.general / totalWeight) * 100);
  const categorySources = [
    ...content.referenceSources.sbcSpecific,
    ...content.referenceSources.general.filter(
      (source) => !content.referenceSources.sbcSpecific.some((item) => item.url === source.url),
    ),
  ];

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
              <Badge className="w-fit">カテゴリ詳細</Badge>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">{category.title}</h2>
                <p className="text-sm leading-7 text-muted-foreground">{content.overview}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/70 bg-white/82 p-4">
                <p className="text-xs text-muted-foreground">問題数</p>
                <p className="mt-1 text-xl font-semibold text-foreground">{category.totalQuestions}問</p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/82 p-4">
                <p className="text-xs text-muted-foreground">想定時間</p>
                <p className="mt-1 text-xl font-semibold text-foreground">{category.estimatedMinutes}分</p>
              </div>
            </div>

            <div className="space-y-4">
              <ProgressMeter
                label="クイズ進捗"
                value={progressValue}
                helper={`${answeredCount} / ${category.totalQuestions} 問を学習済み`}
              />
              <ProgressMeter
                label="チェックリスト進捗"
                value={checklistProgressValue}
                helper={`${checkedChecklistCount} / ${checklistItems.length} 項目を確認済み`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button asChild className="flex-1">
                <Link href={nextHref}>
                  {answeredCount > 0 ? "続きから再開" : "このカテゴリを始める"}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 bg-white/80">
                <Link href={`/checklists/${category.id}`}>
                  チェックリストを見る
                  <ListChecks className="size-4" />
                </Link>
              </Button>
            </div>

            <Button
              variant="ghost"
              className="w-full justify-center text-muted-foreground hover:text-foreground"
              onClick={() => {
                resetCategoryProgress(category.id);
                router.push(`/quiz/${category.id}/0`);
              }}
            >
              <RotateCcw className="size-4" />
              クイズを最初からやり直す
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/70 bg-white/82 p-4">
                <p className="text-xs text-muted-foreground">チェック項目</p>
                <p className="mt-1 text-xl font-semibold text-foreground">{checklistItems.length}項目</p>
              </div>
              <Button variant="outline" asChild className="h-auto min-h-[84px] bg-white/80 p-0">
                <Link
                  href={`/checklists/${category.id}`}
                  className="flex h-full flex-col items-start justify-center gap-1 px-4"
                >
                  <span className="text-xs text-muted-foreground">事前確認用</span>
                  <span className="text-base font-semibold text-foreground">
                    {checkedChecklistCount === checklistItems.length && checklistItems.length > 0
                      ? "すべて確認済み"
                      : `${checklistItems.length - checkedChecklistCount}項目が未確認`}
                  </span>
                </Link>
              </Button>
            </div>

            <SourceLinks sources={categorySources} compact />
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-2 gap-3">
        {Object.entries(typeCounts).map(([type, count]) => (
          <Card key={type}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{type === "scenario" ? "会話問題" : "クイズ問題"}</p>
              <p className="mt-1 text-xl font-semibold text-foreground">{count}問</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="space-y-3 p-4">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
              <Blend className="size-4 text-primary" />
              出題比率
            </div>
            <div className="space-y-2 text-sm leading-6 text-muted-foreground">
              <p>SBC独自 {sbcRatio}%</p>
              <p>一般知識 {generalRatio}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 p-4">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
              <Sparkles className="size-4 text-primary" />
              収録数
            </div>
            <div className="space-y-2 text-sm leading-6 text-muted-foreground">
              <p>SBC独自 {knowledgeCounts["sbc-specific"]}問</p>
              <p>一般知識 {knowledgeCounts.general}問</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">収録問題</h3>
        </div>
        <div className="space-y-3">
          {studyQuestions.map((question, index) => (
            <Card key={question.id}>
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <Badge variant="outline">Q{index + 1}</Badge>
                  <div className="flex flex-wrap justify-end gap-2">
                    <KnowledgeBadge knowledgeType={question.knowledgeType} />
                    <Badge>{getQuestionTypeLabel(question)}</Badge>
                  </div>
                </div>
                <CardTitle className="text-base">{question.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm leading-6 text-muted-foreground">{question.prompt}</p>
                <div className="flex flex-wrap gap-2">
                  {question.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <SourceLinks sources={getQuestionSources(question)} compact />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
