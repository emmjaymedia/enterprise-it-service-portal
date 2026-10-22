"use client";
import Link from "next/link";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useGetDashboardDemoQuery } from "@/features/dashboard/dashboard-data";
import { articles } from "@/features/portal/portal-data";
import { rememberSearch, clearSearches } from "./shared-slice";
import s from "./shared.module.scss";
export default function GlobalSearch({
  initialQuery,
}: {
  initialQuery: string;
}) {
  const dispatch = useAppDispatch();
  const context = useAppSelector((state) => state.shared.context);
  const own = useAppSelector((state) => state.portal.tickets);
  const recent = useAppSelector((state) => state.shared.recent[context]);
  const { data } = useGetDashboardDemoQuery(undefined, {
    skip: context !== "agent",
  });
  const [query, setQuery] = useState(initialQuery);
  const [term, setTerm] = useState(initialQuery);
  const [type, setType] = useState("All");
  const [unavailable, setUnavailable] = useState(false);
  const ticketRecords = (context === "employee" ? own : (data ?? [])).map(
    (t) => ({
      id: t.id,
      title: t.subject,
      type: "Tickets",
      snippet: `${t.status} · ${t.service}`,
      href: `${context === "employee" ? "/portal" : "/workspace"}/tickets/${encodeURIComponent(t.id)}`,
    }),
  );
  const records = [
    ...ticketRecords,
    ...articles.map((a, i) => ({
      id: `KB-${4029 + i}`,
      title: a.title,
      type: "Articles",
      snippet: a.text,
      href: "/portal/knowledge",
    })),
    {
      id: "ASSET-MBP-9812",
      title:
        context === "employee"
          ? "My MacBook Pro 16″"
          : "Assigned workstation · MacBook Pro",
      type: "Assets",
      snippet: "Assigned demo device · macOS Sonoma",
      href: "/portal#my-tickets",
    },
    {
      id: "SERVICE-VPN",
      title: "Corporate VPN",
      type: "Services",
      snippet: "Remote access help and troubleshooting",
      href: "/portal/knowledge",
    },
    {
      id: context === "employee" ? "ME-AY" : "ME-DC",
      title: context === "employee" ? "Amina Yusuf" : "Daniel Cole",
      type: "People",
      snippet: "Your own directory profile",
      href: "/profile",
    },
  ];
  const matches = term.trim()
    ? records.filter((r) =>
        `${r.id} ${r.title} ${r.snippet}`
          .toLowerCase()
          .includes(term.trim().toLowerCase()),
      )
    : [];
  const results = matches.filter((r) => type === "All" || r.type === type);
  const groups = ["Tickets", "Articles", "Assets", "Services", "People"];
  function search(value: string) {
    setQuery(value);
    setTerm(value);
    dispatch(rememberSearch({ context, query: value }));
  }
  return (
    <div className={s.sharedPage}>
      <div className={s.pageHeading}>
        <div>
          <span className={s.eyebrow}>
            GLOBAL SEARCH · {context === "employee" ? "EMPLOYEE" : "SUPPORT"}{" "}
            PREVIEW
          </span>
          <h1>Find what you need</h1>
          <p>
            Search visible tickets, help articles, your profile, assigned assets
            and services.
          </p>
        </div>
      </div>
      <form
        className={s.searchBox}
        onSubmit={(e) => {
          e.preventDefault();
          search(query);
        }}
      >
        <label className={s.srOnly} htmlFor="global-query">
          Search all records
        </label>
        <input
          id="global-query"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tickets, articles, assets, services…"
        />
        <button className={s.primary}>Search</button>
      </form>
      <div className={s.segment}>
        {["All", ...groups].map((t) => (
          <button key={t} aria-pressed={type === t} onClick={() => setType(t)}>
            {t} ({matches.filter((r) => t === "All" || r.type === t).length})
          </button>
        ))}
      </div>
      <div className={s.contentColumns}>
        <section>
          {unavailable ? (
            <div className={s.card}>
              <h2>Search is unavailable</h2>
              <p>Your query is preserved. Try again.</p>
              <button onClick={() => setUnavailable(false)}>
                Retry search
              </button>
            </div>
          ) : !term.trim() ? (
            <div className={s.empty}>
              <h2>Start with a keyword</h2>
              <p>Try “VPN”, “MFA”, a ticket number or your own name.</p>
            </div>
          ) : !results.length ? (
            <div className={s.empty}>
              <h2>No results for “{term}”</h2>
              <p>Try a shorter phrase or a different record type.</p>
              <button
                onClick={() => {
                  setType("All");
                  search("");
                }}
              >
                Clear search
              </button>
            </div>
          ) : (
            <>
              <p role="status" className={s.hint}>
                {results.length} matching visible records
              </p>
              {groups
                .filter((g) => results.some((r) => r.type === g))
                .map((g) => (
                  <section key={g} className={s.searchGroup}>
                    <h2>{g}</h2>
                    {results
                      .filter((r) => r.type === g)
                      .map((r) => (
                        <article key={r.id} className={s.card}>
                          <span className={s.badge}>{r.id}</span>
                          <h3>{r.title}</h3>
                          <p>{r.snippet}</p>
                          <Link className={s.textLink} href={r.href}>
                            Open {g === "Tickets" ? "ticket" : "result"} →
                          </Link>
                        </article>
                      ))}
                  </section>
                ))}
            </>
          )}
        </section>
        <aside>
          <section className={s.info}>
            <h2>Scope of this preview</h2>
            <p>
              {context === "employee"
                ? "Only your employee records and public self-help content are included."
                : "Support ticket metadata comes from the existing workspace mock query."}{" "}
              Internal messages are never indexed or shown in snippets. Scope is
              a frontend simulation, not authorization.
            </p>
          </section>
          <section className={s.card}>
            <h2>Recent Searches</h2>
            {recent.length ? (
              recent.map((q) => (
                <button className={s.recent} key={q} onClick={() => search(q)}>
                  {q} →
                </button>
              ))
            ) : (
              <p>No recent searches this visit.</p>
            )}
            <button
              disabled={!recent.length}
              onClick={() => dispatch(clearSearches(context))}
            >
              Clear history
            </button>
          </section>
          <label className={s.demoControl}>
            <input
              type="checkbox"
              checked={unavailable}
              onChange={(e) => setUnavailable(e.target.checked)}
            />
            Simulate search unavailable
          </label>
        </aside>
      </div>
    </div>
  );
}
