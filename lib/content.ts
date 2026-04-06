import categoriesJson from "@/data/categories.json";
import complianceComplaintJson from "@/data/compliance-complaint.json";
import contractPaymentJson from "@/data/contract-payment.json";
import counselingBasicsJson from "@/data/counseling-basics.json";
import inquiryHandlingJson from "@/data/inquiry-handling.json";
import receptionFlowJson from "@/data/reception-flow.json";
import treatmentBasicsJson from "@/data/treatment-basics.json";
import type {
  Category,
  CategoryContent,
  Choice,
  Difficulty,
  KnowledgeType,
  Question,
  QuizQuestion,
  ScenarioChoice,
  ScenarioQuestion,
  ScenarioStep,
} from "@/types/content";

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseString(value: unknown, path: string) {
  invariant(typeof value === "string", `${path} must be a string`);
  return value;
}

function parseNumber(value: unknown, path: string) {
  invariant(typeof value === "number" && Number.isFinite(value), `${path} must be a number`);
  return value;
}

function parseStringArray(value: unknown, path: string) {
  invariant(Array.isArray(value), `${path} must be an array`);
  return value.map((item, index) => parseString(item, `${path}[${index}]`));
}

function parseDifficulty(value: unknown, path: string): Difficulty {
  invariant(value === "easy" || value === "medium" || value === "hard", `${path} must be a valid difficulty`);
  return value;
}

function parseKnowledgeType(value: unknown, path: string): KnowledgeType {
  invariant(value === "sbc-specific" || value === "general", `${path} must be a valid knowledge type`);
  return value;
}

function parseChoice(value: unknown, path: string): Choice {
  invariant(isRecord(value), `${path} must be an object`);

  return {
    id: parseString(value.id, `${path}.id`),
    label: parseString(value.label, `${path}.label`),
    text: parseString(value.text, `${path}.text`),
  };
}

function parseScenarioChoice(value: unknown, path: string): ScenarioChoice {
  invariant(isRecord(value), `${path} must be an object`);

  return {
    id: parseString(value.id, `${path}.id`),
    label: parseString(value.label, `${path}.label`),
    text: parseString(value.text, `${path}.text`),
    nextStepId: value.nextStepId ? parseString(value.nextStepId, `${path}.nextStepId`) : undefined,
    feedback: value.feedback ? parseString(value.feedback, `${path}.feedback`) : undefined,
  };
}

function parseScenarioStep(value: unknown, path: string): ScenarioStep {
  invariant(isRecord(value), `${path} must be an object`);
  invariant(Array.isArray(value.choices), `${path}.choices must be an array`);

  return {
    id: parseString(value.id, `${path}.id`),
    speaker: parseString(value.speaker, `${path}.speaker`),
    message: parseString(value.message, `${path}.message`),
    prompt: parseString(value.prompt, `${path}.prompt`),
    choices: value.choices.map((choice, index) => parseScenarioChoice(choice, `${path}.choices[${index}]`)),
    correctChoiceId: parseString(value.correctChoiceId, `${path}.correctChoiceId`),
  };
}

function parseQuestion(value: unknown, path: string): Question {
  invariant(isRecord(value), `${path} must be an object`);

  const base = {
    id: parseString(value.id, `${path}.id`),
    categoryId: parseString(value.categoryId, `${path}.categoryId`),
    type: parseString(value.type, `${path}.type`),
    knowledgeType: parseKnowledgeType(value.knowledgeType, `${path}.knowledgeType`),
    title: parseString(value.title, `${path}.title`),
    prompt: parseString(value.prompt, `${path}.prompt`),
    explanation: parseString(value.explanation, `${path}.explanation`),
    difficulty: parseDifficulty(value.difficulty, `${path}.difficulty`),
    tags: parseStringArray(value.tags, `${path}.tags`),
  };

  if (base.type === "scenario") {
    invariant(Array.isArray(value.steps), `${path}.steps must be an array`);

    return {
      ...base,
      type: "scenario",
      situation: parseString(value.situation, `${path}.situation`),
      steps: value.steps.map((step, index) => parseScenarioStep(step, `${path}.steps[${index}]`)),
      feedbackCorrect: parseString(value.feedbackCorrect, `${path}.feedbackCorrect`),
      feedbackIncorrect: parseString(value.feedbackIncorrect, `${path}.feedbackIncorrect`),
    } satisfies ScenarioQuestion;
  }

  invariant(
    base.type === "multiple-choice" || base.type === "true-false" || base.type === "order",
    `${path}.type must be a supported quiz type`,
  );
  invariant(Array.isArray(value.choices), `${path}.choices must be an array`);

  return {
    ...base,
    type: base.type,
    choices: value.choices.map((choice, index) => parseChoice(choice, `${path}.choices[${index}]`)),
    correctAnswer: parseString(value.correctAnswer, `${path}.correctAnswer`),
  } satisfies QuizQuestion;
}

function parseCategory(value: unknown, path: string): Category {
  invariant(isRecord(value), `${path} must be an object`);

  return {
    id: parseString(value.id, `${path}.id`),
    title: parseString(value.title, `${path}.title`),
    description: parseString(value.description, `${path}.description`),
    icon: parseString(value.icon, `${path}.icon`),
    accent: parseString(value.accent, `${path}.accent`),
    surface: parseString(value.surface, `${path}.surface`),
    border: parseString(value.border, `${path}.border`),
    totalQuestions: parseNumber(value.totalQuestions, `${path}.totalQuestions`),
    estimatedMinutes: parseNumber(value.estimatedMinutes, `${path}.estimatedMinutes`),
  };
}

function parseCategoryContent(value: unknown, path: string): CategoryContent {
  invariant(isRecord(value), `${path} must be an object`);
  invariant(Array.isArray(value.questions), `${path}.questions must be an array`);

  return {
    categoryId: parseString(value.categoryId, `${path}.categoryId`),
    overview: parseString(value.overview, `${path}.overview`),
    questions: value.questions.map((question, index) => parseQuestion(question, `${path}.questions[${index}]`)),
  };
}

const rawCategories = (categoriesJson as unknown[]).map((category, index) =>
  parseCategory(category, `categories[${index}]`),
);

const rawContentCollections = [
  parseCategoryContent(receptionFlowJson, "reception-flow"),
  parseCategoryContent(counselingBasicsJson, "counseling-basics"),
  parseCategoryContent(treatmentBasicsJson, "treatment-basics"),
  parseCategoryContent(contractPaymentJson, "contract-payment"),
  parseCategoryContent(inquiryHandlingJson, "inquiry-handling"),
  parseCategoryContent(complianceComplaintJson, "compliance-complaint"),
];

const contentMap = Object.fromEntries(rawContentCollections.map((entry) => [entry.categoryId, entry])) as Record<
  string,
  CategoryContent
>;

export const categories: Category[] = rawCategories.map((category) => ({
  ...category,
  totalQuestions: contentMap[category.id]?.questions.length ?? category.totalQuestions,
}));

export function getCategories() {
  return categories;
}

export function getCategory(categoryId: string) {
  return categories.find((category) => category.id === categoryId) ?? null;
}

export function getCategoryContent(categoryId: string) {
  return contentMap[categoryId] ?? null;
}

export function getQuestionsByCategory(categoryId: string) {
  return getCategoryContent(categoryId)?.questions ?? [];
}

export function getQuestionByIndex(categoryId: string, questionIndex: number) {
  return getQuestionsByCategory(categoryId)[questionIndex] ?? null;
}

export function getScenarioById(scenarioId: string) {
  for (const content of rawContentCollections) {
    const scenario = content.questions.find(
      (question): question is ScenarioQuestion => question.type === "scenario" && question.id === scenarioId,
    );

    if (scenario) {
      return scenario;
    }
  }

  return null;
}

export function getTotalQuestionCount() {
  return categories.reduce((sum, category) => sum + category.totalQuestions, 0);
}

export function getQuestionTypeLabel(question: Question) {
  switch (question.type) {
    case "multiple-choice":
      return "4択クイズ";
    case "true-false":
      return "○×クイズ";
    case "order":
      return "順序確認";
    case "scenario":
      return "会話シミュレーション";
    default:
      return "問題";
  }
}

export function getKnowledgeTypeLabel(question: Question) {
  switch (question.knowledgeType) {
    case "sbc-specific":
      return "SBC独自";
    case "general":
      return "一般知識";
    default:
      return "分類なし";
  }
}
