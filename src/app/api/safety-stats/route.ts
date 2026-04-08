import { NextResponse } from "next/server";
import type { LiveStat, SafetyStatsResponse } from "@/lib/types";

// ---------------------------------------------------------------------------
// Fallback defaults — used when government APIs are unreachable
// ---------------------------------------------------------------------------
const FALLBACK_STATS: LiveStat[] = [
  {
    value: "100+",
    label: "Deaths per year",
    detail: "Construction workers killed by electricity",
    year: 2023,
    source: "BLS CFOI",
  },
  {
    value: "50%+",
    label: "Of all electrical injuries",
    detail: "Suffered by construction workers",
    year: 2023,
    source: "BLS CFOI",
  },
  {
    value: "2,400+",
    label: "Electrical inspections",
    detail: "OSHA construction inspections with electrical violations",
    year: 2023,
    source: "DOL OSHA",
  },
];

// ---------------------------------------------------------------------------
// In-memory cache (survives across requests within the same server process)
// ---------------------------------------------------------------------------
let cachedResponse: SafetyStatsResponse | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Next.js ISR-style revalidation (seconds)
export const revalidate = 86400;

// ---------------------------------------------------------------------------
// BLS Public Data API v1 — Census of Fatal Occupational Injuries (CFOI)
// ---------------------------------------------------------------------------
// Series ID components for CFOI:
//   FW = Fatal injuries
//   U  = All ownerships
//   00 = All industries or specific NAICS
//   X4 = Construction (NAICS 23) industry group
//   XXX = All occupations
//   3  = Event/exposure
//   XX = All events  OR  specific event codes
//   00000 = remaining dimensions
//
// We request two series:
//   1) Total construction fatalities (all events)
//   2) Exposure to electricity (event E42 → code 42)
// ---------------------------------------------------------------------------

const BLS_ENDPOINT = "https://api.bls.gov/publicAPI/v1/timeseries/data/";

interface BLSDataPoint {
  year: string;
  period: string;
  periodName: string;
  value: string;
}

interface BLSSeries {
  seriesID: string;
  data: BLSDataPoint[];
}

interface BLSResponse {
  status: string;
  Results?: {
    series: BLSSeries[];
  };
}

async function fetchBLSStats(): Promise<LiveStat[]> {
  const currentYear = new Date().getFullYear();
  // CFOI data typically lags 1-2 years
  const endYear = String(currentYear);
  const startYear = String(currentYear - 5);

  // Series: total fatal injuries in construction (all events)
  const constructionFatalitiesSeries = "FWU00X4XXX3XX00000";
  // Series: electrical contact fatalities in construction (event code 42)
  const electrocutionSeries = "FWU00X4XXX34200000";

  const response = await fetch(BLS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      seriesid: [constructionFatalitiesSeries, electrocutionSeries],
      startyear: startYear,
      endyear: endYear,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) throw new Error(`BLS API returned ${response.status}`);

  const data: BLSResponse = await response.json();

  if (data.status !== "REQUEST_SUCCEEDED" || !data.Results?.series) {
    throw new Error(`BLS API status: ${data.status}`);
  }

  const stats: LiveStat[] = [];

  for (const series of data.Results.series) {
    // Data is sorted newest-first; grab the most recent annual value
    const latest = series.data.find((d) => d.period === "A01");
    if (!latest) continue;

    const year = parseInt(latest.year, 10);
    const value = parseInt(latest.value, 10);

    if (series.seriesID === constructionFatalitiesSeries) {
      stats.push({
        value: value.toLocaleString("en-US"),
        label: "Construction fatalities",
        detail: `Total fatal injuries in construction (${year})`,
        year,
        source: "BLS CFOI",
      });
    } else if (series.seriesID === electrocutionSeries) {
      stats.push({
        value: value.toLocaleString("en-US"),
        label: "Electrocution deaths",
        detail: `Electrical contact fatalities in construction (${year})`,
        year,
        source: "BLS CFOI",
      });
    }
  }

  return stats;
}

// ---------------------------------------------------------------------------
// DOL OSHA Enforcement API — Electrical violation inspections
// ---------------------------------------------------------------------------

const DOL_ENDPOINT = "https://enforcedata.dol.gov/api/v2/safety/inspection";

interface DOLResponse {
  result?: {
    totalCount?: number;
    records?: unknown[];
  };
}

async function fetchDOLStats(): Promise<LiveStat[]> {
  const currentYear = new Date().getFullYear();
  // Query recent year's construction inspections with electrical citations
  const targetYear = currentYear - 1;

  const params = new URLSearchParams({
    "filter[sic_code][gte]": "1500",
    "filter[sic_code][lte]": "1799",
    "filter[open_date][gte]": `${targetYear}-01-01`,
    "filter[open_date][lte]": `${targetYear}-12-31`,
    "filter[violation_standard][contains]": "1926.4",
    limit: "1",
    offset: "0",
  });

  const response = await fetch(`${DOL_ENDPOINT}?${params}`, {
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) throw new Error(`DOL API returned ${response.status}`);

  const data: DOLResponse = await response.json();
  const count = data.result?.totalCount ?? data.result?.records?.length;

  if (count == null) throw new Error("DOL API: no count in response");

  return [
    {
      value: count.toLocaleString("en-US"),
      label: "Electrical inspections",
      detail: `OSHA construction inspections citing electrical violations (${targetYear})`,
      year: targetYear,
      source: "DOL OSHA",
    },
  ];
}

// ---------------------------------------------------------------------------
// Route Handler
// ---------------------------------------------------------------------------

export async function GET() {
  // Return cached response if still fresh
  if (cachedResponse && Date.now() - cacheTimestamp < CACHE_TTL_MS) {
    return NextResponse.json(cachedResponse);
  }

  const stats: LiveStat[] = [];

  // Fetch BLS and DOL in parallel; each can fail independently
  const [blsResult, dolResult] = await Promise.allSettled([
    fetchBLSStats(),
    fetchDOLStats(),
  ]);

  if (blsResult.status === "fulfilled") {
    stats.push(...blsResult.value);
  } else {
    console.warn("BLS API failed, using fallback:", blsResult.reason);
    stats.push(...FALLBACK_STATS.filter((s) => s.source === "BLS CFOI"));
  }

  if (dolResult.status === "fulfilled") {
    stats.push(...dolResult.value);
  } else {
    console.warn("DOL API failed, using fallback:", dolResult.reason);
    stats.push(...FALLBACK_STATS.filter((s) => s.source === "DOL OSHA"));
  }

  const payload: SafetyStatsResponse = {
    stats,
    fetchedAt: new Date().toISOString(),
  };

  // Update in-memory cache
  cachedResponse = payload;
  cacheTimestamp = Date.now();

  return NextResponse.json(payload);
}
