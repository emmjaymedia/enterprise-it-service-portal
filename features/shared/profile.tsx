"use client";
import Link from "next/link";
import { useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  defaultPreferences,
  identities,
  revokeSession,
  savePreferences,
  setSession,
} from "./shared-slice";
import s from "./shared.module.scss";
export default function Profile() {
  const dispatch = useAppDispatch();
  const context = useAppSelector((state) => state.shared.context);
  const saved = useAppSelector((state) => state.shared.preferences[context]);
  const revoked = useAppSelector((state) => state.shared.revoked);
  const identity = identities[context];
  const [form, setForm] = useState(saved);
  const [failure, setFailure] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [revoke, setRevoke] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const lock = useRef(false);
  const dirty = JSON.stringify(saved) !== JSON.stringify(form);
  async function save() {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setMessage("Saving…");
    await new Promise((r) => setTimeout(r, 400));
    if (failure)
      setMessage(
        "Save failed in demo mode. Your changes are preserved; turn off simulated failure and retry.",
      );
    else {
      dispatch(savePreferences({ context, value: form }));
      setMessage(
        "Preferences saved for this demo visit. Existing ticket screens continue to display UTC timestamps.",
      );
    }
    setBusy(false);
    lock.current = false;
  }
  function close() {
    dialog.current?.close();
    opener.current?.focus();
  }
  return (
    <div className={s.sharedPage}>
      <div className={s.pageHeading}>
        <div>
          <span className={s.eyebrow}>ENTERPRISE PORTAL / USER SETTINGS</span>
          <h1>Account & User Preferences</h1>
          <p>
            {identity.name} · {identity.role}
          </p>
        </div>
        <span className={s.badge}>Directory-managed identity · Demo</span>
      </div>
      <div className={s.profileColumns}>
        <nav className={s.sectionNav} aria-label="Profile sections">
          <a href="#identity">General Profile →</a>
          <a href="#regional">Language & Timezone</a>
          <a href="#notification-preferences">Notification Channels</a>
          <a href="#sessions">Sessions & Security</a>
        </nav>
        <div>
          <section id="identity" className={s.card}>
            <span className={s.eyebrow}>SECTION 1 · IDENTITY</span>
            <h2>Enterprise Identity Summary</h2>
            <div className={s.info}>
              <strong>Directory-Managed Attributes</strong>
              <p>
                Name, role, department and email are read-only. Contact HR or IT
                Support to request a correction.
              </p>
            </div>
            <div className={s.identitySummary}>
              <span className={s.largeAvatar}>{identity.initials}</span>
              <div>
                <h2>{identity.name}</h2>
                <p>
                  {identity.role} · {identity.department}
                </p>
                <p>{identity.email}</p>
              </div>
            </div>
            <dl className={s.directory}>
              <div>
                <dt>Department</dt>
                <dd>{identity.department}</dd>
              </div>
              <div>
                <dt>Identity provider</dt>
                <dd>Organization directory · Mock</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>London HQ</dd>
              </div>
              <div>
                <dt>Employment status</dt>
                <dd>Active · Demo identity</dd>
              </div>
            </dl>
          </section>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void save();
            }}
          >
            <fieldset disabled={busy}>
              <section id="regional" className={s.card}>
                <span className={s.eyebrow}>SECTION 2 · LOCALIZATION</span>
                <h2>Regional & Display Preferences</h2>
                <p>
                  Saved preferences are a configuration preview. Translated
                  application content and timezone rendering follow in a later
                  milestone.
                </p>
                <div className={s.twoColumns}>
                  <label>
                    Interface Language
                    <select
                      value={form.language}
                      onChange={(e) =>
                        setForm({ ...form, language: e.target.value })
                      }
                    >
                      <option>English</option>
                      <option>Arabic</option>
                    </select>
                  </label>
                  <label>
                    Primary Timezone
                    <select
                      value={form.timezone}
                      onChange={(e) =>
                        setForm({ ...form, timezone: e.target.value })
                      }
                    >
                      {[
                        "Africa/Lagos",
                        "Europe/London",
                        "UTC",
                        "Asia/Riyadh",
                      ].map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <label>
                  Date Format
                  <select
                    value={form.dateFormat}
                    onChange={(e) =>
                      setForm({ ...form, dateFormat: e.target.value })
                    }
                  >
                    {["DD/MM/YYYY", "MM/DD/YYYY", "ISO 8601"].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </label>
                <p className={s.info}>
                  Preview:{" "}
                  {form.dateFormat === "ISO 8601"
                    ? "2026-10-19T09:30:00.000Z (UTC)"
                    : new Intl.DateTimeFormat(
                        form.language === "Arabic"
                          ? "ar"
                          : form.dateFormat === "MM/DD/YYYY"
                            ? "en-US"
                            : "en-GB",
                        {
                          timeZone: form.timezone,
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      ).format(new Date("2026-10-19T09:30:00Z"))}{" "}
                  · {form.timezone}
                </p>
              </section>
              <section id="notification-preferences" className={s.card}>
                <span className={s.eyebrow}>SECTION 3 · ROUTING POLICIES</span>
                <h2>Notification Delivery Preferences</h2>
                <p>
                  Channels are mocked; no email, push or chat messages are sent.
                </p>
                <label className={s.check}>
                  <input type="checkbox" checked disabled />
                  Critical security notices · Mandatory
                </label>
                <label className={s.check}>
                  <input
                    type="checkbox"
                    checked={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.checked })
                    }
                  />
                  Ticket updates by email
                </label>
                <label className={s.check}>
                  <input
                    type="checkbox"
                    checked={form.inApp}
                    onChange={(e) =>
                      setForm({ ...form, inApp: e.target.checked })
                    }
                  />
                  Optional in-app updates
                </label>
                <label className={s.check}>
                  <input
                    type="checkbox"
                    checked={form.digest}
                    onChange={(e) =>
                      setForm({ ...form, digest: e.target.checked })
                    }
                  />
                  Knowledge digest
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      email: defaultPreferences.email,
                      inApp: defaultPreferences.inApp,
                      digest: defaultPreferences.digest,
                    })
                  }
                >
                  Restore channel defaults
                </button>
              </section>
              <div className={`${s.card} ${s.saveBar}`}>
                <span>
                  {dirty ? "Unsaved modifications" : "No unsaved changes"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setForm(saved);
                    setMessage("Unsaved changes discarded.");
                  }}
                >
                  Cancel Changes
                </button>
                <button className={s.primary} disabled={!dirty}>
                  {busy ? "Saving…" : "Save Preferences"}
                </button>
              </div>
              <label className={s.demoControl}>
                <input
                  type="checkbox"
                  checked={failure}
                  onChange={(e) => setFailure(e.target.checked)}
                />
                Simulate save failure (demo)
              </label>
            </fieldset>
          </form>
          <p role="status" className={s.hint}>
            {message}
          </p>
          <section id="sessions" className={s.card}>
            <span className={s.eyebrow}>SECTION 4 · SESSIONS</span>
            <h2>Active Login Sessions & MFA</h2>
            <div className={s.sessionRow}>
              <div>
                <strong>This browser · Current demo session</strong>
                <p>Frontend preview; no real session token exists.</p>
              </div>
              <Link
                href="/login"
                onClick={() => dispatch(setSession("signed-out"))}
              >
                Sign out
              </Link>
            </div>
            {!revoked.includes(context + "-mobile") ? (
              <div className={s.sessionRow}>
                <div>
                  <strong>Safari Mobile · iPhone</strong>
                  <p>Mock other device · Last active 2 hours ago</p>
                </div>
                <button
                  onClick={(e) => {
                    setRevoke(context + "-mobile");
                    opener.current = e.currentTarget;
                    dialog.current?.showModal();
                  }}
                >
                  Revoke Session
                </button>
              </div>
            ) : (
              <p className={s.success}>Other mock session revoked.</p>
            )}
            <div className={s.info}>
              <h3>Organization-managed MFA</h3>
              <p>
                For actual device enrollment, contact your identity provider. To
                preview verification, begin a new demo sign-in.
              </p>
              <Link href="/login">Manage MFA preview →</Link>
            </div>
          </section>
        </div>
      </div>
      <dialog
        className={s.dialog}
        ref={dialog}
        aria-labelledby="revoke-title"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
      >
        <h2 id="revoke-title">Revoke this session?</h2>
        <p>
          This removes the other simulated session for this demo identity. Your
          current visit remains active.
        </p>
        <div className={s.row}>
          <button onClick={close}>Keep Session</button>
          <button
            className={s.primary}
            onClick={() => {
              dispatch(revokeSession(revoke));
              setMessage("Other demo session revoked.");
              close();
            }}
          >
            Revoke Session
          </button>
        </div>
      </dialog>
    </div>
  );
}
