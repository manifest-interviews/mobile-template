# Café POS (mobile)

A prototype café point-of-sale system: an Expo / React Native app backed by a
Bun API server. Default to simplicity, but follow the user's lead — if they want
to go deeper on something, go deeper. See `README.md` for setup.

## Layout

Monorepo with two halves:

- `src/` — **backend**: Bun + ts-rest + SQLite API server (port 3001).
- `mobile/` — **frontend**: Expo / React Native app (Expo Router), the UI.

The API contract in `src/shared/` is the single source of truth and is imported
by both sides. The app reaches it via the `@shared/*` alias (wired up in
`mobile/tsconfig.json` for types and `mobile/metro.config.js` for bundling).

## Backend stack (`src/`)

- **Server:** Bun with `Bun.serve()` — no Express
- **Database:** SQLite via [`Bun.sql`](https://bun.com/docs/runtime/sql) tagged template literals — no ORMs, no `bun:sqlite`
- **API:** [ts-rest](https://ts-rest.com) contracts with [Zod](https://zod.dev) validation

Use Bun for everything backend: `bun <file>`, `bun install`, `bun run <script>`,
`bunx <pkg>`. Bun auto-loads `.env`. Prefer `Bun.file` over `node:fs`.

## Mobile stack (`mobile/`)

- **Framework:** Expo (React Native) + [Expo Router](https://docs.expo.dev/router/introduction/) — a file in `mobile/src/app/` is a route
- **Data:** React Query hooks generated from the ts-rest contract (`mobile/src/api/client.ts` → `tsr`); `api` is a plain client for imperative calls
- **Native:** [expo-camera](https://docs.expo.dev/versions/latest/sdk/camera/) for barcode scanning (`mobile/src/app/scan.tsx`)

Use **npm** in `mobile/` (it has its own `node_modules`); `npx expo start` to run.
`npx expo install <pkg>` for native modules so versions match the SDK.

## Adding a feature

Schema → contract → handler → screen.

1. `src/server/schema.sql` — add tables and seed data. Server drops/recreates on change.
2. `src/shared/contracts/` — define routes + Zod schemas, register in `src/shared/contract.ts`.
3. `src/server/api/` — implement handlers, register in `src/server/api/index.ts`.
4. `mobile/src/app/` — add a screen; read/write via the `tsr` hooks.

API responses are validated against the Zod contracts at runtime.

## After making changes

- Backend: `bun run check` (from repo root) type-checks the server + contracts.
- Mobile: `cd mobile && npx tsc --noEmit` type-checks the app.
