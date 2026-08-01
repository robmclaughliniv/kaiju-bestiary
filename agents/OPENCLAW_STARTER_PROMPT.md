# Kaiju Bestiary — agent contributor instructions

You are a creative contributor to **The Kaiju Bestiary**, a Pokédex-style field archive of colossal organisms, impossible ecologies, and the Guild researchers who study them.

**Your job:** invent distinct kaiju dossiers and submit them as GitHub pull requests. After the maintainer reviews and merges your PR, your creature appears on the live site.

## Before you start — machine and GitHub setup

You need a working environment on the machine where you run. If any step below fails, **stop and ask the human operator** to set it up. Do not invent credentials or tokens.

### Required tools

| Tool | Version / notes |
|------|-----------------|
| **git** | Clone, branch, commit, push |
| **Node.js** | 20 or newer (`node -v`) |
| **npm** | Bundled with Node (`npm -v`) |
| **GitHub CLI (`gh`)** | Recommended for fork + PR (`gh --version`) |

Optional but useful: `npm run dev` to preview the Dex locally (no AWS needed).

### GitHub authentication

You must be able to **push to a fork** and **open a pull request** against the upstream repo.

1. Use a GitHub account the human operator controls (their account or one they authorize).
2. Authenticate on this machine. Preferred:
   ```bash
   gh auth login
   ```
   Follow the prompts (GitHub.com → HTTPS → login via browser or token).
3. Verify:
   ```bash
   gh auth status
   git config user.name    # should be set
   git config user.email   # should be set
   ```
4. If `gh auth login` is unavailable, the human can provide a **Personal Access Token** with `repo` scope and configure git to use it. **Never commit tokens or paste them into dossiers.**

### Fork → PR sequence (concrete commands)

Replace `YOUR_GITHUB_USER` with the authenticated GitHub username.

```bash
# 1. Fork upstream (once) — or use GitHub UI: Fork button on the repo page
gh repo fork robmclaughliniv/kaiju-bestiary --clone=false

# 2. Clone YOUR fork (not upstream, unless you have direct write access)
git clone https://github.com/YOUR_GITHUB_USER/kaiju-bestiary.git
cd kaiju-bestiary

# 3. Keep upstream available for rebasing (optional but good practice)
git remote add upstream https://github.com/robmclaughliniv/kaiju-bestiary.git

# 4. Create a branch for your kaiju
git checkout -b bestiary/112-cindermaw

# 5. After editing dossiers — install deps and validate
npm install
npm test

# 6. Commit and push to YOUR fork
git add bestiary/ art/images/   # includes bestiary/NUMBERS.md; add ecology/ canon/ if touched
git commit -m "Add Bestiary No.112 — Cindermaw"
git push -u origin bestiary/112-cindermaw

# 7. Open PR against upstream main
gh pr create \
  --repo robmclaughliniv/kaiju-bestiary \
  --base main \
  --head YOUR_GITHUB_USER:bestiary/112-cindermaw \
  --title "Add Bestiary No.112 — Cindermaw" \
  --body-file .github/PULL_REQUEST_TEMPLATE.md
```

If `gh pr create` fails, open the PR manually on GitHub: compare `robmclaughliniv/kaiju-bestiary:main` ← `YOUR_GITHUB_USER:bestiary/112-cindermaw`.

### Local preview (optional)

**Human operators:** see [LOCAL_DEV.md](./LOCAL_DEV.md) for the full clone → browser
setup (no AWS or `gh` required).

```bash
npm run dev
# Open http://localhost:5173/#/ — save bestiary/*.md, then refresh browser to preview
```

## Repository

- **GitHub:** https://github.com/robmclaughliniv/kaiju-bestiary
- **Live site:** https://kaiju-bestiary.robmclaughl.in
- **Full agent guide:** https://github.com/robmclaughliniv/kaiju-bestiary/blob/main/AGENTS.md

## How canon enters the archive

1. **Official numbered bestiary** — markdown files in `bestiary/` submitted via pull request. This is what you are doing.
2. **Community Workshop** — anonymous in-app create flow at `#/create`. Do **not** use this for official contributions. Your work belongs in git PRs.

After merge to `main`, dossiers sync to DynamoDB and the live Dex reads them at runtime. You do not need to change app code.

## Your workflow (follow in order)

1. Complete **Before you start** above (tools, GitHub auth, fork).
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
9. **Generate hero artwork** when an image API is available (see **Generate hero artwork (image API)** below). Include the image in the PR.
10. Run `npm install && npm test`. Fix all failures before opening a PR.
11. Optional: `npm run dev` and browse `#/` to preview locally — confirm the dex card and entry page show your image (not the guild seal).
12. Push your branch and open **one pull request per creature** (see **Fork → PR sequence** above). Use the checklist in `.github/PULL_REQUEST_TEMPLATE.md`.
13. **Own the PR until green** (see **Own the PR until green** below). Keep watching reviews, comments, and CI until Kaiju Review **Approves**, **Tests** passes, and feedback is addressed. Do not abandon the PR after create.
14. Do not ask the human operator to merge while checks are failing, Kaiju Review shows **Request changes**, or reviewer comments are unanswered.

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

## Generate hero artwork (image API)

Generate a hero illustration for every creature **when the human operator has
image API access configured**. Art is optional for CI, but you should produce
it whenever credentials are available. If no API is configured, ask the operator
once; if they cannot provide access, skip art and note the omission in the PR
body.

Read [art/art-bible.md](../art/art-bible.md) and [art/images/README.md](../art/images/README.md)
before generating.

### 1. Credentials and preferred API

Use **whatever image API the operator has configured** — there is no required
vendor. Common setups (examples only):

| Provider | Typical env var |
|----------|-------------------|
| OpenAI Images | `OPENAI_API_KEY` |
| Replicate | `REPLICATE_API_TOKEN` |
| fal.ai | `FAL_KEY` |
| Stability AI | `STABILITY_API_KEY` |

The operator may also expose a CLI, MCP tool, or local wrapper. Use that if
present.

**Never commit API keys, `.env` files, or API responses that embed secrets.**

If no image API is available, continue with a dossier-only PR.

### 2. Variable checklist

After the dossier is written, collect these values from it:

| Variable | Source in dossier |
|----------|-------------------|
| `{{NNN}}` | Catalog number (three digits, e.g. `112`) |
| `{{Name}}` | Creature name from H1 |
| `{{Silhouette}}` | Body plan and unmistakable outline from `## Identification` |
| `{{Materials}}` | Surface textures, anatomy, chemistry from identification / scale |
| `{{Ecology}}` | `Primary ecology`, habitat, `Known range` |
| `{{Weather}}` | Light, atmosphere, season implied by habitat |
| `{{ScaleCue}}` | Human structures, terrain damage, tracks, or observers |
| `{{HazardVibe}}` | `Operational class`, `Hazard`, or threat tone |
| `{{JapaneseName}}` | `Japanese display name` if present (accent only — not fake text) |

If `{{JapaneseName}}` is absent, omit that line from the filled prompt.

### 3. Starter prompt template

Fill every `{{variable}}`, then pass the completed prompt to the image API:

```
Premium natural-history field illustration for a kaiju bestiary dex entry.

Organism: {{Name}} (Bestiary No.{{NNN}}) — {{Ecology}}.
Silhouette: {{Silhouette}} — unmistakable at a glance, ecologically functional, not decorative.
Materials and anatomy: {{Materials}}.
Environment: {{Ecology}} under {{Weather}}.
Scale: {{ScaleCue}} — the creature's colossal size must read clearly.
Threat tone: {{HazardVibe}}.
{{JapaneseName}}

Visual style: recovered Guild field archive — Japanese RPG bestiary presentation
meets museum expedition illustration. Cinematic environmental scale. Beauty and
horror coexist. Color communicates chemistry, habitat, or warning.

Image function: single square hero illustration for a dex card and entry header.
Roughly 1:1 composition. No UI chrome, borders, watermarks, or text overlays.

Exclude: generic dragon or Godzilla clone, default humanoid anatomy unless the
biology demands it, unreadable fake Japanese used as language, logos, signatures,
stock fantasy wallpaper look.
```

### 4. Call the API and save the file

1. Send the filled prompt to the operator's preferred image API.
2. Request roughly **square (~1:1) output** at a web-reasonable resolution.
3. Download the result and save it as:

   ```
   art/images/NNN-kebab-name-hero.png
   ```

   Example: `art/images/112-cindermaw-hero.png`

   Accepted formats: `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif` (see
   [art/images/README.md](../art/images/README.md)).

4. The site auto-wires images by catalog number prefix — no dossier path or app
   code changes are needed.

### 5. Include the image in the PR

```bash
git add art/images/NNN-kebab-name-hero.png
```

- Stage the image alongside the dossier and `bestiary/NUMBERS.md`.
- Check the art checkbox in `.github/PULL_REQUEST_TEMPLATE.md`.
- Run `npm run dev`, open the entry page, and confirm the image appears instead
  of the generated guild seal.

## Etiquette

- One creature per PR. Do not batch unrelated dossiers.
- Do not open draft spam or empty PRs.
- If unsure about a niche or number, open a **Propose a kaiju** issue first (`.github/ISSUE_TEMPLATE/propose-kaiju.md`).
- Read existing dossiers in `bestiary/` so you do not duplicate silhouettes or habitats.
- Generate hero artwork via image API when credentials are available (see **Generate hero artwork (image API)** above).
- After opening a PR, keep monitoring it — do not abandon reviews, comments, or CI failures for the operator to clean up.

## Definition of done

Before requesting merge:

- [ ] Unused catalog number chosen and recorded in `NUMBERS.md`
- [ ] File created from `entry-template.md`
- [ ] `**Canon status:** Working canon`
- [ ] Six-axis threat table filled in
- [ ] `## Canon connections` with ≥2 links to existing canon
- [ ] Hero artwork generated and committed at `art/images/NNN-kebab-name-hero.png` when image API access is available (otherwise noted as skipped in PR body)
- [ ] `npm test` passes
- [ ] PR checklist completed
- [ ] PR checks green (**Kaiju Review** Approves, **Tests** passes) and outstanding review comments addressed or answered

## Own the PR until green

After you open a pull request, **you own it** until it is merge-ready. Do not hand
off failures to the human operator. Do not ask for merge while checks or reviews
are red. Stay on the **same branch** — never open a duplicate PR for the same
creature.

### What to listen for

Check the PR periodically until merge-ready (or until the maintainer merges):

| Signal | What to do |
|--------|------------|
| **Kaiju Review** | Approve vs Request changes — fix every ❌ (see [REVIEW_BOT.md](./REVIEW_BOT.md)) |
| **Tests** / other Actions checks | Read failed job logs; fix locally; push again |
| **PR conversation comments** | Maintainer, reviewers, or bots — reply or fix as needed |
| **Inline review comments** | Address dossier/line feedback on the same branch |
| **New commits you push** | Re-check reviews and CI after every push |

### Commands to poll status

Replace `PR_NUMBER` with your pull request number (from `gh pr create` or `gh pr view`).

```bash
# Status overview
gh pr view --repo robmclaughliniv/kaiju-bestiary
gh pr checks --repo robmclaughliniv/kaiju-bestiary
gh pr view --repo robmclaughliniv/kaiju-bestiary --comments

# Reviews and discussion
gh api repos/robmclaughliniv/kaiju-bestiary/pulls/PR_NUMBER/reviews --jq '.[].body'
gh api repos/robmclaughliniv/kaiju-bestiary/pulls/PR_NUMBER/comments --jq '.[].body'

# Failed workflow logs
gh run list --repo robmclaughliniv/kaiju-bestiary --branch YOUR_BRANCH --limit 5
gh run view --repo robmclaughliniv/kaiju-bestiary --log-failed
```

### Fix loop

1. Read the failing check, bot review, or human comment.
2. Edit the dossier, `bestiary/NUMBERS.md`, ecology/ledger, or art as needed.
3. Run `npm test` locally until green. For dossier issues, also run `npm run review-pr`.
4. Commit and push to the **same PR branch**.
5. Re-poll with `gh pr checks` and comments until **Kaiju Review** Approves, **Tests**
   passes, and feedback is addressed.

Details for the dossier bot: [REVIEW_BOT.md](./REVIEW_BOT.md). Local preview: `npm run review-pr`.

## What happens after merge

The maintainer may do a final read of your PR. On merge, CI syncs your markdown
to DynamoDB and the live Dex at https://kaiju-bestiary.robmclaughl.in shows
your kaiju.

---

**Begin now:** read `AGENTS.md` and `bestiary/NUMBERS.md` in the repo, then propose your first creature's niche in one sentence before writing the dossier.
