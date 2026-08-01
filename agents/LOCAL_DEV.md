# Run the Kaiju Bestiary locally

Preview your in-progress kaiju in a browser — the same Dex and entry pages as
the live site, without AWS or production deploy. **No GitHub CLI required** for
preview alone (you only need `git` + Node to clone and run).

If an OpenClaw agent is writing dossiers for you, use this guide while the agent
works. Agents follow [OPENCLAW_STARTER_PROMPT.md](./OPENCLAW_STARTER_PROMPT.md).

## Prerequisites

| Requirement | Notes |
|-------------|--------|
| **Node.js 20+** | Check with `node -v` |
| **npm** | Bundled with Node (`npm -v`) |
| **git** | To clone the repository |
| **A web browser** | Chrome, Firefox, Safari, etc. |

You do **not** need an AWS account, Terraform, or `gh` just to preview locally.

## First-time setup

Replace `YOUR_GITHUB_USER` with your GitHub username (fork) or use the upstream
URL if you have direct access.

```bash
# Clone your fork (recommended) or upstream
git clone https://github.com/YOUR_GITHUB_USER/kaiju-bestiary.git
cd kaiju-bestiary

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The terminal prints a local URL, usually:

**http://localhost:5173/**

Open that in your browser. You should see the Dex with existing entries (Founding
Four and any other dossiers already in `bestiary/`).

## Preview your kaiju while writing

1. Copy [bestiary/entry-template.md](../bestiary/entry-template.md) to
   `bestiary/NNN-your-name.md` (three-digit number, lowercase slug).
2. Fill in the dossier and update [bestiary/NUMBERS.md](../bestiary/NUMBERS.md).
3. **Save the file**, then **refresh the browser** (the dev server re-reads
   `bestiary/*.md` automatically).
4. Find your creature on the Dex home page, or open it directly:

   ```
   http://localhost:5173/#/entry/112-cindermaw
   ```

   The slug is the filename without `.md` (e.g. `112-cindermaw`).

5. Use **show unrecorded slots** on the Dex to browse empty catalog numbers.
6. Open **Codex** (`#/codex`) for lore reference while you write.
7. Optional artwork: add `art/images/NNN-anything.png`. New image files may
   require restarting `npm run dev` once so Vite picks them up.

## Validate before opening a PR

```bash
npm test
```

Fix any failures before your agent (or you) pushes and opens a pull request.

Preview what the **Kaiju Review** bot will check on your branch:

```bash
npm run review-pr
```

## After opening a PR

The **Kaiju Review** GitHub Action reviews changed dossiers and posts Approve
or Request changes. If it requests changes, fix every ❌ item, run `npm test`,
commit, and push to the **same branch** — do not open a new PR. Repeat until
Kaiju Review Approves. See [REVIEW_BOT.md](./REVIEW_BOT.md).

## What local dev is and isn’t

| Local dev | Production |
|-----------|------------|
| Dex + entry pages + Codex + Workshop | Same UI at https://kaiju-bestiary.robmclaughl.in |
| `/api/bestiary` served from in-memory mock seeded from `bestiary/` | `/api/bestiary` backed by DynamoDB |
| Your changes visible after save + browser refresh | Changes live after maintainer merges PR to `main` |
| No deploy needed | GitHub Actions syncs markdown → DynamoDB → site |

Workshop **Create** (`#/create`) also works locally and saves to the same
in-memory store (separate from official numbered bestiary).

## Troubleshooting

**Dex says “Loading…” forever or “archive offline”**

- Confirm `npm run dev` is still running in the terminal.
- Use the URL printed in the terminal (port may differ from 5173).
- Hard refresh the page (Cmd+Shift+R / Ctrl+Shift+R).

**New dossier doesn’t appear after editing**

- Save the markdown file, then refresh the browser (each page load re-reads `bestiary/`).
- Check the filename: must be `NNN-name.md` (three digits, hyphen, slug).
- Check the H1 matches: `# Bestiary No.NNN — Name`
- Run `npm test` — parse errors often explain what’s wrong.

**Removed a dossier file but it still appears in the Dex**

- Restart `npm run dev` once — the in-memory store keeps removed entries until restart.

**Port already in use**

- Vite picks the next free port; read the terminal output for the actual URL.

**`npm test` fails**

- Read the error message. Common issues: missing `## Canon connections` (Working
  entries need ≥2 bullets), H1/filename number mismatch, body under 400 characters.

## Stop the dev server

In the terminal where `npm run dev` is running, press **Ctrl+C**.

## Next steps

- Contribution rules: [CONTRIBUTING.md](../CONTRIBUTING.md)
- Agent / PR workflow: [OPENCLAW_STARTER_PROMPT.md](./OPENCLAW_STARTER_PROMPT.md)
- Kaiju Review bot: [REVIEW_BOT.md](./REVIEW_BOT.md)
- Catalog numbers: [bestiary/NUMBERS.md](../bestiary/NUMBERS.md)
