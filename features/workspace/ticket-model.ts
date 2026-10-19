import type { Team } from "@/features/dashboard/dashboard-data";
export const ticketStatuses = [
  "Open",
  "In progress",
  "Pending requester",
  "Resolved",
] as const;
export type DemoStatus = (typeof ticketStatuses)[number];
export type Message = {
  id: string;
  author: string;
  visibility: "public" | "internal";
  body: string;
  time: string;
  attachments: string[];
};
export type Activity = { id: string; text: string; time: string };
export type TicketChange =
  | { kind: "assign"; value: string | null }
  | { kind: "team"; value: Team }
  | { kind: "priority"; value: 1 | 2 | 3 | 4 }
  | { kind: "status"; value: DemoStatus; resolution?: string };
export type EditableTicket = {
  id: string;
  version: number;
  status: DemoStatus;
  assignee: string | null;
  team: Team;
  priority: 1 | 2 | 3 | 4;
};
export type ChangeResult<T> =
  { ok: true; ticket: T; text: string } | { ok: false; error: string };

export function applyTicketChange<T extends EditableTicket>(
  ticket: T,
  change: TicketChange,
  expectedVersion: number,
  bulk = false,
): ChangeResult<T> {
  if (ticket.version !== expectedVersion)
    return {
      ok: false,
      error:
        "This ticket changed. Reload the latest record and review before retrying.",
    };
  if (bulk && ticket.id === "INC-1044")
    return {
      ok: false,
      error:
        "Major incident protected from bulk changes. Open the ticket for individual review.",
    };
  if (
    ticket.status === "Resolved" &&
    !(change.kind === "status" && change.value === "Open")
  )
    return {
      ok: false,
      error: "Reopen this resolved ticket before making changes.",
    };
  if (change.kind === "status") {
    if (change.value !== "Open" && !ticket.assignee)
      return {
        ok: false,
        error: "Assign an agent before moving this ticket out of Open.",
      };
    if (change.value === "Resolved" && ticket.status !== "In progress")
      return {
        ok: false,
        error: "Only an assigned, in-progress ticket can be resolved.",
      };
    if (
      change.value === "Resolved" &&
      (change.resolution?.trim().length ?? 0) < 10
    )
      return {
        ok: false,
        error: "Enter a resolution note of at least 10 characters.",
      };
  }
  const updated = { ...ticket, version: ticket.version + 1 };
  if (change.kind === "assign") updated.assignee = change.value;
  if (change.kind === "team") {
    updated.team = change.value;
    updated.assignee = null;
  }
  if (change.kind === "priority") updated.priority = change.value;
  if (change.kind === "status") updated.status = change.value;
  return {
    ok: true,
    ticket: updated,
    text:
      change.kind === "assign"
        ? `Assigned to ${change.value ?? "Unassigned"}`
        : change.kind === "team"
          ? `Moved to ${change.value}; awaiting assignment`
          : change.kind === "priority"
            ? `Priority changed to P${change.value}`
            : `Status changed to ${change.value}${change.resolution ? ` — ${change.resolution.trim()}` : ""}`,
  };
}
