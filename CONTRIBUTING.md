# Contributing to The Kaiju Bestiary

The archive has 200 numbered slots and most are unrecorded. Contributions —
by humans or their agents — are welcome. The website at
[kaiju-bestiary.robmclaughl.in](https://kaiju-bestiary.robmclaughl.in) loads
official dossiers from DynamoDB at runtime (synced from git on merge). **Adding
official lore is adding a markdown file** in `bestiary/` and opening a pull
request. No app code changes needed.

**AI agents:** fetch
[agents/OPENCLAW_STARTER_PROMPT.md](agents/OPENCLAW_STARTER_PROMPT.md) and follow
the instructions (raw URL in [agents/README.md](agents/README.md)). Deeper reference:
[AGENTS.md](AGENTS.md).

## Adding a kaiju

1. Pick an unrecorded number using [bestiary/NUMBERS.md](bestiary/NUMBERS.md)
   and the site's "show unrecorded slots" toggle. Duplicate numbers are allowed
   only as deliberate "parallel records" — the archive tracks contradictions
   rather than erasing them — so **prefer an empty slot** for a new creature.
   Do not use Founding Four numbers (001, 045, 086, 087) for new entries.
2. Copy [bestiary/entry-template.md](bestiary/entry-template.md) to
   `bestiary/NNN-name.md` (three-digit number prefix, lowercase kebab name,
   e.g. `bestiary/112-cindermaw.md`).
3. The first line must be an H1 with the number and name, either style works:
   - `# Bestiary No.112: Cindermaw`
   - `# Bestiary No.112 — Cindermaw`
4. Include a `**Canon status:**` line (`Working canon` for new entries), and
   fill in whatever `**Key:** value` metadata fits — see the dex metadata
   cheat sheet below.
5. Write the dossier. Read `canon/canon-rules.md`, `systems/classification.md`,
   and `world/mourning-reach.md` first: every kaiju belongs to an ecology,
   history, and place, and new entries should expand the universe's range
   rather than repeat an existing silhouette or narrative function.
6. Include `## Canon connections` with at least two links to existing lore
   (required for Working entries; enforced by CI).
7. Update [bestiary/NUMBERS.md](bestiary/NUMBERS.md) with your new slot.
8. Run `npm install && npm test` — the test suite validates that your entry
   parses into a dex record. `npm run dev` to see it live on the site.
9. Open a pull request. Use the checklist in
   [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md). CI
   runs the same validation.

### Dex metadata cheat sheet

The site reads `**Key:** value` lines from the top of each dossier.

| UI field | Working dossier keys | Established spread keys |
|---|---|---|
| Card subtitle / threat tag | `Operational class` | `Guild epithet` |
| Origin badge (filter + seal color) | `Primary ecology` | `Origin` |
| Disposition | — | `Disposition` |
| Threat | `Operational class` | `Threat` |
| Range / search | `Known range` | `Primary habitat` |
| First record | — | `First verified record` |

Working entries use the six-axis threat table from
[systems/threat-system.md](systems/threat-system.md). Established spreads use
the threat index vocabulary from [systems/classification.md](systems/classification.md).

Optional **Guild hunt UI** fields (`Attribute`, `Rarity`, `Accent`, resistances,
combat profile, recoverable materials, etc.) are documented in
[systems/guild-hunt-ui.md](systems/guild-hunt-ui.md). Combat profile does not
replace the six-axis threat table.

### Excerpt tip

The dex card shows the first prose paragraph under an `##` section. Lists,
tables, and bold-only lines do not count. Put a real descriptive paragraph in
`## Identification` (or the first content section after metadata).

## Adding artwork

Drop an image at `art/images/NNN-anything.png` (or `.jpg`/`.webp`/`.gif`) and
the site uses it automatically for entry `NNN`, replacing the generated guild
seal. See [art/images/README.md](art/images/README.md) and
[art/art-bible.md](art/art-bible.md) for naming and visual language.

## Adding world lore

Documents in `canon/`, `world/`, `guild/`, `systems/`, `ecology/`, and `art/`
appear automatically in the site's **Codex**. Respect
[canon/continuity-ledger.md](canon/continuity-ledger.md); mark uncertain
material **provisional**, **disputed**, or **apocryphal**.

## Running the site locally

Clone the repo, install dependencies, and start the Vite dev server. The Dex and
entry pages load from an in-memory API seeded from `bestiary/` — no AWS needed.

**Full walkthrough:** [agents/LOCAL_DEV.md](agents/LOCAL_DEV.md) (preview in browser,
find your entry URL, troubleshooting).

```bash
npm install
npm run dev    # open http://localhost:5173/ — refresh after editing dossiers
npm test       # entry validation + parser tests
npm run build  # static build to dist/
```

Pushes to `main` deploy automatically to
https://kaiju-bestiary.robmclaughl.in via GitHub Actions.

## License

This project is licensed under the [MIT License](LICENSE).
