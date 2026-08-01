// Contribution guardrail: every dossier in bestiary/ must parse into a valid
// dex record. This runs in CI on every push, so a malformed contribution
// fails loudly instead of silently vanishing from the site.

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parseEntry, parseMeta } from "./parse.js";
import {
  FOUNDING_FOUR_ALLOWED,
  REQUIRED_THREAT_AXES,
  WORKING_META_KEYS,
  countCanonConnectionItems,
  isWorkingCanon,
  parseNumbersInventory,
  validateDossier,
} from "./bestiaryRules.js";
import { parseThreatAxes } from "./parse.js";

const bestiaryDir = join(__dirname, "..", "bestiary");
const numbersPath = join(bestiaryDir, "NUMBERS.md");
const files = readdirSync(bestiaryDir).filter(
  (f) => f.endsWith(".md") && /^\d{3}-/.test(f)
);

describe("NUMBERS.md inventory", () => {
  const numbersRaw = readFileSync(numbersPath, "utf8");
  const inventory = parseNumbersInventory(numbersRaw);

  it("lists every numbered bestiary file", () => {
    for (const file of files) {
      expect(
        inventory,
        `${file} is missing from bestiary/NUMBERS.md — add a row under All recorded slots`
      ).toContain(file);
    }
  });

  it("only lists files that exist on disk", () => {
    for (const name of inventory) {
      expect(
        files,
        `${name} in NUMBERS.md has no matching file in bestiary/`
      ).toContain(name);
    }
  });
});

describe("bestiary archive", () => {
  it("contains at least the Founding Four", () => {
    expect(files.length).toBeGreaterThanOrEqual(4);
  });

  for (const file of files) {
    describe(file, () => {
      const raw = readFileSync(join(bestiaryDir, file), "utf8");
      const entry = parseEntry(file, raw);
      const validation = validateDossier(file, raw, { isNew: false });

      it("has a dex number in its H1 (e.g. `# Bestiary No.042 — Name`)", () => {
        expect(entry.number).not.toBeNull();
        expect(entry.number).toBeGreaterThanOrEqual(1);
        expect(entry.number).toBeLessThanOrEqual(200);
      });

      it("has a name", () => {
        expect(entry.name).toBeTruthy();
        expect(entry.name.length).toBeLessThan(80);
      });

      it("filename number prefix matches the H1 number", () => {
        const prefix = file.match(/^(\d+)/);
        expect(prefix, "filename should start with the 3-digit dex number").not.toBeNull();
        expect(parseInt(prefix[1], 10)).toBe(entry.number);
      });

      it("declares a canon status", () => {
        expect(entry.status, "add a `**Canon status:** ...` line").toBeTruthy();
      });

      it("has some body text and an excerpt for the dex card", () => {
        expect(raw.length).toBeGreaterThan(400);
        expect(entry.excerpt).toBeTruthy();
      });

      it("does not claim a Founding Four number without allowlist approval", () => {
        const allowed = FOUNDING_FOUR_ALLOWED[entry.number];
        if (!allowed) return;
        const label = String(entry.number).padStart(3, "0");
        expect(
          allowed,
          `${file} uses reserved catalog number ${label}. See bestiary/NUMBERS.md and canon/continuity-ledger.md (C-006, C-007).`
        ).toContain(file);
      });

      it("includes Canon connections when Working canon", () => {
        if (!isWorkingCanon(entry.status)) return;
        const count = countCanonConnectionItems(raw);
        expect(
          count,
          "Working entries need `## Canon connections` with at least two bullet items — see AGENTS.md"
        ).toBeGreaterThanOrEqual(2);
      });

      it("includes a six-axis Threat assessment table when Working canon", () => {
        if (!isWorkingCanon(entry.status)) return;
        const axes = parseThreatAxes(raw);
        expect(
          axes,
          "Working entries need `## Threat assessment` with a six-axis GFM table — see systems/threat-system.md"
        ).toBeTruthy();
        expect(axes).toHaveLength(6);
        for (const name of REQUIRED_THREAT_AXES) {
          expect(axes.some((row) => row.axis === name), `missing axis ${name}`).toBe(true);
        }
        for (const row of axes) {
          expect(row.rating, `${row.axis} rating must be 0–5`).toBeGreaterThanOrEqual(0);
          expect(row.rating, `${row.axis} rating must be 0–5`).toBeLessThanOrEqual(5);
        }
      });

      it("declares Working metadata keys when Working canon", () => {
        if (!isWorkingCanon(entry.status)) return;
        const meta = parseMeta(raw);
        for (const key of WORKING_META_KEYS) {
          expect(
            meta[key],
            `Working entries need \`**${key.charAt(0).toUpperCase() + key.slice(1)}:**\` — see entry-template.md`
          ).toBeTruthy();
        }
      });

      it("passes shared dossier validation (no template placeholders on established entries)", () => {
        if (!isWorkingCanon(entry.status)) return;
        const placeholderErrors = validation.errors.filter((e) =>
          /placeholder|TBD|Guild Name|No\.XXX|lorem ipsum/i.test(e)
        );
        expect(placeholderErrors, placeholderErrors.join("; ")).toHaveLength(0);
      });
    });
  }
});

describe("parseMeta", () => {
  it("reads bold key/value lines in both dossier styles", () => {
    const meta = parseMeta(
      "**Guild epithet:** The Test\n- **Origin:** Mineral / Echo\n**Canon status:** Working canon\n"
    );
    expect(meta["guild epithet"]).toBe("The Test");
    expect(meta["origin"]).toBe("Mineral / Echo");
    expect(meta["canon status"]).toBe("Working canon");
  });
});

describe("parseEntry", () => {
  it("handles the colon title style", () => {
    const e = parseEntry("001-x.md", "# Bestiary No.001: Gravorax\n\n**Canon status:** Established\n");
    expect(e.number).toBe(1);
    expect(e.name).toBe("Gravorax");
  });
  it("handles the em-dash title style", () => {
    const e = parseEntry("045-x.md", "# Bestiary No.045 — Bloomwraith\n");
    expect(e.number).toBe(45);
    expect(e.name).toBe("Bloomwraith");
  });

  it("parses Venomvine Working dossier structured fields", () => {
    const raw = readFileSync(join(bestiaryDir, "086-venomvine.md"), "utf8");
    const e = parseEntry("086-venomvine.md", raw);
    expect(e.threatAxes).toHaveLength(6);
    expect(e.threatAxes[0]).toMatchObject({ axis: "Scale", rating: 4 });
    expect(e.threatAxes.find((a) => a.axis === "Cascade")?.rating).toBe(5);
    expect(e.abilities).toBeTruthy();
    expect(e.abilities.length).toBeGreaterThanOrEqual(1);
    expect(e.scale).toBeTruthy();
    expect(e.combatProfile).toBeTruthy();
    expect(e.resistances).toHaveLength(9);
    expect(e.bodyMarkdown).not.toMatch(/Threat assessment/i);
    expect(e.bodyMarkdown).not.toMatch(/Field guidance/i);
    expect(e.identificationExcerpt).toMatch(/Venomvine/);
  });

  it("parses Gravorax Established dossier structured fields", () => {
    const raw = readFileSync(join(bestiaryDir, "001-gravorax.md"), "utf8");
    const e = parseEntry("001-gravorax.md", raw);
    expect(e.japaneseName).toBe("グラヴォラックス");
    expect(e.abilities).toHaveLength(4);
    expect(e.abilities[0].name).toBe("Earthbreak Stomp");
    expect(e.abilities[0].mp).toBe(42);
    expect(e.abilities[3].ultimate).toBe(true);
    expect(e.scale["estimated length"]).toBe("138 m");
    expect(e.scale["estimated mass"]).toBe("112,000 t");
    expect(e.lengthMeters).toBe(138);
    expect(e.resistances).toHaveLength(9);
    expect(e.combatProfile?.hp).toBe(420000);
    expect(e.drops?.length).toBeGreaterThanOrEqual(4);
    expect(e.accent).toBe("mineral");
    expect(e.huntRank).toBe("S");
    expect(e.bodyMarkdown).not.toMatch(/Recorded abilities/i);
    expect(e.bodyMarkdown).not.toMatch(/## Scale/i);
  });

  it("parses Bloomwraith hunt UI fields", () => {
    const raw = readFileSync(join(bestiaryDir, "045-bloomwraith.md"), "utf8");
    const e = parseEntry("045-bloomwraith.md", raw);
    expect(e.accent).toBe("toxic");
    expect(e.sealKanji).toBe("幽蘭");
    expect(e.hazard?.label).toBe("MAX");
    expect(e.combatProfile?.level).toBe(45);
    expect(e.abilities).toHaveLength(4);
    expect(e.abilities[3].ultimate).toBe(true);
    expect(e.drops).toHaveLength(5);
    expect(e.lengthMeters).toBe(32.5);
    expect(e.bodyMarkdown).not.toMatch(/Combat profile/i);
    expect(e.bodyMarkdown).not.toMatch(/Resistances/i);
  });
});
