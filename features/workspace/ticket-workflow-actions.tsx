"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  teams,
  useChangeDemoTicketsMutation,
  type DemoTicket,
  type Team,
} from "@/features/dashboard/dashboard-data";
import {
  resolutionArticles,
  resolutionCodes,
  routingTargets,
} from "./workflow-policy";
import type { TicketChange } from "./ticket-model";
import s from "./ticket-workflows.module.scss";

const subscribe = (callback: () => void) => {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
};
const getHash = () => window.location.hash;
const serverHash = () => "";
export default function TicketWorkflowActions({
  ticket,
  onFeedback,
}: {
  ticket: DemoTicket;
  onFeedback: (text: string, version?: number | null) => void;
}) {
  const hash = useSyncExternalStore(subscribe, getHash, serverHash);
  const resolveDialog = useRef<HTMLDialogElement>(null);
  const handoffDialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const resolveButton = useRef<HTMLButtonElement>(null);
  const handoffButton = useRef<HTMLButtonElement>(null);
  const [version, setVersion] = useState(ticket.version);
  const lock = useRef(false);
  const [change, { isLoading }] = useChangeDemoTicketsMutation();
  const [pendingVersion, setPendingVersion] = useState(0);
  const pending = isLoading || ticket.version < pendingVersion;
  const [summary, setSummary] = useState("");
  const [code, setCode] = useState("");
  const [article, setArticle] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"transfer" | "escalate" | "specialist">(
    "transfer",
  );
  const [team, setTeam] = useState<Team | "">("");
  const [assignee, setAssignee] = useState("");
  const [level, setLevel] = useState(2);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [publicUpdate, setPublicUpdate] = useState(true);
  const [fail, setFail] = useState(false);
  const stale = version !== ticket.version;
  const destination = mode === "transfer" ? team : ticket.team;
  const target = destination ? routingTargets[destination] : undefined;
  const eligible = teams.filter(
    (t) =>
      t !== ticket.team &&
      routingTargets[t].available &&
      (!ticket.sensitive || ticket.allowedTeams?.includes(t)),
  );
  const blockers = [
    ...(ticket.status !== "In progress" || !ticket.assignee
      ? ["Assign an agent and move the ticket to In progress."]
      : []),
    ...(ticket.approvalState === "Pending"
      ? ["Required approval is pending."]
      : []),
    ...(ticket.tasks?.some((t) => t.required && !t.done)
      ? ["Required linked tasks are incomplete."]
      : []),
  ];
  useEffect(() => {
    const dialog =
      hash === "#resolve"
        ? resolveDialog.current
        : hash === "#escalate"
          ? handoffDialog.current
          : null;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
    if (hash !== "#resolve") resolveDialog.current?.close();
    if (hash !== "#escalate") handoffDialog.current?.close();
  }, [hash, ticket.version]);
  function open(value: string, button: HTMLButtonElement) {
    opener.current = button;
    setError("");
    setVersion(ticket.version);
    window.location.hash = value;
  }
  function close() {
    if (lock.current) return;
    const fallback =
      window.location.hash === "#resolve"
        ? resolveButton.current
        : handoffButton.current;
    resolveDialog.current?.close();
    handoffDialog.current?.close();
    if (["#resolve", "#escalate"].includes(window.location.hash)) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
    (opener.current ?? fallback)?.focus();
  }
  async function commit(value: TicketChange) {
    if (lock.current || pending) return;
    if (stale) {
      setError(
        "Conflicting update. Review the latest revision before retrying; your input is preserved.",
      );
      return;
    }
    lock.current = true;
    setError("");
    if (fail) {
      setError(
        "Simulated save failure. Your input is preserved. Turn off failure and retry.",
      );
      lock.current = false;
      return;
    }
    setPendingVersion(ticket.version + 1);
    try {
      const results = await change({
        items: [{ id: ticket.id, version }],
        change: value,
        bulk: false,
      }).unwrap();
      if (!results[0].ok) {
        setPendingVersion(0);
        setError(results[0].error ?? "Unable to save.");
        return;
      }
      onFeedback(
        value.kind === "handoff"
          ? "Handoff recorded. Destination notification simulated; SLA retained."
          : "Ticket resolved. Public solution recorded; requester notification simulated.",
        ticket.version + 1,
      );
      lock.current = false;
      close();
      if (value.kind === "status") {
        setSummary("");
        setCode("");
        setArticle("");
      } else {
        setReason("");
        setNotes("");
      }
    } catch {
      setPendingVersion(0);
      setError("Unable to save. Your input is preserved for retry.");
    } finally {
      lock.current = false;
    }
  }
  const conflict = stale && (
    <div className={s.warning} role="alert">
      <strong>This record changed (revision {ticket.version}).</strong>
      <p>
        Review the current properties and checklist. Your input is preserved.
      </p>
      <button
        type="button"
        onClick={() => {
          setVersion(ticket.version);
          setError("Latest revision reviewed. You can retry.");
        }}
      >
        Use latest revision
      </button>
    </div>
  );
  const failure = (
    <label className={s.check}>
      <input
        type="checkbox"
        checked={fail}
        onChange={(e) => setFail(e.target.checked)}
        disabled={pending}
      />
      Simulate save failure (demo)
    </label>
  );
  const recovery = (
    <details>
      <summary>Demo recovery scenarios</summary>
      {failure}
      <p>
        Simulate another agent changing priority while your form stays open.
      </p>
      <button
        type="button"
        disabled={pending}
        onClick={async () => {
          if (lock.current) return;
          lock.current = true;
          try {
            const rows = await change({
              items: [{ id: ticket.id, version: ticket.version }],
              change: {
                kind: "priority",
                value: ticket.priority === 3 ? 2 : 3,
              },
              bulk: false,
            }).unwrap();
            setError(
              rows[0].ok
                ? "Another agent updated priority. Review the latest record before retrying."
                : (rows[0].error ?? "Unable to simulate update."),
            );
          } catch {
            setError("Unable to simulate update. Your input is preserved.");
          } finally {
            lock.current = false;
          }
        }}
      >
        Simulate conflicting update
      </button>
    </details>
  );

  return (
    <>
      <button
        type="button"
        disabled={pending || ticket.status === "Resolved"}
        ref={resolveButton}
        onClick={(e) => open("resolve", e.currentTarget)}
      >
        ✓ Resolve ticket
      </button>
      <button
        type="button"
        disabled={pending || ticket.status === "Resolved"}
        ref={handoffButton}
        onClick={(e) => open("escalate", e.currentTarget)}
      >
        ⇄ Escalate or transfer
      </button>
      <dialog
        ref={resolveDialog}
        className={s.dialog}
        aria-labelledby="resolve-heading"
        onToggle={(e) => {
          if (e.newState === "open") setVersion(ticket.version);
        }}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
      >
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void commit({
              kind: "status",
              value: "Resolved",
              resolution: summary,
              code,
              article,
            });
          }}
        >
          <header>
            <small>INCIDENT & REQUEST MANAGEMENT · REV-{ticket.version}</small>
            <h2 id="resolve-heading">Resolve {ticket.id}</h2>
            <p>{ticket.subject}</p>
          </header>
          <div className={s.body}>
            {conflict}
            <section className={s.panel}>
              <h3>Linked task checklist</h3>
              {ticket.tasks?.length ? (
                ticket.tasks.map((task) => (
                  <p key={task.id}>
                    {task.done ? "✓" : "○"} {task.label} ·{" "}
                    {task.required ? "Required" : "Optional"} ·{" "}
                    {task.done ? "Complete" : "Incomplete"}
                  </p>
                ))
              ) : (
                <p>No linked tasks.</p>
              )}
              <p>Approval: {ticket.approvalState ?? "Not required"}</p>
            </section>
            {blockers.length > 0 && (
              <div className={s.warning}>
                <strong>Resolution blocked</strong>
                <ul>
                  {blockers.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className={s.grid}>
              <label>
                Resolution code *
                <select value={code} onChange={(e) => setCode(e.target.value)}>
                  <option value="">Select code</option>
                  {resolutionCodes.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label>
                Resolution category
                <input readOnly value={ticket.service} />
              </label>
            </div>
            <label>
              Public solution summary *
              <textarea
                rows={5}
                maxLength={2000}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Explain the fix and how the requester can verify it…"
              />
            </label>
            <small>
              {summary.length}/2000 · Plain text · Visible to requester
            </small>
            <label>
              Public article reference (optional)
              <select
                value={article}
                onChange={(e) => setArticle(e.target.value)}
              >
                <option value="">No article</option>
                {resolutionArticles.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.id}: {a.title}
                  </option>
                ))}
              </select>
            </label>
            <aside className={s.panel}>
              <h3>Requester notification preview</h3>
              <p>
                To: {ticket.requester} · {ticket.id} has been resolved.
              </p>
              <p className={s.preview}>
                {summary || "Your public solution summary will appear here."}
              </p>
              <small>
                Public message saved in the mock record; no email is delivered.
              </small>
            </aside>
            {recovery}
            {error && (
              <p role="alert" className={s.error}>
                {error}
              </p>
            )}
          </div>
          <footer>
            <button type="button" disabled={pending} onClick={close}>
              Return to investigation
            </button>
            <button
              className={s.primary}
              type="submit"
              disabled={pending || blockers.length > 0 || stale}
            >
              {pending ? "Resolving…" : "Resolve ticket"}
            </button>
          </footer>
        </form>
      </dialog>
      <dialog
        ref={handoffDialog}
        className={s.dialog}
        aria-labelledby="handoff-heading"
        onToggle={(e) => {
          if (e.newState === "open") setVersion(ticket.version);
        }}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
      >
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (!destination) {
              setError("Choose an eligible destination team.");
              return;
            }
            void commit({
              kind: "handoff",
              mode,
              team: destination,
              assignee:
                mode === "escalate"
                  ? routingTargets[destination].lead
                  : assignee || null,
              level,
              reason,
              notes,
              publicUpdate,
            });
          }}
        >
          <header>
            <small>
              {ticket.id} · REV-{ticket.version}
            </small>
            <h2 id="handoff-heading">Escalate or Reassign Ticket</h2>
            <p>
              Current assignee: {ticket.assignee ?? "Unassigned"} · Current
              queue: {ticket.team}
            </p>
          </header>
          <div className={s.body}>
            {conflict}
            <div className={s.modes} aria-label="Workflow action">
              {(
                [
                  ["transfer", "Transfer Queue / Team"],
                  ["escalate", "Escalate Level"],
                  ["specialist", "Individual Specialist"],
                ] as const
              ).map(([value, label]) => (
                <button
                  type="button"
                  aria-pressed={mode === value}
                  key={value}
                  onClick={() => {
                    setMode(value);
                    setTeam("");
                    setAssignee("");
                    setError("");
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            {mode === "transfer" ? (
              <label>
                Destination team *
                <select
                  value={team}
                  onChange={(e) => {
                    setTeam(e.target.value as Team);
                    setAssignee("");
                  }}
                >
                  <option value="">Choose destination</option>
                  {teams
                    .filter((t) => t !== ticket.team)
                    .map((t) => (
                      <option
                        key={t}
                        value={t}
                        disabled={
                          !routingTargets[t].available ||
                          !!(
                            ticket.sensitive &&
                            !ticket.allowedTeams?.includes(t)
                          )
                        }
                      >
                        {t}
                        {!routingTargets[t].available
                          ? " — unavailable"
                          : ticket.sensitive &&
                              !ticket.allowedTeams?.includes(t)
                            ? " — access grant required"
                            : ""}
                      </option>
                    ))}
                </select>
              </label>
            ) : (
              <p className={s.panel}>
                Current team: {ticket.team} ·{" "}
                {target?.available ? "Available" : "Unavailable"}
              </p>
            )}
            {mode === "transfer" && !eligible.length && (
              <p className={s.warning}>
                No eligible destination team. Sensitive-record sharing requires
                an authorized access grant; this preview cannot grant access.
              </p>
            )}
            {mode === "escalate" ? (
              <label>
                Escalation level *
                <select
                  value={level}
                  onChange={(e) => setLevel(Number(e.target.value))}
                >
                  {[2, 3].map((l) => (
                    <option
                      key={l}
                      value={l}
                      disabled={l <= (ticket.escalationLevel ?? 1)}
                    >
                      L{l}
                    </option>
                  ))}
                </select>
                <small>
                  Current: L{ticket.escalationLevel ?? 1} · Destination lead:{" "}
                  {target?.lead}
                </small>
              </label>
            ) : (
              <label>
                Destination specialist
                {mode === "specialist" ? " *" : " (optional)"}
                <select
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  disabled={!target?.available}
                >
                  <option value="">
                    {mode === "transfer"
                      ? "Leave unassigned in team triage"
                      : "Choose specialist"}
                  </option>
                  {target?.members
                    .filter(
                      (name) =>
                        mode !== "specialist" || name !== ticket.assignee,
                    )
                    .map((name) => (
                      <option key={name}>{name}</option>
                    ))}
                  <option disabled>Marcus Vance — unavailable</option>
                </select>
              </label>
            )}
            <label>
              Reason *
              <textarea
                rows={2}
                maxLength={500}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Why does this ticket need a handoff or escalation?"
              />
            </label>
            <label>
              Detailed context & handoff notes (internal)
              <textarea
                rows={4}
                maxLength={2000}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>
            <aside className={s.panel}>
              <h3>SLA & access impact</h3>
              <p>
                Resolution SLA: {ticket.sla} · Illustrative 8×5 UTC policy; P1
                uses 24×7.
              </p>
              <p>
                Reassignment retains existing SLA state and targets. Destination
                support gains record context, including internal notes.{" "}
                {ticket.sensitive
                  ? "This sensitive record is restricted to teams with an existing grant."
                  : "Only the listed eligible teams can receive this demo record."}
              </p>
            </aside>
            <label className={s.check}>
              <input
                type="checkbox"
                checked={publicUpdate}
                onChange={(e) => setPublicUpdate(e.target.checked)}
              />
              Send public status update to {ticket.requester}
            </label>
            <p className={s.preview}>
              Preview: Your ticket{" "}
              {mode === "escalate"
                ? `was escalated to level ${level}`
                : "has a new support assignment"}{" "}
              with {destination || "the destination team"}. Your existing
              service targets continue to apply.
            </p>
            <small>
              Destination notification is simulated. Internal reasons and notes
              are excluded from the public update.
            </small>
            {recovery}
            {error && (
              <p role="alert" className={s.error}>
                {error}
              </p>
            )}
          </div>
          <footer>
            <button type="button" disabled={pending} onClick={close}>
              Cancel
            </button>
            <button
              type="submit"
              className={s.primary}
              disabled={
                pending ||
                stale ||
                ticket.status === "Resolved" ||
                (mode === "transfer" && !eligible.length) ||
                (mode !== "transfer" && !target?.available)
              }
            >
              {pending
                ? "Saving…"
                : mode === "escalate"
                  ? "Confirm Escalation"
                  : mode === "specialist"
                    ? "Confirm Reassignment"
                    : "Confirm Transfer & Reassign"}
            </button>
          </footer>
        </form>
      </dialog>
    </>
  );
}
