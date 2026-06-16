# Café POS — mobile app

The Expo / React Native client. It talks to the Bun API server in the repo root
(`../`).

```bash
npm install
npx expo start      # then press i (iOS), a (Android), or scan the QR in Expo Go
```

The backend must be running too — see the [root README](../README.md) for the
full setup, the architecture, and how to add a feature end-to-end.

## Where things are

- `src/app/` — screens (Expo Router; a file is a route)
- `src/api/` — the ts-rest clients (`tsr` React Query hooks + `api` plain client) and API URL config
- `src/components/`, `src/state/`, `src/lib/` — UI, cart state, helpers
- `src/shared` — symlink to the backend's `../src/shared` ts-rest contracts (the shared API definition)
