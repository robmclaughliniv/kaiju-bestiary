import { randomUUID } from "node:crypto";
import { validateCreationPayload } from "./validate.mjs";
import { buildMarkdown, slugify } from "./markdown.mjs";
import { getItem, putItem, scanItems } from "./dynamo.mjs";
import { memoryGet, memoryList, memoryPut } from "./memory-store.mjs";

const LIST_CAP = 100;

function useMemoryStore() {
  return process.env.WORKSHOP_MEMORY_STORE === "1" || !process.env.DYNAMODB_TABLE_NAME;
}

export async function listCreations() {
  const raw = useMemoryStore() ? memoryList() : await scanItems(LIST_CAP);
  return raw
    .filter((item) => item.kind === "creation" && item.status === "public")
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
    .map(toSummary);
}

export async function getCreation(id) {
  const item = useMemoryStore() ? memoryGet(id) : await getItem(id);
  if (!item || item.kind !== "creation" || item.status !== "public") return null;
  return toDetail(item);
}

export async function createCreation(payload) {
  const validation = validateCreationPayload(payload);
  if (validation.error) return validation;

  const now = new Date().toISOString();
  const id = randomUUID();
  const slug = `${slugify(validation.data.name)}-${id.slice(0, 8)}`;
  const body = buildMarkdown(validation.data);

  const item = {
    id,
    kind: "creation",
    status: "public",
    name: validation.data.name,
    slug,
    operationalClass: validation.data.operationalClass,
    primaryEcology: validation.data.primaryEcology,
    knownRange: validation.data.knownRange,
    creatorLabel: validation.data.creatorLabel,
    threat: validation.data.threat,
    body,
    createdAt: now,
    updatedAt: now,
  };

  if (useMemoryStore()) {
    memoryPut(item);
  } else {
    await putItem(item);
  }

  return { item: toDetail(item) };
}

function toSummary(item) {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    operationalClass: item.operationalClass,
    primaryEcology: item.primaryEcology,
    knownRange: item.knownRange,
    creatorLabel: item.creatorLabel || null,
    createdAt: item.createdAt,
  };
}

function toDetail(item) {
  return {
    ...toSummary(item),
    body: item.body,
    threat: item.threat,
    updatedAt: item.updatedAt,
  };
}
