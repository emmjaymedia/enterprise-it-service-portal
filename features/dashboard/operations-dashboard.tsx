"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import WorkspaceShell from "@/components/workspace/workspace-shell";
import Icon, { type IconName } from "@/components/workspace/icon";
import { matchesQueue, teams, trend, useGetDashboardDemoQuery, type DemoTicket, type QueueFilter } from "./dashboard-data";
import styles from "./operations-dashboard.module.scss";

type WorklistFilter = QueueFilter | "risk";
const filterLabels: Record<WorklistFilter, string> = { all: "All open tickets", risk: "At-risk & high priority", unassigned: "Unassigned tickets", due: "Approaching SLA", breached: "Breached SLA" };

function MetricCard({ label, count, icon, tone, description, detail, onClick }: { label: string; count: number | string; icon: IconName; tone: "blue" | "orange" | "red"; description: string; detail: string; onClick: () => void }) {
  return <button type="button" className={`${styles.metric} ${styles[tone]}`} onClick={onClick}>
    <span className={styles.metricTop}>{label}<span className={styles.metricIcon}><Icon name={icon} /></span></span>
    <span className={styles.metricValue}>{count}<span className={styles.metricDetail}>{detail}</span></span>
    <span className={styles.metricDescription}><span className={styles.dot} />{description}</span>
    <span className={styles.metricArrow}><Icon name="chevron" size={14} /></span>
  </button>;
}

function InflowChart({ team, period }: { team: string; period: string }) {
  const factor = team === "All teams" ? 1 : (teams.indexOf(team as (typeof teams)[number]) + 2) / 10;
  const series = (period === "today" ? trend.slice(-1) : trend).map((d) => ({ ...d, created: Math.round(d.created * factor), resolved: Math.round(d.resolved * factor) }));
  const created = series.reduce((sum, d) => sum + d.created, 0);
  const resolved = series.reduce((sum, d) => sum + d.resolved, 0);
  return <section className={`${styles.panel} ${styles.trend}`} aria-labelledby="trend-title">
    <div className={styles.panelHeading}><div><h2 id="trend-title">Ticket Inflow vs. Resolution <span className={styles.tag}>{period === "today" ? "Oct 18" : "Week 42"}</span></h2><p>Created tickets and resolution cycles · Simulated history</p></div><div className={styles.legend}><span><i />Created <strong>{created}</strong></span><span><i />Resolved <strong>{resolved}</strong></span></div></div>
    <div className={styles.plot}>
      <div className={styles.yLabels} aria-hidden="true"><span>30</span><span>20</span><span>10</span><span>0</span></div>
      <div className={styles.bars} role="img" aria-label={`Mock trend: ${created} created tickets and ${resolved} resolution cycles. ${series.map((d) => `${d.day}: ${d.created} created, ${d.resolved} resolved`).join("; ")}`}>
        {series.map((day) => <div className={styles.barGroup} key={day.day}><div className={styles.barPair}><span title={`${day.created} created`} style={{ height: `${day.created / 30 * 100}%` }} /><span title={`${day.resolved} resolution cycles`} style={{ height: `${day.resolved / 30 * 100}%` }} /></div><span className={day.day === "Sun" ? styles.today : ""}>{day.day}{day.day === "Sun" ? " 18" : ""}</span></div>)}
      </div>
    </div>
    <div className={styles.slaMetrics}><div><span className={styles.ring}>94%</span><span><strong>94.2% First response SLA</strong><small>Target ≥ 95% · Illustrative completed cycles</small></span></div><div><span className={styles.ring}>92%</span><span><strong>91.8% Resolution SLA</strong><small>Target ≥ 90% · Illustrative completed cycles</small></span></div></div>
  </section>;
}

export default function OperationsDashboard() {
  const [team, setTeam] = useState("All teams");
  const [period, setPeriod] = useState("week");
  const [search, setSearch] = useState("");
  const [queue, setQueue] = useState<WorklistFilter>("risk");
  const [page, setPage] = useState(0);
  const [updated, setUpdated] = useState("Initial snapshot");
  const [selected, setSelected] = useState<DemoTicket | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const { data = [], isLoading, isError, isFetching, refetch } = useGetDashboardDemoQuery();
  const scoped = data.filter((t) => (team === "All teams" || t.team === team) && (period === "week" || t.age === 0));
  const visible = scoped.filter((t) => (queue === "risk" ? t.priority <= 2 || t.sla !== "On track" : matchesQueue(t, queue)) && `${t.id} ${t.subject} ${t.requester}`.toLowerCase().includes(search.toLowerCase().trim()));
  const pages = Math.max(1, Math.ceil(visible.length / 5));
  const currentPage = Math.min(page, pages - 1);
  const rows = visible.slice(currentPage * 5, (currentPage + 1) * 5);
  const incident = scoped.find((t) => t.id === "INC-1044");
  const priorityCounts = [1, 2, 3, 4].map((p) => scoped.filter((t) => t.priority === p).length);
  const goToQueue = (value: WorklistFilter) => { setQueue(value); setPage(0); document.getElementById("worklist")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" }); };
  const openPreview = (ticket: DemoTicket) => { setSelected(ticket); dialog.current?.showModal(); };
  const metricValue = (count: number) => isLoading ? "—" : isError ? "Unavailable" : count;

  return <WorkspaceShell search={search} onSearch={(value) => { setSearch(value); setPage(0); }}>
    <div className={styles.heading}>
      <div><p className={styles.breadcrumb}>WORKSPACE <span>/</span> <b>Overview</b></p><h1>Operations Dashboard</h1><p className={styles.subtitle}>Your service desk at a glance. Stay ahead of what needs attention.</p></div>
      <div className={styles.filters}>
        <label><Icon name="team" size={17} /><span className={styles.srOnly}>Team scope</span><select value={team} onChange={(e) => { setTeam(e.target.value); setPage(0); }}><option>All teams</option>{teams.map((name) => <option key={name}>{name}</option>)}</select></label>
        <label><Icon name="calendar" size={17} /><span className={styles.srOnly}>Date range</span><select value={period} onChange={(e) => { setPeriod(e.target.value); setPage(0); }}><option value="week">Oct 12–18, 2026</option><option value="today">Today · Oct 18, 2026</option></select></label>
        <button type="button" className={styles.refresh} disabled={isFetching} onClick={async () => { const result = await refetch(); setUpdated(result.error ? "Refresh failed" : `Updated ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`); }}><Icon name="refresh" size={16} />{isFetching ? "Refreshing…" : "Refresh"}</button>
      </div>
    </div>
    <div className={styles.scope}><span><span className={styles.demoLabel}>DEMO DATA</span> Fictional organization · {team} · {period === "week" ? "Oct 12–18, 2026" : "Oct 18, 2026"} · UTC</span><span role="status">{updated}</span></div>
    {isError ? <div role="alert" className={styles.error}>Dashboard data could not be loaded. Use Refresh to try again.</div> : null}
    <section className={styles.metrics} aria-label="Service desk metrics" aria-busy={isLoading}>
      <MetricCard label="OPEN TICKETS" count={metricValue(scoped.length)} icon="ticket" tone="blue" detail="Active queue" description="Open and in-progress demo tickets" onClick={() => goToQueue("all")} />
      <MetricCard label="UNASSIGNED" count={metricValue(scoped.filter((t) => !t.assignee).length)} icon="team" tone="orange" detail="Needs an owner" description="Active tickets without an assignee" onClick={() => goToQueue("unassigned")} />
      <MetricCard label="APPROACHING SLA" count={metricValue(scoped.filter((t) => t.sla === "Due soon").length)} icon="clock" tone="blue" detail="Due soon" description="Resolution target ≥ 75% elapsed" onClick={() => goToQueue("due")} />
      <MetricCard label="BREACHED SLA" count={metricValue(scoped.filter((t) => t.sla === "Breached").length)} icon="alert" tone="red" detail="Needs attention" description="Resolution target exceeded" onClick={() => goToQueue("breached")} />
    </section>
    <div className={styles.dashboardGrid}>
      <InflowChart team={team} period={period} />
      <div className={styles.sideWidgets}>
        <section id="incident" className={incident ? styles.incident : `${styles.panel} ${styles.noIncident}`} aria-label="Major incident alert">
          {incident ? <><div className={styles.incidentTop}><span><span className={styles.dot} />MAJOR INCIDENT ACTIVE</span><b>Severity 1</b></div><h2>INC-1044: Global Payroll Portal Outage</h2><p>Sign-on failures affecting EU &amp; US payroll cycles. Network Operations is investigating.</p><div className={styles.incidentBottom}><span className={styles.avatars}><i>DC</i><i>PS</i><i>RK</i></span><span>3 agents coordinating</span><button type="button" onClick={() => openPreview(incident)}>View incident <Icon name="chevron" size={14} /></button></div></> : <><Icon name="check" /><h2>No major incidents in this scope</h2><p>Select All teams to see the organization demo alert.</p></>}
        </section>
        <section className={`${styles.panel} ${styles.priority}`} aria-labelledby="priority-title"><h2 id="priority-title">Priority Distribution</h2><p>{scoped.length} active demo tickets in selected scope</p><div className={styles.priorityBar} role="img" aria-label={priorityCounts.map((n, i) => `P${i + 1}: ${n}`).join(", ")}>{priorityCounts.map((count, i) => <span className={styles[`p${i + 1}`]} key={i} style={{ flex: count }} />)}</div><div className={styles.priorityLabels}>{["Critical", "High", "Medium", "Low"].map((label, i) => <div key={label}><i className={styles[`p${i + 1}`]} /><span>P{i + 1} {label}</span><strong>{priorityCounts[i]}</strong></div>)}</div></section>
      </div>
      <section id="worklist" className={`${styles.panel} ${styles.worklist}`} aria-labelledby="worklist-title">
        <div className={styles.worklistHeading}><div><span className={styles.riskIcon}><Icon name="alert" size={18} /></span><h2 id="worklist-title">{filterLabels[queue]}<small>Prioritize the work that matters most</small></h2></div><label><span className={styles.srOnly}>Worklist view</span><select value={queue} onChange={(e) => { setQueue(e.target.value as WorklistFilter); setPage(0); }}>{Object.entries(filterLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div>
        <div className={styles.tableScroll} role="region" aria-label="Dashboard worklist" tabIndex={0}><table><caption className={styles.srOnly}>Fictional tickets, {filterLabels[queue]}, {team}. Search: {search || "none"}.</caption><thead><tr><th scope="col">TICKET ID</th><th scope="col">PRIORITY</th><th scope="col">SUBJECT</th><th scope="col">REQUESTER</th><th scope="col">SLA</th></tr></thead><tbody>{rows.map((ticket) => <tr key={ticket.id}><th scope="row"><button type="button" className={styles.ticketLink} onClick={() => openPreview(ticket)}>{ticket.id}</button></th><td><span className={`${styles.badge} ${styles[`priority${ticket.priority}`]}`}>P{ticket.priority} {["Critical", "High", "Medium", "Low"][ticket.priority - 1]}</span></td><td><button type="button" className={styles.subject} onClick={() => openPreview(ticket)}>{ticket.subject}</button><small>{ticket.service}</small></td><td>{ticket.requester}<small>{ticket.department}</small></td><td><span className={`${styles.sla} ${ticket.sla === "Breached" ? styles.overdue : ""}`}>{ticket.sla}</span></td></tr>)}{!rows.length ? <tr><td colSpan={5} className={styles.empty} role="status">{isLoading ? "Loading demo tickets…" : isError ? "Demo tickets unavailable. Try Refresh." : "No tickets match this view. Try another team, view or search."}</td></tr> : null}</tbody></table></div>
        <div className={styles.tableFooter}><span role="status">{visible.length ? `${currentPage * 5 + 1}–${Math.min((currentPage + 1) * 5, visible.length)} of ${visible.length} tickets` : "0 tickets"}{search ? ` matching “${search}”` : ""}</span><div><button type="button" aria-label="Previous worklist page" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>←</button><span>{currentPage + 1} / {pages}</span><button type="button" aria-label="Next worklist page" disabled={currentPage + 1 >= pages} onClick={() => setPage(currentPage + 1)}>→</button></div></div>
      </section>
      <section id="team-capacity" className={`${styles.panel} ${styles.capacity}`} aria-labelledby="capacity-title"><div className={styles.panelHeading}><div><h2 id="capacity-title">Team Capacity &amp; Queue Load</h2><p>Active assignments in the selected scope</p></div><Icon name="team" size={18} /></div>{teams.filter((name) => team === "All teams" || team === name).map((name, i) => { const records = scoped.filter((t) => t.team === name); const unassigned = records.filter((t) => !t.assignee).length; return <button className={styles.teamCard} key={name} type="button" onClick={() => { setTeam(name); setPage(0); }} aria-label={`Filter dashboard to ${name}`}><span className={styles.teamTop}><Icon name={(["team", "box", "grid", "settings"] as const)[i % 4]} size={17} /><strong>{name}</strong><b>{records.length} active</b></span><span className={styles.teamMeta}>{unassigned} unassigned<span>{records.filter((t) => t.priority <= 2).length} high priority</span></span><span className={styles.capacityTrack}><span style={{ width: `${Math.min(100, records.length / 12 * 100)}%` }} /></span></button>; })}<p className={styles.capacityNote}>Illustrative capacity: 12 active tickets per team.</p></section>
    </div>
    <footer className={styles.footer}><span><span className={styles.dot} />All dashboard records are fictional. Filters reset on page reload.</span><Link href="/tickets">Open existing ticket workspace <Icon name="chevron" size={13} /></Link></footer>
    <dialog ref={dialog} className={styles.dialog} onClose={() => setSelected(null)} aria-labelledby="preview-title">
      <div className={styles.dialogHeader}><span className={styles.demoLabel}>DEMO TICKET PREVIEW</span><button type="button" aria-label="Close ticket preview" onClick={() => dialog.current?.close()}><Icon name="close" /></button></div>
      {selected ? <><p className={styles.previewId}>{selected.id} · {selected.status}</p><h2 id="preview-title">{selected.subject}</h2><dl><div><dt>Requester</dt><dd>{selected.requester}</dd></div><div><dt>Team</dt><dd>{selected.team}</dd></div><div><dt>Assignee</dt><dd>{selected.assignee ?? "Unassigned"}</dd></div><div><dt>Resolution SLA</dt><dd>{selected.sla}</dd></div><div><dt>Priority</dt><dd>P{selected.priority}</dd></div><div><dt>Service</dt><dd>{selected.service}</dd></div></dl><p className={styles.previewNote}>This is a frontend preview of the supplied design. Use the existing ticket workspace to create, assign and resolve tickets.</p><Link href="/tickets" className={styles.previewAction}>Open ticket workspace <Icon name="chevron" size={16} /></Link></> : null}
    </dialog>
  </WorkspaceShell>;
}
