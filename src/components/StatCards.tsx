"use client";

import { StatCard as StatCardType } from "@/lib/types";

interface StatCardsProps {
  stats: StatCardType[];
}

export default function StatCards({ stats }: StatCardsProps) {
  if (stats.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 my-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-industrial-900 rounded-xl p-4 text-center"
        >
          {/* Lightning bolt SVG icon */}
          <svg
            className="w-6 h-6 mx-auto mb-2 text-safety-orange"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
          </svg>
          <p className="text-2xl font-bold text-safety-orange leading-tight">
            {stat.value}
          </p>
          <p className="text-xs font-semibold text-white mt-1 uppercase tracking-wide">
            {stat.label}
          </p>
          {stat.detail && (
            <p className="text-xs text-industrial-400 mt-1">{stat.detail}</p>
          )}
        </div>
      ))}
    </div>
  );
}
