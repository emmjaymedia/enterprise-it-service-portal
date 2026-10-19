"use client";
import { useState } from "react";
import {
  teams,
  useChangeDemoTicketsMutation,
  type DemoTicket,
} from "@/features/dashboard/dashboard-data";
import type { Team } from "@/features/dashboard/dashboard-data";
import type { TicketChange } from "./ticket-model";
import styles from "./workspace-tickets.module.scss";
export default function TicketProperties({ ticket }: { ticket: DemoTicket }) {
  const [change, { isLoading }] = useChangeDemoTicketsMutation();
  const [pendingVersion, setPendingVersion] = useState(0);
  const pending = isLoading || ticket.version < pendingVersion;
  const [feedback, setFeedback] = useState("");
  async function update(value: TicketChange) {
    setPendingVersion(ticket.version + 1);
    try {
      const rows = await change({
        items: [{ id: ticket.id, version: ticket.version }],
        change: value,
        bulk: false,
      }).unwrap();
      if (!rows[0].ok) setPendingVersion(0);
      setFeedback(
        rows[0].ok
          ? "Property updated in this mock session."
          : (rows[0].error ?? "Update failed."),
      );
    } catch {
      setPendingVersion(0);
      setFeedback("Update failed. Your current ticket is unchanged.");
    }
  }
  return (
    <section className={styles.railCard} aria-labelledby="properties-title">
      <h2 id="properties-title">Ticket properties</h2>
      <label>
        Assigned team
        <select
          aria-label="Assigned team"
          value={ticket.team}
          disabled={pending || ticket.status === "Resolved"}
          onChange={(e) =>
            void update({ kind: "team", value: e.target.value as Team })
          }
        >
          {teams.map((team) => (
            <option key={team}>{team}</option>
          ))}
        </select>
      </label>
      <label>
        Assignee
        <select
          aria-label="Assignee"
          value={ticket.assignee ?? "unassigned"}
          disabled={pending || ticket.status === "Resolved"}
          onChange={(e) =>
            void update({
              kind: "assign",
              value: e.target.value === "unassigned" ? null : e.target.value,
            })
          }
        >
          <option value="unassigned">Unassigned</option>
          {["Daniel Cole", "Priya Shah", "Rashid Khan", "Maya Lee"].map(
            (name) => (
              <option key={name}>{name}</option>
            ),
          )}
        </select>
      </label>
      <label>
        Priority
        <select
          aria-label="Priority"
          value={ticket.priority}
          disabled={pending || ticket.status === "Resolved"}
          onChange={(e) =>
            void update({
              kind: "priority",
              value: Number(e.target.value) as 1 | 2 | 3 | 4,
            })
          }
        >
          {["Critical", "High", "Medium", "Low"].map((name, i) => (
            <option key={name} value={i + 1}>
              P{i + 1} {name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Current status
        <select
          aria-label="Current status"
          value={ticket.status}
          disabled={pending}
          onChange={(e) =>
            void update({
              kind: "status",
              value: e.target.value as
                "Open" | "In progress" | "Pending requester",
            })
          }
        >
          {ticket.status === "Resolved" ? (
            <>
              <option>Resolved</option>
              <option value="Open">Reopen → Open</option>
            </>
          ) : (
            ["Open", "In progress", "Pending requester"].map((s) => (
              <option key={s}>{s}</option>
            ))
          )}
        </select>
      </label>
      <p className={styles.railNote}>
        Resolution requires a note. Use Resolve ticket in the record actions.
      </p>
      <p className={styles.propertyFeedback} role="status">
        {pending ? "Updating…" : feedback}
      </p>
    </section>
  );
}
