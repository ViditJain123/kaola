// Shared design tokens for the "Stop Scrolling, Koala" video.
// Sourced from /main.md (Lockin Club / sticker-book vertical spec).

export const fps = 30;

export const aspect = {
  width: 576,
  height: 1024,
};

// Three horizontal zones — TOP is reserved for manually-added subtitles
// (see main.md §2). Nothing in the video renders into subtitleSafe; it's
// kept empty so the user can drop subtitles on a track above this composition.
// Comfortable for 2-line subtitles at ~32–40px font + padding.
export const zones = {
  subtitleSafe: { y: 0, height: 160 },   // ~16%  reserved — leave EMPTY
  middle: { y: 160, height: 300 },       // ~29%  props (swap per phrase)
  bottom: { y: 460, height: 564 },       // ~55%  mascot
};

// Max usable width inside the middle zone (canvas width minus 32px side padding).
// Use this when sizing big-text props so they don't run off the 576-px frame.
export const maxPropWidth = 512;

export const colors = {
  background: "#FFFFFF",
  text: "#111111",
  muted: "#6B7280",
  // Lockin Club accent palette — high contrast on white
  primary: "#0EA5E9",   // electric blue (lock-in / focus)
  accent: "#F59E0B",    // amber (grind / streak)
  danger: "#EF4444",    // red (❌, addiction, fried)
  positive: "#10B981",  // green (unlocked / win)
};

const fontStack =
  "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

export const fonts = {
  family: fontStack,
  // Aliases — keep agent-written scenes using `fonts.body` / `fonts.sans` working.
  body: fontStack,
  sans: fontStack,
  hookWeight: 900,
  bodyWeight: 700,
  ctaWeight: 900,
};

export const motion = {
  cutFrames: 3,           // snappy — main.md says all transitions <= 5 frames
  popInFrames: 4,         // prop entry (3-5 frames)
  mascotPopFrames: 6,     // mascot pose-swap pop (slightly longer for "poppy" feel)
  intensity: "high" as const,
};
