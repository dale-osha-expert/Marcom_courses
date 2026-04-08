"use client";

import { useEffect, useState } from "react";
import type { StatCard as StatCardType, LiveStat, SafetyStatsResponse } from "@/lib/types";

interface LiveStatCardsProps {
  fallbackStats: StatCardType[];
}

export default function LiveStatCards({ fallbackStats }: LiveStatCardsProps) {
  const [stats, setStats] = useState<LiveStat[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/safety-stats", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<SafetyStatsResponse>;
      })
      .then((data) => setStats(data.stats))
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.warn("Failed to fetch live stats:", err);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 my-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="bg-industrial-900 rounded-xl p-4 animate-pulse"
          >
            <div className="w-6 h-6 mx-auto mb-2 rounded bg-industrial-700" />
            <div className="h-7 w-16 mx-auto rounded bg-industrial-700 mb-2" />
            <div className="h-3 w-24 mx-auto rounded bg-industrial-700 mb-1" />
            <div className="h-3 w-32 mx-auto rounded bg-industrial-700" />
          </div>
        ))}
      </div>
    );
  }

  // Live data available — render with source citations
  if (stats && stats.length > 0) {
    return (
      <div className="grid grid-cols-2 gap-3 my-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-industrial-900 rounded-xl p-4 text-center"
          >
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
            <p className="text-[10px] text-industrial-500 mt-2 italic">
              {stat.source} {stat.year}
            </p>
          </div>
        ))}
      </div>
    );
  }

  // Fallback — render static cards (same style as StatCards)
  if (fallbackStats.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 my-4">
      {fallbackStats.map((stat, i) => (
        <div
          key={i}
          className="bg-industrial-900 rounded-xl p-4 text-center"
        >
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
