import { handleRequest } from "./lib/router.mjs";

export const handler = async (event) => {
  try {
    return await handleRequest(event);
  } catch (err) {
    console.error(err);
    return json(500, { error: "Internal server error" });
  }
};

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
