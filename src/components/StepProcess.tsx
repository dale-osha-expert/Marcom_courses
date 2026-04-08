"use client";

import { ProcessStep } from "@/lib/types";

interface StepProcessProps {
  title: string;
  items: ProcessStep[];
}

export default function StepProcess({ title, items }: StepProcessProps) {
  if (items.length === 0) return null;

  return (
    <div className="my-4 bg-industrial-50 border border-industrial-200 rounded-xl p-5">
      <h4 className="font-bold text-industrial-900 text-sm mb-4 text-center uppercase tracking-wide">
        {title}
      </h4>
      <div className="space-y-0">
        {items.map((item, i) => (
          <div key={item.step} className="flex items-start gap-3">
            {/* Step column: circle + connector line */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-safety-orange text-white flex items-center justify-center text-sm font-bold shrink-0">
                {item.step}
              </div>
              {i < items.length - 1 && (
                <div className="w-0.5 h-6 bg-safety-orange/30" />
              )}
            </div>
            {/* Step text */}
            <p className="text-sm text-industrial-800 font-medium pt-1.5 pb-4">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
