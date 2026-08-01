// Shared bestiary validation rules for CI tests and the Kaiju Review PR bot.

import { parseEntry, parseMeta, parseSections, parseThreatAxes } from "./parse.js";

export const REQUIRED_THREAT_AXES = [
  "Scale",
  "Lethality",
  "Reach",
  "Persistence",
  "Intelligence",
  "Cascade",
];

export const WORKING_META_KEYS = ["operational class", "primary ecology", "known range"];

// Founding Four numbers (C-006) plus known C-007 parallel records only.
export const FOUNDING_FOUR_ALLOWED = {
  1: ["001-gravorax.md"],
  45: ["045-vespera.md", "045-bloomwraith.md"],
  86: ["086-thalassion.md", "086-venomvine.md"],
  87: ["087-okisendra.md", "087-orchidia.md"],
};

export const REQUIRED_WORKING_SECTIONS = [
  "Names",
  "Identification",
  "Biology",
  "Behavior",
  "Ecological role",
  "Human relationship",
  "Threat assessment",
  "Field guidance",
  "Canon connections",
];

export const TEMPLATE_PLACEHOLDER_PATTERNS = [
  { pattern: /Bestiary\s+No\.XXX/i, message: "H1 still uses template placeholder `No.XXX`" },
  {
    pattern: /Bestiary\s+No\.\d+\s*[:—–-]+\s*Guild Name/i,
    message: "H1 still uses template placeholder `Guild Name`",
  },
  { pattern: /\*\*Operational class:\*\*\s*TBD/i, message: "`Operational class` is still `TBD`" },
  { pattern: /\*\*Known range:\*\*\s*TBD/i, message: "`Known range` is still `TBD`" },
  { pattern: /\*\*Primary ecology:\*\*\s*TBD/i, message: "`Primary ecology` is still `TBD`" },
  { pattern: /\blorem ipsum\b/i, message: "Contains placeholder text `lorem ipsum`" },
];

export const MOURNING_REACH_PATTERN = /mourning reach/i;

export const BESTIARY_FILE_RE = /^bestiary\/(\d{3}-.+\.md)$/;

export function isBestiaryDossierPath(path) {
  return BESTIARY_FILE_RE.test(path);
}

export function bestiaryFilename(path) {
  const match = path.match(BESTIARY_FILE_RE);
  return match ? match[1] : null;
}

export function countCanonConnectionItems(markdown) {
  const parts = markdown.split(/^## /m);
  for (const part of parts) {
    if (!/^Canon connections\s/i.test(part)) continue;
    const section = part.split("\n").slice(1).join("\n").trim();
    if (!section) return 0;
    const bullets = section.match(/^[-*]\s+.+/gm) || [];
    const paragraphs = section
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter((p) => p && !/^[-*]\s/.test(p));
    return bullets.length + paragraphs.length;
  }
  return 0;
}

export function parseNumbersInventory(markdown) {
  const parts = markdown.split(/^## All recorded slots\s/mi);
  if (parts.length < 2) return [];
  const section = parts[1].split(/^## /m)[0];
  const inventory = [];
  for (const match of section.matchAll(/`(\d{3}-[^`]+\.md)`/g)) {
    inventory.push(match[1]);
  }
  return inventory;
}

export function isWorkingCanon(status) {
  return status?.toLowerCase().includes("working");
}

export function hasSection(markdown, title) {
  const needle = title.toLowerCase();
  return parseSections(markdown).some((s) => s.title.toLowerCase() === needle);
}

export function mentionsMourningReach(text) {
  return MOURNING_REACH_PATTERN.test(text);
}

/**
 * Validate a single bestiary dossier.
 * @returns {{ errors: string[], warnings: string[], entry: import('./parse.js').parseEntry extends Function ? ReturnType<import('./parse.js').parseEntry> : never }}
 */
export function validateDossier(file, raw, { isNew = false } = {}) {
  const errors = [];
  const warnings = [];
  const entry = parseEntry(file, raw);

  if (entry.number == null) {
    errors.push("Missing dex number in H1 (expected `# Bestiary No.NNN — Name`)");
  } else {
    if (entry.number < 1 || entry.number > 200) {
      errors.push(`Dex number ${entry.number} is outside catalog range 1–200`);
    }

    const prefix = file.match(/^(\d+)/);
    if (!prefix) {
      errors.push("Filename should start with the 3-digit dex number");
    } else if (parseInt(prefix[1], 10) !== entry.number) {
      errors.push(
        `Filename prefix ${prefix[1]} does not match H1 number ${String(entry.number).padStart(3, "0")}`
      );
    }

    const allowed = FOUNDING_FOUR_ALLOWED[entry.number];
    if (allowed && !allowed.includes(file)) {
      const label = String(entry.number).padStart(3, "0");
      errors.push(
        `Reserved catalog number ${label} — see bestiary/NUMBERS.md and canon/continuity-ledger.md (C-006, C-007)`
      );
    }
  }

  if (!entry.name) {
    errors.push("Missing creature name in H1");
  } else if (entry.name.length >= 80) {
    errors.push("Creature name exceeds 80 characters");
  }

  if (!entry.status) {
    errors.push("Missing `**Canon status:**` line");
  } else if (isNew && !entry.status.toLowerCase().includes("working canon")) {
    errors.push('New entries must declare `**Canon status:** Working canon`');
  }

  if (raw.length <= 400) {
    errors.push("Body must exceed 400 characters");
  }

  if (!entry.excerpt) {
    errors.push(
      "Missing dex card excerpt — add a prose paragraph under an `##` section (not only lists or tables)"
    );
  }

  for (const { pattern, message } of TEMPLATE_PLACEHOLDER_PATTERNS) {
    if (pattern.test(raw)) {
      errors.push(message);
    }
  }

  if (isWorkingCanon(entry.status)) {
    for (const section of REQUIRED_WORKING_SECTIONS) {
      if (!hasSection(raw, section)) {
        errors.push(`Missing required section \`## ${section}\``);
      }
    }

    const meta = parseMeta(raw);
    for (const key of WORKING_META_KEYS) {
      if (!meta[key]) {
        const label = key.charAt(0).toUpperCase() + key.slice(1);
        errors.push(`Missing \`**${label}:**\` metadata — see entry-template.md`);
      }
    }

    const connectionCount = countCanonConnectionItems(raw);
    if (connectionCount < 2) {
      errors.push(
        "`## Canon connections` needs at least two bullet items linking to existing lore"
      );
    }

    const axes = parseThreatAxes(raw);
    if (!axes) {
      errors.push(
        "Missing `## Threat assessment` with a six-axis GFM table — see systems/threat-system.md"
      );
    } else {
      if (axes.length !== 6) {
        errors.push(`Threat assessment must have exactly six axes (found ${axes.length})`);
      }
      for (const name of REQUIRED_THREAT_AXES) {
        if (!axes.some((row) => row.axis === name)) {
          errors.push(`Threat assessment missing axis \`${name}\``);
        }
      }
      for (const row of axes) {
        if (row.rating < 0 || row.rating > 5) {
          errors.push(`${row.axis} rating must be 0–5 (got ${row.rating})`);
        }
      }
    }

    if (!hasSection(raw, "Scale") && !hasSection(raw, "Recorded abilities")) {
      warnings.push(
        "Optional sections missing: consider adding `## Scale` and/or `## Recorded abilities`"
      );
    } else if (!hasSection(raw, "Scale")) {
      warnings.push("Optional section missing: `## Scale`");
    } else if (!hasSection(raw, "Recorded abilities")) {
      warnings.push("Optional section missing: `## Recorded abilities`");
    }
  }

  return { errors, warnings, entry };
}

/**
 * Validate a pull request's bestiary-related changes.
 * @param {{
 *   changedFiles: Array<{ path: string, status: string, content?: string | null, previousContent?: string | null }>,
 *   numbersMdContent?: string | null,
 * }} input
 */
export function validatePullRequest({ changedFiles, numbersMdContent = null }) {
  const errors = [];
  const warnings = [];
  const dossierFindings = [];

  const paths = changedFiles.map((f) => f.path);
  const bestiaryChanges = changedFiles.filter((f) => isBestiaryDossierPath(f.path));
  const newBestiaryFiles = bestiaryChanges.filter((f) => f.status === "added");
  const modifiedBestiaryFiles = bestiaryChanges.filter(
    (f) => f.status === "modified" || f.status === "changed"
  );

  const numbersEntry = changedFiles.find((f) => f.path === "bestiary/NUMBERS.md");
  const numbersRaw =
    numbersEntry?.content ??
    numbersMdContent ??
    null;

  if (newBestiaryFiles.length > 1) {
    warnings.push(
      `PR adds ${newBestiaryFiles.length} new dossiers — prefer one creature per PR`
    );
  }

  if (bestiaryChanges.length === 0) {
    return {
      scope: "non-bestiary",
      errors,
      warnings,
      dossierFindings,
      markdown: "",
    };
  }

  const inventory = numbersRaw ? parseNumbersInventory(numbersRaw) : null;

  for (const file of [...newBestiaryFiles, ...modifiedBestiaryFiles]) {
    const filename = bestiaryFilename(file.path);
    if (!filename) continue;

    if (file.status === "removed") continue;

    if (file.content == null) {
      errors.push(`Could not read content for \`${file.path}\``);
      continue;
    }

    const isNew = file.status === "added";
    const result = validateDossier(filename, file.content, { isNew });
    dossierFindings.push({
      path: file.path,
      isNew,
      errors: result.errors,
      warnings: result.warnings,
    });

    if (isNew && inventory && !inventory.includes(filename)) {
      result.errors.push(
        `\`${filename}\` is not listed in \`bestiary/NUMBERS.md\` under All recorded slots`
      );
    }

    if (mentionsMourningReach(file.content)) {
      if (!paths.includes("ecology/mourning-reach-web.md")) {
        result.errors.push(
          "Dossier mentions Mourning Reach — PR must also update `ecology/mourning-reach-web.md`"
        );
      }
      if (!paths.includes("canon/continuity-ledger.md")) {
        result.errors.push(
          "Dossier mentions Mourning Reach — PR must also update `canon/continuity-ledger.md`"
        );
      }
    }

    const artMatch = file.content.match(/art\/images\/\d{3}-[^\s"'`]+\.(?:png|jpe?g|webp|gif)/i);
    if (artMatch) {
      warnings.push(
        `Dossier references \`${artMatch[0]}\` — ensure the image file is included in the PR`
      );
    }

    for (const msg of result.errors) errors.push(`\`${file.path}\`: ${msg}`);
    for (const msg of result.warnings) warnings.push(`\`${file.path}\`: ${msg}`);
  }

  const markdown = formatReviewMarkdown({
    scope: "bestiary",
    errors,
    warnings,
    dossierFindings,
    bestiaryChanges,
  });

  return {
    scope: "bestiary",
    errors,
    warnings,
    dossierFindings,
    markdown,
  };
}

export function formatReviewMarkdown({
  scope,
  errors,
  warnings,
  dossierFindings = [],
  bestiaryChanges = [],
}) {
  if (scope === "non-bestiary") {
    return [
      "## Kaiju Review",
      "",
      "No bestiary dossier changes detected — skipping dossier checklist.",
      "",
      "The **Tests** workflow still validates the full archive on every PR.",
    ].join("\n");
  }

  const lines = ["## Kaiju Review", ""];

  if (bestiaryChanges.length > 0) {
    lines.push("**Dossiers reviewed:**");
    for (const f of bestiaryChanges) {
      lines.push(`- \`${f.path}\` (${f.status})`);
    }
    lines.push("");
  }

  if (errors.length === 0) {
    lines.push("All required kaiju attributes are present.");
  } else {
    lines.push("### Required fixes");
    lines.push("");
    for (const err of errors) {
      lines.push(`- ❌ ${err}`);
    }
  }

  if (warnings.length > 0) {
    lines.push("");
    lines.push("### Warnings");
    lines.push("");
    for (const warn of warnings) {
      lines.push(`- ⚠️ ${warn}`);
    }
  }

  if (errors.length > 0) {
    lines.push("");
    lines.push("## Agent fix loop");
    lines.push("");
    lines.push("1. Read every ❌ item above.");
    lines.push("2. Edit the dossier / NUMBERS.md / ecology / ledger as needed.");
    lines.push("3. Run `npm test` locally until green.");
    lines.push("4. Commit and push to the **same PR branch** (do not open a new PR).");
    lines.push("5. Wait for **Kaiju Review** to re-run. Repeat until it Approves.");
  }

  return lines.join("\n");
}

export const AGENT_FIX_LOOP_FOOTER = [
  "## Agent fix loop",
  "",
  "1. Read every ❌ item above.",
  "2. Edit the dossier / NUMBERS.md / ecology / ledger as needed.",
  "3. Run `npm test` locally until green.",
  "4. Commit and push to the **same PR branch** (do not open a new PR).",
  "5. Wait for **Kaiju Review** to re-run. Repeat until it Approves.",
].join("\n");
