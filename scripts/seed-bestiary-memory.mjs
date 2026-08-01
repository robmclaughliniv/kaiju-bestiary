import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseEntry } from "../src/parse.js";
import { buildBestiaryItem } from "../api/lib/bestiary-item.mjs";
import { memoryUpsertBestiary } from "../api/lib/memory-store.mjs";

/** Seed in-memory DynamoDB mock from bestiary/*.md for local dev. */
export function seedBestiaryMemoryStore() {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const bestiaryDir = join(root, "bestiary");

  let files;
  try {
    files = readdirSync(bestiaryDir).filter((f) => /^\d{3}-.+\.md$/.test(f));
  } catch {
    return;
  }

  for (const file of files) {
    const sourceFile = `bestiary/${file}`;
    const raw = readFileSync(join(bestiaryDir, file), "utf8");
    const parsed = parseEntry(sourceFile, raw);
    if (parsed.number == null) continue;
    memoryUpsertBestiary(buildBestiaryItem(sourceFile, raw, parsed));
  }
}
