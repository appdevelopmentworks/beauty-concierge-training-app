import categoriesJson from "@/data/categories.json";
import complianceComplaintJson from "@/data/compliance-complaint.json";
import contractPaymentJson from "@/data/contract-payment.json";
import counselingBasicsJson from "@/data/counseling-basics.json";
import inquiryHandlingJson from "@/data/inquiry-handling.json";
import receptionFlowJson from "@/data/reception-flow.json";
import treatmentBasicsJson from "@/data/treatment-basics.json";
import type {
  Category,
  CategoryChecklist,
  CategoryContent,
  ChecklistItem,
  Choice,
  Difficulty,
  KnowledgeMix,
  KnowledgeType,
  Question,
  QuizQuestion,
  ScenarioChoice,
  ScenarioQuestion,
  ScenarioStep,
  SourceLink,
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

function parseSourceLink(value: unknown, path: string): SourceLink {
  invariant(isRecord(value), `${path} must be an object`);

  return {
    label: parseString(value.label, `${path}.label`),
    url: parseString(value.url, `${path}.url`),
  };
}

function parseChecklistItem(value: unknown, path: string): ChecklistItem {
  invariant(isRecord(value), `${path} must be an object`);

  return {
    id: parseString(value.id, `${path}.id`),
    title: parseString(value.title, `${path}.title`),
    description: parseString(value.description, `${path}.description`),
    sources: Array.isArray(value.sources)
      ? value.sources.map((source, index) => parseSourceLink(source, `${path}.sources[${index}]`))
      : undefined,
  };
}

function parseCategoryChecklist(value: unknown, path: string): CategoryChecklist {
  invariant(isRecord(value), `${path} must be an object`);
  invariant(Array.isArray(value.items), `${path}.items must be an array`);

  return {
    title: parseString(value.title, `${path}.title`),
    description: parseString(value.description, `${path}.description`),
    items: value.items.map((item, index) => parseChecklistItem(item, `${path}.items[${index}]`)),
  };
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

function parseKnowledgeMix(value: unknown, path: string): KnowledgeMix {
  invariant(isRecord(value), `${path} must be an object`);

  return {
    sbcSpecific: parseNumber(value.sbcSpecific, `${path}.sbcSpecific`),
    general: parseNumber(value.general, `${path}.general`),
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
    sources: Array.isArray(value.sources)
      ? value.sources.map((source, index) => parseSourceLink(source, `${path}.sources[${index}]`))
      : undefined,
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
    sources: Array.isArray(value.sources)
      ? value.sources.map((source, index) => parseSourceLink(source, `${path}.sources[${index}]`))
      : undefined,
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
    knowledgeMix: parseKnowledgeMix(value.knowledgeMix, `${path}.knowledgeMix`),
  };
}

function parseCategoryContent(value: unknown, path: string): CategoryContent {
  invariant(isRecord(value), `${path} must be an object`);
  invariant(Array.isArray(value.questions), `${path}.questions must be an array`);
  invariant(isRecord(value.referenceSources), `${path}.referenceSources must be an object`);
  invariant(isRecord(value.checklist), `${path}.checklist must be an object`);

  const referenceSources = value.referenceSources;

  return {
    categoryId: parseString(value.categoryId, `${path}.categoryId`),
    overview: parseString(value.overview, `${path}.overview`),
    referenceSources: {
      sbcSpecific: Array.isArray(referenceSources.sbcSpecific)
        ? referenceSources.sbcSpecific.map((source, index) =>
            parseSourceLink(source, `${path}.referenceSources.sbcSpecific[${index}]`),
          )
        : [],
      general: Array.isArray(referenceSources.general)
        ? referenceSources.general.map((source, index) =>
            parseSourceLink(source, `${path}.referenceSources.general[${index}]`),
          )
        : [],
    },
    checklist: parseCategoryChecklist(value.checklist, `${path}.checklist`),
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

export function getChecklistByCategory(categoryId: string) {
  return getCategoryContent(categoryId)?.checklist ?? null;
}

export function getQuestionByIndex(categoryId: string, questionIndex: number) {
  return getStudyQuestionsByCategory(categoryId)[questionIndex] ?? null;
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

export function getQuestionSources(question: Question) {
  if (question.sources?.length) {
    return question.sources;
  }

  const content = getCategoryContent(question.categoryId);
  if (!content) {
    return [];
  }

  return question.knowledgeType === "sbc-specific"
    ? content.referenceSources.sbcSpecific
    : content.referenceSources.general;
}

function getStudyOrderScore(params: {
  knowledgeType: KnowledgeType;
  mix: KnowledgeMix;
  usedCounts: Record<KnowledgeType, number>;
}) {
  const { knowledgeType, mix, usedCounts } = params;
  const denominator = knowledgeType === "sbc-specific" ? mix.sbcSpecific : mix.general;
  return (usedCounts[knowledgeType] + 1) / denominator;
}

export function getStudyQuestionsByCategory(categoryId: string) {
  const category = getCategory(categoryId);
  const questions = getQuestionsByCategory(categoryId);

  if (!category) {
    return questions;
  }

  const pools: Record<KnowledgeType, Question[]> = {
    "sbc-specific": questions.filter((question) => question.knowledgeType === "sbc-specific"),
    general: questions.filter((question) => question.knowledgeType === "general"),
  };

  const usedCounts: Record<KnowledgeType, number> = {
    "sbc-specific": 0,
    general: 0,
  };

  const ordered: Question[] = [];

  while (pools["sbc-specific"].length > 0 || pools.general.length > 0) {
    const candidates = (["sbc-specific", "general"] as const).filter((type) => pools[type].length > 0);
    candidates.sort(
      (left, right) =>
        getStudyOrderScore({
          knowledgeType: left,
          mix: category.knowledgeMix,
          usedCounts,
        }) -
        getStudyOrderScore({
          knowledgeType: right,
          mix: category.knowledgeMix,
          usedCounts,
        }),
    );

    const nextType = candidates[0];
    const nextQuestion = pools[nextType].shift();

    if (!nextQuestion) {
      break;
    }

    usedCounts[nextType] += 1;
    ordered.push(nextQuestion);
  }

  return ordered;
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
