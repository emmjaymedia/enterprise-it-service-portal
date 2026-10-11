"use client";

import { useState } from "react";
import {
  agentIdSchema,
  supportAgents,
  updateTicketSchema,
  type Ticket,
  type UpdateTicketInput,
} from "./ticket-schema";
import { useUpdateTicketMutation } from "./tickets-api";
import styles from "./ticket-workflow.module.scss";

function getUpdateError(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error
  ) {
    const data = error.data;

    if (
      typeof data === "object" &&
      data !== null &&
      "error" in data
    ) {
      const details = data.error;

      if (
        typeof details === "object" &&
        details !== null &&
        "message" in details &&
        typeof details.message === "string"
      ) {
        return details.message;
      }
    }
  }

  return "We could not confirm the update. Refresh the ticket before trying again.";
}

export default function TicketWorkflow({
  ticket,
  refreshing,
  onRefresh,
}: {
  ticket: Ticket;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  const [selectedAgent, setSelectedAgent] = useState(
    ticket.assigneeId ?? supportAgents[0].id,
  );
  const [resolution, setResolution] = useState("");
  const [feedback, setFeedback] = useState<{
    kind: "success" | "error";
    message: string;
  } | null>(null);

  const [updateTicket, { isLoading }] = useUpdateTicketMutation();
  const busy = isLoading || refreshing;

  const assignee = supportAgents.find(
    (agent) => agent.id === ticket.assigneeId,
  );

  async function submitChange(changes: UpdateTicketInput) {
    if (busy) return;

    const parsed = updateTicketSchema.safeParse(changes);

    if (!parsed.success) {
      setFeedback({
        kind: "error",
        message: parsed.error.issues[0]?.message ?? "Check the fields.",
      });
      return;
    }

    setFeedback(null);

    try {
      await updateTicket({
        id: ticket.id,
        changes: parsed.data,
      }).unwrap();

      setFeedback({
        kind: "success",
        message: "Ticket updated. Its details are refreshing.",
      });
    } catch (error: unknown) {
      setFeedback({
        kind: "error",
        message: getUpdateError(error),
      });
    }
  }

  return (
    <section
      className={styles.workflow}
      aria-labelledby="workflow-heading"
    >
      <h3 id="workflow-heading">Support workflow</h3>
      <p>Local demo controls — support permissions are not enforced yet.</p>

      <p>
        <strong>Assigned agent:</strong> {assignee?.name ?? "Unassigned"}
      </p>

      {ticket.status !== "Resolved" && (
        <>
          <form
            onSubmit={(event) => {
              event.preventDefault();

              const agent = agentIdSchema.safeParse(selectedAgent);

              if (!agent.success) {
                setFeedback({
                  kind: "error",
                  message: "Select a valid support agent.",
                });
                return;
              }

              void submitChange({
                action: "assign",
                assigneeId: agent.data,
                expectedVersion: ticket.version ?? 0,
              });
            }}
          >
            <label htmlFor="assigned-agent">Support agent</label>
            <select
              id="assigned-agent"
              value={selectedAgent}
              disabled={busy}
              onChange={(event) => {
                const parsed = agentIdSchema.safeParse(event.target.value);
                if (parsed.success) setSelectedAgent(parsed.data);
              }}
            >
              {supportAgents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={busy || selectedAgent === ticket.assigneeId}
            >
              Assign agent
            </button>
          </form>

          {ticket.status === "Open" && (
            <>
              <p>Assign an agent, then start work on this ticket.</p>
              <button
                type="button"
                disabled={busy || !ticket.assigneeId}
                onClick={() =>
                  void submitChange({
                    action: "start",
                    expectedVersion: ticket.version ?? 0,
                  })
                }
              >
                Start work
              </button>
            </>
          )}

          {ticket.status === "In progress" && (
            <form
              onSubmit={(event) => {
                event.preventDefault();

                void submitChange({
                  action: "resolve",
                  resolution,
                  expectedVersion: ticket.version ?? 0,
                });
              }}
            >
              <label htmlFor="resolution-note">Resolution note</label>
              <textarea
                id="resolution-note"
                rows={4}
                maxLength={2000}
                required
                disabled={busy}
                value={resolution}
                aria-describedby="resolution-hint"
                onChange={(event) => setResolution(event.target.value)}
              />
              <p id="resolution-hint">
                Explain the fix using 10–2,000 characters.
              </p>

              <button
                type="submit"
                disabled={busy || !ticket.assigneeId}
              >
                Resolve ticket
              </button>
            </form>
          )}
        </>
      )}

      {ticket.status === "Resolved" && (
        <div>
          <h4>Resolution</h4>
          <p className={styles.resolution}>
            {ticket.resolution ?? "No resolution note in this sample record."}
          </p>
        </div>
      )}

      <button type="button" disabled={busy} onClick={onRefresh}>
        Refresh details
      </button>

      <div role="status" aria-atomic="true">
        {busy && <p>Updating or refreshing ticket…</p>}
        {feedback?.kind === "success" && <p>{feedback.message}</p>}
      </div>

      <div role="alert" aria-atomic="true">
        {feedback?.kind === "error" && (
          <p className={styles.error}>{feedback.message}</p>
        )}
      </div>
    </section>
  );
}