export type ScreenLink = { label: string; href?: string; primary?: boolean };
export type ScreenField = {
  label: string;
  value?: string;
  type?: "text" | "textarea" | "select" | "checkbox" | "password";
  options?: string[];
  span?: boolean;
  hint?: string;
};
export type ScreenRow = {
  cells: string[];
  href?: string;
  tone?: "warning" | "danger" | "success";
};
export type ScreenCard = {
  title: string;
  text: string;
  meta?: string;
  badge?: string;
  href?: string;
  icon?: "box" | "book" | "settings" | "team" | "alert" | "ticket";
  value?: string;
};
export type ScreenSection = {
  title: string;
  caption?: string;
  tab?: string;
  kind:
    | "table"
    | "cards"
    | "fields"
    | "timeline"
    | "checklist"
    | "text"
    | "chart"
    | "calendar"
    | "topology"
    | "workflow"
    | "matrix"
    | "tokens"
    | "code";
  columns?: string[];
  rows?: ScreenRow[];
  cards?: ScreenCard[];
  fields?: ScreenField[];
  items?: {
    title: string;
    text?: string;
    meta?: string;
    done?: boolean;
    href?: string;
    tone?: string;
  }[];
  paragraphs?: string[];
  links?: ScreenLink[];
  bars?: { label: string; value: number; secondary?: number }[];
  tone?: "warning" | "danger" | "success";
};
export type ScreenSpec = {
  id: string;
  path: string;
  title: string;
  description: string;
  area: "workspace" | "portal" | "admin" | "design";
  eyebrow: string;
  actions?: ScreenLink[];
  metrics?: { label: string; value: string; note: string; tone?: string }[];
  tabs?: string[];
  sections: ScreenSection[];
  aside?: ScreenSection[];
  parent?: { label: string; href: string };
  notice?: string;
  darkHero?: boolean;
};
