// ---------------------------------------------------------------------------
// Safety Certifications Platform — Type Definitions
// ---------------------------------------------------------------------------

/** Topic string — each course defines its own topic keys */
export type Topic = string;

/** Difficulty tiers map to the 10-question progression */
export type Difficulty = "easy" | "medium" | "hard";

/** A single answer option */
export interface AnswerOption {
  id: string;
  text: string;
}

/** A base exam question */
export interface Question {
  id: number;
  topic: Topic;
  difficulty: Difficulty;
  questionText: string;
  options: AnswerOption[];
  correctOptionId: string;
  /** OSHA clause reference for remediation content */
  oshaClause: string;
}

/** The mini-lesson + rephrased question returned by the remediation engine */
export interface RemediationPayload {
  lesson: string;
  rephrasedQuestion: Question;
}

/** Overall exam state managed by the page component */
export interface ExamState {
  introComplete: boolean;
  currentQuestionIndex: number;
  score: number;
  isRemediating: boolean;
  remediationPayload: RemediationPayload | null;
  answeredCorrectly: boolean[];
  isComplete: boolean;
  isLoading: boolean;
  selectedAnswerId: string | null;
  showFeedback: boolean;
}

/** A single FAQ entry for a course */
export interface FaqItem {
  question: string;
  answer: string;
}

/** An infographic stat card */
export interface StatCard {
  value: string;
  label: string;
  detail?: string;
}

/** A stat card enriched with live government data source metadata */
export interface LiveStat extends StatCard {
  year: number;
  source: string;
}

/** Response shape from /api/safety-stats */
export interface SafetyStatsResponse {
  stats: LiveStat[];
  fetchedAt: string;
}

/** A numbered process step */
export interface ProcessStep {
  step: number;
  title: string;
}

/** Visual elements for a single topic */
export interface TopicVisuals {
  stats?: StatCard[];
  steps?: { title: string; items: ProcessStep[] };
  warnings?: string[];
}

/** A full course definition */
export interface Course {
  id: string;
  slug: string;
  title: string;
  topic: string;
  productLine: string;
  durationMinutes: number;
  shortDescription: string;
  oshaRefs: string[];
  passingScore: number;
  questions: Question[];
  lessons: Record<string, string>;
  /** Rephrased versions keyed by original question ID, shown after a wrong answer */
  rephrasedQuestions: Record<number, Question>;
  /** Per-topic bullet-point summaries of key facts */
  keyTakeaways: Record<string, string[]>;
  /** FAQ items displayed on the results screen */
  faq: FaqItem[];
  /** Human-readable display names for topic keys */
  topicDisplayNames?: Record<string, string>;
  /** Visual elements (stat cards, step processes, warnings) keyed by topic */
  visuals?: Record<string, TopicVisuals>;
}
