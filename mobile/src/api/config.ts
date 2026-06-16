import Constants from "expo-constants";
import { Platform } from "react-native";

// The backend (the Bun server in the repo root) listens on this port.
const PORT = 3001;

/**
 * Figures out where the API lives.
 *
 * On a simulator/emulator and on a physical phone running Expo Go, the dev
 * machine isn't "localhost" — it's the machine's LAN IP. Expo already knows
 * that IP (it's how your phone reaches Metro), so we reuse it. Override with
 * EXPO_PUBLIC_API_URL if your backend runs somewhere else.
 */
function inferApiUrl(): string {
  const override = process.env.EXPO_PUBLIC_API_URL;
  if (override) return override;

  // e.g. "192.168.1.20:8081" — the host half is the dev machine.
  const hostUri = Constants.expoConfig?.hostUri ?? "";
  const host = hostUri.split(":")[0];
  if (host) return `http://${host}:${PORT}`;

  // Last-resort fallbacks if Expo couldn't tell us the host.
  const fallback = Platform.OS === "android" ? "10.0.2.2" : "localhost";
  return `http://${fallback}:${PORT}`;
}

export const API_URL = inferApiUrl();
