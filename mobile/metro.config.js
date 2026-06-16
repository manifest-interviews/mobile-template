// Learn more: https://docs.expo.dev/guides/monorepos/
const { getDefaultConfig } = require("expo/metro-config");

// The shared ts-rest contracts live in the backend at <root>/src/shared and are
// surfaced here through the `src/shared` symlink, so they resolve via the normal
// "@/*" alias (see tsconfig.json) with no extra Metro configuration needed.
const config = getDefaultConfig(__dirname);

module.exports = config;
