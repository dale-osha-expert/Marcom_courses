"use client";

import { Question } from "@/lib/types";
import { renderLesson } from "@/lib/renderLesson";
import KeyTakeaways from "./KeyTakeaways";

interface TopicsToReviewProps {
  questions: Question[];
  answeredCorrectly: boolean[];
  lessons: Record<string, string>;
  keyTakeaways: Record<string, string[]>;
  topicDisplayNames?: Record<string, string>;
}

function formatTopicKey(key: string): string {
  return key
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function TopicsToReview({
  questions,
  answeredCorrectly,
  lessons,
  keyTakeaways,
  topicDisplayNames,
}: TopicsToReviewProps) {
  // Derive missed topics
  const missedTopics = new Set<string>();
  questions.forEach((q, i) => {
    if (!answeredCorrectly[i]) {
      missedTopics.add(q.topic);
    }
  });

  if (missedTopics.size === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <h3 className="font-bold text-green-800 text-lg mb-1">
          Perfect Score — All Topics Mastered
        </h3>
        <p className="text-green-700 text-sm">
          You answered every question correctly. No topics to review.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-industrial-900 text-lg">
        Topics to Review
      </h3>
      {Array.from(missedTopics).map((topic) => {
        const displayName =
          topicDisplayNames?.[topic] ?? formatTopicKey(topic);
        const lesson = lessons[topic];
        const firstParagraph = lesson?.split("\n\n")[0] ?? "";
        const takeaways = keyTakeaways[topic] ?? [];

        return (
          <div
            key={topic}
            className="bg-white rounded-2xl shadow-lg border border-industrial-100 border-l-4 border-l-red-400 p-6"
          >
            <h4 className="font-bold text-industrial-900 mb-3">
              {displayName}
            </h4>
            {firstParagraph && (
              <p
                className="text-sm text-industrial-600 leading-relaxed mb-2"
                dangerouslySetInnerHTML={{
                  __html: renderLesson(firstParagraph),
                }}
              />
            )}
            {takeaways.length > 0 && (
              <KeyTakeaways takeaways={takeaways} />
            )}
          </div>
        );
      })}
    </div>
  );
}
