"use client";

interface WarningCalloutProps {
  warnings: string[];
}

export default function WarningCallout({ warnings }: WarningCalloutProps) {
  if (warnings.length === 0) return null;

  return (
    <div className="my-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4">
      <div className="flex items-start gap-3">
        {/* Warning triangle SVG */}
        <svg
          className="w-6 h-6 text-red-500 shrink-0 mt-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <div>
          {warnings.map((warning, i) => (
            <p
              key={i}
              className="text-sm font-semibold text-red-800 mb-1 last:mb-0"
            >
              {warning}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
