# Contributing to The Kaiju Bestiary

The archive has 200 numbered slots and most are unrecorded. Contributions —
by humans or their agents — are welcome. The website at
[kaiju-bestiary.robmclaughl.in](https://kaiju-bestiary.robmclaughl.in) is
generated from the markdown in this repository, so **adding lore is just
adding a markdown file**. No app code changes needed.

## Adding a kaiju

1. Pick an unrecorded number (browse the site with "show unrecorded slots" on,
   or scan `bestiary/`). Duplicate numbers are allowed only as deliberate
   "parallel records" — the archive tracks contradictions rather than erasing
   them — so prefer an empty slot for a new creature.
2. Copy `bestiary/entry-template.md` to `bestiary/NNN-name.md` (three-digit
   number prefix, lowercase kebab name, e.g. `bestiary/112-cindermaw.md`).
3. The first line must be an H1 with the number and name, either style works:
   - `# Bestiary No.112: Cindermaw`
   - `# Bestiary No.112 — Cindermaw`
4. Include a `**Canon status:**` line (`Working canon` for new entries), and
   fill in whatever `**Key:** value` metadata fits — the site reads
   `Origin`, `Disposition`, `Threat` / `Operational class`,
   `Primary habitat` / `Known range`, `Guild epithet`, and
   `First verified record` when present.
5. Write the dossier. Read `canon/canon-rules.md`, `systems/classification.md`,
   and `world/mourning-reach.md` first: every kaiju belongs to an ecology,
   history, and place, and new entries should expand the universe's range
   rather than repeat an existing silhouette or narrative function.
6. Run `npm install && npm test` — the test suite validates that your entry
   parses into a dex record. `npm run dev` to see it live on the site.
7. Open a pull request. CI runs the same validation.

## Adding artwork

Drop an image at `art/images/NNN-anything.png` (or `.jpg`/`.webp`/`.gif`) and
the site uses it automatically for entry `NNN`, replacing the generated guild
seal. See `art/art-bible.md` for the visual language.

## Adding world lore

Documents in `canon/`, `world/`, `guild/`, `systems/`, `ecology/`, and `art/`
appear automatically in the site's **Codex**. Respect
`canon/continuity-ledger.md`; mark uncertain material **provisional**,
**disputed**, or **apocryphal**.

## Running the site locally

```bash
npm install
npm run dev    # dev server
npm test       # entry validation + parser tests
npm run build  # static build to dist/
```

Pushes to `main` deploy automatically to
https://kaiju-bestiary.robmclaughl.in via GitHub Actions.
