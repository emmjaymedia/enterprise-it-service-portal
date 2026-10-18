import type { CSSProperties } from "react";

const paths = {
  grid: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  ticket: "M3 5h18v5a2 2 0 0 0 0 4v5H3v-5a2 2 0 0 0 0-4V5Z M9 5v14",
  search: "M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4",
  plus: "M12 5v14 M5 12h14", chevron: "m9 5 7 7-7 7",
  alert: "m12 3 10 18H2L12 3Z M12 9v5 M12 17v1",
  refresh: "M20 7v5h-5 M4 17v-5h5 M5 7a8 8 0 0 1 13-2l2 3 M4 16l2 3a8 8 0 0 0 13-2",
  team: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M17 4a4 4 0 0 1 0 8 M22 21v-2a4 4 0 0 0-3-4",
  calendar: "M3 5h18v16H3z M7 3v4 M17 3v4 M3 10h18",
  clock: "M12 8v5l3 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z",
  chart: "M4 20V10 M10 20V4 M16 20v-8 M22 20V2",
  book: "M12 5v16 M12 5C7 2 3 3 2 4v15c3-2 6-1 10 2 4-3 7-4 10-2V4c-1-1-5-2-10 1Z",
  box: "m12 2 10 5v10l-10 5-10-5V7l10-5Z M2 7l10 5 10-5 M12 12v10",
  settings: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1 1-3Z",
  menu: "M3 6h18 M3 12h18 M3 18h18", close: "m6 6 12 12 M6 18 18 6",
  check: "m5 12 4 4L19 6", logout: "M10 3H3v18h7 M10 12h12 M17 7l5 5-5 5",
} as const;
export type IconName = keyof typeof paths;
export default function Icon({ name, size = 20, style }: { name: IconName; size?: number; style?: CSSProperties }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}><path d={paths[name]} /></svg>;
}
