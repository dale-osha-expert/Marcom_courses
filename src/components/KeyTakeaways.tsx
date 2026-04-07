"use client";

import { renderLesson } from "@/lib/renderLesson";

interface KeyTakeawaysProps {
  takeaways: string[];
}

export default function KeyTakeaways({ takeaways }: KeyTakeawaysProps) {
  if (takeaways.length === 0) return null;

  return (
    <div className="bg-safety-orange/5 border border-safety-orange/20 rounded-xl p-4 mt-4">
      <h4 className="font-bold text-safety-orange text-sm mb-2">
        Key Takeaways
      </h4>
      <ul className="space-y-1.5">
        {takeaways.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-sm text-industrial-700"
          >
            <span className="text-safety-orange mt-0.5 shrink-0">&#x2022;</span>
            <span
              dangerouslySetInnerHTML={{ __html: renderLesson(item) }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
