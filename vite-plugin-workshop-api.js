import { handleRequest } from "./api/lib/router.mjs";
import { seedBestiaryMemoryStore } from "./scripts/seed-bestiary-memory.mjs";

/** Vite dev middleware: same routes as production Lambda, in-memory store. */
export function workshopApiPlugin() {
  process.env.WORKSHOP_MEMORY_STORE = "1";
  seedBestiaryMemoryStore();

  return {
    name: "workshop-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/")) return next();

        const url = new URL(req.url, "http://localhost");
        const method = req.method || "GET";
        let body = "";

        if (method === "POST" || method === "PUT" || method === "PATCH") {
          body = await readBody(req);
        }

        const event = {
          rawPath: url.pathname,
          body,
          requestContext: { http: { method } },
        };

        try {
          const response = await handleRequest(event);
          res.statusCode = response.statusCode;
          for (const [key, value] of Object.entries(response.headers || {})) {
            res.setHeader(key, value);
          }
          res.end(response.body || "");
        } catch (err) {
          console.error("[workshop-api]", err);
          res.statusCode = 500;
          res.setHeader("content-type", "application/json");
          res.end(JSON.stringify({ error: "Internal server error" }));
        }
      });
    },
  };
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}
