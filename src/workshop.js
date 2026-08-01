import { parseEntry } from "./parse.js";

const THREAT_AXES = ["Scale", "Lethality", "Reach", "Persistence", "Intelligence", "Cascade"];

export { THREAT_AXES };

export const EMPTY_THREAT = Object.fromEntries(THREAT_AXES.map((axis) => [axis.toLowerCase(), 0]));

export async function fetchCreations() {
  const res = await fetch("/api/creations");
  if (!res.ok) throw new Error("Could not load workshop entries");
  const data = await res.json();
  return data.items || [];
}

export async function fetchCreation(id) {
  const res = await fetch(`/api/creations/${encodeURIComponent(id)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Could not load workshop entry");
  return res.json();
}

export async function createCreation(payload) {
  const res = await fetch("/api/creations", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Could not save creation");
  }
  return data;
}

export function parseWorkshopEntry(detail) {
  if (!detail?.body) return null;
  const path = `workshop/${detail.slug || detail.id}.md`;
  const parsed = parseEntry(path, detail.body);
  return {
    ...parsed,
    id: detail.id,
    slug: detail.slug,
    name: detail.name,
    workshop: true,
    creatorLabel: detail.creatorLabel,
    createdAt: detail.createdAt,
    threat: detail.operationalClass || parsed.threat,
    origin: detail.primaryEcology || parsed.origin,
    habitat: detail.knownRange || parsed.habitat,
  };
}
