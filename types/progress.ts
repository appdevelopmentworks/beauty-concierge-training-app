export interface CategoryProgress {
  categoryId: string;
  answeredQuestionIds: string[];
  correctQuestionIds: string[];
  answeredCount: number;
  correctCount: number;
  completed: boolean;
  lastPlayedAt: string | null;
}

export type ProgressMap = Record<string, CategoryProgress>;

export interface SessionResult {
  categoryId: string;
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  completedAt: string;
}
