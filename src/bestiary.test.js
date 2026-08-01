import { describe, it, expect, beforeEach } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { handleRequest } from "../api/lib/router.mjs";
import { memoryReset } from "../api/lib/memory-store.mjs";
import { seedBestiaryMemoryStore } from "../scripts/seed-bestiary-memory.mjs";
import { buildBestiaryItem } from "../api/lib/bestiary-item.mjs";
import { parseEntry } from "./parse.js";

const bestiaryDir = join(__dirname, "..", "bestiary");

describe("bestiary API", () => {
  beforeEach(() => {
    process.env.WORKSHOP_MEMORY_STORE = "1";
    memoryReset();
    seedBestiaryMemoryStore();
  });

  it("lists bestiary summaries without body markdown", async () => {
    const res = await handleRequest({
      rawPath: "/api/bestiary",
      requestContext: { http: { method: "GET" } },
    });
    expect(res.statusCode).toBe(200);
    const data = JSON.parse(res.body);
    expect(data.items.length).toBeGreaterThanOrEqual(4);
    for (const item of data.items) {
      expect(item.slug).toBeTruthy();
      expect(item.number).toBeGreaterThan(0);
      expect(item.body).toBeUndefined();
    }
  });

  it("returns full detail for a known slug", async () => {
    const file = readdirSync(bestiaryDir).find((f) => f.startsWith("001-"));
    const raw = readFileSync(join(bestiaryDir, file), "utf8");
    const parsed = parseEntry(`bestiary/${file}`, raw);

    const res = await handleRequest({
      rawPath: `/api/bestiary/${parsed.slug}`,
      requestContext: { http: { method: "GET" } },
    });
    expect(res.statusCode).toBe(200);
    const detail = JSON.parse(res.body);
    expect(detail.slug).toBe(parsed.slug);
    expect(detail.body).toContain("Gravorax");
  });

  it("returns 404 for unknown slug", async () => {
    const res = await handleRequest({
      rawPath: "/api/bestiary/does-not-exist",
      requestContext: { http: { method: "GET" } },
    });
    expect(res.statusCode).toBe(404);
  });
});

describe("bestiary item builder", () => {
  it("builds stable DynamoDB ids from slug", () => {
    const file = readdirSync(bestiaryDir).find((f) => f.startsWith("045-"));
    const raw = readFileSync(join(bestiaryDir, file), "utf8");
    const parsed = parseEntry(`bestiary/${file}`, raw);
    const item = buildBestiaryItem(`bestiary/${file}`, raw, parsed);
    expect(item.id).toBe(`bestiary:${parsed.slug}`);
    expect(item.kind).toBe("bestiary");
    expect(item.body).toBe(raw);
  });
});
