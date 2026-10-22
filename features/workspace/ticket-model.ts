import type { Team } from "@/features/dashboard/dashboard-data";
import {
  resolutionCodes,
  resolutionArticles,
  routingTargets,
  type WorkflowFields,
} from "./workflow-policy";
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
  | {
      kind: "status";
      value: DemoStatus;
      resolution?: string;
      code?: string;
      article?: string;
      reason?: string;
    }
  | {
      kind: "handoff";
      mode: "transfer" | "escalate" | "specialist";
      team: Team;
      assignee: string | null;
      level: number;
      reason: string;
      notes: string;
      publicUpdate: boolean;
    };
export type EditableTicket = WorkflowFields & {
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
    if (
      ticket.status === "Resolved" &&
      change.value === "Open" &&
      ((change.reason?.trim().length ?? 0) < 10 ||
        (change.reason?.length ?? 0) > 2000)
    )
      return {
        ok: false,
        error: "Enter a reopening reason of 10–2,000 characters.",
      };

    if (
      ["In progress", "Resolved"].includes(change.value) &&
      ticket.approvalState === "Pending"
    )
      return {
        ok: false,
        error:
          "Required approval is pending. Fulfillment and resolution are blocked.",
      };
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
    if (change.value === "Resolved") {
      if (
        (change.resolution?.trim().length ?? 0) < 10 ||
        (change.resolution?.length ?? 0) > 2000
      )
        return {
          ok: false,
          error: "Enter a public solution summary of 10–2,000 characters.",
        };
      if (!resolutionCodes.some((code) => code === change.code))
        return { ok: false, error: "Select a resolution code." };
      if (ticket.tasks?.some((task) => task.required && !task.done))
        return {
          ok: false,
          error: "Complete all required linked tasks before resolving.",
        };
      if (
        change.article &&
        !resolutionArticles.some((article) => article.id === change.article)
      )
        return {
          ok: false,
          error: "Choose an available public article reference.",
        };
    }
  }
  const destination =
    change.kind === "handoff"
      ? change.team
      : change.kind === "team"
        ? change.value
        : null;
  if (destination) {
    if (!routingTargets[destination]?.available)
      return {
        ok: false,
        error: "Destination team is unavailable. Choose an available team.",
      };
    if (ticket.sensitive && !ticket.allowedTeams?.includes(destination))
      return {
        ok: false,
        error:
          "Sensitive record: destination needs an authorized access grant. No sharing was changed.",
      };
  }
  if (change.kind === "handoff") {
    if (
      change.reason.trim().length < 10 ||
      change.reason.length > 500 ||
      change.notes.length > 2000
    )
      return {
        ok: false,
        error:
          "Enter a reason of 10–500 characters and handoff notes up to 2,000 characters.",
      };
    if (
      change.assignee &&
      !routingTargets[change.team].members.includes(change.assignee)
    )
      return {
        ok: false,
        error: "Destination specialist is unavailable in that team.",
      };
    if (change.mode === "transfer" && change.team === ticket.team)
      return {
        ok: false,
        error: "Choose a different destination team for transfer.",
      };
    if (
      change.mode === "specialist" &&
      (!change.assignee ||
        change.team !== ticket.team ||
        change.assignee === ticket.assignee)
    )
      return {
        ok: false,
        error: "Choose another available specialist in the current team.",
      };
    if (
      change.mode === "escalate" &&
      (change.team !== ticket.team ||
        change.level <= (ticket.escalationLevel ?? 1) ||
        change.level > 3 ||
        !Number.isInteger(change.level))
    )
      return {
        ok: false,
        error:
          "Select a higher escalation level (maximum L3) for the current team.",
      };
  }
  const updated = { ...ticket, version: ticket.version + 1 };
  if (change.kind === "assign") updated.assignee = change.value;
  if (change.kind === "team") {
    updated.team = change.value;
    updated.assignee = null;
  }
  if (change.kind === "priority") updated.priority = change.value;
  if (change.kind === "status") {
    updated.status = change.value;
    if (change.value === "Resolved") {
      updated.resolutionCode = change.code;
      updated.resolutionSummary = change.resolution?.trim();
      updated.resolutionArticle = change.article;
      updated.resolutionCycle = (ticket.resolutionCycle ?? 0) + 1;
    }
  }
  if (change.kind === "handoff") {
    updated.team = change.team;
    updated.assignee = change.assignee;
    if (change.mode === "escalate") updated.escalationLevel = change.level;
  }
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
            : change.kind === "handoff"
              ? `${change.mode === "escalate" ? `Escalated to L${change.level}` : change.mode === "specialist" ? "Specialist reassigned" : "Transferred"}: ${change.team} / ${change.assignee ?? "Team triage"}. Reason: ${change.reason.trim()}${change.notes.trim() ? `. Internal handoff: ${change.notes.trim()}` : ""}. Destination notification simulated; SLA retained.`
              : `Status changed to ${change.value}${change.resolution ? ` — ${change.code}: ${change.resolution.trim()}` : ""}${change.reason ? ` — ${change.reason}` : ""}`,
  };
}
