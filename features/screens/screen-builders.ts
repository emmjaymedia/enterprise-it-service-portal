import type {
  ScreenSection,
  ScreenField,
  ScreenCard,
  ScreenRow,
  ScreenLink,
} from "./screen-types";
export const table = (
  title: string,
  columns: string[],
  rows: ScreenRow[],
  tab?: string,
): ScreenSection => ({ kind: "table", title, columns, rows, tab });
export const fields = (
  title: string,
  values: ScreenField[],
  tab?: string,
): ScreenSection => ({ kind: "fields", title, fields: values, tab });
export const cards = (
  title: string,
  values: ScreenCard[],
  tab?: string,
): ScreenSection => ({ kind: "cards", title, cards: values, tab });
export const text = (
  title: string,
  paragraphs: string[],
  links?: ScreenLink[],
  tab?: string,
): ScreenSection => ({ kind: "text", title, paragraphs, links, tab });
export const timeline = (
  title: string,
  values: ScreenSection["items"],
  tab?: string,
): ScreenSection => ({ kind: "timeline", title, items: values, tab });
export const checklist = (
  title: string,
  values: ScreenSection["items"],
  tab?: string,
): ScreenSection => ({ kind: "checklist", title, items: values, tab });
export const select = (
  label: string,
  options: string[],
  value?: string,
): ScreenField => ({ label, type: "select", options, value });
export const input = (
  label: string,
  value = "",
  hint?: string,
): ScreenField => ({ label, value, hint });
export const textarea = (label: string, value = ""): ScreenField => ({
  label,
  value,
  type: "textarea",
  span: true,
});
export const row = (
  cells: string[],
  href?: string,
  tone?: ScreenRow["tone"],
): ScreenRow => ({ cells, href, tone });
export const link = (
  label: string,
  href?: string,
  primary = false,
): ScreenLink => ({ label, href, primary });
