import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CategoryDetailPage from "@/app/categories/[categoryId]/page";
import CategoriesPage from "@/app/categories/page";
import ChecklistPage from "@/app/checklists/[categoryId]/page";
import HomePage from "@/app/page";
import ProgressPage from "@/app/progress/page";
import { getChecklistByCategory } from "@/lib/content";
import type { CategoryProgress, ProgressMap } from "@/types/progress";

let paramsState: Record<string, string> = { categoryId: "reception-flow" };
let progressState: ProgressMap = {};

const pushMock = vi.fn();
const resetCategoryProgressMock = vi.fn();
const recordChecklistViewedMock = vi.fn();
const resetChecklistProgressMock = vi.fn();
const toggleChecklistItemMock = vi.fn();

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/navigation", () => ({
  useParams: () => paramsState,
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("@/hooks/use-progress-overview", () => ({
  useProgressOverview: () => progressState,
}));

vi.mock("@/lib/progress-storage", async () => {
  const actual = await vi.importActual<typeof import("@/lib/progress-storage")>("@/lib/progress-storage");

  return {
    ...actual,
    recordChecklistViewed: (...args: Parameters<typeof actual.recordChecklistViewed>) =>
      recordChecklistViewedMock(...args),
    resetChecklistProgress: (...args: Parameters<typeof actual.resetChecklistProgress>) =>
      resetChecklistProgressMock(...args),
    resetCategoryProgress: (...args: Parameters<typeof actual.resetCategoryProgress>) =>
      resetCategoryProgressMock(...args),
    toggleChecklistItem: (...args: Parameters<typeof actual.toggleChecklistItem>) => toggleChecklistItemMock(...args),
  };
});

function createCategoryProgress(categoryId: string, overrides: Partial<CategoryProgress> = {}): CategoryProgress {
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
    ...overrides,
  };
}

describe("screen smoke tests", () => {
  beforeEach(() => {
    paramsState = { categoryId: "reception-flow" };
    progressState = {};
  });

  it("renders the home page summary and primary actions", () => {
    progressState = {
      "reception-flow": createCategoryProgress("reception-flow", { answeredCount: 3 }),
      "counseling-basics": createCategoryProgress("counseling-basics", { completed: true }),
    };

    render(<HomePage />);

    expect(screen.getByRole("heading", { name: /SBCコンシェルジュ研修MVP/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "学習を始める" })).toHaveAttribute("href", "/categories");
    expect(screen.getByText("カテゴリ別にクイズ学習とチェックリスト学習を切り替えられる")).toBeInTheDocument();
  });

  it("renders the categories page with the current catalog summary", () => {
    render(<CategoriesPage />);

    expect(screen.getByText("カテゴリ一覧")).toBeInTheDocument();
    expect(screen.getByText("6カテゴリ・合計60問とチェックリスト学習を収録しています。途中からでもそのまま再開できます。")).toBeInTheDocument();
  });

  it("renders category detail with checklist CTA and can reset quiz progress", () => {
    const checklist = getChecklistByCategory("reception-flow");
    const checkedChecklistItemIds = checklist?.items.slice(0, 2).map((item) => item.id) ?? [];

    progressState = {
      "reception-flow": createCategoryProgress("reception-flow", {
        answeredCount: 4,
        checkedChecklistItemIds,
      }),
    };

    render(<CategoryDetailPage />);

    expect(screen.getByRole("link", { name: "チェックリストを見る" })).toHaveAttribute(
      "href",
      "/checklists/reception-flow",
    );
    expect(screen.getByText("3項目が未確認")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "クイズを最初からやり直す" }));

    expect(resetCategoryProgressMock).toHaveBeenCalledWith("reception-flow");
    expect(pushMock).toHaveBeenCalledWith("/quiz/reception-flow/0");
  });

  it("renders the checklist page and records checklist interactions", async () => {
    const checklist = getChecklistByCategory("reception-flow");
    const firstItem = checklist?.items[0];

    progressState = {
      "reception-flow": createCategoryProgress("reception-flow", {
        checkedChecklistItemIds: checklist?.items.slice(0, 1).map((item) => item.id) ?? [],
        lastChecklistViewedAt: "2026-04-06T10:00:00.000Z",
      }),
    };

    render(<ChecklistPage />);

    await waitFor(() => {
      expect(recordChecklistViewedMock).toHaveBeenCalledWith("reception-flow");
    });

    expect(screen.getByText("確認項目")).toBeInTheDocument();
    expect(screen.getByText(firstItem?.title ?? "")).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: "確認する" })[0]);

    expect(toggleChecklistItemMock).toHaveBeenCalledWith({
      categoryId: "reception-flow",
      itemId: checklist?.items[1].id,
      totalItems: checklist?.items.length,
    });
  });

  it("renders the progress page with quiz and checklist summaries", () => {
    const checklist = getChecklistByCategory("reception-flow");

    progressState = {
      "reception-flow": createCategoryProgress("reception-flow", {
        answeredCount: 5,
        correctCount: 4,
        checkedChecklistItemIds: checklist?.items.map((item) => item.id) ?? [],
        checklistCompleted: true,
        lastPlayedAt: "2026-04-06T10:30:00.000Z",
        lastChecklistViewedAt: "2026-04-06T10:20:00.000Z",
      }),
    };

    render(<ProgressPage />);

    expect(screen.getByText("チェック全体")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "チェックリスト" })[0]).toHaveAttribute(
      "href",
      "/checklists/reception-flow",
    );
    expect(screen.getAllByText("チェックリスト進捗").length).toBeGreaterThan(0);
  });
});
