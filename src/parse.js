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

function parseTableRows(body) {
  const rows = [];
  for (const line of body.split("\n")) {
    if (!line.startsWith("|") || line.includes("---")) continue;
    const cells = line
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean);
    if (cells.length >= 2) rows.push(cells);
  }
  return rows;
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

function parseInlineAbilityMeta(body) {
  const meta = {};
  let description = body;

  for (const key of ["mp", "japanese", "ultimate"]) {
    const re = new RegExp(`\\*\\*${key}:\\*\\*\\s*(.+?)(?:\\n|$)`, "i");
    const m = description.match(re);
    if (m) {
      meta[key] = m[1].trim();
      description = description.replace(re, "").trim();
    }
  }

  description = description.replace(/\s+/g, " ").trim();
  return { meta, description };
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
    const rawBody = nl === -1 ? "" : trimmed.slice(nl + 1).trim();
    const { meta, description } = parseInlineAbilityMeta(rawBody);
    if (name) {
      abilities.push({
        name,
        description,
        mp: meta.mp ? parseInt(meta.mp, 10) || meta.mp : null,
        japanese: meta.japanese || null,
        ultimate: /^true$/i.test(meta.ultimate || ""),
      });
    }
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

  const sentences = body
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length === 0) return null;
  return sentences.map((s) => ({ name: "Field guidance", description: s }));
}

export function parseResistances(markdown) {
  const body = sectionByTitle(markdown, "Resistances");
  if (!body) return null;

  const rows = [];
  for (const cells of parseTableRows(body)) {
    if (cells[0].toLowerCase() === "type") continue;
    rows.push({ type: cells[0], modifier: cells[1] });
  }
  return rows.length > 0 ? rows : null;
}

export function parseCombatProfile(markdown) {
  const body = sectionByTitle(markdown, "Combat profile");
  if (!body) return null;

  const stats = {};
  const re = /\*\*([^*]+):\*\*\s*(.+)/g;
  let m;
  while ((m = re.exec(body)) !== null) {
    const key = m[1].trim().toLowerCase();
    const raw = m[2].trim();
    const num = parseInt(raw.replace(/,/g, ""), 10);
    stats[key] = Number.isNaN(num) ? raw : num;
  }
  return Object.keys(stats).length > 0 ? stats : null;
}

export function parseDrops(markdown) {
  const body =
    sectionByTitle(markdown, "Recoverable materials") ||
    sectionByTitle(markdown, "Materials and remains");
  if (!body) return null;

  const drops = [];
  for (const cells of parseTableRows(body)) {
    const header = cells[0].toLowerCase();
    if (header === "material" || header === "item") continue;
    const chanceStr = cells[1] || "";
    const chanceMatch = chanceStr.match(/([\d.]+)\s*%/);
    drops.push({
      name: cells[0],
      chance: chanceMatch ? parseFloat(chanceMatch[1]) : null,
      chanceLabel: chanceStr || null,
      note: cells[2] || "",
      rare: /rare/i.test(cells[2] || "") || /rare/i.test(cells[0]),
    });
  }
  return drops.length > 0 ? drops : null;
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
    const lengthStr =
      scale["estimated length"] || scale["length"] || scale["estimated height"];
    if (lengthStr) {
      const m = lengthStr.match(/([\d,.]+)\s*m/i);
      if (m) return parseFloat(m[1].replace(/,/g, ""));
    }
  }
  if (threatAxes) {
    for (const row of threatAxes) {
      const m =
        row.notes.match(/([\d,.]+)[–-]([\d,.]+)\s*m/i) ||
        row.notes.match(/([\d,.]+)\s*m/i);
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

function parseClassificationField(markdown, field) {
  const body = sectionByTitle(markdown, "Classification");
  if (!body) return null;
  const re = new RegExp(`\\*\\*${field}:\\*\\*\\s*(.+)`, "i");
  const m = body.match(re);
  return m ? m[1].trim() : null;
}

export function parseEcologyNote(markdown) {
  const body =
    sectionByTitle(markdown, "Ecological role") ||
    sectionByTitle(markdown, "Ecology and behavior");
  if (!body) return null;

  const para = body
    .split(/\n\n/)
    .find(
      (p) =>
        p.trim() &&
        !p.trim().startsWith("-") &&
        !p.trim().startsWith("|") &&
        !p.trim().startsWith("**")
    );
  if (!para) return null;

  const sentence = para.replace(/\s+/g, " ").trim().split(/(?<=[.!?])\s+/)[0];
  return sentence || null;
}

const ACCENT_KEYWORDS = {
  toxic: ["toxic", "poison", "venom", "corrosive", "acid"],
  mineral: ["mineral", "stone", "earth", "primordial", "crystal", "echo"],
  aquatic: ["abyssal", "ocean", "water", "marine", "tidal"],
  floral: ["plant", "floral", "botanical", "orchid", "vine", "forest"],
  primordial: ["primordial", "geological", "seismic"],
  aerial: ["aerial", "astral", "echo", "atmospheric", "storm"],
};

export function deriveAccent(meta, origin, attribute) {
  if (meta.accent) return meta.accent.toLowerCase().trim();

  const haystack = `${attribute || ""} ${origin || ""}`.toLowerCase();
  for (const [accent, keywords] of Object.entries(ACCENT_KEYWORDS)) {
    if (keywords.some((k) => haystack.includes(k))) return accent;
  }
  return "default";
}

export function parseHazardLevel(meta) {
  const raw = meta.hazard || meta.toxicity;
  if (!raw) return null;
  if (/^max$/i.test(raw.trim())) return { label: "MAX", value: 5 };
  const num = parseInt(raw, 10);
  if (!Number.isNaN(num)) return { label: String(num), value: Math.min(5, Math.max(0, num)) };
  return { label: raw, value: null };
}

const HUD_SECTIONS = new Set([
  "identification",
  "threat assessment",
  "recorded abilities",
  "field guidance",
  "scale",
  "resistances",
  "combat profile",
  "recoverable materials",
]);

const HEADER_META_KEYS = [
  "guild epithet",
  "japanese display name",
  "japanese epithet",
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
  "attribute",
  "guild type",
  "rarity",
  "accent",
  "seal kanji",
  "calligraphy",
  "hazard",
  "toxicity",
  "hunt rank",
  "documented hunts",
  "expedition value",
  "bounty",
];

export function buildBodyMarkdown(markdown) {
  let result = markdown;

  result = result.replace(/^#\s+.+\n?/m, "");

  for (const key of HEADER_META_KEYS) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    result = result.replace(new RegExp(`^\\*\\*${escaped}:\\*\\*.*$\\n?`, "gim"), "");
  }

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
  const resistances = parseResistances(markdown);
  const combatProfile = parseCombatProfile(markdown);
  const drops = parseDrops(markdown);

  const origin =
    meta.origin ||
    meta["primary ecology"] ||
    parseClassificationField(markdown, "Origin") ||
    null;

  const attribute =
    meta.attribute ||
    parseClassificationField(markdown, "Origin") ||
    meta["primary ecology"] ||
    null;

  const guildType =
    meta["guild type"] ||
    parseClassificationField(markdown, "Guild descriptor") ||
    null;

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

  const rarityRaw = meta.rarity;
  const rarity = rarityRaw ? parseInt(rarityRaw, 10) : null;

  return {
    slug,
    number,
    name,
    japaneseName: meta["japanese display name"] || null,
    japaneseEpithet: meta["japanese epithet"] || null,
    epithet: meta["guild epithet"] || meta["operational class"] || null,
    origin,
    disposition: meta.disposition || parseClassificationField(markdown, "Disposition") || null,
    threat: meta.threat || meta["operational class"] || null,
    habitat: meta["primary habitat"] || meta["known range"] || null,
    status: meta["canon status"] || null,
    firstRecord: meta["first verified record"] || null,
    attribute,
    guildType,
    rarity: Number.isNaN(rarity) ? null : rarity,
    accent: deriveAccent(meta, origin, attribute),
    sealKanji: meta["seal kanji"] || null,
    calligraphy: meta.calligraphy || null,
    hazard: parseHazardLevel(meta),
    huntRank: meta["hunt rank"] || null,
    documentedHunts: meta["documented hunts"] || null,
    expeditionValue: meta["expedition value"] || null,
    bounty: meta.bounty || null,
    excerpt: excerptMatch || null,
    identificationExcerpt: identificationExcerpt || excerptMatch || null,
    ecologyNote: parseEcologyNote(markdown),
    threatAxes,
    abilities,
    resistances,
    combatProfile,
    drops,
    scale,
    lengthMeters: parseLengthMeters(scale, threatAxes),
    bodyMarkdown: buildBodyMarkdown(markdown),
    markdown,
  };
}
