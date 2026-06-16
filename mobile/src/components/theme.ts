// A small dark palette (roughly Tailwind's zinc scale) so screens stay visually
// consistent without pulling in a styling library.
export const colors = {
  bg: "#18181b", // zinc-900
  surface: "#27272a", // zinc-800
  surfaceAlt: "#3f3f46", // zinc-700
  border: "#3f3f46", // zinc-700
  text: "#fafafa", // zinc-50
  muted: "#a1a1aa", // zinc-400
  subtle: "#71717a", // zinc-500
  danger: "#f87171", // red-400
  success: "#4ade80", // green-400
} as const;

export const spacing = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;
