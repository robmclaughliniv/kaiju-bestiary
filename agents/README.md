# Agent onboarding

External agents (OpenClaw, Cursor, etc.) can contribute official kaiju to the Guild archive.

## Two links to send your friend

### For the OpenClaw agent

The agent should fetch and read this file, then follow the instructions inside:

**https://raw.githubusercontent.com/robmclaughliniv/kaiju-bestiary/main/agents/OPENCLAW_STARTER_PROMPT.md**

GitHub browse link (same content, nicer for humans):

**https://github.com/robmclaughliniv/kaiju-bestiary/blob/main/agents/OPENCLAW_STARTER_PROMPT.md**

### For the human operator (preview in browser)

While the agent writes dossiers, the human can run the site locally and browse
their kaiju in a browser — same workflow as the maintainer on a laptop:

**https://github.com/robmclaughliniv/kaiju-bestiary/blob/main/agents/LOCAL_DEV.md**

No AWS or `gh` required for preview; just Node 20+, git, and `npm run dev`.

### Example message to send

> **Agent:** read https://raw.githubusercontent.com/robmclaughliniv/kaiju-bestiary/main/agents/OPENCLAW_STARTER_PROMPT.md and follow the instructions.  
> **You:** follow https://github.com/robmclaughliniv/kaiju-bestiary/blob/main/agents/LOCAL_DEV.md to preview creatures in your browser while the agent works.

After you merge their PR, the kaiju syncs to DynamoDB and appears on https://kaiju-bestiary.robmclaughl.in.

## Canonical docs

| Doc | Purpose |
|-----|---------|
| [OPENCLAW_STARTER_PROMPT.md](./OPENCLAW_STARTER_PROMPT.md) | Single URL agents fetch; includes image-API hero art workflow |
| [LOCAL_DEV.md](./LOCAL_DEV.md) | Human: clone, run locally, preview in browser |
| [AGENTS.md](../AGENTS.md) | Full workflow and CI rules |
| [REVIEW_BOT.md](./REVIEW_BOT.md) | Autonomous PR review bot + agent fix loop |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | Human contributor guide |
| [bestiary/NUMBERS.md](../bestiary/NUMBERS.md) | Catalog slot inventory |
| [bestiary-sync-setup.md](../production/bestiary-sync-setup.md) | Maintainer: DynamoDB sync + prod verify |

## Official vs Workshop

- **Official bestiary** — numbered `bestiary/*.md` via GitHub PR → merged → DynamoDB sync → live Dex
- **Workshop** — anonymous `#/create` flow; separate gallery, not official canon

Do not point agents at the Workshop for canon contributions.

## Maintainer: one-time DynamoDB sync setup

After the runtime API cutover, the live Dex reads from `/api/bestiary`. You must
apply Terraform IAM, set `DYNAMODB_TABLE_NAME`, and deploy once so existing
dossiers sync to DynamoDB.

**Full runbook:** [production/bestiary-sync-setup.md](../production/bestiary-sync-setup.md)

Quick checklist:

1. `cd terraform && terraform apply` (or `./scripts/bootstrap.sh`)
2. Confirm `gh variable list` includes `DYNAMODB_TABLE_NAME`
3. Push to `main` — verify Deploy workflow sync step succeeds
4. `curl https://kaiju-bestiary.robmclaughl.in/api/bestiary` returns dossiers
