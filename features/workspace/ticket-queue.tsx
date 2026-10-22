"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import WorkspaceShell from "@/components/workspace/workspace-shell";
import Icon from "@/components/workspace/icon";
import {
  teams,
  useGetDashboardDemoQuery,
  useChangeDemoTicketsMutation,
  type BulkItem,
  type BulkResult,
  type DemoTicket,
  type Team,
} from "@/features/dashboard/dashboard-data";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { viewSaved, viewDeleted } from "./workspace-slice";
import {
  defaultFilters,
  filterTickets,
  parseFilters,
  queueUrl,
  views,
  viewLabels,
  type QueueFilters,
} from "./queue-filters";
import TriagePreview from "@/features/screens/triage-preview";
import type { TicketChange } from "./ticket-model";
import styles from "./workspace-tickets.module.scss";

const optionalColumns = [
  "requester",
  "team",
  "status",
  "sla",
  "updated",
] as const;
const labels = {
  requester: "Requester",
  team: "Team & assignee",
  status: "Status",
  sla: "Resolution SLA",
  updated: "Updated",
};
export default function TicketQueue() {
  const params = useSearchParams();
  const f = parseFilters(new URLSearchParams(params.toString()));
  const scope = queueUrl(f);
  const {
    data = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetDashboardDemoQuery();
  const [changeTickets, { isLoading: isChanging }] =
    useChangeDemoTicketsMutation();
  const [selection, setSelection] = useState<{
    scope: string;
    items: BulkItem[];
  }>({ scope: "", items: [] });
  const [feedback, setFeedback] = useState<{
    scope: string;
    rows: BulkResult[];
  } | null>(null);
  const [columns, setColumns] = useState<string[]>([...optionalColumns]);
  const [actionKind, setActionKind] = useState("assign");
  const [actionValue, setActionValue] = useState("Daniel Cole");
  const [viewName, setViewName] = useState("");
  const [viewError, setViewError] = useState("");
  const [notice, setNotice] = useState("");
  const viewDialog = useRef<HTMLDialogElement>(null);
  const columnDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const clear = () => {
      setSelection({ scope: "", items: [] });
      setFeedback(null);
    };
    window.addEventListener("popstate", clear);
    return () => window.removeEventListener("popstate", clear);
  }, []);
  const savedViews = useAppSelector((state) => state.workspace.views);
  const dispatch = useAppDispatch();
  const selected = selection.scope === scope ? selection.items : [];
  const results = feedback?.scope === scope ? feedback.rows : [];
  const failures = results.filter((r) => !r.ok);
  const filtered = filterTickets(data, f);
  const pages = Math.max(1, Math.ceil(filtered.length / f.size));
  const page = Math.min(f.page, pages);
  const rows = filtered.slice((page - 1) * f.size, page * f.size);
  const allPageSelected =
    rows.length > 0 && rows.every((t) => selected.some((s) => s.id === t.id));
  const somePageSelected =
    !allPageSelected && rows.some((t) => selected.some((s) => s.id === t.id));
  const update = (patch: Partial<QueueFilters>, replace = false) => {
    const next = { ...f, page: 1, ...patch };
    window.history[replace ? "replaceState" : "pushState"](
      null,
      "",
      queueUrl(next),
    );
    setSelection({ scope: "", items: [] });
    setFeedback(null);
    setNotice("");
  };
  const selectTicket = (ticket: DemoTicket, checked: boolean) =>
    setSelection({
      scope,
      items: checked
        ? [
            ...selected.filter((s) => s.id !== ticket.id),
            { id: ticket.id, version: ticket.version },
          ]
        : selected.filter((s) => s.id !== ticket.id),
    });
  const sort = (key: QueueFilters["sort"]) =>
    update({
      sort: key,
      direction: f.sort === key && f.direction === "asc" ? "desc" : "asc",
    });
  const detailUrl = (id: string) =>
    `/workspace/tickets/${encodeURIComponent(id)}?returnTo=${encodeURIComponent(scope)}`;
  async function bulkAction() {
    const change: TicketChange =
      actionKind === "team"
        ? { kind: "team", value: actionValue as Team }
        : actionKind === "assign"
          ? {
              kind: "assign",
              value: actionValue === "unassigned" ? null : actionValue,
            }
          : actionKind === "priority"
            ? { kind: "priority", value: Number(actionValue) as 1 | 2 | 3 | 4 }
            : {
                kind: "status",
                value: actionValue as
                  "Open" | "In progress" | "Pending requester",
              };
    try {
      const response = await changeTickets({
        items: selected,
        change,
        bulk: true,
      }).unwrap();
      setFeedback({ scope, rows: response });
      setSelection({
        scope,
        items: selected.filter((s) =>
          response.some((r) => r.id === s.id && !r.ok),
        ),
      });
      setNotice(
        `${response.filter((r) => r.ok).length} updated; ${response.filter((r) => !r.ok).length} failed. Only failed rows remain selected.`,
      );
    } catch {
      setNotice(
        "Bulk action could not complete. Your selection is preserved. Try again.",
      );
    }
  }
  function exportCsv() {
    const cell = (value: string) =>
      `"${(/^[=+\-@\t\r]/.test(value) ? "'" + value : value).replaceAll('"', '""')}"`;
    const records = selected.length
      ? filtered.filter((t) => selected.some((s) => s.id === t.id))
      : filtered;
    const csv = [
      ["Ticket", "Subject", "Priority", "Status", "Team", "Assignee"],
      ...records.map((t) => [
        t.id,
        t.subject,
        `P${t.priority}`,
        t.status,
        t.team,
        t.assignee ?? "Unassigned",
      ]),
    ]
      .map((row) => row.map(cell).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "servicedesk-demo-tickets.csv";
    a.click();
    URL.revokeObjectURL(url);
    setNotice(`Exported ${records.length} demo tickets.`);
  }
  const chips: { label: string; clear: Partial<QueueFilters> }[] = [
    ...(f.team !== "All teams"
      ? [{ label: `Team: ${f.team}`, clear: { team: "All teams" } }]
      : []),
    ...(f.priority !== "all"
      ? [{ label: `Priority: P${f.priority}`, clear: { priority: "all" } }]
      : []),
    ...(f.status !== "active"
      ? [{ label: `Status: ${f.status}`, clear: { status: "active" } }]
      : []),
    ...(f.service !== "all"
      ? [{ label: `Service: ${f.service}`, clear: { service: "all" } }]
      : []),
    ...(f.period === "today"
      ? [{ label: "Created today", clear: { period: "week" as const } }]
      : []),
    ...(f.attachments
      ? [{ label: "Has attachments", clear: { attachments: false } }]
      : []),
    ...(f.high ? [{ label: "Only P1/P2", clear: { high: false } }] : []),
  ];
  return (
    <WorkspaceShell search={f.q} onSearch={(q) => update({ q }, true)}>
      <div className={styles.breadcrumb}>
        <Link href="/workspace">Workspace</Link>
        <Icon name="chevron" size={12} />
        <span>Tickets</span>
        <Icon name="chevron" size={12} />
        <span>{viewLabels[f.view]}</span>
      </div>
      <div className={styles.pageHeading}>
        <div>
          <h1>Ticket Queue</h1>
          <p>Manage, filter, and triage your support work.</p>
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            onClick={exportCsv}
            disabled={isLoading || isError || !filtered.length}
          >
            <Icon name="logout" size={15} />
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => columnDialog.current?.showModal()}
          >
            <Icon name="grid" size={15} />
            Columns
          </button>
          <Link className={styles.primary} href="/tickets#create-ticket">
            <Icon name="plus" size={16} />
            Create ticket
          </Link>
        </div>
      </div>
      <div className={styles.demoBanner}>
        <span className={styles.demoTag}>MOCK WORKSPACE</span>Session-only
        changes · Oct 12–18, 2026 · UTC · Fictional support records
      </div>
      <nav className={styles.views} aria-label="Ticket views">
        {views.map((view) => (
          <button
            type="button"
            key={view}
            aria-pressed={f.view === view}
            className={f.view === view ? styles.activeView : ""}
            onClick={() => update({ view })}
          >
            {viewLabels[view]}
            <span>
              {
                filterTickets(data, {
                  ...defaultFilters,
                  team: f.team,
                  period: f.period,
                  view,
                }).length
              }
            </span>
          </button>
        ))}
        <button
          type="button"
          className={styles.saveView}
          onClick={() => {
            setViewName("");
            setViewError("");
            viewDialog.current?.showModal();
          }}
        >
          <Icon name="plus" size={14} />
          Save view
        </button>
        <Link href="/workspace/views">Advanced Filter Builder →</Link>
      </nav>
      {savedViews.length ? (
        <div className={styles.savedViews} aria-label="Saved views">
          <span>PERSONAL VIEWS</span>
          {savedViews.map((view) => (
            <div key={view.id}>
              <button
                type="button"
                onClick={() => {
                  setColumns(view.columns);
                  window.history.pushState(
                    null,
                    "",
                    queueUrl({ ...view.filters, page: 1 }),
                  );
                  setSelection({ scope: "", items: [] });
                  setNotice(`Loaded view: ${view.name}`);
                }}
              >
                {view.name}
              </button>
              <button
                type="button"
                aria-label={`Delete saved view ${view.name}`}
                onClick={() => dispatch(viewDeleted(view.id))}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : null}
      <section className={styles.filterPanel} aria-label="Queue filters">
        <div className={styles.searchRow}>
          <label className={styles.queueSearch}>
            <Icon name="search" size={18} />
            <span className={styles.srOnly}>Search queue tickets</span>
            <input
              type="search"
              value={f.q}
              placeholder="Filter tickets by ID, keyword, or requester…"
              onChange={(e) => update({ q: e.target.value }, true)}
              maxLength={200}
            />
          </label>
          <button
            type="button"
            disabled={isFetching}
            onClick={async () => {
              try {
                await refetch().unwrap();
                setNotice("Queue refreshed. Session changes are preserved.");
              } catch {
                setNotice("Refresh failed. Try again.");
              }
            }}
          >
            <Icon name="refresh" size={15} />
            {isFetching ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        <div className={styles.filterControls}>
          <label>
            Priority
            <select
              aria-label="Priority"
              value={f.priority}
              onChange={(e) => update({ priority: e.target.value })}
            >
              <option value="all">All priorities</option>
              {[1, 2, 3, 4].map((p) => (
                <option value={p} key={p}>
                  P{p}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select
              aria-label="Status"
              value={f.status}
              onChange={(e) => update({ status: e.target.value })}
            >
              {[
                "active",
                "all",
                "Open",
                "In progress",
                "Pending requester",
                "Resolved",
              ].map((s) => (
                <option value={s} key={s}>
                  {s === "active"
                    ? "All active"
                    : s === "all"
                      ? "All statuses"
                      : s}
                </option>
              ))}
            </select>
          </label>
          <label>
            Team
            <select
              aria-label="Team"
              value={f.team}
              onChange={(e) => update({ team: e.target.value })}
            >
              <option>All teams</option>
              {teams.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label>
            Service
            <select
              aria-label="Service"
              value={f.service}
              onChange={(e) => update({ service: e.target.value })}
            >
              <option value="all">All services</option>
              {[
                "Payroll",
                "Corporate VPN",
                "Printing",
                "Identity & Access",
              ].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            aria-pressed={f.high}
            onClick={() => update({ high: !f.high })}
          >
            Only P1/P2
          </button>
          <button
            type="button"
            aria-pressed={f.attachments}
            onClick={() => update({ attachments: !f.attachments })}
          >
            Has attachments
          </button>
          <button
            type="button"
            aria-pressed={f.period === "today"}
            onClick={() =>
              update({ period: f.period === "today" ? "week" : "today" })
            }
          >
            Created today
          </button>
        </div>
        <div className={styles.chips}>
          {chips.map((chip) => (
            <button
              key={chip.label}
              type="button"
              aria-label={`Remove ${chip.label} filter`}
              onClick={() => update(chip.clear)}
            >
              {chip.label}
              <Icon name="close" size={12} />
            </button>
          ))}
        </div>
        <div className={styles.filterFooter}>
          <span role="status">
            {isLoading
              ? "Loading tickets…"
              : `${filtered.length} matching tickets · ${selected.length} selected`}
          </span>
          <button
            type="button"
            onClick={() => {
              window.history.pushState(null, "", "/workspace/tickets");
              setSelection({ scope: "", items: [] });
              setNotice("Filters and selection cleared.");
            }}
          >
            Clear all filters
          </button>
        </div>
      </section>
      <p role="status" className={styles.notice}>
        {notice}
      </p>
      {results.length ? (
        <section
          className={`${styles.bulkResults} ${failures.length ? styles.hasFailures : ""}`}
          aria-label="Bulk action results"
        >
          <strong>
            {results.filter((r) => r.ok).length} succeeded · {failures.length}{" "}
            failed
          </strong>
          {failures.length ? (
            <ul>
              {failures.map((r) => (
                <li key={r.id}>
                  <Link href={detailUrl(r.id)}>{r.id}</Link>: {r.error}
                </li>
              ))}
            </ul>
          ) : (
            <p>All selected tickets were updated.</p>
          )}
        </section>
      ) : null}
      {selected.length ? (
        <section className={styles.bulkBar} aria-label="Bulk actions">
          <strong>{selected.length} selected</strong>
          <label>
            <span className={styles.srOnly}>Bulk action</span>
            <select
              aria-label="Bulk action"
              value={actionKind}
              onChange={(e) => {
                setActionKind(e.target.value);
                setActionValue(
                  e.target.value === "assign"
                    ? "Daniel Cole"
                    : e.target.value === "team"
                      ? teams[0]
                      : e.target.value === "priority"
                        ? "2"
                        : "In progress",
                );
              }}
            >
              <option value="assign">Assign agent</option>
              <option value="team">Move to team</option>
              <option value="priority">Change priority</option>
              <option value="status">Change status</option>
            </select>
          </label>
          <label>
            <span className={styles.srOnly}>Bulk action value</span>
            <select
              aria-label="Bulk action value"
              value={actionValue}
              onChange={(e) => setActionValue(e.target.value)}
            >
              {(actionKind === "team"
                ? [...teams]
                : actionKind === "assign"
                  ? [
                      "Daniel Cole",
                      "Priya Shah",
                      "Rashid Khan",
                      "Maya Lee",
                      "unassigned",
                    ]
                  : actionKind === "priority"
                    ? ["1", "2", "3", "4"]
                    : ["Open", "In progress", "Pending requester"]
              ).map((value) => (
                <option key={value} value={value}>
                  {actionKind === "priority"
                    ? `P${value}`
                    : value === "unassigned"
                      ? "Unassigned"
                      : value}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className={styles.primary}
            disabled={isChanging}
            onClick={() => void bulkAction()}
          >
            {isChanging ? "Applying…" : "Apply to selected"}
          </button>
          <button
            type="button"
            aria-label="Clear selection"
            onClick={() => setSelection({ scope, items: [] })}
          >
            <Icon name="close" size={18} />
          </button>
        </section>
      ) : null}
      <section className={styles.tablePanel} aria-label="Ticket queue results">
        <div className={styles.scrollHint}>
          Scroll the table horizontally to see all ticket properties.
        </div>
        <div
          className={styles.tableScroll}
          tabIndex={0}
          role="region"
          aria-label="Scrollable ticket table"
        >
          <table className={styles.queueTable}>
            <caption className={styles.srOnly}>
              {viewLabels[f.view]}, {filtered.length} matching demo tickets
            </caption>
            <thead>
              <tr>
                <th scope="col">
                  <input
                    type="checkbox"
                    aria-label="Select all tickets on this page"
                    checked={allPageSelected}
                    ref={(node) => {
                      if (node) node.indeterminate = somePageSelected;
                    }}
                    onChange={(e) =>
                      setSelection({
                        scope,
                        items: e.target.checked
                          ? [
                              ...selected.filter(
                                (s) => !rows.some((t) => t.id === s.id),
                              ),
                              ...rows.map((t) => ({
                                id: t.id,
                                version: t.version,
                              })),
                            ]
                          : selected.filter(
                              (s) => !rows.some((t) => t.id === s.id),
                            ),
                      })
                    }
                  />
                </th>
                {(
                  [
                    ["id", "Ticket ID"],
                    ["priority", "Priority"],
                    ["subject", "Subject"],
                  ] as const
                ).map(([key, label]) => (
                  <th
                    scope="col"
                    key={key}
                    aria-sort={
                      f.sort === key
                        ? f.direction === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                  >
                    <button type="button" onClick={() => sort(key)}>
                      {label}
                      <span aria-hidden="true">
                        {f.sort === key
                          ? f.direction === "asc"
                            ? "↑"
                            : "↓"
                          : "↕"}
                      </span>
                    </button>
                  </th>
                ))}
                {optionalColumns
                  .filter((c) => columns.includes(c))
                  .map((column) => (
                    <th
                      key={column}
                      scope="col"
                      aria-sort={
                        column === "updated"
                          ? f.sort === "updated"
                            ? f.direction === "asc"
                              ? "ascending"
                              : "descending"
                            : "none"
                          : undefined
                      }
                    >
                      {column === "updated" ? (
                        <button type="button" onClick={() => sort("updated")}>
                          Updated{" "}
                          <span aria-hidden="true">
                            {f.sort === "updated"
                              ? f.direction === "asc"
                                ? "↑"
                                : "↓"
                              : "↕"}
                          </span>
                        </button>
                      ) : (
                        labels[column]
                      )}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((ticket) => {
                const failure = failures.find((r) => r.id === ticket.id);
                return (
                  <tr
                    key={ticket.id}
                    className={`${selected.some((s) => s.id === ticket.id) ? styles.selectedRow : ""} ${failure ? styles.failedRow : ""}`}
                  >
                    <td>
                      <input
                        type="checkbox"
                        aria-label={`Select ${ticket.id}`}
                        checked={selected.some((s) => s.id === ticket.id)}
                        onChange={(e) => selectTicket(ticket, e.target.checked)}
                      />
                    </td>
                    <th scope="row">
                      <Link
                        className={styles.ticketId}
                        href={detailUrl(ticket.id)}
                      >
                        {ticket.id}
                      </Link>
                    </th>
                    <td>
                      <span
                        className={`${styles.badge} ${styles[`priority${ticket.priority}`]}`}
                      >
                        P{ticket.priority}{" "}
                        {
                          ["Critical", "High", "Medium", "Low"][
                            ticket.priority - 1
                          ]
                        }
                      </span>
                    </td>
                    <td className={styles.subjectCell}>
                      <Link href={detailUrl(ticket.id)}>{ticket.subject}</Link>
                      <Link
                        href={`${scope}${scope.includes("?") ? "&" : "?"}preview=${ticket.id}`}
                        aria-label={`Preview ${ticket.id}`}
                      >
                        Quick Preview →
                      </Link>
                      <small>
                        {ticket.service}
                        {ticket.attachments.length
                          ? ` · ${ticket.attachments.length} attachment(s)`
                          : ""}
                      </small>
                      {failure ? (
                        <p className={styles.rowError}>{failure.error}</p>
                      ) : null}
                    </td>
                    {columns.includes("requester") ? (
                      <td>
                        {ticket.requester}
                        <small>{ticket.department}</small>
                      </td>
                    ) : null}
                    {columns.includes("team") ? (
                      <td>
                        {ticket.team}
                        <small>{ticket.assignee ?? "Unassigned"}</small>
                      </td>
                    ) : null}
                    {columns.includes("status") ? (
                      <td>
                        <span
                          className={`${styles.status} ${ticket.status === "Resolved" ? styles.resolved : ""}`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                    ) : null}
                    {columns.includes("sla") ? (
                      <td>
                        <span
                          className={
                            ticket.sla === "Breached" ? styles.dangerText : ""
                          }
                        >
                          {ticket.status === "Resolved"
                            ? "Completed"
                            : ticket.status === "Pending requester"
                              ? "Paused · requester"
                              : ticket.sla}
                        </span>
                        <small>Simulated resolution target</small>
                      </td>
                    ) : null}
                    {columns.includes("updated") ? (
                      <td>
                        {ticket.updatedMinutes
                          ? `${ticket.updatedMinutes}m ago`
                          : "Just now"}
                      </td>
                    ) : null}
                  </tr>
                );
              })}
              {!rows.length ? (
                <tr>
                  <td colSpan={4 + columns.length} className={styles.empty}>
                    {isLoading
                      ? "Loading demo tickets…"
                      : isError
                        ? "Could not load tickets. Use Refresh to retry."
                        : "No tickets match this view. Adjust the filters or clear them to see more work."}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className={styles.pagination}>
          <span role="status">
            {filtered.length
              ? `${(page - 1) * f.size + 1}–${Math.min(page * f.size, filtered.length)} of ${filtered.length}`
              : "0 tickets"}
          </span>
          <label>
            Rows per page
            <select
              aria-label="Rows per page"
              value={f.size}
              onChange={(e) => update({ size: Number(e.target.value) })}
            >
              {[10, 25, 50].map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>
          </label>
          <div>
            <button
              type="button"
              disabled={page === 1}
              onClick={() => update({ page: page - 1 })}
            >
              Previous
            </button>
            <span>
              Page {page} of {pages}
            </span>
            <button
              type="button"
              disabled={page === pages}
              onClick={() => update({ page: page + 1 })}
            >
              Next
            </button>
          </div>
        </div>
      </section>
      <p className={styles.footnote}>
        Selections clear when the view, filters, sort or page changes. Changes
        and personal saved views last for this browser session; reloading resets
        the demo.
      </p>
      <dialog
        ref={viewDialog}
        className={styles.dialog}
        aria-labelledby="save-view-title"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const name = viewName.trim();
            if (
              !name ||
              savedViews.some(
                (v) => v.name.toLowerCase() === name.toLowerCase(),
              )
            ) {
              setViewError("Enter a unique view name.");
              return;
            }
            dispatch(
              viewSaved({
                id: crypto.randomUUID(),
                name,
                filters: { ...f, page: 1 },
                columns,
              }),
            );
            viewDialog.current?.close();
            setNotice(`Saved personal view: ${name}`);
          }}
        >
          <h2 id="save-view-title">Save personal view</h2>
          <p>Save these filters, columns and sort for this session.</p>
          <label>
            View name
            <input
              autoFocus
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
              maxLength={50}
              required
            />
          </label>
          {viewError ? (
            <p role="alert" className={styles.rowError}>
              {viewError}
            </p>
          ) : null}
          <div className={styles.actions}>
            <button type="button" onClick={() => viewDialog.current?.close()}>
              Cancel
            </button>
            <button className={styles.primary} type="submit">
              Save view
            </button>
          </div>
        </form>
      </dialog>
      <dialog
        ref={columnDialog}
        className={styles.dialog}
        aria-labelledby="columns-title"
      >
        <h2 id="columns-title">Table columns</h2>
        <p>Ticket ID, priority and subject are always visible.</p>
        {optionalColumns.map((column) => (
          <label key={column} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={columns.includes(column)}
              onChange={(e) =>
                setColumns(
                  e.target.checked
                    ? [...columns, column]
                    : columns.filter((c) => c !== column),
                )
              }
            />
            {labels[column]}
          </label>
        ))}
        <button
          type="button"
          className={styles.primary}
          onClick={() => columnDialog.current?.close()}
        >
          Done
        </button>
      </dialog>
      <TriagePreview tickets={data} />
    </WorkspaceShell>
  );
}
