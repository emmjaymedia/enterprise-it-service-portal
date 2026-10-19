"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSession } from "./shared-slice";
import AccessShell from "./access-shell";
import s from "./shared.module.scss";
export type StateKind =
  "403" | "404" | "maintenance" | "offline" | "session-expired";
const states = {
  "403": {
    code: "DEMO-ACCESS-403",
    heading: "Access restricted",
    text: "This content is unavailable to your current preview context. We cannot confirm whether a restricted record exists.",
  },
  "404": {
    code: "DEMO-NOTFOUND-404",
    heading: "We couldn’t find that page",
    text: "The address may be incorrect or the page may no longer be available. Return to your workspace or search your visible records.",
  },
  maintenance: {
    code: "DEMO-MAINTENANCE-503",
    heading: "Scheduled maintenance",
    text: "This is the maintenance-state preview. No actual service outage is being reported. Your existing text drafts remain in this browser visit.",
  },
  offline: {
    code: "DEMO-OFFLINE",
    heading: "You appear to be offline",
    text: "This is the offline-state preview. Your existing client-side text drafts are retained while the page stays open. Avoid a reload if you have unsent work.",
  },
  "session-expired": {
    code: "DEMO-SESSION-EXPIRED",
    heading: "Your session has expired",
    text: "Sign in again to continue the demo. Existing text drafts remain in memory during client navigation; a full reload resets them.",
  },
};
export default function SystemState({ kind }: { kind: StateKind }) {
  const dispatch = useAppDispatch();
  const context = useAppSelector((state) => state.shared.context);
  const [message, setMessage] = useState("");
  const item = states[kind];
  useEffect(() => {
    if (kind === "session-expired") dispatch(setSession("expired"));
  }, [kind, dispatch]);
  return (
    <AccessShell>
      <section className={s.systemGrid}>
        <div className={`${s.card} ${s.topBorder}`}>
          <span className={s.badge}>{item.code}</span>
          <h1>{item.heading}</h1>
          <p>{item.text}</p>
          <div className={s.info}>
            <h2>Reference code</h2>
            <code>{item.code}</code>
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(item.code);
                  setMessage("Reference code copied.");
                } catch {
                  setMessage(
                    "Copy is unavailable. Select and copy the reference code above.",
                  );
                }
              }}
            >
              Copy reference
            </button>
          </div>
          <div className={s.row}>
            {kind === "session-expired" ? (
              <Link className={s.primary} href="/login">
                Sign In Again →
              </Link>
            ) : (
              <button
                className={s.primary}
                onClick={() =>
                  setMessage(
                    kind === "offline"
                      ? navigator.onLine
                        ? "Browser reports a network connection. Return to your workspace to continue."
                        : "Still offline. Your client-side drafts are retained."
                      : kind === "maintenance"
                        ? "Maintenance preview remains active. Return to your workspace to continue the demo."
                        : "The resource remains unavailable in this preview. Try search or contact support.",
                  )
                }
              >
                Retry
              </button>
            )}
            <Link href={context === "agent" ? "/workspace" : "/portal"}>
              Return to My Workspace
            </Link>
            <Link href="/search">Search</Link>
          </div>
          <p role="status" className={s.hint}>
            {message}
          </p>
        </div>
        <aside>
          <section className={s.card}>
            <h2>Need assistance?</h2>
            <p>Give the IT Help Desk the reference code shown here.</p>
            <strong>ext. 4357</strong>
          </section>
          <section className={s.info}>
            <h2>Drafts and recovery</h2>
            <p>
              Client navigation preserves Redux ticket drafts. Issue-report text
              saved in session storage can be restored after a reload.
              Attachment file contents are never retained.
            </p>
            <Link href="/system-states">Browse system-state previews →</Link>
          </section>
        </aside>
      </section>
    </AccessShell>
  );
}
export function SystemStateGallery() {
  return (
    <AccessShell>
      <section className={s.narrow}>
        <div className={s.card}>
          <span className={s.badge}>S02 · FRONTEND STATE PREVIEWS</span>
          <h1>System & Access States</h1>
          <p>
            Review error and recovery paths without changing backend
            availability or access controls.
          </p>
          <div className={s.stateLinks}>
            {(Object.keys(states) as StateKind[]).map((kind) => (
              <Link key={kind} href={`/${kind}`}>
                <span>{states[kind].code}</span>
                <strong>{states[kind].heading} →</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </AccessShell>
  );
}
