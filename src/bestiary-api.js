import { parseEntry } from "./parse.js";

export async function fetchBestiarySummaries() {
  const res = await fetch("/api/bestiary");
  if (!res.ok) throw new Error("Could not load bestiary archive");
  const data = await res.json();
  return data.items || [];
}

export async function fetchBestiaryEntry(slug) {
  const res = await fetch(`/api/bestiary/${encodeURIComponent(slug)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Could not load bestiary entry");
  return res.json();
}

/** Merge API detail with full parseEntry output for dossier panels. */
export function parseBestiaryDetail(detail) {
  if (!detail?.body) return null;
  const path = `bestiary/${detail.slug}.md`;
  const parsed = parseEntry(path, detail.body);
  return {
    ...parsed,
    slug: detail.slug,
    number: detail.number ?? parsed.number,
    name: detail.name ?? parsed.name,
    japaneseName: detail.japaneseName ?? parsed.japaneseName,
    epithet: detail.epithet ?? parsed.epithet,
    origin: detail.origin ?? parsed.origin,
    disposition: detail.disposition ?? parsed.disposition,
    threat: detail.threat ?? parsed.threat,
    habitat: detail.habitat ?? parsed.habitat,
    status: detail.status ?? parsed.status,
    firstRecord: detail.firstRecord ?? parsed.firstRecord,
    excerpt: detail.excerpt ?? parsed.excerpt,
    updatedAt: detail.updatedAt ?? null,
  };
}

/** Card-level record from list API summary. */
export function summaryToRecord(summary) {
  return {
    slug: summary.slug,
    number: summary.number,
    name: summary.name,
    japaneseName: summary.japaneseName,
    epithet: summary.epithet,
    origin: summary.origin,
    disposition: summary.disposition,
    threat: summary.threat,
    habitat: summary.habitat,
    status: summary.status,
    firstRecord: summary.firstRecord,
    excerpt: summary.excerpt,
  };
}

export const TOTAL_SLOTS = 200;

export function buildSlots(entries) {
  return Array.from({ length: TOTAL_SLOTS }, (_, i) => {
    const number = i + 1;
    return { number, records: entries.filter((e) => e.number === number) };
  });
}

export function recordedCountFrom(entries) {
  return new Set(entries.map((e) => e.number)).size;
}
