import { describe, it, expect } from "vitest";
import { validateDossier, validatePullRequest } from "./bestiaryRules.js";

const MINIMAL_WORKING = `# Bestiary No.112 — Cindermaw

**Canon status:** Working canon
**Operational class:** Ember stalker
**Known range:** Ash coasts
**Primary ecology:** Volcanic littoral

## Names

- Guild name: Cindermaw

## Identification

Cindermaw moves through cooling lava fields like a furnace given legs, leaving glassy footprints that crack when touched.

## Biology

Anatomy unresolved.

## Behavior

Territorial at dusk.

## Ecological role

Scavenges thermal vents.

## Human relationship

Coastal settlements maintain watch fires.

## Threat assessment

| Axis | Rating | Notes |
|---|---:|---|
| Scale | 3 | |
| Lethality | 4 | |
| Reach | 2 | |
| Persistence | 3 | |
| Intelligence | 2 | |
| Cascade | 3 | |

## Field guidance

Do not follow glass trails uphill.

## Canon connections

- Links to [Gravorax](../bestiary/001-gravorax.md) through shared seismic corridors.
- Shares ash-cycle prey with coastal Guild survey routes.

## Recorded encounters

First sighting 2019.
`.repeat(1);

describe("validateDossier", () => {
  it("passes a complete Working dossier", () => {
    const { errors } = validateDossier("112-cindermaw.md", MINIMAL_WORKING, { isNew: true });
    expect(errors).toHaveLength(0);
  });

  it("flags template placeholders on new entries", () => {
    const raw = MINIMAL_WORKING.replace("112", "112").replace(
      "**Operational class:** Ember stalker",
      "**Operational class:** TBD"
    );
    const { errors } = validateDossier("112-cindermaw.md", raw, { isNew: true });
    expect(errors.some((e) => /TBD/.test(e))).toBe(true);
  });

  it("requires Working canon on new entries", () => {
    const raw = MINIMAL_WORKING.replace("Working canon", "Established");
    const { errors } = validateDossier("112-cindermaw.md", raw, { isNew: true });
    expect(errors.some((e) => /Working canon/.test(e))).toBe(true);
  });
});

describe("validatePullRequest", () => {
  it("requires ecology and ledger updates when Mourning Reach is mentioned", () => {
    const mourningReachContent = MINIMAL_WORKING.replace(
      "- Shares ash-cycle prey with coastal Guild survey routes.",
      "- Operates along the Mourning Reach ash shelf."
    );
    const result = validatePullRequest({
      changedFiles: [
        {
          path: "bestiary/112-cindermaw.md",
          status: "added",
          content: mourningReachContent,
        },
        {
          path: "bestiary/NUMBERS.md",
          status: "modified",
          content: "## All recorded slots\n\n- `112-cindermaw.md`\n",
        },
      ],
    });

    expect(result.errors.some((e) => /mourning-reach-web/.test(e))).toBe(true);
    expect(result.errors.some((e) => /continuity-ledger/.test(e))).toBe(true);
  });

  it("passes when Mourning Reach coupling files are included", () => {
    const mourningReachContent = MINIMAL_WORKING.replace(
      "- Shares ash-cycle prey with coastal Guild survey routes.",
      "- Operates along the Mourning Reach ash shelf."
    );
    const result = validatePullRequest({
      changedFiles: [
        {
          path: "bestiary/112-cindermaw.md",
          status: "added",
          content: mourningReachContent,
        },
        {
          path: "bestiary/NUMBERS.md",
          status: "modified",
          content: "## All recorded slots\n\n- `112-cindermaw.md`\n",
        },
        {
          path: "ecology/mourning-reach-web.md",
          status: "modified",
          content: "updated",
        },
        {
          path: "canon/continuity-ledger.md",
          status: "modified",
          content: "updated",
        },
      ],
    });

    expect(result.errors).toHaveLength(0);
  });

  it("reports non-bestiary scope when no dossiers changed", () => {
    const result = validatePullRequest({
      changedFiles: [{ path: "README.md", status: "modified", content: "# Hi" }],
    });
    expect(result.scope).toBe("non-bestiary");
    expect(result.errors).toHaveLength(0);
  });
});
