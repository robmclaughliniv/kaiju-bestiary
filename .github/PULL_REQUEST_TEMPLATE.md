## Summary

<!-- One or two sentences: what kaiju (or lore) does this PR add or change? -->

## New bestiary entry checklist

<!-- Delete sections that do not apply. For non-bestiary PRs, describe changes below. -->

The **Kaiju Review** bot enforces this checklist on every PR that touches
`bestiary/`. If it requests changes, push fixes to this same branch until it
Approves. See [agents/REVIEW_BOT.md](../agents/REVIEW_BOT.md).

- [ ] Catalog number is **unused** (see [bestiary/NUMBERS.md](../bestiary/NUMBERS.md))
- [ ] Not using Founding Four numbers 001 / 045 / 086 / 087 for a new creature
- [ ] File created from [bestiary/entry-template.md](../bestiary/entry-template.md)
- [ ] `**Canon status:** Working canon` for new entries
- [ ] H1 number matches filename prefix (`bestiary/NNN-slug.md`)
- [ ] Prose paragraph under an `##` section (dex card excerpt)
- [ ] `## Canon connections` with at least two links to existing canon
- [ ] Six-axis threat table filled in ([systems/threat-system.md](../systems/threat-system.md))
- [ ] `Operational class`, `Primary ecology`, and `Known range` set (Working entries; CI enforced)
- [ ] Distinct silhouette — does not duplicate Founding Four or botanical entries
- [ ] [bestiary/NUMBERS.md](../bestiary/NUMBERS.md) updated with the new slot
- [ ] Mourning Reach ecology updated if applicable ([ecology/mourning-reach-web.md](../ecology/mourning-reach-web.md))
- [ ] Continuity ledger updated if applicable ([canon/continuity-ledger.md](../canon/continuity-ledger.md))
- [ ] `npm test` passes locally
- [ ] `npm run build` passes locally (recommended)
- [ ] Art optional: `art/images/NNN-*.{png,jpg,webp,gif}` if included

## Test plan

<!-- How did you verify this? e.g. npm test, npm run dev, checked dex card -->
