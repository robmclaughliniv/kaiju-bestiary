#!/usr/bin/env node
/**
 * Deterministic Kaiju PR review — validates changed bestiary dossiers and
 * emits a markdown report for the Kaiju Review GitHub Action.
 *
 * Usage:
 *   node scripts/review-pr.mjs --manifest pr-manifest.json
 *   node scripts/review-pr.mjs --local [--base main]
 *   node scripts/review-pr.mjs --pr 42 [--repo owner/repo]
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { validatePullRequest, formatReviewMarkdown } from "../src/bestiaryRules.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function parseArgs(argv) {
  const args = {
    manifest: null,
    local: false,
    base: "main",
    pr: null,
    repo: process.env.GITHUB_REPOSITORY || null,
    reportMd: null,
    reportJson: null,
  };

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--manifest") args.manifest = argv[++i];
    else if (arg === "--local") args.local = true;
    else if (arg === "--base") args.base = argv[++i];
    else if (arg === "--pr") args.pr = argv[++i];
    else if (arg === "--repo") args.repo = argv[++i];
    else if (arg === "--report-md") args.reportMd = argv[++i];
    else if (arg === "--report-json") args.reportJson = argv[++i];
    else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      console.error(`Unknown argument: ${arg}`);
      printHelp();
      process.exit(2);
    }
  }

  return args;
}

function printHelp() {
  console.log(`Usage:
  node scripts/review-pr.mjs --manifest pr-manifest.json [--report-md out.md] [--report-json out.json]
  node scripts/review-pr.mjs --local [--base main] [--report-md out.md] [--report-json out.json]
  node scripts/review-pr.mjs --pr 42 [--repo owner/repo] [--report-md out.md] [--report-json out.json]
`);
}

function git(args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}

function loadLocalManifest(base) {
  let mergeBase;
  try {
    mergeBase = git(["merge-base", "HEAD", base]);
  } catch {
    mergeBase = base;
  }

  const diffOut = git(["diff", "--name-status", mergeBase, "HEAD"]);
  const changedFiles = [];

  for (const line of diffOut.split("\n").filter(Boolean)) {
    const [statusCode, ...rest] = line.split("\t");
    let status = "modified";
    let path = rest[0];

    if (statusCode.startsWith("R")) {
      status = "modified";
      path = rest[1] || rest[0];
    } else if (statusCode === "A") status = "added";
    else if (statusCode === "D") status = "removed";
    else if (statusCode === "M") status = "modified";

    const entry = { path, status, content: null };
    if (status !== "removed") {
      const abs = join(root, path);
      if (existsSync(abs)) {
        entry.content = readFileSync(abs, "utf8");
      }
    }
    changedFiles.push(entry);
  }

  return { changedFiles };
}

async function fetchPrManifest(prNumber, repo) {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN or GH_TOKEN is required for --pr mode");
  }

  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const prRes = await fetch(`https://api.github.com/repos/${repo}/pulls/${prNumber}`, {
    headers,
  });
  if (!prRes.ok) {
    throw new Error(`Failed to fetch PR #${prNumber}: ${prRes.status} ${await prRes.text()}`);
  }
  const pr = await prRes.json();
  const headSha = pr.head.sha;

  const files = [];
  let page = 1;
  while (true) {
    const filesRes = await fetch(
      `https://api.github.com/repos/${repo}/pulls/${prNumber}/files?per_page=100&page=${page}`,
      { headers }
    );
    if (!filesRes.ok) {
      throw new Error(`Failed to fetch PR files: ${filesRes.status}`);
    }
    const batch = await filesRes.json();
    files.push(...batch);
    if (batch.length < 100) break;
    page++;
  }

  const changedFiles = [];
  for (const file of files) {
    const entry = {
      path: file.filename,
      status: file.status,
      content: null,
      previousContent: null,
    };

    if (file.status === "removed") {
      changedFiles.push(entry);
      continue;
    }

    const contentRes = await fetch(
      `https://api.github.com/repos/${repo}/contents/${encodeURIComponent(file.filename)}?ref=${headSha}`,
      { headers: { ...headers, Accept: "application/vnd.github.raw" } }
    );

    if (contentRes.ok) {
      entry.content = await contentRes.text();
    } else if (file.patch) {
      entry.content = reconstructFromPatch(file.patch);
    }

    changedFiles.push(entry);
  }

  return { changedFiles };
}

function reconstructFromPatch(patch) {
  const lines = patch.split("\n");
  const body = [];
  for (const line of lines) {
    if (line.startsWith("+++") || line.startsWith("---") || line.startsWith("@@")) continue;
    if (line.startsWith("+")) body.push(line.slice(1));
  }
  return body.join("\n");
}

function writeReports(result, args) {
  const payload = {
    scope: result.scope,
    ok: result.errors.length === 0,
    errorCount: result.errors.length,
    warningCount: result.warnings.length,
    errors: result.errors,
    warnings: result.warnings,
    dossierFindings: result.dossierFindings,
    markdown: result.markdown,
  };

  if (args.reportJson) {
    writeFileSync(args.reportJson, JSON.stringify(payload, null, 2));
  }

  if (args.reportMd) {
    writeFileSync(args.reportMd, result.markdown);
  }

  console.log(result.markdown || "(no report body)");
  console.log("");
  console.log(
    `Kaiju Review: ${payload.ok ? "PASS" : "FAIL"} (${payload.errorCount} error(s), ${payload.warningCount} warning(s))`
  );

  return payload;
}

async function main() {
  const args = parseArgs(process.argv);
  let manifest;

  if (args.manifest) {
    manifest = JSON.parse(readFileSync(args.manifest, "utf8"));
  } else if (args.local) {
    manifest = loadLocalManifest(args.base);
  } else if (args.pr) {
    if (!args.repo) {
      console.error("--repo or GITHUB_REPOSITORY is required with --pr");
      process.exit(2);
    }
    manifest = await fetchPrManifest(args.pr, args.repo);
  } else {
    printHelp();
    process.exit(2);
  }

  const result = validatePullRequest({
    changedFiles: manifest.changedFiles || [],
    numbersMdContent: manifest.numbersMdContent ?? null,
  });

  if (result.scope === "non-bestiary") {
    result.markdown = formatReviewMarkdown({
      scope: "non-bestiary",
      errors: [],
      warnings: [],
    });
  }

  const payload = writeReports(result, args);
  process.exit(payload.ok ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
