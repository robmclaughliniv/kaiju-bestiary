# Bestiary DynamoDB sync — maintainer setup

One-time (and occasional refresh) steps so merged `bestiary/*.md` dossiers sync to
DynamoDB and the live Dex loads them from `/api/bestiary`.

If the site shows an empty Dex or “archive offline” after the runtime API cutover,
work through this runbook before debugging application code.

## Prerequisites

On your machine:

- Tools: `terraform`, `aws`, `gh`, `git`, Node 20
- Auth: `aws sts get-caller-identity` succeeds; `gh auth status` succeeds
- Repo includes: [`terraform/dynamodb-sync.tf`](../terraform/dynamodb-sync.tf),
  [`scripts/sync-bestiary.mjs`](../scripts/sync-bestiary.mjs), updated
  [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml), and the
  [`api/`](../api/) bestiary routes

## Step A — Apply Terraform (DynamoDB sync IAM)

Grants the GitHub Actions deploy role permission to upsert/delete bestiary items
in the app DynamoDB table.

```bash
cd terraform
terraform init
terraform plan    # expect: new IAM policy + attachment for bestiary sync
terraform apply   # type yes when prompted
```

Or re-run the full bootstrap (also refreshes GitHub Actions variables):

```bash
./scripts/bootstrap.sh
# review plan → type yes
```

Confirm the table output is non-null:

```bash
cd terraform && terraform output dynamodb_table_name
```

## Step B — Set / refresh GitHub Actions variables

If you used `bootstrap.sh`, it sets `DYNAMODB_TABLE_NAME` automatically. If you
only ran `terraform apply`, set it yourself:

```bash
TABLE=$(cd terraform && terraform output -raw dynamodb_table_name)
gh variable set DYNAMODB_TABLE_NAME --body "$TABLE"
gh variable list
```

Confirm these variables exist:

| Variable | Purpose |
|----------|---------|
| `AWS_DEPLOY_ROLE_ARN` | OIDC deploy role |
| `AWS_REGION` | Usually `us-west-2` |
| `S3_BUCKET` | Static site sync target |
| `CLOUDFRONT_DISTRIBUTION_ID` | Cache invalidation |
| `LAMBDA_FUNCTION_NAME` | API Lambda code deploy |
| `DYNAMODB_TABLE_NAME` | Bestiary + Workshop table |

## Step C — Ship code to `main`

Push (or merge) the runtime-bestiary changes to `main`. That triggers:

1. **Deploy** ([`deploy.yml`](../.github/workflows/deploy.yml)) — tests → build →
   OIDC → `node scripts/sync-bestiary.mjs` → S3 sync → CloudFront invalidate
2. **Deploy API** ([`deploy-api.yml`](../.github/workflows/deploy-api.yml)) — when
   `api/**` changed, updates Lambda so `GET /api/bestiary` exists in production

If the API workflow did not run (no `api/**` changes in the push), trigger it
manually: Actions → **Deploy API** → **Run workflow**.

## Step D — Verify

1. **GitHub Actions:** Deploy workflow green; sync step logs `Upserted bestiary:…`
2. **API:**
   ```bash
   curl -s https://kaiju-bestiary.robmclaughl.in/api/bestiary | head
   curl -s https://kaiju-bestiary.robmclaughl.in/api/bestiary/001-gravorax | head
   ```
   Expect JSON with existing dossiers (Founding Four + botanical parallels).
3. **Site:** https://kaiju-bestiary.robmclaughl.in — Dex cards render (not stuck
   on “Loading…” or “archive offline”).
4. **Entry page:** `#/entry/001-gravorax` loads full dossier panels.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Sync step `AccessDenied` | IAM policy not applied | Step A — apply `dynamodb-sync.tf` |
| Sync step “DYNAMODB_TABLE_NAME is required” | Missing repo variable | Step B |
| `/api/bestiary` returns 404 | Old Lambda code | Run Deploy API workflow |
| API returns `{ "items": [] }` | Sync never ran or failed | Re-run Deploy; check sync logs |
| API OK but Dex empty | CloudFront cache | Wait for invalidation or re-run Deploy |
| Workshop broken | Separate issue | Check `/api/creations`; do not disable Workshop routes |

## GitHub repo settings (for external agent PRs)

Separate from AWS — required so fork PRs from agents work:

- Repo **public** (or contributor is a collaborator)
- **Settings → Actions → General → Fork pull request workflows** — enabled
- Expect to **Approve** first-time outside contributor workflow runs once

## After setup

Each merge to `main` re-runs sync automatically. New dossiers from merged PRs
appear on the live Dex without further manual steps.
