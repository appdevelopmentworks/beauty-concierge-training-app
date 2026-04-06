export interface CategoryProgress {
  categoryId: string;
  answeredQuestionIds: string[];
  correctQuestionIds: string[];
  checkedChecklistItemIds: string[];
  answeredCount: number;
  correctCount: number;
  completed: boolean;
  lastPlayedAt: string | null;
  checklistCompleted: boolean;
  lastChecklistViewedAt: string | null;
}

export type ProgressMap = Record<string, CategoryProgress>;

export interface SessionResult {
  categoryId: string;
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  completedAt: string;
}
