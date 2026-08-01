// Pure markdown-dossier parsing, shared by the app (src/lore.js) and the
// contribution-validating test suite. No Vite dependencies here.

export function parseMeta(markdown) {
  const meta = {};
  const re = /\*\*([^*:]+):?\*\*:?\s*(.+?)\s*$/gm;
  let m;
  while ((m = re.exec(markdown)) !== null) {
    const key = m[1].trim().replace(/:$/, "").toLowerCase();
    const value = m[2].trim();
    if (!(key in meta)) meta[key] = value;
  }
  return meta;
}

/** Split markdown into `##` sections. Returns [{ title, body }] */
export function parseSections(markdown) {
  const parts = markdown.split(/^## /m);
  return parts.slice(1).map((part) => {
    const nl = part.indexOf("\n");
    const title = nl === -1 ? part.trim() : part.slice(0, nl).trim();
    const body = nl === -1 ? "" : part.slice(nl + 1).trim();
    return { title, body };
  });
}

export function sectionByTitle(markdown, title) {
  const needle = title.toLowerCase();
  const hit = parseSections(markdown).find((s) => s.title.toLowerCase() === needle);
  return hit ? hit.body : null;
}

export function parseThreatAxes(markdown) {
  const body = sectionByTitle(markdown, "Threat assessment");
  if (!body) return null;

  const rows = [];
  for (const line of body.split("\n")) {
    if (!line.startsWith("|") || line.includes("---")) continue;
    const cells = line
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean);
    if (cells.length < 2) continue;
    if (cells[0].toLowerCase() === "axis") continue;

    const rating = parseInt(cells[1], 10);
    if (Number.isNaN(rating)) continue;

    rows.push({
      axis: cells[0],
      rating,
      notes: cells[2] || "",
    });
  }
  return rows.length > 0 ? rows : null;
}

export function parseAbilities(markdown) {
  const body = sectionByTitle(markdown, "Recorded abilities");
  if (!body) return null;

  const abilities = [];
  const chunks = body.split(/^### /m);
  for (const chunk of chunks) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;
    const nl = trimmed.indexOf("\n");
    const name = nl === -1 ? trimmed.trim() : trimmed.slice(0, nl).trim();
    const description =
      nl === -1 ? "" : trimmed.slice(nl + 1).trim().replace(/\s+/g, " ");
    if (name) abilities.push({ name, description });
  }
  return abilities.length > 0 ? abilities : null;
}

export function parseFieldGuidance(markdown) {
  const body = sectionByTitle(markdown, "Field guidance");
  if (!body) return null;

  const bulletItems = [];
  for (const line of body.split("\n")) {
    const m = line.match(/^[-*]\s+(.+)/);
    if (m) bulletItems.push({ name: "Field guidance", description: m[1].trim() });
  }
  if (bulletItems.length > 0) return bulletItems;

  // Prose-style guidance: split into sentence directives
  const sentences = body
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length === 0) return null;
  return sentences.map((s) => ({ name: "Field guidance", description: s }));
}

export function parseScale(markdown) {
  const body = sectionByTitle(markdown, "Scale");
  if (!body) return null;

  const scale = {};
  const re = /\*\*([^*]+):\*\*\s*(.+)/g;
  let m;
  while ((m = re.exec(body)) !== null) {
    const key = m[1].trim().toLowerCase();
    scale[key] = m[2].trim();
  }
  return Object.keys(scale).length > 0 ? scale : null;
}

/** Parse length in meters from scale or threat notes */
export function parseLengthMeters(scale, threatAxes) {
  if (scale) {
    const lengthStr = scale["estimated length"] || scale["length"];
    if (lengthStr) {
      const m = lengthStr.match(/([\d,.]+)\s*m/i);
      if (m) return parseFloat(m[1].replace(/,/g, ""));
    }
  }
  if (threatAxes) {
    for (const row of threatAxes) {
      const m = row.notes.match(/([\d,.]+)[–-]([\d,.]+)\s*m/i) || row.notes.match(/([\d,.]+)\s*m/i);
      if (m) {
        if (m[2]) {
          return (parseFloat(m[1].replace(/,/g, "")) + parseFloat(m[2].replace(/,/g, ""))) / 2;
        }
        return parseFloat(m[1].replace(/,/g, ""));
      }
    }
  }
  return null;
}

const HUD_SECTIONS = new Set([
  "identification",
  "threat assessment",
  "recorded abilities",
  "field guidance",
  "scale",
]);

const HEADER_META_KEYS = [
  "guild epithet",
  "japanese display name",
  "field designation",
  "canon status",
  "operational class",
  "known range",
  "primary ecology",
  "origin",
  "disposition",
  "threat",
  "first verified record",
  "primary habitat",
];

export function buildBodyMarkdown(markdown) {
  let result = markdown;

  // Remove H1
  result = result.replace(/^#\s+.+\n?/m, "");

  // Remove header meta lines
  for (const key of HEADER_META_KEYS) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    result = result.replace(new RegExp(`^\\*\\*${escaped}:\\*\\*.*$\\n?`, "gim"), "");
  }

  // Remove HUD sections
  const sections = parseSections(result);
  const kept = sections.filter((s) => !HUD_SECTIONS.has(s.title.toLowerCase()));
  result = kept.map((s) => `## ${s.title}\n\n${s.body}`).join("\n\n");

  return result.trim();
}

export function parseEntry(path, markdown) {
  const slug = path.split("/").pop().replace(/\.md$/, "");
  const h1 = markdown.match(/^#\s+(.+)$/m);
  const title = h1 ? h1[1].trim() : slug;

  const head = title.match(/Bestiary\s+No\.?\s*(\d+)\s*[:—–-]+\s*(.+)/i);
  const number = head ? parseInt(head[1], 10) : null;
  const name = head ? head[2].trim() : title;

  const meta = parseMeta(markdown);
  const threatAxes = parseThreatAxes(markdown);
  const scale = parseScale(markdown);
  const abilities = parseAbilities(markdown) || parseFieldGuidance(markdown);

  const identificationBody = sectionByTitle(markdown, "Identification");
  const identificationExcerpt = identificationBody
    ? identificationBody
        .split(/\n\n/)
        .find(
          (p) =>
            p.trim() &&
            !p.trim().startsWith("-") &&
            !p.trim().startsWith("|") &&
            !p.trim().startsWith("**") &&
            !p.trim().startsWith(">")
        )
        ?.replace(/\s+/g, " ")
        .trim() || null
    : null;

  // First real paragraph after the metadata block, used as the card excerpt.
  const excerptMatch = markdown
    .split(/\n## /)
    .slice(1)
    .map((section) => {
      const lines = section.split("\n").slice(1).join("\n").trim();
      const para = lines.split(/\n\n/).find(
        (p) =>
          p.trim() &&
          !p.trim().startsWith("-") &&
          !p.trim().startsWith("|") &&
          !p.trim().startsWith("**") &&
          !p.trim().startsWith(">") &&
          !p.trim().startsWith("#")
      );
      return para ? para.replace(/\s+/g, " ").trim() : null;
    })
    .find(Boolean);

  return {
    slug,
    number,
    name,
    japaneseName: meta["japanese display name"] || null,
    epithet: meta["guild epithet"] || meta["operational class"] || null,
    origin: meta["origin"] || meta["primary ecology"] || null,
    disposition: meta["disposition"] || null,
    threat: meta["threat"] || meta["operational class"] || null,
    habitat: meta["primary habitat"] || meta["known range"] || null,
    status: meta["canon status"] || null,
    firstRecord: meta["first verified record"] || null,
    excerpt: excerptMatch || null,
    identificationExcerpt: identificationExcerpt || excerptMatch || null,
    threatAxes,
    abilities,
    scale,
    lengthMeters: parseLengthMeters(scale, threatAxes),
    bodyMarkdown: buildBodyMarkdown(markdown),
    markdown,
  };
}
