"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  changeApprovalPreview,
  decideApproval,
  saveApprovalDraft,
  type ApprovalAction,
} from "./approvals-slice";
import s from "./approvals.module.scss";
export default function ApprovalDecision({
  id,
  basePath = "/portal/approvals",
}: {
  id: string;
  basePath?: string;
}) {
  const dispatch = useAppDispatch();
  const record = useAppSelector((state) =>
    state.approvals.records.find((r) => r.id === id),
  );
  const note = useAppSelector((state) => state.approvals.drafts[id] ?? "");
  const outcome = useAppSelector((state) => state.approvals.outcomes[id]);
  const [action, setAction] = useState<ApprovalAction>("Approve");
  const [delegate, setDelegate] = useState("");
  const [error, setError] = useState("");
  const [version, setVersion] = useState(record?.version ?? 0);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  if (!record)
    return (
      <section className={s.card}>
        <h1>Approval unavailable</h1>
        <p>This record is unavailable in the frontend demo.</p>
        <Link href={basePath}>Back to approvals</Link>
      </section>
    );
  const blocked =
    record.status !== "Pending" || record.requester === "Amina Yusuf";
  function prepare(next: ApprovalAction, button: HTMLButtonElement) {
    setError("");
    if ((next === "Reject" || next === "Clarify") && note.trim().length < 10) {
      setError("Enter a reason of 10–500 characters before continuing.");
      return;
    }
    if (next === "Delegate" && delegate !== "Priya Shah") {
      setError("Choose an available delegate.");
      return;
    }
    setAction(next);
    opener.current = button;
    dialog.current?.showModal();
  }
  return (
    <div className={s.page}>
      <nav aria-label="Breadcrumb">
        <Link href="/portal">Portal Home</Link> /{" "}
        <Link href={basePath}>Approvals Inbox</Link> / {id}
      </nav>
      <header className={s.card}>
        <div className={s.badges}>
          <span>{id}</span>
          <span>{record.status}</span>
          <span>Revision {record.version}</span>
        </div>
        <h1>{record.title}</h1>
        <p>
          {record.service} · Due {record.due}
        </p>
      </header>
      <div className={s.columns}>
        <div className={s.stack}>
          <section className={s.card}>
            <h2>{record.requester}</h2>
            <p>Requester · Department manager review by Amina Yusuf</p>
          </section>
          <section className={s.card}>
            <h2>Business Justification</h2>
            <blockquote>{record.justification}</blockquote>
          </section>
          <section className={s.card}>
            <h2>
              Requested{" "}
              {record.category === "Hardware & assets"
                ? "Hardware"
                : "Entitlements"}
            </h2>
            <div className={s.details}>
              <div>
                <small>Target service</small>
                <strong>{record.service}</strong>
              </div>
              <div>
                <small>Budget impact</small>
                <strong>{record.cost}</strong>
              </div>
              <div>
                <small>Scope and conditions</small>
                <strong>{record.scope}</strong>
              </div>
              <div>
                <small>Approval step</small>
                <strong>Department manager · 1 of 2</strong>
              </div>
            </div>
          </section>
          <aside className={s.notice}>
            <strong>
              {record.requester === "Amina Yusuf"
                ? "Self-approval blocked"
                : "Individual authorization required"}
            </strong>
            <p>
              {record.requester === "Amina Yusuf"
                ? "Another approver must review your own request."
                : "Approval records your decision only. Subsequent reviews and fulfillment are separate steps."}
            </p>
          </aside>
          <section className={s.card}>
            <h2>Approval & Fulfillment Workflow</h2>
            <ol className={s.chain}>
              <li>Department manager review — {record.status}</li>
              <li>
                System owner / procurement review —{" "}
                {record.status === "Approved"
                  ? "Pending further review"
                  : "Waiting"}
              </li>
              <li>Fulfillment — not started</li>
            </ol>
          </section>
          <section className={s.card}>
            <h2>Prior Decisions & Activity</h2>
            <ol className={s.chain}>
              {record.history.map((entry, index) => (
                <li key={index}>{entry}</li>
              ))}
            </ol>
          </section>
        </div>
        <aside className={s.stack}>
          <section className={s.card}>
            <h2>Your Decision</h2>
            <p>You are reviewing this request as department manager.</p>
            {outcome && (
              <p className={s.notice} role="status">
                {outcome}
              </p>
            )}
            {record.status === "Pending" && record.version !== version && (
              <div role="alert">
                <p>The request revision changed. Review the current scope.</p>
                <button
                  onClick={() => {
                    setVersion(record.version);
                    setError("");
                  }}
                >
                  I reviewed revision {record.version}
                </button>
              </div>
            )}
            {blocked ? (
              <p>
                {record.requester === "Amina Yusuf"
                  ? "You cannot decide your own request."
                  : `This item is ${record.status.toLowerCase()} and is read-only.`}
              </p>
            ) : (
              <>
                <label>
                  Decision notes{" "}
                  <small>Required for rejection or clarification</small>
                  <textarea
                    maxLength={500}
                    rows={5}
                    value={note}
                    onChange={(e) =>
                      dispatch(saveApprovalDraft({ id, text: e.target.value }))
                    }
                  />
                </label>
                <small>{note.length} / 500 characters</small>
                {error && (
                  <p role="alert" className={s.error}>
                    {error}
                  </p>
                )}
                <div className={s.actions}>
                  {(["Approve", "Reject", "Clarify"] as const).map((a) => (
                    <button
                      disabled={record.version !== version}
                      className={a === "Approve" ? s.primary : undefined}
                      key={a}
                      onClick={(e) => prepare(a, e.currentTarget)}
                    >
                      {a === "Clarify"
                        ? "Request Clarification"
                        : `${a} Request`}
                    </button>
                  ))}
                </div>
                {record.canDelegate && (
                  <>
                    <label>
                      Delegate to
                      <select
                        value={delegate}
                        onChange={(e) => setDelegate(e.target.value)}
                      >
                        <option value="">Choose alternate</option>
                        <option>Priya Shah</option>
                        <option disabled>Marcus Vance — unavailable</option>
                      </select>
                    </label>
                    <button
                      disabled={record.version !== version}
                      onClick={(e) => prepare("Delegate", e.currentTarget)}
                    >
                      Delegate Approval
                    </button>
                  </>
                )}
                <p>
                  Clarification keeps approval pending. Delegation transfers
                  this review to the selected alternate.
                </p>
                <details>
                  <summary>Demo conflict scenario</summary>
                  <p>
                    Simulate the requester changing scope before your decision.
                  </p>
                  <button onClick={() => dispatch(changeApprovalPreview(id))}>
                    Simulate request change
                  </button>
                </details>
              </>
            )}
          </section>
          <aside className={s.notice}>
            <strong>Frontend preview</strong>
            <p>
              No permissions, provisioning, notifications or durable audit trail
              are implemented. Changes reset on reload.
            </p>
          </aside>
        </aside>
      </div>
      <dialog
        ref={dialog}
        className={s.dialog}
        onClose={() => opener.current?.focus()}
      >
        <h2>
          {action === "Clarify"
            ? "Request clarification?"
            : `${action} this request?`}
        </h2>
        <p>
          {id} · {record.title}
        </p>
        <p>
          {action === "Approve"
            ? "Confirm you reviewed the scope and cost. Further approval may still be required."
            : action === "Delegate"
              ? `Transfer this review to ${delegate}.`
              : note}
        </p>
        <div className={s.actions}>
          <button autoFocus onClick={() => dialog.current?.close()}>
            Cancel
          </button>
          <button
            className={s.primary}
            onClick={() => {
              dispatch(decideApproval({ id, version, action, note, delegate }));
              if (record.version === version && record.status === "Pending")
                setVersion(version + 1);
              dialog.current?.close();
            }}
          >
            Confirm {action.toLowerCase()}
          </button>
        </div>
      </dialog>
    </div>
  );
}
