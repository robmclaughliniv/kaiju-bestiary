# Archive Workflow

Operational guide for editing this repository. Verify behavior against source files; do not invent catalog numbers, dates, or abilities.

## Intent

This repo is the canonical source of truth for The Kaiju Bestiary. Contributors maintain in-world Guild records, worldbuilding, systems, art direction, and production planning. Written canon outranks decorative or generated artwork text (`README.md`, `canon/timeline.md`).

## Repository interfaces

| Path | Role |
|---|---|
| `canon/` | Governance: canon levels, continuity decisions, timeline |
| `guild/` | Institutional voice, mandate, archive practice |
| `systems/` | Classification labels and multi-axis threat ratings |
| `world/` | Places and regional framing |
| `ecology/` | Cross-organism relationships |
| `bestiary/` | Numbered dossiers |
| `art/` | Visual rules and spread requirements |
| `production/` | Roadmap and this workflow |

Unresolved experiments belong in a future `working/` directory when needed. Do not park conflicting canon there without a continuity note.

## Two dossier formats

The archive currently uses two verified dossier shapes. Match the format to the entry's role.

### Established archive spreads

Used by the Founding Four (`001-gravorax.md`, `045-vespera.md`, `086-thalassion.md`, `087-okisendra.md`).

Typical fields:

- title form `Bestiary No.XXX: Name`
- `Canon status: Established`
- Classification block with Origin, Disposition, Threat, first verified record, habitat
- Scale, morphology, ecology, recorded abilities, Guild advisory, cultural record, open questions

Threat lines in these spreads use the index vocabulary from `systems/classification.md` (for example Extreme, Catastrophic, Existential).

### Working field dossiers

Used by Mourning Reach botanical entries and by `bestiary/entry-template.md`.

Typical fields:

- title form `Bestiary No.XXX — Name`
- `Canon status: Working canon`
- Operational class from `systems/threat-system.md`
- Identification through field guidance, plus the six-axis threat table

New regional Working entries should start from `bestiary/entry-template.md` unless an Established spread is explicitly required.

## Add a new kaiju entry

1. Confirm the organism fills a missing ecological or narrative role (`ecology/`, `production/roadmap.md`).
2. Choose an unused catalog number. Do not reuse Established Founding Four numbers (001, 045, 086, 087). See C-006 and C-007 in `canon/continuity-ledger.md`.
3. Create `bestiary/NNN-slug.md` from the correct format above.
4. Fill threat data using both systems when applicable:
   - operational class + six axes → `systems/threat-system.md`
   - origin / disposition / threat index labels → `systems/classification.md`
5. Link at least two existing canon connections (region, organism, Guild branch, or timeline event).
6. If the organism touches the Mourning Reach, update at least two relationships in `ecology/mourning-reach-web.md`.
7. Record cross-cutting decisions or collisions in `canon/continuity-ledger.md`.
8. Add dated events only when justified; promote dates into `canon/timeline.md` before treating artwork dates as canon.

## Change existing canon

| Change type | Required steps |
|---|---|
| Refine Working canon | Edit the file; note new contradictions in the ledger if they affect other entries |
| Alter Locked / Established facts | Follow retcon protocol in `canon/canon-rules.md` and add a Retcons row in the ledger |
| Reassign a catalog number | Update dossier title/filename, ecology links, timeline references, README if needed, and ledger status |
| Promote Working → Established | Verify no open contradictions remain unrecorded; align format fields; update roadmap definition-of-done checks |

## Common pitfalls

- **Number collisions:** Bloomwraith, Venomvine, and Orchidia files still title themselves 045 / 086 / 087 while Established Founding Four dossiers hold those numbers. Treat the botanical numbers as pending reassignment (C-007), not as competing Established claims.
- **Sealed vs public No.001:** `guild/guild-foundation.md` associates the Quiet Commission with sealed No.001 material, while `bestiary/001-gravorax.md` is Established. Do not "fix" that tension in prose without a continuity decision.
- **Single power levels:** Do not replace the six-axis table with a combat tier. Threat is ecological and civilizational (`systems/threat-system.md`).
- **Orphan ecology:** A Mourning Reach entry that does not modify `ecology/mourning-reach-web.md` is incomplete.
- **Artwork text:** Illegible or generated dates/names are not automatically canon (`canon/timeline.md` dating rule).
- **Silhouette repetition:** Phase One asks new entries to expand categories, not clone an existing body plan or narrative function (`README.md`).

## Definition of done

Use the checklist in `production/roadmap.md`. At minimum, a finished creature needs distinct silhouette, biological logic or intentional mystery, ecological role, human consequences, threat assessment, field guidance, two canon connections, art brief, and recorded unresolved contradictions.
