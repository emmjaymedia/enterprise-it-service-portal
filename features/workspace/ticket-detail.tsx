"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import WorkspaceShell from "@/components/workspace/workspace-shell";
import Icon from "@/components/workspace/icon";
import {
  useGetDashboardDemoQuery,
  useChangeDemoTicketsMutation,
  type DemoTicket,
} from "@/features/dashboard/dashboard-data";
import TicketProperties from "./ticket-properties";
import TicketConversation, { displayTime } from "./ticket-conversation";
import styles from "./workspace-tickets.module.scss";
export default function TicketDetail({ id }: { id: string }) {
  const { data = [], isLoading, isError, refetch } = useGetDashboardDemoQuery();
  const ticket = data.find((t) => t.id === id);
  const searchParams = useSearchParams();
  const requestedReturn = searchParams.get("returnTo") ?? "";
  const back =
    requestedReturn === "/workspace/tickets" ||
    requestedReturn.startsWith("/workspace/tickets?")
      ? requestedReturn
      : "/workspace/tickets";
  const [search, setSearch] = useState("");
  return (
    <WorkspaceShell search={search} onSearch={setSearch}>
      <div className={styles.breadcrumb}>
        <Link href="/workspace">ITSM WORKSPACE</Link>
        <span>/</span>
        <Link href={back}>Incident management</Link>
        <span>/</span>
        <span>{id}</span>
        {ticket ? (
          <span className={styles.version}>REV-{ticket.version}</span>
        ) : null}
        <span className={styles.detailDemo}>
          Mock record · Session changes only
        </span>
      </div>
      {isLoading ? (
        <p role="status">Loading ticket details…</p>
      ) : isError ? (
        <section role="alert" className={styles.empty}>
          <h1>Unable to load ticket</h1>
          <button type="button" onClick={() => void refetch()}>
            Retry
          </button>
        </section>
      ) : ticket ? (
        <TicketRecord
          key={id}
          ticket={ticket}
          tickets={data}
          back={back}
          onRefresh={() => void refetch()}
        />
      ) : (
        <section className={styles.empty}>
          <h1>Ticket not found</h1>
          <p>This ID is not in the current mock workspace.</p>
          <Link href={back}>Back to ticket queue</Link>
        </section>
      )}
    </WorkspaceShell>
  );
}
function TicketRecord({
  ticket,
  tickets,
  back,
  onRefresh,
}: {
  ticket: DemoTicket;
  tickets: DemoTicket[];
  back: string;
  onRefresh: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [resolution, setResolution] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackVersion, setFeedbackVersion] = useState<number | null>(null);
  function reportFeedback(text: string, version: number | null = null) {
    setFeedback(text);
    setFeedbackVersion(version);
  }
  const [change, { isLoading }] = useChangeDemoTicketsMutation();
  const [pendingVersion, setPendingVersion] = useState(0);
  const pending = isLoading || ticket.version < pendingVersion;
  async function resolve() {
    setPendingVersion(ticket.version + 1);
    try {
      const results = await change({
        items: [{ id: ticket.id, version: ticket.version }],
        change: { kind: "status", value: "Resolved", resolution },
        bulk: false,
      }).unwrap();
      if (!results[0].ok) {
        setPendingVersion(0);
        reportFeedback(results[0].error ?? "Unable to resolve.");
        return;
      }
      reportFeedback(
        "Ticket resolved in this mock session.",
        ticket.version + 1,
      );
      setResolution("");
      dialog.current?.close();
    } catch {
      setPendingVersion(0);
      reportFeedback("Unable to resolve. Your note is preserved.");
    }
  }
  return (
    <div className={styles.recordGrid}>
      <aside className={styles.recordNavigation} aria-label="Ticket navigation">
        <Link className={styles.backLink} href={back}>
          ← Back to ticket queue
        </Link>
        <section className={styles.railCard}>
          <h2>Active queue</h2>
          <strong>{ticket.team}</strong>
          <p>Related work in this team</p>
        </section>
        <nav
          className={styles.siblingTickets}
          aria-label="Other tickets in team"
        >
          {tickets
            .filter((t) => t.team === ticket.team)
            .slice(0, 5)
            .map((t) => (
              <Link
                key={t.id}
                href={`/workspace/tickets/${encodeURIComponent(t.id)}?returnTo=${encodeURIComponent(back)}`}
                aria-current={t.id === ticket.id ? "page" : undefined}
              >
                <span>
                  {t.id}
                  <small>{t.status}</small>
                </span>
                <strong>{t.subject}</strong>
              </Link>
            ))}
        </nav>
        <div className={styles.triageActions}>
          <p>RECORD ACTIONS</p>
          <button
            type="button"
            disabled={pending || ticket.status === "Resolved"}
            onClick={async () => {
              setPendingVersion(ticket.version + 1);
              try {
                const rows = await change({
                  items: [{ id: ticket.id, version: ticket.version }],
                  change: { kind: "assign", value: "Daniel Cole" },
                  bulk: false,
                }).unwrap();
                if (!rows[0].ok) setPendingVersion(0);
                reportFeedback(
                  rows[0].ok
                    ? "Assigned to you in the mock workspace."
                    : (rows[0].error ?? "Assignment failed."),
                  rows[0].ok ? ticket.version + 1 : null,
                );
              } catch {
                setPendingVersion(0);
                reportFeedback("Assignment failed. Try again.");
              }
            }}
          >
            <Icon name="team" size={14} />
            Assign to me
          </button>
          <button
            type="button"
            className={styles.primary}
            disabled={ticket.status === "Resolved"}
            onClick={() => {
              reportFeedback("");
              dialog.current?.showModal();
            }}
          >
            <Icon name="check" size={14} />
            Resolve ticket
          </button>
        </div>
      </aside>
      <div className={styles.recordMain}>
        <section className={styles.recordHeader}>
          <div className={styles.ticketHeadingMeta}>
            <button
              type="button"
              className={styles.refreshRecord}
              onClick={() => {
                onRefresh();
                reportFeedback(
                  "Latest session record loaded. Review and retry your change.",
                );
              }}
            >
              <Icon name="refresh" size={13} />
              Refresh record
            </button>
            <span className={styles.ticketId}>{ticket.id}</span>
            <span className={styles.status}>{ticket.status}</span>
            <span
              className={`${styles.badge} ${styles[`priority${ticket.priority}`]}`}
            >
              P{ticket.priority}{" "}
              {["Critical", "High", "Medium", "Low"][ticket.priority - 1]}
            </span>
          </div>
          <h1>{ticket.subject}</h1>
          <p>
            <Icon name="box" size={14} />
            Service: <strong>{ticket.service}</strong>
            <span>·</span>Self-service portal
          </p>
          <small>
            Created{" "}
            {ticket.age === 0
              ? "today"
              : `${ticket.age} ${ticket.age === 1 ? "day" : "days"} ago`}{" "}
            · Fictional record
          </small>
        </section>
        <section
          className={`${styles.slaBanner} ${ticket.sla === "Breached" && ticket.status !== "Resolved" ? styles.breachedBanner : ""}`}
          aria-label="Resolution SLA"
        >
          <Icon name="clock" size={25} />
          <div>
            <strong>
              Resolution SLA:{" "}
              {ticket.status === "Resolved"
                ? "Completed"
                : ticket.status === "Pending requester"
                  ? "Paused — awaiting requester"
                  : ticket.sla}
            </strong>
            <p>Illustrative 8×5 UTC policy · P1 critical uses 24×7</p>
            <small>Demo target · Times do not count down.</small>
          </div>
        </section>
        <p className={styles.notice} role="status">
          {feedbackVersion === null || feedbackVersion === ticket.version
            ? feedback
            : ""}
        </p>
        <TicketConversation ticket={ticket} />
      </div>
      <aside
        className={styles.propertiesRail}
        aria-label="Ticket context and properties"
      >
        <section className={styles.railCard}>
          <h2>Requester profile</h2>
          <div className={styles.requester}>
            <span className={styles.personAvatar}>
              {ticket.requester
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
            <div>
              <strong>{ticket.requester}</strong>
              <small>{ticket.department}</small>
            </div>
          </div>
          <dl>
            <div>
              <dt>Department</dt>
              <dd>{ticket.department}</dd>
            </div>
            <div>
              <dt>Contact channel</dt>
              <dd>Employee portal</dd>
            </div>
            <div>
              <dt>Visibility</dt>
              <dd>Public replies only</dd>
            </div>
          </dl>
        </section>
        <section className={styles.railCard}>
          <h2>Associated asset</h2>
          <div className={styles.asset}>
            <Icon name="box" size={24} />
            <div>
              <strong>AST-00321</strong>
              <small>Dell Latitude 7440 · Demo reference</small>
            </div>
          </div>
          <dl>
            <div>
              <dt>Platform</dt>
              <dd>Windows 11 Enterprise</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>In service</dd>
            </div>
          </dl>
        </section>
        <TicketProperties ticket={ticket} />
        <section className={styles.railCard}>
          <h2>Recent activity</h2>
          <ol className={styles.railActivity}>
            {[...ticket.activity]
              .reverse()
              .slice(0, 5)
              .map((event) => (
                <li key={event.id}>
                  <strong>{event.text}</strong>
                  <time dateTime={event.time}>{displayTime(event.time)}</time>
                </li>
              ))}
          </ol>
        </section>
        <Link href="/tickets" className={styles.legacyLink}>
          Original ticket workspace →
        </Link>
      </aside>
      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-labelledby="resolve-title"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void resolve();
          }}
        >
          <h2 id="resolve-title">Resolve {ticket.id}</h2>
          <p>Assign the ticket and start work before resolving it.</p>
          <label>
            Resolution note
            <textarea
              autoFocus
              rows={5}
              required
              minLength={10}
              maxLength={2000}
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
            />
          </label>
          <p role="status" className={styles.rowError}>
            {feedback}
          </p>
          <div className={styles.actions}>
            <button type="button" onClick={() => dialog.current?.close()}>
              Cancel
            </button>
            <button type="submit" disabled={pending} className={styles.primary}>
              Resolve ticket
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
