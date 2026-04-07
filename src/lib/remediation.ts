// ---------------------------------------------------------------------------
// ForkliftMastery — Remediation Engine (Mock)
// Simulates AI-generated mini-lessons and rephrased questions.
// ---------------------------------------------------------------------------

import { Question, RemediationPayload, Topic } from "./types";

/**
 * Fallback lessons map. Each course provides its own lessons;
 * this empty map is used only as a fallback by simulateRemediation.
 */
const LESSONS: Record<Topic, string> = {};

/**
 * Rephrased questions keyed by original question ID.
 * With the expanded 43-question bank, the remediation engine falls back to
 * auto-rephrasing via the template in simulateRemediation when a hand-crafted
 * entry does not exist for a given question ID.
 */
const REPHRASED_QUESTIONS: Record<number, Question> = {};

/**
 * Simulates an AI-generated remediation payload.
 * Accepts optional per-course lessons and rephrasedQuestions maps.
 */
export async function simulateRemediation(
  originalQuestion: Question,
  lessons?: Record<string, string>,
  rephrasedQuestions?: Record<number, Question>
): Promise<RemediationPayload> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lessonMap = lessons ?? LESSONS;
      const lesson =
        lessonMap[originalQuestion.topic] ??
        "No lesson content available for this topic.";

      const rephrasedMap = rephrasedQuestions ?? REPHRASED_QUESTIONS;
      const rephrased = rephrasedMap[originalQuestion.id] ?? {
        ...originalQuestion,
        id: originalQuestion.id + 100,
        questionText: originalQuestion.questionText,
      };

      resolve({ lesson, rephrasedQuestion: rephrased });
    }, 1000);
  });
}
