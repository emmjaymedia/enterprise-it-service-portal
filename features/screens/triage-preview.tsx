"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { DemoTicket } from "@/features/dashboard/dashboard-data";
import s from "./triage-preview.module.scss";
export default function TriagePreview({ tickets }: { tickets: DemoTicket[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("preview");
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const record = tickets.find((t) => t.id === id);
  useEffect(() => {
    if (id && dialog.current && !dialog.current.open) {
      opener.current = document.activeElement as HTMLElement;
      dialog.current.showModal();
    }
  }, [id]);
  function close() {
    dialog.current?.close();
    const next = new URLSearchParams(params.toString());
    next.delete("preview");
    router.replace(`/workspace/tickets${next.size ? `?${next}` : ""}`, {
      scroll: false,
    });
    opener.current?.focus();
  }
  if (!id) return null;
  const index = tickets.findIndex((t) => t.id === id);
  const adjacent = (offset: number) => {
    const next = new URLSearchParams(params.toString());
    next.set(
      "preview",
      tickets[(index + offset + tickets.length) % tickets.length].id,
    );
    return `/workspace/tickets?${next}`;
  };
  return (
    <dialog
      ref={dialog}
      className={s.drawer}
      aria-labelledby="triage-preview-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
    >
      <header>
        <span>TRIAGE PREVIEW · {id}</span>
        <button type="button" onClick={close} aria-label="Close triage preview">
          ×
        </button>
      </header>
      {record ? (
        <>
          <div className={s.body}>
            <span className={s.badge}>
              P{record.priority} · {record.status}
            </span>
            <h2 id="triage-preview-title">{record.subject}</h2>
            <p>
              {record.messages.find((m) => m.visibility === "public")?.body}
            </p>
            <section>
              <h3>Requester Identification</h3>
              <strong>{record.requester}</strong>
              <p>{record.department} · Employee portal</p>
            </section>
            <section>
              <h3>Impact & Urgency</h3>
              <dl>
                <div>
                  <dt>Service</dt>
                  <dd>{record.service}</dd>
                </div>
                <div>
                  <dt>Priority</dt>
                  <dd>P{record.priority}</dd>
                </div>
                <div>
                  <dt>Resolution SLA</dt>
                  <dd>{record.sla} · Illustrative target</dd>
                </div>
              </dl>
            </section>
            <section>
              <h3>Suggested Routing</h3>
              <label>
                Team
                <select defaultValue={record.team}>
                  {[
                    "Network Operations",
                    "Applications Support",
                    "Workplace IT",
                    "Identity & Access",
                  ].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label>
                Assignee
                <select defaultValue={record.assignee ?? "Team triage"}>
                  {[
                    record.assignee ?? "Team triage",
                    "Daniel Cole",
                    "Priya Shah",
                    "Team triage",
                  ]
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .map((name) => (
                      <option key={name}>{name}</option>
                    ))}
                </select>
              </label>
              <small>
                Routing controls are layout previews. Open the full ticket to
                use the existing assignment workflow.
              </small>
            </section>
          </div>
          <footer>
            <div>
              <Link href={adjacent(-1)}>← Previous</Link>
              <Link href={adjacent(1)}>Next →</Link>
            </div>
            <Link className={s.primary} href={`/workspace/tickets/${id}`}>
              Open Full Ticket →
            </Link>
          </footer>
        </>
      ) : (
        <div className={s.body}>
          <h2 id="triage-preview-title">Ticket unavailable</h2>
          <p>This record is unavailable in the current sample queue.</p>
          <button onClick={close}>Back to Queue</button>
        </div>
      )}
    </dialog>
  );
}
