"use client";
import Link from "next/link";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { markRead, clearRead, identities } from "./shared-slice";
import s from "./shared.module.scss";
export default function Notifications() {
  const dispatch = useAppDispatch();
  const context = useAppSelector((state) => state.shared.context);
  const notices = useAppSelector((state) => state.shared.notices).filter(
    (n) => n.context === context,
  );
  const [tab, setTab] = useState("All");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const filtered = notices.filter(
    (n) =>
      (tab === "All" || !n.read) &&
      (category === "All" || n.category === category),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 3));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * 3, current * 3);
  const visibleSelected = selected.filter((id) =>
    rows.some((n) => n.id === id),
  );
  function read(ids: string[]) {
    dispatch(markRead({ context, ids }));
    setSelected([]);
    setMessage(
      `${ids.length} notification(s) marked read. Delivery preferences do not change read state.`,
    );
  }
  return (
    <div className={s.sharedPage}>
      <div className={s.pageHeading}>
        <div>
          <span className={s.eyebrow}>
            TRIAGE & FEED · {identities[context].name}
          </span>
          <h1>
            Notifications Center{" "}
            <span className={s.badge}>
              {notices.filter((n) => !n.read).length} unread
            </span>
          </h1>
          <p>
            Your ticket updates and service notices. Demo events, not live
            delivery.
          </p>
        </div>
        <div className={s.row}>
          <button
            onClick={() =>
              read(notices.filter((n) => !n.read).map((n) => n.id))
            }
          >
            Mark all as read
          </button>
          <Link href="/profile#notification-preferences">Preferences →</Link>
        </div>
      </div>
      <div className={s.contentColumns}>
        <section>
          <div className={s.toolbar}>
            <div className={s.segment} aria-label="Notification filters">
              {["All", "Unread"].map((t) => (
                <button
                  aria-pressed={tab === t}
                  key={t}
                  onClick={() => {
                    setTab(t);
                    setPage(1);
                    setSelected([]);
                  }}
                >
                  {t}{" "}
                  {t === "All"
                    ? notices.length
                    : notices.filter((n) => !n.read).length}
                </button>
              ))}
            </div>
            <label>
              Category
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                  setSelected([]);
                }}
              >
                {["All", "Ticket updates", "System", "Knowledge"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>
          <div className={s.bulk}>
            <label className={s.check}>
              <input
                type="checkbox"
                aria-label="Select all notifications in view"
                checked={
                  rows.length > 0 && rows.every((n) => selected.includes(n.id))
                }
                disabled={!rows.length}
                onChange={(e) =>
                  setSelected(e.target.checked ? rows.map((n) => n.id) : [])
                }
              />
              Select all in view
            </label>
            <span>{visibleSelected.length} selected</span>
            <button
              disabled={!visibleSelected.length}
              onClick={() => read(visibleSelected)}
            >
              Mark selected read
            </button>
            <button
              disabled={!notices.some((n) => n.read)}
              onClick={() => {
                dispatch(clearRead(context));
                setSelected([]);
                setMessage(
                  "Read notifications cleared. Ticket records are unchanged.",
                );
              }}
            >
              Clear read
            </button>
          </div>
          <p role="status" className={s.hint}>
            {message}
          </p>
          {rows.map((n) => (
            <article
              key={n.id}
              className={`${s.card} ${s.notice} ${!n.read ? s.unread : ""}`}
            >
              <div className={s.noticeTop}>
                <input
                  type="checkbox"
                  aria-label={`Select ${n.title}`}
                  checked={selected.includes(n.id)}
                  onChange={(e) =>
                    setSelected((old) =>
                      e.target.checked
                        ? [...old, n.id]
                        : old.filter((id) => id !== n.id),
                    )
                  }
                />
                <span className={s.badge}>{n.category}</span>
                <time dateTime={n.at}>
                  {new Date(n.at).toLocaleString("en-GB", { timeZone: "UTC" })}{" "}
                  UTC
                </time>
              </div>
              <h2>{n.title}</h2>
              <p>{n.body}</p>
              <div className={s.row}>
                {n.href ? (
                  <Link
                    className={s.textLink}
                    href={n.href}
                    onClick={() => read([n.id])}
                  >
                    Open related record →
                  </Link>
                ) : (
                  <span className={s.hint}>
                    Related item unavailable. It may have been removed or access
                    changed.
                  </span>
                )}
                <button onClick={() => read([n.id])} disabled={n.read}>
                  {n.read ? "✓ Read" : "Mark read"}
                </button>
              </div>
            </article>
          ))}
          {!rows.length && (
            <div className={s.empty}>
              <h2>
                {tab === "Unread" ? "You’re all caught up" : "No notifications"}
              </h2>
              <p>There are no matching notifications in this demo view.</p>
              <button
                onClick={() => {
                  setTab("All");
                  setCategory("All");
                }}
              >
                Show all
              </button>
            </div>
          )}
          <div className={s.pagination}>
            <span>
              {filtered.length} matching notifications · Page {current} of{" "}
              {pages}
            </span>
            <button
              disabled={current === 1}
              onClick={() => {
                setPage(current - 1);
                setSelected([]);
              }}
            >
              Previous
            </button>
            <button
              disabled={current >= pages}
              onClick={() => {
                setPage(current + 1);
                setSelected([]);
              }}
            >
              Next
            </button>
          </div>
        </section>
        <aside>
          <section className={s.card}>
            <h2>Delivery Channels</h2>
            <p>In-app notifications · Frontend demo</p>
            <p>Work email · Not connected</p>
            <p>
              Read state is independent of delivery settings. Mandatory security
              notices remain enabled.
            </p>
            <Link href="/profile#notification-preferences">
              Edit preferences →
            </Link>
          </section>
          <section className={s.info}>
            <h2>Need help?</h2>
            <p>IT Help Desk: ext. 4357</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
