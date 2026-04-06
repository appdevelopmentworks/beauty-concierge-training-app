import type { CategoryProgress, ProgressMap, SessionResult } from "@/types/progress";

const PROGRESS_STORAGE_KEY = "beauty-concierge-training-progress";
const RESULT_STORAGE_KEY = "beauty-concierge-training-result";

function canUseStorage() {
  return typeof window !== "undefined";
}

function emitProgressUpdated() {
  if (!canUseStorage()) {
    return;
  }

  window.dispatchEvent(new Event("progress-updated"));
}

function createEmptyCategoryProgress(categoryId: string): CategoryProgress {
  return {
    categoryId,
    answeredQuestionIds: [],
    correctQuestionIds: [],
    answeredCount: 0,
    correctCount: 0,
    completed: false,
    lastPlayedAt: null,
  };
}

export function readProgress(): ProgressMap {
  if (!canUseStorage()) {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as ProgressMap;
    return parsed ?? {};
  } catch {
    return {};
  }
}

function writeProgress(progress: ProgressMap) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  emitProgressUpdated();
}

export function getCategoryProgress(categoryId: string) {
  const progress = readProgress();
  return progress[categoryId] ?? createEmptyCategoryProgress(categoryId);
}

export function recordQuestionResult(params: {
  categoryId: string;
  questionId: string;
  isCorrect: boolean;
  totalQuestions: number;
}) {
  const { categoryId, questionId, isCorrect, totalQuestions } = params;
  const progress = readProgress();
  const current = progress[categoryId] ?? createEmptyCategoryProgress(categoryId);

  if (current.answeredQuestionIds.includes(questionId)) {
    return current;
  }

  const next: CategoryProgress = {
    ...current,
    answeredQuestionIds: [...current.answeredQuestionIds, questionId],
    correctQuestionIds: isCorrect
      ? [...current.correctQuestionIds, questionId]
      : current.correctQuestionIds,
    answeredCount: current.answeredCount + 1,
    correctCount: isCorrect ? current.correctCount + 1 : current.correctCount,
    completed: current.answeredCount + 1 >= totalQuestions,
    lastPlayedAt: new Date().toISOString(),
  };

  writeProgress({
    ...progress,
    [categoryId]: next,
  });

  if (next.completed) {
    saveSessionResult({
      categoryId,
      totalQuestions,
      answeredCount: next.answeredCount,
      correctCount: next.correctCount,
      completedAt: next.lastPlayedAt ?? new Date().toISOString(),
    });
  }

  return next;
}

export function resetCategoryProgress(categoryId: string) {
  const progress = readProgress();

  writeProgress({
    ...progress,
    [categoryId]: createEmptyCategoryProgress(categoryId),
  });
}

export function getProgressPercent(answeredCount: number, totalQuestions: number) {
  if (totalQuestions === 0) {
    return 0;
  }

  return (answeredCount / totalQuestions) * 100;
}

export function saveSessionResult(result: SessionResult) {
  if (!canUseStorage()) {
    return;
  }

  const current = readSessionResults();
  window.localStorage.setItem(
    RESULT_STORAGE_KEY,
    JSON.stringify({
      ...current,
      [result.categoryId]: result,
    }),
  );
}

export function readSessionResults(): Record<string, SessionResult> {
  if (!canUseStorage()) {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(RESULT_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    return JSON.parse(raw) as Record<string, SessionResult>;
  } catch {
    return {};
  }
}

export function getSessionResult(categoryId: string) {
  const results = readSessionResults();
  return results[categoryId] ?? null;
}
