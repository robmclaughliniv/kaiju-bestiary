# Kaiju Review bot

Autonomous, deterministic PR review for bestiary contributions. When a pull
request adds or changes dossiers in `bestiary/`, the **Kaiju Review** GitHub
Action validates required kaiju attributes and posts an **Approve** or **Request
changes** review.

No LLM is involved — the same rules as [`src/bestiaryRules.js`](../src/bestiaryRules.js)
power both this bot and parts of the test suite.

## When it runs

- **Workflow:** [`.github/workflows/kaiju-review.yml`](../.github/workflows/kaiju-review.yml)
- **Triggers:** PR opened, updated (new commits pushed), reopened, marked ready
  for review
- **Check name:** `Kaiju Review` (GitHub Actions job `review`)

The existing **Tests** workflow still runs `npm test` + `npm run build` on every
PR. Both checks must pass before merge when branch protection is configured.

## What the bot checks (errors — PR fails)

For each **new or modified** `bestiary/NNN-*.md` file in the PR:

| Check | Detail |
|---|---|
| H1 + filename | `# Bestiary No.NNN — Name` matches `NNN-` filename prefix |
| Body + excerpt | Raw markdown > 400 chars; prose paragraph under an `##` section |
| Working canon (new files) | `**Canon status:** Working canon` |
| Working metadata | `Operational class`, `Primary ecology`, `Known range` |
| Required sections | Names, Identification, Biology, Behavior, Ecological role, Human relationship, Threat assessment, Field guidance, Canon connections |
| Threat assessment | Six-axis GFM table (Scale, Lethality, Reach, Persistence, Intelligence, Cascade; ratings 0–5) |
| Canon connections | ≥2 bullet items |
| NUMBERS.md | New dossiers listed under **All recorded slots** in the PR's `bestiary/NUMBERS.md` |
| Founding Four | No new files at 001 / 045 / 086 / 087 unless allowlisted |
| Template leftovers | No `TBD`, `No.XXX`, template H1 `Guild Name`, or `lorem ipsum` |
| Mourning Reach | If the dossier mentions Mourning Reach, the PR must also change `ecology/mourning-reach-web.md` and `canon/continuity-ledger.md` |

## Warnings (do not fail the PR)

- More than one new dossier in a single PR (prefer one creature per PR)
- Missing optional `## Scale` or `## Recorded abilities`
- Dossier references an art path under `art/images/` but the image may not be in the PR

## Non-bestiary PRs

If the PR does not touch any `bestiary/NNN-*.md` files, the bot approves with a
short note and skips the dossier checklist. Code-only changes still require the
**Tests** workflow to pass.

## Agent fix loop (required)

After opening a PR, **do not ask for human merge** while Kaiju Review shows
**Request changes**. OpenClaw and other agents must also watch **Tests** failures
and human PR comments — not only this bot — until the PR is green. Full ownership
loop: [OPENCLAW_STARTER_PROMPT.md](./OPENCLAW_STARTER_PROMPT.md#own-the-pr-until-green).

1. Read the bot's PR review — every line marked ❌ is a required fix.
2. Edit the dossier, `bestiary/NUMBERS.md`, and ecology/ledger files as needed.
3. Run `npm test` locally until green.
4. Optionally run `npm run review-pr` to preview the bot report before pushing.
5. Commit and push to the **same PR branch** (do not open a new PR).
6. Wait for **Kaiju Review** to re-run on the new commit.
7. Repeat until the bot **Approves** and **Tests** passes.

```bash
# Preview what the bot will check (local diff vs main)
npm run review-pr

# Or against a specific base branch
node scripts/review-pr.mjs --local --base main
```

## Maintainer setup

Branch protection on `main` should require these status checks:

- **Tests**
- **Kaiju Review**

Without branch protection, the bot still posts reviews and fails its job, but
GitHub may allow merge anyway.

For fork PRs, the workflow uses `pull_request_target` so the bot can post
reviews. It checks out the **base** branch only and reads PR file content via
the GitHub API — it does not execute code from the contributor's branch.

## Related docs

- [AGENTS.md](../AGENTS.md) — full agent workflow
- [OPENCLAW_STARTER_PROMPT.md](./OPENCLAW_STARTER_PROMPT.md) — fork → PR → fix loop
- [LOCAL_DEV.md](./LOCAL_DEV.md) — local preview and validation
- [systems/threat-system.md](../systems/threat-system.md) — six-axis threat table
