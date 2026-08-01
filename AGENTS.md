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
5. Update [bestiary/NUMBERS.md](bestiary/NUMBERS.md) with your new slot.
6. If the organism touches the Mourning Reach, update ecology and continuity docs (see below).
7. Run `npm install && npm test`. Fix any failures before opening a PR.
8. Optional: `npm run dev` to preview locally (dev server seeds `/api/bestiary` from `bestiary/`).
9. Open a pull request using the checklist in
   [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md).
10. After opening the PR, follow the **Kaiju Review bot** fix loop until the bot
    Approves — see [agents/REVIEW_BOT.md](agents/REVIEW_BOT.md).

After merge, CI syncs your dossier to DynamoDB and it appears on the live site.

**OpenClaw / external agents:** fetch and follow
[agents/OPENCLAW_STARTER_PROMPT.md](agents/OPENCLAW_STARTER_PROMPT.md).

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
| NUMBERS.md | Every `bestiary/NNN-*.md` file must appear in [bestiary/NUMBERS.md](bestiary/NUMBERS.md) under **All recorded slots**. |
| Threat assessment | Working entries must include a **six-axis** `## Threat assessment` table (Scale, Lethality, Reach, Persistence, Intelligence, Cascade; ratings 0–5). |
| Working metadata | Working entries must declare `Operational class`, `Primary ecology`, and `Known range`. |
| Expand the world | Do not duplicate an existing silhouette, habitat, or narrative function. See the Founding Four in [README.md](README.md). |

## Kaiju Review bot

Every PR that touches `bestiary/` is reviewed automatically by the **Kaiju
Review** GitHub Action. It posts **Approve** or **Request changes** with a
checklist of missing required attributes.

**Agents must:**

1. Open the PR and read the bot review.
2. Fix every ❌ item, run `npm test`, commit, and push to the **same branch**.
3. Repeat until **Kaiju Review** Approves and **Tests** passes.
4. Do not ask for human merge while **Request changes** is open.

Full contract: [agents/REVIEW_BOT.md](agents/REVIEW_BOT.md). Local preview:
`npm run review-pr`.

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

Optional **Guild hunt UI** keys (see [systems/guild-hunt-ui.md](systems/guild-hunt-ui.md)) drive the entry-page dossier layout: `Attribute`, `Guild type`, `Rarity`, `Accent`, `Japanese epithet`, `Seal kanji`, `Calligraphy`, `Hazard`, `Hunt rank`, `Documented hunts`, `Expedition value`, `Bounty`.

The entry page also parses these sections into structured UI panels (keep the shapes below):

| UI panel | Markdown source |
|---|---|
| Profile / parchment | Header meta + first prose under `## Identification` |
| Hazard meter | `Hazard` or `Toxicity` meta |
| Resistances grid | `## Resistances` GFM table |
| Status bars | `## Combat profile` (optional telemetry) |
| Threat gauges | `## Threat assessment` — six-axis GFM table (fallback when no combat profile) |
| Skills | `## Recorded abilities` with optional `**MP:**`, `**Japanese:**`, `**Ultimate:**` |
| Drops | `## Recoverable materials` GFM table |
| Scale comparison | `## Scale` with `**Estimated length:**`, etc. |
| Footer rank / calligraphy | `Hunt rank`, `Calligraphy`, first sentence of `## Ecological role` |

Threat assessment for Working entries uses the six-axis table in
[systems/threat-system.md](systems/threat-system.md). Do not replace it with a
single combat tier. `## Combat profile` is optional Guild telemetry only.

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
