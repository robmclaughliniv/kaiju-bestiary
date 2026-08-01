# The Kaiju Bestiary

A living field archive of colossal organisms, impossible ecologies, lost expeditions, and the people who study, survive, worship, and misunderstand them.

**Browse the archive:** https://kaiju-bestiary.robmclaughl.in — a Pokédex-style
web app. Official numbered dossiers enter through GitHub pull requests, sync to
DynamoDB on merge, and load at runtime via `/api/bestiary`. See
[CONTRIBUTING.md](CONTRIBUTING.md).
**For AI agents:** point OpenClaw at
[agents/OPENCLAW_STARTER_PROMPT.md](agents/OPENCLAW_STARTER_PROMPT.md) (one URL to fetch).
Full rules: [AGENTS.md](AGENTS.md).

**Community Workshop:** the site also has an in-app **Create** flow (`#/create`)
that saves anonymous dossiers to a lightweight DynamoDB store via a same-origin
`/api` Lambda. Workshop entries are separate from the numbered Guild archive;
official canon still enters through GitHub pull requests.

This repository is the canonical source of truth for **The Kaiju Bestiary** universe. It supports illustrated Guild dossiers, maps, expedition journals, fiction, RPG systems, a future website, and a premium art book.

## The premise

Kaiju are not a single species and are not merely giant monsters. The Guild uses the term for macro-organisms and natural phenomena whose scale, biology, or influence exceeds conventional ecological categories. Some are animals. Some are colonies, forests, geological systems, living weather, or phenomena that may not be alive in any ordinary sense.

The archive is assembled by imperfect observers across centuries. Records may be revised, contradicted, censored, or proven wrong.

## Core principles

- Every kaiju belongs to an ecology, history, and place.
- Threat ratings measure long-term ecological and civilizational impact, not combat power alone.
- Mystery is preserved where certainty would make the world smaller.
- Contradictions are tracked rather than silently erased.
- Visual design, lore, systems, geography, and chronology must reinforce one another.
- Guild researchers have distinct voices, biases, loyalties, and fears.

## The Founding Four

These entries define the initial creative range of the universe:

- **Bestiary No.001, Gravorax:** a tectonic compression organism known as the Earth That Walks.
- **Bestiary No.045, Vespera:** a migratory Echo-Type whose song induces shared memories and impossible architecture.
- **Bestiary No.086, Thalassion:** an abyssal colonial colossus whose dorsal structures resemble a drowned cathedral-city.
- **Bestiary No.087, Okisendra:** a corrosive botanical macro-organism capable of replacing entire ecosystems.

## Repository map

- `canon/` immutable truths, terminology, continuity ledger, and timeline
- `world/` regions, seas, settlements, cultures, and geography
- `guild/` the Natural Phenomena Preservation Society and its records
- `bestiary/` numbered kaiju dossiers (Established spreads and Working field dossiers)
- `ecology/` food webs, migrations, and interspecies relationships
- `systems/` classification, threat ratings, and game-facing frameworks
- `art/` visual language, finished-art notes, and generation briefs
- `production/` roadmap and publishing workflow
- `working/` unresolved ideas and experiments
- `src/`, `index.html` the archive website (Vite + React; see CONTRIBUTING.md)
- `terraform/`, `scripts/`, `.github/` hosting and CI (S3 + CloudFront on robmclaughl.in)
- `api/` optional Lambda handlers for the community Workshop (`/api/creations`)

Contributor operations (formats, numbering constraints, pitfalls): `production/archive-workflow.md`.

## Workshop API (runtime create)

Git-backed markdown in `bestiary/` is the contribution source of truth. On merge
to `main`, CI runs `scripts/sync-bestiary.mjs` to upsert dossiers into DynamoDB;
the live Dex fetches them at `/api/bestiary` so the frontend bundle stays light.

The **Workshop** is a separate gallery for anonymous in-app creations.

**Local dev:** `npm run dev` serves `/api/*` via an in-memory mock (no AWS needed).
Human setup and browser preview: [agents/LOCAL_DEV.md](agents/LOCAL_DEV.md).

**Production bootstrap** (one-time, after enabling the API in Terraform):

1. Tag and push `static-site-v1.0.2` in the shared `robmclaughl.in` module repo
   (adds DynamoDB `Scan`/`DeleteItem` to the Lambda role).
2. Run `scripts/bootstrap.sh` and confirm the plan (creates Lambda, HTTP API, DynamoDB).
3. Push to `main` — `deploy-api.yml` ships `api/` code to Lambda when `api/**` changes.

**Bestiary sync on merge** (required for the live Dex after the runtime API cutover):
see [production/bestiary-sync-setup.md](production/bestiary-sync-setup.md) for
Terraform IAM, `DYNAMODB_TABLE_NAME`, deploy verification, and troubleshooting.

Endpoints:

- `GET /api/bestiary` — list official numbered dossiers (summaries)
- `GET /api/bestiary/:slug` — fetch one official dossier (full markdown body)
- `GET /api/creations` — list workshop entries
- `POST /api/creations` — file a new dossier (anonymous, JSON body)
- `GET /api/creations/:id` — fetch one workshop entry

## Current phase

Phase One establishes the Guild Archive, its taxonomy, the Founding Four, and the chronology connecting their discoveries. Mourning Reach botanical dossiers remain Working canon and still need unused catalog numbers so they no longer collide with Founding Four indices. New entries should expand the universe's categories rather than repeat an existing silhouette, habitat, or narrative function.

## Canon status

The files under `bestiary/`, `guild/`, `systems/`, and `canon/` are authoritative unless explicitly marked **provisional**, **disputed**, or **apocryphal**. Artwork may contain illegible decorative text or visual inconsistencies. Written canon takes precedence until an artwork detail is deliberately promoted into canon.

## Contributing

Contributions welcome — add a kaiju, artwork, or world lore. Humans:
[CONTRIBUTING.md](CONTRIBUTING.md). Agents: fetch
[agents/OPENCLAW_STARTER_PROMPT.md](agents/OPENCLAW_STARTER_PROMPT.md). Catalog numbers:
[bestiary/NUMBERS.md](bestiary/NUMBERS.md).

## License

MIT — see [LICENSE](LICENSE).
