"use client";

import { Question, FaqItem } from "@/lib/types";
import TopicsToReview from "./TopicsToReview";
import FaqAccordion from "./FaqAccordion";

interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  passingScore: number;
  courseTitle: string;
  oshaRefs: string[];
  questions: Question[];
  answeredCorrectly: boolean[];
  lessons: Record<string, string>;
  keyTakeaways: Record<string, string[]>;
  faq: FaqItem[];
  topicDisplayNames?: Record<string, string>;
  onRestart: () => void;
}

export default function ResultsScreen({
  score,
  totalQuestions,
  passingScore,
  courseTitle,
  oshaRefs,
  questions,
  answeredCorrectly,
  lessons,
  keyTakeaways,
  faq,
  topicDisplayNames,
  onRestart,
}: ResultsScreenProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const passed = percentage >= passingScore;

  return (
    <div className="space-y-6">
      {/* Score card */}
      <div className="bg-white rounded-2xl shadow-lg border border-industrial-100 overflow-hidden text-center">
        <div
          className={`px-6 py-8 ${
            passed ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <div className="text-6xl mb-3">{passed ? "\u2705" : "\u274C"}</div>
          <h2 className="text-white font-bold text-2xl">
            {passed ? "Certification Passed!" : "Certification Not Achieved"}
          </h2>
          <p className="text-white/80 mt-1">
            {oshaRefs[0]} — {courseTitle}
          </p>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <p className="text-5xl font-bold text-industrial-900">{percentage}%</p>
            <p className="text-industrial-500 mt-1">
              {score} of {totalQuestions} correct
            </p>
          </div>

          <div className="bg-industrial-50 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-semibold text-industrial-900 mb-2">
              {passed ? "What this means:" : "Next steps:"}
            </h3>
            <p className="text-sm text-industrial-600 leading-relaxed">
              {passed
                ? `You have demonstrated knowledge of ${courseTitle} safety standards. This written exam is one component of full certification, which also requires practical evaluation and workplace-specific training.`
                : `A score of ${passingScore}% or higher is required to pass. Review the topics below where remediation was triggered, then retake the exam.`}
            </p>
          </div>
        </div>
      </div>

      {/* Topics to Review */}
      <TopicsToReview
        questions={questions}
        answeredCorrectly={answeredCorrectly}
        lessons={lessons}
        keyTakeaways={keyTakeaways}
        topicDisplayNames={topicDisplayNames}
      />

      {/* FAQ */}
      <FaqAccordion items={faq} />

      {/* Retake button */}
      <button
        onClick={onRestart}
        className="w-full bg-safety-orange hover:bg-safety-orange/90 text-white font-bold py-3 px-6 rounded-xl transition-colors text-lg"
      >
        {passed ? "Retake Exam" : "Try Again"}
      </button>
    </div>
  );
}
