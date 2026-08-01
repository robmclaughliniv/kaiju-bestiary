import { describe, it, expect, beforeEach } from "vitest";
import { validateCreationPayload } from "../api/lib/validate.mjs";
import { buildMarkdown } from "../api/lib/markdown.mjs";
import { createCreation } from "../api/lib/creations.mjs";
import { memoryReset } from "../api/lib/memory-store.mjs";
import { parseEntry } from "./parse.js";
import { parseWorkshopEntry } from "./workshop.js";

describe("workshop API validation", () => {
  it("requires name and identification", () => {
    expect(validateCreationPayload({}).error).toMatch(/Name/);
    expect(validateCreationPayload({ name: "Ab" }).error).toMatch(/Identification/);
  });

  it("accepts a valid payload", () => {
    const result = validateCreationPayload({
      name: "Glassfin Leviathan",
      identification: "A translucent dorsal crest visible from twenty kilometers at dusk.",
      threat: { scale: 3, lethality: 2, reach: 4, persistence: 1, intelligence: 2, cascade: 3 },
    });
    expect(result.error).toBeUndefined();
    expect(result.data.name).toBe("Glassfin Leviathan");
  });
});

describe("workshop markdown round-trip", () => {
  beforeEach(() => {
    process.env.WORKSHOP_MEMORY_STORE = "1";
    memoryReset();
  });

  it("creates markdown that parseEntry understands", async () => {
    const { item } = await createCreation({
      name: "Test Kaiju",
      identification:
        "Observers report a low harmonic vibration preceding each surface breach.",
      operationalClass: "Migratory colossus",
      primaryEcology: "Abyssal",
      knownRange: "Outer trenches",
      threat: { scale: 2, lethality: 1, reach: 3, persistence: 2, intelligence: 1, cascade: 2 },
    });

    const parsed = parseWorkshopEntry(item);
    expect(parsed.name).toBe("Test Kaiju");
    expect(parsed.threatAxes).toHaveLength(6);
    expect(parsed.identificationExcerpt).toMatch(/harmonic vibration/);
  });

  it("builds markdown with threat table", () => {
    const md = buildMarkdown({
      name: "Shardmaw",
      identification: "Crystalline jaw plates refract emergency flares into blinding spectra.",
      operationalClass: "Mineral predator",
      primaryEcology: "Mineral",
      knownRange: "High passes",
      creatorLabel: null,
      behavior: "",
      ecologicalRole: "",
      threat: { scale: 4, lethality: 3, reach: 2, persistence: 4, intelligence: 1, cascade: 2 },
    });
    expect(md).toMatch(/# Workshop — Shardmaw/);
    expect(md).toMatch(/\| Scale \| 4 \|/);
  });
});
