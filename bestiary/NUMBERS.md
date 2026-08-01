# Catalog number inventory

The archive has **200 numbered slots** (001–200). This file tracks which
numbers are taken, reserved, or colliding. Update it when you add or reassign
an entry.

The live site also shows empty slots: enable **"show unrecorded slots"** on the
dex grid at https://kaiju-bestiary.robmclaughl.in

## Reserved — Founding Four (Established)

Do **not** assign new creatures to these numbers. C-006 in
[canon/continuity-ledger.md](../canon/continuity-ledger.md).

| No. | Established entry | File |
|---:|---|---|
| 001 | Gravorax | `001-gravorax.md` |
| 045 | Vespera | `045-vespera.md` |
| 086 | Thalassion | `086-thalassion.md` |
| 087 | Okisendra | `087-okisendra.md` |

## Known parallel-record collisions (C-007)

These Working botanical dossiers reuse Founding Four numbers pending reassignment.
**Do not add more files at 045, 086, or 087.**

| No. | Working entry | File | Collides with |
|---:|---|---|---|
| 045 | Bloomwraith | `045-bloomwraith.md` | Vespera (045) |
| 086 | Venomvine | `086-venomvine.md` | Thalassion (086) |
| 087 | Orchidia | `087-orchidia.md` | Okisendra (087) |

## All recorded slots

| No. | Name | Status | File |
|---:|---|---|---|
| 001 | Gravorax | Established | `001-gravorax.md` |
| 002 | Glassmother | Working canon | `002-glassmother.md` |
| 045 | Vespera | Established | `045-vespera.md` |
| 045 | Bloomwraith | Working canon | `045-bloomwraith.md` |
| 086 | Thalassion | Established | `086-thalassion.md` |
| 086 | Venomvine | Working canon | `086-venomvine.md` |
| 087 | Okisendra | Established | `087-okisendra.md` |
| 087 | Orchidia | Working canon | `087-orchidia.md` |

## Suggested free ranges for new Working entries

Any number **not listed above** is available. Good starting blocks:

- **002–044** — early catalog, away from Vespera/Bloomwraith collision at 045
- **046–085** — mid catalog, away from Thalassion/Venomvine at 086
- **088–200** — late catalog, away from Okisendra/Orchidia at 087

When in doubt, pick the lowest unused number in one of these ranges and confirm
on the site with unrecorded slots visible.

## Adding a new entry

1. Pick an unused number from the ranges above.
2. Create `bestiary/NNN-slug.md` from [entry-template.md](entry-template.md).
3. Add a row to **All recorded slots** in this file in your PR.
