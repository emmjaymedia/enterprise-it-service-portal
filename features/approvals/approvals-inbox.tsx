"use client";
import Link from "next/link";
import { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import s from "./approvals.module.scss";
export default function ApprovalsInbox({
  basePath = "/portal/approvals",
}: {
  basePath?: string;
}) {
  const records = useAppSelector((state) => state.approvals.records);
  const [tab, setTab] = useState("Pending");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [age, setAge] = useState("All");
  const pending = records.filter((r) => r.status === "Pending").length;
  const rows = records.filter(
    (r) =>
      (tab === "Pending" ? r.status === "Pending" : r.status !== "Pending") &&
      (category === "All" || r.category === category) &&
      (age === "All" || r.age >= Number(age)) &&
      `${r.id} ${r.title} ${r.requester} ${r.service}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <div className={s.page}>
      <header>
        <small>GOVERNANCE & ITSM / ACCESS AUTHORIZATION</small>
        <h1>Approvals Inbox</h1>
        <p>
          Review service requests and access entitlements requiring your
          authorization.
        </p>
      </header>
      <aside className={s.notice}>
        <strong>Individual review required</strong>
        <p>
          Self-approval is blocked. Access requests may need further approval
          before fulfillment.
        </p>
        <small>
          Frontend demo · Records and decisions reset on reload · No
          provisioning or audit integration
        </small>
      </aside>
      <div className={s.tabs} aria-label="Approval views">
        {["Pending", "Completed"].map((t) => (
          <button key={t} aria-pressed={tab === t} onClick={() => setTab(t)}>
            {t === "Pending" ? "Pending Approvals" : "Completed History"}{" "}
            <span>{t === "Pending" ? pending : records.length - pending}</span>
          </button>
        ))}
      </div>
      <div className={s.filters}>
        <label>
          Search requests
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ID, requester, or service…"
          />
        </label>
        <label>
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All categories</option>
            {["Access entitlement", "Hardware & assets", "Cloud resources"].map(
              (c) => (
                <option key={c}>{c}</option>
              ),
            )}
          </select>
        </label>
        <label>
          Request age
          <select value={age} onChange={(e) => setAge(e.target.value)}>
            <option value="All">Any age</option>
            <option value="1">At least 1 day</option>
            <option value="7">At least 7 days</option>
          </select>
        </label>
        <button
          onClick={() => {
            setQuery("");
            setCategory("All");
            setAge("All");
          }}
        >
          Clear filters
        </button>
      </div>
      <p role="status">
        {rows.length} {tab.toLowerCase()} authorizations · Dates in UTC; ages
        use 22 Oct 2026 demo date
      </p>
      {rows.map((r) => (
        <article className={s.request} key={r.id}>
          <div className={s.row}>
            <div>
              <div className={s.badges}>
                <span>{r.id}</span>
                <span>{r.category}</span>
                <span>{r.status}</span>
              </div>
              <h2>{r.title}</h2>
              <p>
                {r.service} · {r.cost}
              </p>
            </div>
            <div className={s.person}>
              <strong>{r.requester}</strong>
              <small>Requester · {r.age} days ago</small>
            </div>
          </div>
          <div className={s.workflow}>
            <strong>1 · Department manager review</strong>
            <span>→</span>
            <span>
              2 ·{" "}
              {r.category === "Hardware & assets"
                ? "Procurement review"
                : "System owner review"}
            </span>
          </div>
          <div className={s.row}>
            <p>Due {r.due}</p>
            <Link className={s.primary} href={`${basePath}/${r.id}`}>
              {r.status === "Pending" ? "Review Decision →" : "View Decision →"}
            </Link>
          </div>
        </article>
      ))}
      {!rows.length && (
        <section className={s.card}>
          <h2>No {tab.toLowerCase()} approvals match</h2>
          <p>Try another view or clear your filters.</p>
        </section>
      )}
    </div>
  );
}
