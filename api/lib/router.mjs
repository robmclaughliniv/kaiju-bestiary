import { listCreations, getCreation, createCreation } from "./creations.mjs";

const MAX_BODY_BYTES = 65536;

export async function handleRequest(event) {
  const method = event.requestContext?.http?.method || event.httpMethod || "GET";
  const path = event.rawPath || event.path || "/";

  if (method === "OPTIONS") {
    return { statusCode: 204, headers: {}, body: "" };
  }

  if (path === "/api/creations" && method === "GET") {
    const items = await listCreations();
    return json(200, { items });
  }

  if (path === "/api/creations" && method === "POST") {
    const raw = event.body || "";
    if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
      return json(413, { error: "Payload too large" });
    }
    let payload;
    try {
      payload = raw ? JSON.parse(raw) : {};
    } catch {
      return json(400, { error: "Invalid JSON body" });
    }
    const result = await createCreation(payload);
    if (result.error) return json(result.status, { error: result.error });
    return json(201, result.item);
  }

  const detail = path.match(/^\/api\/creations\/([^/]+)$/);
  if (detail && method === "GET") {
    const item = await getCreation(detail[1]);
    if (!item) return json(404, { error: "Not found" });
    return json(200, item);
  }

  return json(404, { error: "Not found" });
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
    body: JSON.stringify(body),
  };
}
