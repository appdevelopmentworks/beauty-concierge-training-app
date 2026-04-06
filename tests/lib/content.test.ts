import { describe, expect, it } from "vitest";

import { categories, getCategoryContent, getChecklistByCategory, getQuestionSources, getTotalQuestionCount } from "@/lib/content";

describe("content data", () => {
  it("keeps category totals, questions, and checklists aligned", () => {
    expect(categories).toHaveLength(6);
    expect(getTotalQuestionCount()).toBe(60);

    for (const category of categories) {
      const content = getCategoryContent(category.id);
      const checklist = getChecklistByCategory(category.id);

      expect(content).not.toBeNull();
      expect(content?.questions).toHaveLength(category.totalQuestions);
      expect(content?.questions.every((question) => question.categoryId === category.id)).toBe(true);
      expect(checklist?.items.length).toBeGreaterThanOrEqual(5);
    }
  });

  it("resolves at least one reference source for every question", () => {
    for (const category of categories) {
      const content = getCategoryContent(category.id);
      expect(content).not.toBeNull();

      for (const question of content?.questions ?? []) {
        expect(getQuestionSources(question).length).toBeGreaterThan(0);

        if (question.type === "scenario") {
          for (const step of question.steps) {
            expect((step.sources ?? []).length).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  it("keeps a source URL on every checklist item", () => {
    for (const category of categories) {
      const checklist = getChecklistByCategory(category.id);

      expect(checklist).not.toBeNull();
      for (const item of checklist?.items ?? []) {
        expect(item.sources?.length ?? 0).toBeGreaterThan(0);
      }
    }
  });
});
