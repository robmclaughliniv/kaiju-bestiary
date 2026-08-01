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

export function memoryReset() {
  items.clear();
}
