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
    checkedChecklistItemIds: [],
    answeredCount: 0,
    correctCount: 0,
    completed: false,
    lastPlayedAt: null,
    checklistCompleted: false,
    lastChecklistViewedAt: null,
  };
}

function normalizeCategoryProgress(categoryId: string, value: Partial<CategoryProgress> | null | undefined): CategoryProgress {
  const empty = createEmptyCategoryProgress(categoryId);

  return {
    ...empty,
    ...value,
    categoryId,
    answeredQuestionIds: Array.isArray(value?.answeredQuestionIds) ? value.answeredQuestionIds : [],
    correctQuestionIds: Array.isArray(value?.correctQuestionIds) ? value.correctQuestionIds : [],
    checkedChecklistItemIds: Array.isArray(value?.checkedChecklistItemIds) ? value.checkedChecklistItemIds : [],
    answeredCount: typeof value?.answeredCount === "number" ? value.answeredCount : 0,
    correctCount: typeof value?.correctCount === "number" ? value.correctCount : 0,
    completed: typeof value?.completed === "boolean" ? value.completed : false,
    lastPlayedAt: typeof value?.lastPlayedAt === "string" ? value.lastPlayedAt : null,
    checklistCompleted: typeof value?.checklistCompleted === "boolean" ? value.checklistCompleted : false,
    lastChecklistViewedAt: typeof value?.lastChecklistViewedAt === "string" ? value.lastChecklistViewedAt : null,
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

    const parsed = JSON.parse(raw) as Record<string, Partial<CategoryProgress>>;
    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).map(([categoryId, value]) => [categoryId, normalizeCategoryProgress(categoryId, value)]),
    );
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

export function recordChecklistViewed(categoryId: string) {
  const progress = readProgress();
  const current = progress[categoryId] ?? createEmptyCategoryProgress(categoryId);

  const next: CategoryProgress = {
    ...current,
    lastChecklistViewedAt: new Date().toISOString(),
  };

  writeProgress({
    ...progress,
    [categoryId]: next,
  });

  return next;
}

export function toggleChecklistItem(params: {
  categoryId: string;
  itemId: string;
  totalItems: number;
}) {
  const { categoryId, itemId, totalItems } = params;
  const progress = readProgress();
  const current = progress[categoryId] ?? createEmptyCategoryProgress(categoryId);
  const isChecked = current.checkedChecklistItemIds.includes(itemId);
  const checkedChecklistItemIds = isChecked
    ? current.checkedChecklistItemIds.filter((currentItemId) => currentItemId !== itemId)
    : [...current.checkedChecklistItemIds, itemId];

  const next: CategoryProgress = {
    ...current,
    checkedChecklistItemIds,
    checklistCompleted: totalItems > 0 && checkedChecklistItemIds.length >= totalItems,
    lastChecklistViewedAt: new Date().toISOString(),
  };

  writeProgress({
    ...progress,
    [categoryId]: next,
  });

  return next;
}

export function resetChecklistProgress(categoryId: string) {
  const progress = readProgress();
  const current = progress[categoryId] ?? createEmptyCategoryProgress(categoryId);

  writeProgress({
    ...progress,
    [categoryId]: {
      ...current,
      checkedChecklistItemIds: [],
      checklistCompleted: false,
      lastChecklistViewedAt: new Date().toISOString(),
    },
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
