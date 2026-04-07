"use client";

import { Course } from "@/lib/types";
import { renderLesson } from "@/lib/renderLesson";
import KeyTakeaways from "./KeyTakeaways";

interface CourseIntroProps {
  course: Course;
  onStartQuiz: () => void;
}

export default function CourseIntro({ course, onStartQuiz }: CourseIntroProps) {
  return (
    <div className="space-y-6">
      {/* Course overview */}
      <div className="bg-white rounded-2xl shadow-lg border border-industrial-100 overflow-hidden">
        <div className="bg-industrial-900 px-6 py-5">
          <h2 className="text-white font-bold text-xl mb-1">{course.title}</h2>
          <p className="text-industrial-400 text-sm">{course.productLine}</p>
        </div>
        <div className="p-6">
          <p className="text-industrial-700 leading-relaxed mb-4">
            {course.shortDescription}
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-safety-orange/10 text-safety-orange font-semibold px-3 py-1 rounded-full">
              {course.durationMinutes} min
            </span>
            <span className="bg-safety-orange/10 text-safety-orange font-semibold px-3 py-1 rounded-full">
              {course.questions.length} Questions
            </span>
            <span className="bg-safety-orange/10 text-safety-orange font-semibold px-3 py-1 rounded-full">
              {course.passingScore}% to Pass
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {course.oshaRefs.map((ref) => (
              <span
                key={ref}
                className="bg-industrial-100 text-industrial-600 text-xs font-mono px-2 py-1 rounded"
              >
                {ref}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Course content heading */}
      <div className="text-center">
        <h3 className="text-industrial-900 font-bold text-lg">
          Course Material
        </h3>
        <p className="text-industrial-500 text-sm mt-1">
          Review the following sections before taking the exam
        </p>
      </div>

      {/* Lesson sections */}
      {Object.entries(course.lessons).map(([topicKey, content]) => (
        <div
          key={topicKey}
          className="bg-white rounded-2xl shadow-lg border border-industrial-100 p-6"
        >
          <div className="prose prose-sm max-w-none">
            {content.split("\n\n").map((paragraph, i) => (
              <p
                key={i}
                className="text-industrial-700 leading-relaxed mb-3"
                dangerouslySetInnerHTML={{
                  __html: renderLesson(paragraph),
                }}
              />
            ))}
          </div>
          {course.keyTakeaways[topicKey] && (
            <KeyTakeaways takeaways={course.keyTakeaways[topicKey]} />
          )}
        </div>
      ))}

      {/* Begin Exam CTA */}
      <button
        onClick={onStartQuiz}
        className="w-full bg-safety-orange hover:bg-safety-orange/90 text-white font-bold py-4 px-6 rounded-xl transition-colors text-lg shadow-lg"
      >
        Begin Exam ({course.questions.length} Questions)
      </button>
    </div>
  );
}
