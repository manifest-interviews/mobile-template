# Café POS — Mobile Interview App

A café point-of-sale system: a **React Native (Expo) mobile app** backed by a
small **Bun API server**. Products, orders, a checkout flow, and camera barcode
scanning are already built — you'll extend and build on top of it during the
interview.

**Please do not fork this repository.** Just clone it locally.

## Layout

This is a monorepo with two pieces:

```
.
├── src/            # Backend — Bun + ts-rest + SQLite API server (port 3001)
│   ├── server/     #   db, schema/seed, route handlers
│   └── shared/     #   ts-rest contracts (the SINGLE source of truth for the API)
└── mobile/         # Frontend — Expo / React Native app (the UI you run on a phone)
```

The mobile app imports the **same `src/shared` contracts** the server implements,
so the API is end-to-end type-safe across the two.

## Preparing for the interview

You'll run two things side by side: the **backend** and the **Expo app**.

### 1. Backend (Bun)

Install [Bun](https://bun.com/) and start the API server:

```bash
# Install bun (Node-compatible runtime)
curl -fsSL https://bun.sh/install | bash

# From the repo root:
bun install
bun dev          # API server on http://localhost:3001
```

Sanity check: open <http://localhost:3001/api/products> — you should see JSON.

### 2. Mobile app (Expo)

In a second terminal:

```bash
cd mobile
npm install
npx expo start
```

Then run it on a device or simulator:

- **iOS Simulator** — press `i` (requires Xcode)
- **Android Emulator** — press `a` (requires Android Studio)
- **Your phone** — install **Expo Go** and scan the QR code. Your phone and
  computer must be on the same Wi-Fi.

The app finds the backend automatically using the host Expo is already serving
from. If it can't reach the API, point it explicitly:

```bash
EXPO_PUBLIC_API_URL=http://<your-computer-ip>:3001 npx expo start
```

### 3. Claude Code

Install [Claude Code](https://code.claude.com/docs/en/quickstart):

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

We'll provide Claude API keys at the start of the interview. You may use a
different tool (e.g. Cursor, Codex) with your own subscription if you prefer.

Feel free to explore the repo beforehand. The stack is intentionally light.
You're welcome to add libraries (a UI kit, a form library, etc.) before or
during the interview to make yourself more productive. We naturally expect you
to cut corners in an interview that you wouldn't cut in production.

## Stack overview

**Backend** (`src/`)

- **Runtime:** [Bun](https://bun.sh) — server, bundler, and package manager in one
- **Database:** SQLite via Bun's built-in [SQL client](https://bun.com/docs/runtime/sql) (tagged template literals)
- **API:** [ts-rest](https://ts-rest.com) — type-safe contracts shared with the app, with Zod validation

**Mobile** (`mobile/`)

- **Framework:** [Expo](https://docs.expo.dev/) (React Native) with [Expo Router](https://docs.expo.dev/router/introduction/) file-based navigation
- **Data:** [React Query](https://tanstack.com/query) hooks auto-generated from the ts-rest contracts
- **Native:** [expo-camera](https://docs.expo.dev/versions/latest/sdk/camera/) for barcode scanning

## Adding a feature end-to-end

The products, orders, and barcode-scan features are complete working examples.
To add a new resource, follow the same path:

1. **DB Schema** — update `src/server/schema.sql` (tables + seed data in one file).
   The server drops and recreates all tables with fresh seed data on change. No migrations.
2. **Contract** — define routes and Zod schemas under `src/shared/contracts/`, then register in `src/shared/contract.ts`.
3. **Handlers** — implement the contract in a new file under `src/server/api/`, then register in `src/server/api/index.ts`.
4. **Screen** — add a screen under `mobile/src/app/` (a file = a route), reading/writing data via the `tsr` hooks in `mobile/src/api/client.ts`.

API responses are validated against the Zod contracts at runtime, so schema
mismatches surface immediately.

> **Note:** the contracts live in `src/shared` and are imported by the app via
> the `@shared/*` path alias. Metro is configured (`mobile/metro.config.js`) to
> read them from the parent folder — so there's one definition of the API, used
> by both sides.
