"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { isActive, responseTarget } from "./portal-ticket-utils";
import s from "./portal.module.scss";
export default function MyTickets({ view }: { view?: string }) {
  const tickets = useAppSelector((state) => state.portal.tickets);
  const [tab, setTab] = useState(view ? "All" : "Active");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [days, setDays] = useState("All");
  const [service, setService] = useState("All");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [selected, setSelected] = useState(view ?? "");
  const previewRef = useRef<HTMLElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (selected) previewRef.current?.focus();
  }, [selected]);
  const active = tickets.filter((t) => isActive(t.status)).length;
  const completed = tickets.filter((t) =>
    ["Resolved", "Closed"].includes(t.status),
  ).length;
  const resolved = tickets.filter((t) => t.status === "Resolved").length;
  // Use the most recent mock update as the stable demo clock, including newly created issues.
  const clock = Math.max(...tickets.map((t) => Date.parse(t.updatedAt)));
  const filtered = tickets
    .filter(
      (t) =>
        (tab === "All" ||
          (tab === "Active"
            ? isActive(t.status)
            : ["Resolved", "Closed"].includes(t.status))) &&
        (status === "All" || t.status === status) &&
        (service === "All" || t.service === service) &&
        (days === "All" ||
          Date.parse(t.updatedAt) >= clock - Number(days) * 86400000) &&
        `${t.id} ${t.subject} ${t.service}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
  const pages = Math.max(1, Math.ceil(filtered.length / size));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * size, current * size);
  const ticket = tickets.find((t) => t.id === selected);
  const reset = () => {
    setQuery("");
    setStatus("All");
    setDays("All");
    setService("All");
    setPage(1);
  };
  return (
    <>
      <div className={s.pageTitle}>
        <div>
          <span className={s.eyebrow}>
            SELF-SERVICE PORTAL / INCIDENT & REQUEST TRACKING
          </span>
          <h1>My Tickets</h1>
          <p>Track your IT service requests and incident reports.</p>
        </div>
        <Link className={s.primary} href="/portal/tickets/new">
          ＋ Report an Issue
        </Link>
      </div>
      <div className={s.metrics}>
        <div className={s.card}>
          <small>Active Incidents</small>
          <strong>{active}</strong>
          <span>Open or in progress</span>
        </div>
        <div className={s.card}>
          <small>Pending Confirmation</small>
          <strong>{resolved}</strong>
          <span>Resolved · Review the update</span>
        </div>
        <div className={s.card}>
          <small>Total Tickets</small>
          <strong>{tickets.length}</strong>
          <span>Own demo records only</span>
        </div>
        <div className={s.card}>
          <small>Platform Health</small>
          <strong>All Green</strong>
          <span>Illustrative service status</span>
        </div>
      </div>
      <section className={s.ticketList} aria-label="My tickets">
        <div className={s.tabs} role="tablist" aria-label="Ticket state">
          {["Active", "Resolved & Closed", "All"].map((name, i) => (
            <button
              key={name}
              id={`ticket-tab-${i}`}
              type="button"
              role="tab"
              aria-selected={tab === name}
              aria-controls="ticket-results"
              tabIndex={tab === name ? 0 : -1}
              onKeyDown={(e) => {
                if (
                  ["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
                ) {
                  e.preventDefault();
                  const next =
                    e.key === "Home"
                      ? 0
                      : e.key === "End"
                        ? 2
                        : (i + (e.key === "ArrowRight" ? 1 : 2)) % 3;
                  setTab(["Active", "Resolved & Closed", "All"][next]);
                  setStatus("All");
                  setPage(1);
                  document.getElementById(`ticket-tab-${next}`)?.focus();
                }
              }}
              onClick={() => {
                setTab(name);
                setStatus("All");
                setPage(1);
              }}
            >
              {name}{" "}
              <span className={s.tag}>
                {name === "Active"
                  ? active
                  : name === "All"
                    ? tickets.length
                    : completed}
              </span>
            </button>
          ))}
        </div>
        <div className={s.listFilters}>
          <input
            aria-label="Filter tickets"
            placeholder="Filter tickets by ID, keyword, or service"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
          <label>
            Status
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              {[
                "All",
                ...(tab === "Active"
                  ? ["Open", "In progress", "Pending requester"]
                  : tab === "Resolved & Closed"
                    ? ["Resolved", "Closed"]
                    : [
                        "Open",
                        "In progress",
                        "Pending requester",
                        "Resolved",
                        "Closed",
                        "Cancelled",
                      ]),
              ].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            Date range
            <select
              value={days}
              onChange={(e) => {
                setDays(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">All dates</option>
              <option value="7">Past 7 days</option>
              <option value="30">Past 30 days</option>
              <option value="90">Past 90 days</option>
            </select>
          </label>
          <label>
            Service
            <select
              value={service}
              onChange={(e) => {
                setService(e.target.value);
                setPage(1);
              }}
            >
              <option>All</option>
              {Array.from(new Set(tickets.map((t) => t.service))).map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <button onClick={reset}>Reset filters</button>
        </div>
        <p className={s.listHint}>
          Dates use the latest demo update as the reference date. All times
          shown in UTC.
        </p>
        <div
          role="tabpanel"
          id="ticket-results"
          aria-labelledby={`ticket-tab-${["Active", "Resolved & Closed", "All"].indexOf(tab)}`}
        >
          <div className={s.ticketRows}>
            <div className={s.listHead}>
              <span>TICKET ID</span>
              <span>SUBJECT & LATEST UPDATE</span>
              <span>SERVICE AREA</span>
              <span>STATUS / PRIORITY</span>
              <span>UPDATED</span>
              <span>ACTION</span>
            </div>
            {rows.map((t) => (
              <article key={t.id} className={s.listRow}>
                <span className={s.ticketId}>{t.id}</span>
                <div>
                  <h3>{t.subject}</h3>
                  <p>
                    {t.status === "Resolved"
                      ? "Solution ready for your review"
                      : t.status === "Closed"
                        ? "Request completed"
                        : t.status === "Cancelled"
                          ? "Request withdrawn"
                          : t.status === "Open"
                            ? "Received · Awaiting triage"
                            : "IT Support is investigating"}
                  </p>
                </div>
                <span>{t.service}</span>
                <div>
                  <span className={s.tag}>{t.status}</span>
                  <br />
                  <span className={s.warm}>{t.priority}</span>
                </div>
                <time dateTime={t.updatedAt}>
                  {new Date(t.updatedAt).toLocaleDateString("en-GB", {
                    timeZone: "UTC",
                  })}
                </time>
                <Link
                  className={s.primary}
                  href={`/portal/tickets/${encodeURIComponent(t.id)}`}
                >
                  View Ticket
                </Link>
              </article>
            ))}
          </div>
          {!rows.length && (
            <div className={s.empty}>
              <h2>
                {!tickets.length
                  ? "No tickets yet"
                  : tab === "Active" && active === 0
                    ? "You have no active tickets"
                    : "No matching tickets"}
              </h2>
              <p>Try another tab or clear your filters.</p>
              <button onClick={reset}>Clear filters</button>
              <Link href="/portal/tickets/new"> Report an issue →</Link>
            </div>
          )}
          <div className={s.pagination}>
            <span role="status">
              Showing {filtered.length ? (current - 1) * size + 1 : 0}–
              {Math.min(current * size, filtered.length)} of {filtered.length}{" "}
              matching tickets
            </span>
            <label>
              Rows per page{" "}
              <select
                value={size}
                onChange={(e) => {
                  setSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                {[2, 5, 10, 25].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </label>
            <button
              disabled={current === 1}
              onClick={() => setPage(current - 1)}
            >
              Previous
            </button>
            <span>
              {current} / {pages}
            </span>
            <button
              disabled={current >= pages}
              onClick={() => setPage(current + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </section>
      {selected && (
        <section
          className={s.card}
          id="ticket-preview"
          ref={previewRef}
          tabIndex={-1}
          aria-label="Ticket preview"
        >
          <div className={s.previewHeading}>
            <h2>
              {ticket
                ? `${ticket.id} · ${ticket.subject}`
                : "Ticket unavailable"}
            </h2>
            <button
              onClick={() => {
                setSelected("");
                openerRef.current?.focus();
              }}
            >
              Close preview
            </button>
          </div>
          {ticket ? (
            <>
              <span className={s.tag}>{ticket.status}</span>{" "}
              <span className={s.warm}>{ticket.priority}</span>
              <p className={s.reviewText}>{ticket.description}</p>
              <p>
                <strong>IT Support · Public update</strong>
                <br />
                {ticket.status === "Resolved"
                  ? "A solution is ready. Open the full ticket to confirm or reopen."
                  : ticket.status === "Closed"
                    ? "This issue is completed. This preview is read-only."
                    : "Your report is being reviewed. Check here for further public updates."}
              </p>
              <p>
                First response target: {responseTarget(ticket.priority)} ·
                Illustrative
              </p>
              {ticket.attachments?.length ? (
                <p>
                  Attachment references:{" "}
                  {ticket.attachments.map((f) => f.name).join(", ")}. File
                  contents are unavailable in this demo.
                </p>
              ) : null}
              <Link
                className={s.primary}
                href={`/portal/tickets/${encodeURIComponent(ticket.id)}`}
              >
                Open full ticket →
              </Link>
              <p className={s.hint}>
                Read-only preview. Open the full ticket to reply or review a
                solution.
              </p>
            </>
          ) : (
            <p>
              This record is not available in this demo session. It may have
              reset on reload. Only your own records are shown.
            </p>
          )}
        </section>
      )}
      <section className={s.support}>
        <div>
          <h2>Experiencing a broad outage or service lag?</h2>
          <p>
            Check company-wide service information before submitting another
            issue.
          </p>
          <Link className={s.textLink} href="/portal/status">
            Check Service Status →
          </Link>
        </div>
        <strong>
          Urgent blockers?
          <br />
          ext. 4357 (HELP)
        </strong>
      </section>
    </>
  );
}
