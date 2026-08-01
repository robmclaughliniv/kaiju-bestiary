# Kaiju Bestiary — agent contributor instructions

You are a creative contributor to **The Kaiju Bestiary**, a Pokédex-style field archive of colossal organisms, impossible ecologies, and the Guild researchers who study them.

**Your job:** invent distinct kaiju dossiers and submit them as GitHub pull requests. After the maintainer reviews and merges your PR, your creature appears on the live site.

## Repository

- **GitHub:** https://github.com/robmclaughliniv/kaiju-bestiary
- **Live site:** https://kaiju-bestiary.robmclaughl.in
- **Full agent guide:** https://github.com/robmclaughliniv/kaiju-bestiary/blob/main/AGENTS.md

## How canon enters the archive

1. **Official numbered bestiary** — markdown files in `bestiary/` submitted via pull request. This is what you are doing.
2. **Community Workshop** — anonymous in-app create flow at `#/create`. Do **not** use this for official contributions. Your work belongs in git PRs.

After merge to `main`, dossiers sync to DynamoDB and the live Dex reads them at runtime. You do not need to change app code.

## Your workflow (follow in order)

1. Fork and clone the repository (or work on a branch if you have write access).
2. Read these files before writing anything:
   - `AGENTS.md` — hard CI rules and workflow
   - `bestiary/NUMBERS.md` — pick an **unused** catalog number (1–200)
   - `bestiary/entry-template.md` — copy this for your new file
   - `canon/canon-rules.md`, `systems/classification.md`, `systems/threat-system.md`
   - `README.md` Founding Four section — do not clone these silhouettes or roles
3. Pick an empty slot from `NUMBERS.md`. **Do not use 001, 045, 086, or 087** for new creatures (Founding Four reserved). Do not add more parallels at those numbers.
4. Create `bestiary/NNN-kebab-name.md` (three-digit prefix, lowercase slug).
5. Set the H1 to match the filename number: `# Bestiary No.112 — Cindermaw`
6. Fill the Working field dossier:
   - `**Canon status:** Working canon`
   - Metadata keys: `Operational class`, `Primary ecology`, `Known range`, etc.
   - `## Identification` with a real prose paragraph (required for the dex card excerpt)
   - `## Threat assessment` — six-axis GFM table (0–5 ratings); see `systems/threat-system.md`
   - `## Canon connections` — **at least two** bullet items linking to existing lore
   - Other sections as appropriate (Scale, Recorded abilities, Field guidance)
7. Update `bestiary/NUMBERS.md` with your new entry.
8. If the creature touches Mourning Reach, update `ecology/mourning-reach-web.md` and `canon/continuity-ledger.md`.
9. Run `npm install && npm test`. Fix all failures before opening a PR.
10. Optional: `npm run dev` and browse `#/` to preview locally.
11. Open **one pull request per creature** using the checklist in `.github/PULL_REQUEST_TEMPLATE.md`.

## Hard constraints (CI enforced — PR will fail if violated)

| Rule | Detail |
|------|--------|
| Unused number | Prefer an empty slot. Never 001, 045, 086, 087 for new entries. |
| No new parallels | Do not add more files at Founding Four numbers. |
| H1 + filename | `# Bestiary No.NNN — Name` must match `NNN-` filename prefix. |
| Canon status | New entries: `**Canon status:** Working canon` |
| Body length | Raw markdown must exceed 400 characters. |
| Excerpt | At least one prose paragraph under an `##` section. |
| Canon connections | Working entries: ≥2 bullet items under `## Canon connections`. |
| Expand the world | Distinct silhouette, habitat, and narrative function — not a clone of existing entries. |

## Etiquette

- One creature per PR. Do not batch unrelated dossiers.
- Do not open draft spam or empty PRs.
- If unsure about a niche or number, open a **Propose a kaiju** issue first (`.github/ISSUE_TEMPLATE/propose-kaiju.md`).
- Read existing dossiers in `bestiary/` so you do not duplicate silhouettes or habitats.
- Optional artwork: `art/images/NNN-anything.png` (see `art/images/README.md`).

## Definition of done

Before requesting review:

- [ ] Unused catalog number chosen and recorded in `NUMBERS.md`
- [ ] File created from `entry-template.md`
- [ ] `**Canon status:** Working canon`
- [ ] Six-axis threat table filled in
- [ ] `## Canon connections` with ≥2 links to existing canon
- [ ] `npm test` passes
- [ ] PR checklist completed

## What happens after merge

The maintainer reviews your PR. On merge, CI syncs your markdown to DynamoDB and the live Dex at https://kaiju-bestiary.robmclaughl.in shows your kaiju. No further action needed from you.

---

**Begin now:** read `AGENTS.md` and `bestiary/NUMBERS.md` in the repo, then propose your first creature's niche in one sentence before writing the dossier.
