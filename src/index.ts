import { createFetchHandler } from "@ts-rest/serverless/fetch";
import { contract } from "./shared/contract";
import { router } from "./server/api";

// Validate all responses against the contract's Zod schemas at runtime,
// so raw SQL results are checked even though handlers use casts.
const apiHandler = createFetchHandler(contract, router, {
  responseValidation: true,
});

// This server is API-only — the UI lives in the Expo app under `mobile/`.
// Hitting the server in a browser just shows this hint.
const info = [
  "Café POS API",
  "",
  "This is the backend for the mobile app in `mobile/`. Try:",
  "  GET /api/products",
  "  GET /api/products/lookup?barcode=0001000000016",
  "  GET /api/orders",
  "",
].join("\n");

const server = Bun.serve({
  // hostname defaults to 0.0.0.0 so physical devices on your LAN can reach it.
  port: 3001,
  routes: {
    "/api/*": (req) => apiHandler(req),
    "/*": () =>
      new Response(info, { headers: { "content-type": "text/plain" } }),
  },

  development: process.env.NODE_ENV !== "production" && {
    console: true,
  },
});

console.log(`Café POS API running at ${server.url}`);
