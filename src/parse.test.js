// Contribution guardrail: every dossier in bestiary/ must parse into a valid
// dex record. This runs in CI on every push, so a malformed contribution
// fails loudly instead of silently vanishing from the site.

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parseEntry, parseMeta } from "./parse.js";

const bestiaryDir = join(__dirname, "..", "bestiary");
const files = readdirSync(bestiaryDir).filter(
  (f) => f.endsWith(".md") && !f.includes("template")
);

describe("bestiary archive", () => {
  it("contains at least the Founding Four", () => {
    expect(files.length).toBeGreaterThanOrEqual(4);
  });

  for (const file of files) {
    describe(file, () => {
      const raw = readFileSync(join(bestiaryDir, file), "utf8");
      const entry = parseEntry(file, raw);

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
});
