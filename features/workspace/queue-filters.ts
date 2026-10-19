import { teams, type DemoTicket } from "@/features/dashboard/dashboard-data";
export const views = [
  "all",
  "mine",
  "unassigned",
  "risk",
  "due",
  "breached",
  "pending",
] as const;
export const viewLabels: Record<(typeof views)[number], string> = {
  all: "All active",
  mine: "Assigned to me",
  unassigned: "Unassigned",
  risk: "At risk",
  due: "Due soon",
  breached: "Breached SLA",
  pending: "Pending requester",
};
export type QueueFilters = {
  q: string;
  view: (typeof views)[number];
  team: string;
  period: "week" | "today";
  priority: string;
  status: string;
  service: string;
  attachments: boolean;
  high: boolean;
  sort: "updated" | "priority" | "subject" | "id";
  direction: "asc" | "desc";
  page: number;
  size: number;
};
export const defaultFilters: QueueFilters = {
  q: "",
  view: "all",
  team: "All teams",
  period: "week",
  priority: "all",
  status: "active",
  service: "all",
  attachments: false,
  high: false,
  sort: "updated",
  direction: "asc",
  page: 1,
  size: 10,
};
export function parseFilters(p: URLSearchParams): QueueFilters {
  const pick = <T extends string>(
    key: string,
    allowed: readonly T[],
    fallback: T,
  ): T => allowed.find((v) => v === p.get(key)) ?? fallback;
  return {
    q: (p.get("q") ?? "").slice(0, 200),
    view: pick("view", views, "all"),
    team: pick("team", ["All teams", ...teams], "All teams"),
    period: pick("period", ["week", "today"], "week"),
    priority: pick("priority", ["all", "1", "2", "3", "4"], "all"),
    status: pick(
      "status",
      ["active", "all", "Open", "In progress", "Pending requester", "Resolved"],
      "active",
    ),
    service: pick(
      "service",
      ["all", "Payroll", "Corporate VPN", "Printing", "Identity & Access"],
      "all",
    ),
    attachments: p.get("attachments") === "true",
    high: p.get("high") === "true",
    sort: pick("sort", ["updated", "priority", "subject", "id"], "updated"),
    direction: pick("direction", ["asc", "desc"], "asc"),
    page: Math.min(
      10000,
      Math.max(1, Number.parseInt(p.get("page") ?? "1") || 1),
    ),
    size: [10, 25, 50].includes(Number(p.get("size")))
      ? Number(p.get("size"))
      : 10,
  };
}
export function queueUrl(filters: Partial<QueueFilters>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters))
    if (value !== defaultFilters[key as keyof QueueFilters])
      params.set(key, String(value));
  return `/workspace/tickets${params.size ? `?${params.toString()}` : ""}`;
}
export function filterTickets(tickets: DemoTicket[], f: QueueFilters) {
  return tickets
    .filter(
      (t) =>
        (f.team === "All teams" || t.team === f.team) &&
        (f.period === "week" || t.age === 0) &&
        (f.priority === "all" || t.priority === Number(f.priority)) &&
        (f.status === "all" ||
          (f.status === "active"
            ? t.status !== "Resolved"
            : t.status === f.status)) &&
        (f.service === "all" || t.service === f.service) &&
        (!f.attachments || t.attachments.length > 0) &&
        (!f.high || t.priority <= 2) &&
        (f.view === "all" ||
          (f.view === "mine" && t.assignee === "Daniel Cole") ||
          (f.view === "unassigned" && !t.assignee) ||
          (f.view === "risk" && (t.priority <= 2 || t.sla !== "On track")) ||
          (f.view === "due" && t.sla === "Due soon") ||
          (f.view === "breached" && t.sla === "Breached") ||
          (f.view === "pending" && t.status === "Pending requester")) &&
        `${t.id} ${t.subject} ${t.requester}`
          .toLowerCase()
          .includes(f.q.trim().toLowerCase()),
    )
    .sort((a, b) => {
      const result =
        f.sort === "updated"
          ? a.updatedMinutes - b.updatedMinutes
          : f.sort === "priority"
            ? a.priority - b.priority
            : a[f.sort].localeCompare(b[f.sort]);
      return (
        (f.direction === "asc" ? result : -result) || a.id.localeCompare(b.id)
      );
    });
}
