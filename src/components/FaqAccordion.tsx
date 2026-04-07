"use client";

import { useState } from "react";
import { FaqItem } from "@/lib/types";
import { renderLesson } from "@/lib/renderLesson";

interface FaqAccordionProps {
  items: FaqItem[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (items.length === 0) return null;

  return (
    <div>
      <h3 className="font-bold text-industrial-900 text-lg mb-3">
        Frequently Asked Questions
      </h3>
      <div className="space-y-2">
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="bg-white rounded-xl border border-industrial-100 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full text-left px-5 py-4 flex justify-between items-center gap-3 hover:bg-industrial-50 transition-colors"
              >
                <span className="font-semibold text-industrial-900 text-sm">
                  {item.question}
                </span>
                <span
                  className={`text-industrial-400 text-xs shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  &#9660;
                </span>
              </button>
              {isOpen && (
                <div className="px-5 pb-4">
                  {item.answer.split("\n\n").map((paragraph, j) => (
                    <p
                      key={j}
                      className="text-sm text-industrial-600 leading-relaxed mb-2 last:mb-0"
                      dangerouslySetInnerHTML={{
                        __html: renderLesson(paragraph),
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
