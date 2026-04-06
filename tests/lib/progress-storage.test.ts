import { beforeEach, describe, expect, it } from "vitest";

import {
  getCategoryProgress,
  readProgress,
  readSessionResults,
  recordChecklistViewed,
  recordQuestionResult,
  resetChecklistProgress,
  toggleChecklistItem,
} from "@/lib/progress-storage";

describe("progress storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("normalizes older or partial localStorage payloads", () => {
    window.localStorage.setItem(
      "beauty-concierge-training-progress",
      JSON.stringify({
        reception: {
          answeredCount: 2,
        },
      }),
    );

    const progress = readProgress();

    expect(progress.reception).toEqual(
      expect.objectContaining({
        categoryId: "reception",
        answeredCount: 2,
        correctCount: 0,
        answeredQuestionIds: [],
        correctQuestionIds: [],
        checkedChecklistItemIds: [],
        completed: false,
        checklistCompleted: false,
        lastPlayedAt: null,
        lastChecklistViewedAt: null,
      }),
    );
  });

  it("records quiz answers once and saves a session result on completion", () => {
    recordQuestionResult({
      categoryId: "reception-flow",
      questionId: "q-1",
      isCorrect: true,
      totalQuestions: 2,
    });

    recordQuestionResult({
      categoryId: "reception-flow",
      questionId: "q-1",
      isCorrect: true,
      totalQuestions: 2,
    });

    recordQuestionResult({
      categoryId: "reception-flow",
      questionId: "q-2",
      isCorrect: false,
      totalQuestions: 2,
    });

    const progress = getCategoryProgress("reception-flow");
    const results = readSessionResults();

    expect(progress.answeredQuestionIds).toEqual(["q-1", "q-2"]);
    expect(progress.correctQuestionIds).toEqual(["q-1"]);
    expect(progress.answeredCount).toBe(2);
    expect(progress.correctCount).toBe(1);
    expect(progress.completed).toBe(true);
    expect(results["reception-flow"]).toEqual(
      expect.objectContaining({
        categoryId: "reception-flow",
        totalQuestions: 2,
        answeredCount: 2,
        correctCount: 1,
      }),
    );
  });

  it("tracks checklist views, completion, and reset", () => {
    const viewed = recordChecklistViewed("reception-flow");

    expect(viewed.lastChecklistViewedAt).not.toBeNull();

    toggleChecklistItem({
      categoryId: "reception-flow",
      itemId: "check-1",
      totalItems: 2,
    });
    toggleChecklistItem({
      categoryId: "reception-flow",
      itemId: "check-2",
      totalItems: 2,
    });

    let progress = getCategoryProgress("reception-flow");
    expect(progress.checkedChecklistItemIds).toEqual(["check-1", "check-2"]);
    expect(progress.checklistCompleted).toBe(true);

    resetChecklistProgress("reception-flow");

    progress = getCategoryProgress("reception-flow");
    expect(progress.checkedChecklistItemIds).toEqual([]);
    expect(progress.checklistCompleted).toBe(false);
    expect(progress.lastChecklistViewedAt).not.toBeNull();
  });
});
