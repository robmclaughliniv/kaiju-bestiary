const items = new Map();

export function memoryList() {
  return [...items.values()]
    .filter((item) => item.kind === "creation" && item.status === "public")
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

export function memoryGet(id) {
  const item = items.get(id);
  if (!item || item.kind !== "creation" || item.status !== "public") return null;
  return item;
}

export function memoryPut(item) {
  items.set(item.id, item);
}

export function memoryListBestiary() {
  return [...items.values()].filter((item) => item.kind === "bestiary");
}

export function memoryGetBestiaryBySlug(slug) {
  const item = items.get(`bestiary:${slug}`);
  if (!item || item.kind !== "bestiary") return null;
  return item;
}

export function memoryUpsertBestiary(item) {
  items.set(item.id, item);
}

export function memoryDeleteBestiary(slug) {
  items.delete(`bestiary:${slug}`);
}

export function memoryReset() {
  items.clear();
}
