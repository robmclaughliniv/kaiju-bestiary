import { bestiaryId, toBestiaryDetail, toBestiarySummary } from "./bestiary-item.mjs";
import { getItem, scanItemsByKind, upsertItem, deleteItem } from "./dynamo.mjs";
import {
  memoryDeleteBestiary,
  memoryGetBestiaryBySlug,
  memoryListBestiary,
  memoryUpsertBestiary,
} from "./memory-store.mjs";

function useMemoryStore() {
  return process.env.WORKSHOP_MEMORY_STORE === "1" || !process.env.DYNAMODB_TABLE_NAME;
}

export async function listBestiary() {
  const raw = useMemoryStore()
    ? memoryListBestiary()
    : await scanItemsByKind("bestiary");
  return raw
    .sort((a, b) => a.number - b.number || (a.slug || "").localeCompare(b.slug || ""))
    .map(toBestiarySummary);
}

export async function getBestiaryBySlug(slug) {
  const id = bestiaryId(slug);
  const item = useMemoryStore() ? memoryGetBestiaryBySlug(slug) : await getItem(id);
  if (!item || item.kind !== "bestiary") return null;
  return toBestiaryDetail(item);
}

export async function upsertBestiaryItem(item) {
  if (useMemoryStore()) {
    memoryUpsertBestiary(item);
    return;
  }
  await upsertItem(item);
}

export async function deleteBestiaryItem(slug) {
  const id = bestiaryId(slug);
  if (useMemoryStore()) {
    memoryDeleteBestiary(slug);
    return;
  }
  await deleteItem(id);
}

export async function listBestiarySlugs() {
  const raw = useMemoryStore()
    ? memoryListBestiary()
    : await scanItemsByKind("bestiary");
  return new Set(raw.map((item) => item.slug));
}
