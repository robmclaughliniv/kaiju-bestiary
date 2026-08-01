# Agent guide — adding a kaiju to the bestiary

This repository is a Pokédex-style archive generated from markdown. **Adding a
monster is adding a markdown file** in `bestiary/`. No app code changes are
required.

Humans should also read [CONTRIBUTING.md](CONTRIBUTING.md). This file is the
fast path for AI agents and automated contributors.

## Workflow

1. Read [bestiary/NUMBERS.md](bestiary/NUMBERS.md) and pick an **unused** catalog
   number (1–200).
2. Copy [bestiary/entry-template.md](bestiary/entry-template.md) to
   `bestiary/NNN-kebab-name.md` (three-digit prefix, lowercase slug).
3. Set the H1 to match the filename number:
   - `# Bestiary No.112 — Cindermaw` (Working field dossier — use this for new entries)
4. Fill the dossier. Read before writing:
   - [canon/canon-rules.md](canon/canon-rules.md)
   - [systems/classification.md](systems/classification.md)
   - [systems/threat-system.md](systems/threat-system.md)
   - [world/mourning-reach.md](world/mourning-reach.md) (if the creature belongs there)
5. Run `npm install && npm test`. Fix any failures before opening a PR.
6. Optional: `npm run dev` to preview the site locally.
7. Open a pull request using the checklist in
   [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md).

## Hard constraints (CI enforced)

| Rule | Detail |
|---|---|
| Unused number | Prefer an empty slot. Do **not** add new creatures at 001, 045, 086, or 087. |
| No new parallels | Bloomwraith, Venomvine, and Orchidia already share those numbers (pending C-007 reassignment). Do not add more files at those numbers. |
| H1 + filename | `# Bestiary No.NNN — Name` must match the `NNN-` filename prefix. |
| Canon status | New entries: `**Canon status:** Working canon` |
| Body length | Raw markdown must exceed 400 characters. |
| Excerpt | At least one **prose paragraph** under an `##` section (not only lists or tables). Put real description in `## Identification` or similar. |
| Canon connections | Working entries must include `## Canon connections` with **at least two** bullet items linking to existing lore. |
| Expand the world | Do not duplicate an existing silhouette, habitat, or narrative function. See the Founding Four in [README.md](README.md). |

## Dex metadata (what the UI reads)

Use `**Key:** value` lines near the top of the dossier.

| UI field | Working dossier keys | Established spread keys |
|---|---|---|
| Subtitle / threat tag | `Operational class` | `Guild epithet` |
| Japanese name accent | `Japanese display name` | `Japanese display name` |
| Origin badge | `Primary ecology` | `Origin` (in Classification) |
| Disposition | — | `Disposition` |
| Threat | `Operational class` | `Threat` |
| Range / habitat | `Known range` | `Primary habitat` |
| First record | — | `First verified record` |

The entry page also parses these sections into structured UI panels (keep the shapes below):

| UI panel | Markdown source |
|---|---|
| Threat gauges | `## Threat assessment` — six-axis GFM table (0–5 ratings) |
| Abilities / guidance | `## Recorded abilities` with `###` subsections, or `## Field guidance` |
| Scale comparison | `## Scale` with `**Estimated length:**`, `**Estimated mass:**`, etc. |
| Identification excerpt | First prose paragraph under `## Identification` |

Threat assessment for Working entries uses the six-axis table in
[systems/threat-system.md](systems/threat-system.md). Do not replace it with a
single combat tier.

## Mourning Reach and ecology

If the organism touches the Mourning Reach, update at least two relationships in
[ecology/mourning-reach-web.md](ecology/mourning-reach-web.md). Record
cross-cutting decisions in [canon/continuity-ledger.md](canon/continuity-ledger.md).

## Optional artwork

Drop an image at `art/images/NNN-anything.png` (or `.jpg`/`.webp`/`.gif`). The
site auto-wires it for that catalog number. See
[art/images/README.md](art/images/README.md) and [art/art-bible.md](art/art-bible.md).

## Definition of done (PR checklist)

Before submitting:

- [ ] Unused catalog number chosen ([bestiary/NUMBERS.md](bestiary/NUMBERS.md))
- [ ] File created from [bestiary/entry-template.md](bestiary/entry-template.md)
- [ ] `**Canon status:** Working canon`
- [ ] Distinct silhouette and ecological role (not a clone of Founding Four or botanical entries)
- [ ] Six-axis threat table filled in
- [ ] `## Canon connections` with ≥2 links to existing canon
- [ ] Ecology / ledger updates if the creature touches Mourning Reach
- [ ] `npm test` passes
- [ ] `npm run build` passes (optional but recommended)

## Further reading

- Operations and pitfalls: [production/archive-workflow.md](production/archive-workflow.md)
- Creature definition of done: [production/roadmap.md](production/roadmap.md)
- Continuity decisions: [canon/continuity-ledger.md](canon/continuity-ledger.md)
