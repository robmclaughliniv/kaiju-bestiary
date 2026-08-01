// Build-time ingestion of the repository's markdown lore.
//
// Contributors never touch this file: drop a dossier in `bestiary/` (see
// bestiary/entry-template.md) and it appears in the dex on the next build.
// The parser is deliberately tolerant — it accepts both dossier styles found
// in the archive ("No.001: Gravorax" classification-bullet style and
// "No.045 — Bloomwraith" field-guide style) and keys metadata off any
// `**Key:** value` line it can find.

import { parseEntry } from "./parse.js";

const TOTAL_SLOTS = 200;
export { parseEntry, parseMeta } from "./parse.js";

const bestiaryFiles = import.meta.glob("../bestiary/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const codexFiles = import.meta.glob(
  ["../canon/*.md", "../world/*.md", "../guild/*.md", "../systems/*.md", "../ecology/*.md", "../art/*.md"],
  { eager: true, query: "?raw", import: "default" }
);

// Optional artwork: art/images/NNN-anything.(png|jpg|jpeg|webp|gif) is matched
// to bestiary entries by number prefix.
const imageFiles = import.meta.glob("../art/images/*.{png,jpg,jpeg,webp,gif}", {
  eager: true,
  query: "?url",
  import: "default",
});

function loadEntries() {
  return Object.entries(bestiaryFiles)
    .filter(([path]) => /\/\d{3}-/.test(path))
    .map(([path, raw]) => parseEntry(path, raw))
    .filter((e) => e.number !== null)
    .sort((a, b) => a.number - b.number || a.slug.localeCompare(b.slug));
}

export const entries = loadEntries();

// The dex has 200 numbered slots. A slot may hold zero, one, or several
// records — the archive tracks contradictions rather than erasing them, so
// duplicate numbers are rendered as parallel/disputed records.
export const slots = Array.from({ length: TOTAL_SLOTS }, (_, i) => {
  const number = i + 1;
  return { number, records: entries.filter((e) => e.number === number) };
});

export const recordedCount = new Set(entries.map((e) => e.number)).size;
export { TOTAL_SLOTS };

const CODEX_SECTIONS = {
  canon: "Canon",
  world: "World",
  guild: "The Guild",
  systems: "Systems",
  ecology: "Ecology",
  art: "Art",
};

export const codexDocs = Object.entries(codexFiles)
  .map(([path, raw]) => {
    const parts = path.split("/");
    const dir = parts[parts.length - 2];
    const slug = parts[parts.length - 1].replace(/\.md$/, "");
    const h1 = raw.match(/^#\s+(.+)$/m);
    return {
      slug: `${dir}--${slug}`,
      section: CODEX_SECTIONS[dir] || dir,
      dir,
      title: h1 ? h1[1].trim() : slug,
      markdown: raw,
    };
  })
  .sort((a, b) => a.dir.localeCompare(b.dir) || a.title.localeCompare(b.title));

export function imageFor(number) {
  if (number == null) return null;
  const prefix = String(number).padStart(3, "0");
  const hit = Object.entries(imageFiles).find(([path]) =>
    path.split("/").pop().startsWith(prefix)
  );
  return hit ? hit[1] : null;
}

// Origin class → accent hue for seals and badges.
const ORIGIN_HUES = {
  primordial: 28,
  mineral: 200,
  botanical: 110,
  echo: 270,
  astral: 230,
  colonial: 170,
  abyssal: 195,
  artificial: 0,
  symbiotic: 330,
  corrosive: 80,
  unknown: 210,
};

export function originHue(origin) {
  if (!origin) return 210;
  const first = origin.split(/[\/,]/)[0].trim().toLowerCase();
  return ORIGIN_HUES[first] ?? 210;
}

// Deterministic "guild seal" geometry for entries without artwork: a layered
// radial glyph seeded by the entry name, so every kaiju has a stable sigil.
export function sealFor(name, number) {
  let h = 2166136261;
  const seedStr = `${number}-${name}`;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const rand = () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return (h >>> 0) / 4294967296;
  };
  const rings = [];
  const ringCount = 2 + Math.floor(rand() * 2);
  for (let r = 0; r < ringCount; r++) {
    const points = 5 + Math.floor(rand() * 7);
    const baseRadius = 18 + r * 14;
    const jitter = 4 + rand() * 9;
    const rotation = rand() * Math.PI * 2;
    const pts = [];
    for (let p = 0; p < points; p++) {
      const angle = rotation + (p / points) * Math.PI * 2;
      const radius = baseRadius + (rand() - 0.5) * 2 * jitter;
      pts.push([50 + Math.cos(angle) * radius * 0.48, 50 + Math.sin(angle) * radius * 0.48]);
    }
    rings.push(pts);
  }
  return rings;
}
