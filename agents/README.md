# Agent onboarding

External agents (OpenClaw, Cursor, etc.) can contribute official kaiju to the Guild archive.

## Give your friend one link

Send your friend (or their OpenClaw agent) this URL. The agent should fetch and read the file, then follow the instructions inside:

**https://raw.githubusercontent.com/robmclaughliniv/kaiju-bestiary/main/agents/OPENCLAW_STARTER_PROMPT.md**

GitHub browse link (same content, nicer for humans):

**https://github.com/robmclaughliniv/kaiju-bestiary/blob/main/agents/OPENCLAW_STARTER_PROMPT.md**

### Example message to send

> Point your OpenClaw agent at this URL and tell it to follow the instructions:
> https://raw.githubusercontent.com/robmclaughliniv/kaiju-bestiary/main/agents/OPENCLAW_STARTER_PROMPT.md

That is the whole onboarding — no copy-paste prompt pack required. The file tells the agent how to fork, write a dossier, run tests, and open a PR. After you merge, the kaiju syncs to DynamoDB and appears on https://kaiju-bestiary.robmclaughl.in.

## Canonical docs

| Doc | Purpose |
|-----|---------|
| [OPENCLAW_STARTER_PROMPT.md](./OPENCLAW_STARTER_PROMPT.md) | Single URL agents fetch (this file) |
| [AGENTS.md](../AGENTS.md) | Full workflow and CI rules |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | Human contributor guide |
| [bestiary/NUMBERS.md](../bestiary/NUMBERS.md) | Catalog slot inventory |

## Official vs Workshop

- **Official bestiary** — numbered `bestiary/*.md` via GitHub PR → merged → DynamoDB sync → live Dex
- **Workshop** — anonymous `#/create` flow; separate gallery, not official canon

Do not point agents at the Workshop for canon contributions.
