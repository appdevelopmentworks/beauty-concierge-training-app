export type Difficulty = "easy" | "medium" | "hard";
export type QuestionType = "multiple-choice" | "true-false" | "order" | "scenario";
export type KnowledgeType = "sbc-specific" | "general";

export interface SourceLink {
  label: string;
  url: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  sources?: SourceLink[];
}

export interface CategoryChecklist {
  title: string;
  description: string;
  items: ChecklistItem[];
}

export interface KnowledgeMix {
  sbcSpecific: number;
  general: number;
}

export interface Choice {
  id: string;
  label: string;
  text: string;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
  accent: string;
  surface: string;
  border: string;
  totalQuestions: number;
  estimatedMinutes: number;
  knowledgeMix: KnowledgeMix;
}

export interface BaseQuestion {
  id: string;
  categoryId: string;
  type: QuestionType;
  knowledgeType: KnowledgeType;
  sources?: SourceLink[];
  title: string;
  prompt: string;
  explanation: string;
  difficulty: Difficulty;
  tags: string[];
}

export interface QuizQuestion extends BaseQuestion {
  type: "multiple-choice" | "true-false" | "order";
  choices: Choice[];
  correctAnswer: string;
}

export interface ScenarioChoice extends Choice {
  nextStepId?: string;
  feedback?: string;
}

export interface ScenarioStep {
  id: string;
  speaker: string;
  message: string;
  prompt: string;
  sources?: SourceLink[];
  choices: ScenarioChoice[];
  correctChoiceId: string;
}

export interface ScenarioQuestion extends BaseQuestion {
  type: "scenario";
  situation: string;
  steps: ScenarioStep[];
  feedbackCorrect: string;
  feedbackIncorrect: string;
}

export type Question = QuizQuestion | ScenarioQuestion;

export interface CategoryContent {
  categoryId: string;
  overview: string;
  referenceSources: {
    sbcSpecific: SourceLink[];
    general: SourceLink[];
  };
  checklist: CategoryChecklist;
  questions: Question[];
}
