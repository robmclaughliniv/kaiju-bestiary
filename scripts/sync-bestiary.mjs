#!/usr/bin/env node
/**
 * Sync git-backed bestiary markdown to DynamoDB.
 * Run in CI after tests on merge to main; requires DYNAMODB_TABLE_NAME.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseEntry } from "../src/parse.js";
import { buildBestiaryItem } from "../api/lib/bestiary-item.mjs";
import {
  upsertBestiaryItem,
  deleteBestiaryItem,
  listBestiarySlugs,
} from "../api/lib/bestiary.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const bestiaryDir = join(root, "bestiary");

async function main() {
  if (!process.env.DYNAMODB_TABLE_NAME) {
    console.error("DYNAMODB_TABLE_NAME is required for bestiary sync.");
    process.exit(1);
  }

  const files = readdirSync(bestiaryDir).filter((f) => /^\d{3}-.+\.md$/.test(f));
  const slugs = new Set();

  for (const file of files) {
    const sourceFile = `bestiary/${file}`;
    const raw = readFileSync(join(bestiaryDir, file), "utf8");
    const parsed = parseEntry(sourceFile, raw);
    if (parsed.number == null) {
      console.warn(`Skipping ${file}: no dex number in H1`);
      continue;
    }
    const item = buildBestiaryItem(sourceFile, raw, parsed);
    await upsertBestiaryItem(item);
    slugs.add(parsed.slug);
    console.log(`Upserted ${item.id}`);
  }

  const existing = await listBestiarySlugs();
  for (const slug of existing) {
    if (!slugs.has(slug)) {
      await deleteBestiaryItem(slug);
      console.log(`Deleted orphan bestiary:${slug}`);
    }
  }

  console.log(`Sync complete: ${slugs.size} bestiary record(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
