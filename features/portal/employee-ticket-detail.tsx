"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  requesterAction,
  saveReplyDraft,
  sendPublicReply,
} from "./portal-slice";
import { responseTarget, resolutionTarget } from "./portal-ticket-utils";
import s from "./portal.module.scss";
type FileReference = { name: string; size: number };
export default function EmployeeTicketDetail({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const ticket = useAppSelector((state) =>
    state.portal.tickets.find((t) => t.id === id),
  );
  const draft = useAppSelector((state) => state.portal.replyDrafts[id] ?? "");
  const [attachments, setAttachments] = useState<FileReference[]>([]);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [fail, setFail] = useState(false);
  const [action, setAction] = useState<"confirm" | "reopen" | "cancel" | null>(
    null,
  );
  const [reason, setReason] = useState("");
  const lock = useRef(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const readOnly =
    !ticket || ["Resolved", "Closed", "Cancelled"].includes(ticket.status);
  function openAction(
    kind: "confirm" | "reopen" | "cancel",
    button: HTMLButtonElement,
  ) {
    setAction(kind);
    setReason("");
    setError("");
    opener.current = button;
    dialogRef.current?.showModal();
  }
  function closeAction() {
    dialogRef.current?.close();
    setAction(null);
    setError("");
    opener.current?.focus();
  }
  function commitAction() {
    if (!action || lock.current) return;
    if (
      action !== "confirm" &&
      (reason.trim().length < 10 || reason.length > 2000)
    ) {
      setError("Enter a reason of 10–2,000 characters.");
      return;
    }
    lock.current = true;
    dispatch(
      requesterAction({
        id,
        kind: action,
        reason,
        at: new Date().toISOString(),
        eventId: crypto.randomUUID(),
      }),
    );
    setFeedback(
      action === "confirm"
        ? "Solution confirmed. Your ticket is now closed."
        : action === "reopen"
          ? "Issue reopened for IT Support."
          : "Request cancelled.",
    );
    closeAction();
    lock.current = false;
  }
  async function send() {
    if (lock.current || readOnly) return;
    if (draft.trim().length < 2 || draft.length > 5000) {
      setError("Enter a reply of 2–5,000 characters.");
      return;
    }
    if (error.startsWith("Could not attach")) return;
    lock.current = true;
    setBusy(true);
    setError("");
    setFeedback("Sending reply…");
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (fail) {
      setFeedback(
        "Reply failed in demo mode. Your text and attachment references are preserved. Turn off simulated failure and retry.",
      );
      setBusy(false);
      lock.current = false;
      return;
    }
    dispatch(
      sendPublicReply({
        id,
        message: {
          id: crypto.randomUUID(),
          author: "Amina Yusuf",
          text: draft.trim(),
          at: new Date().toISOString(),
          attachments,
        },
      }),
    );
    setAttachments([]);
    setFeedback("Reply sent to IT Support.");
    setBusy(false);
    lock.current = false;
  }
  function attach(files: FileList | null) {
    if (!files) return;
    const accepted: FileReference[] = [];
    const rejected: string[] = [];
    for (const file of Array.from(files)) {
      if (
        !/\.(png|jpe?g|pdf)$/i.test(file.name) ||
        !["image/png", "image/jpeg", "application/pdf"].includes(file.type) ||
        file.size === 0 ||
        file.size > 20 * 1024 * 1024
      )
        rejected.push(file.name);
      else accepted.push({ name: file.name, size: file.size });
    }
    if (attachments.length + accepted.length > 5) {
      setError("Choose up to 5 attachments.");
      return;
    }
    setAttachments((old) => [...old, ...accepted]);
    setError(
      rejected.length
        ? `Could not attach ${rejected.join(", ")}. Use nonempty PNG, JPG or PDF up to 20 MB each.`
        : "",
    );
  }
  if (!ticket)
    return (
      <section className={s.confirmation}>
        <h1>Ticket unavailable</h1>
        <p>
          This ticket is not available in your current demo session. New records
          reset on reload. Only your own records are shown.
        </p>
        <Link className={s.primary} href="/portal/tickets">
          Return to My Tickets
        </Link>
      </section>
    );
  const messages = ticket.messages ?? [];
  return (
    <>
      <div className={s.breadcrumb}>
        <Link href="/portal">Help Center</Link> ›{" "}
        <Link href="/portal/tickets">My Tickets</Link> › {id}
      </div>
      <header className={`${s.card} ${s.detailHeader}`}>
        <div>
          <span className={s.tag}>{id}</span>{" "}
          <span className={s.tag}>{ticket.status}</span>{" "}
          <span className={s.warm}>{ticket.priority}</span>
          <h1>{ticket.subject}</h1>
        </div>
        {ticket.canCancel &&
          ["Open", "In progress"].includes(ticket.status) && (
            <button
              disabled={busy}
              onClick={(e) => openAction("cancel", e.currentTarget)}
            >
              Cancel Request
            </button>
          )}
      </header>
      <section className={`${s.info} ${s.expectation}`}>
        <div>
          <h2>Response target: {responseTarget(ticket.priority)}</h2>
          <p>
            Resolution target: {resolutionTarget(ticket.priority)} ·
            Illustrative business-calendar targets, not live deadlines.
          </p>
        </div>
        <span className={s.tag}>
          {ticket.status === "Pending requester"
            ? "Waiting for your reply"
            : ticket.status}
        </span>
      </section>
      {ticket.status === "Pending requester" && (
        <section className={s.attention}>
          <h2>IT Support needs your help</h2>
          <p>
            Please answer the latest question below so investigation can
            continue. Sending your reply resumes this demo ticket to In
            progress.
          </p>
        </section>
      )}
      {ticket.status === "Resolved" && (
        <section className={s.attention}>
          <h2>Has this solved your issue?</h2>
          <p>
            Review the solution below. Confirm if you’re back to work, or tell
            us why the issue persists.
          </p>
          <div className={s.reviewActions}>
            <button
              className={s.primary}
              onClick={(e) => openAction("confirm", e.currentTarget)}
            >
              Confirm Solution
            </button>
            <button onClick={(e) => openAction("reopen", e.currentTarget)}>
              Reopen Issue
            </button>
          </div>
        </section>
      )}
      {["Closed", "Cancelled"].includes(ticket.status) && (
        <p className={s.info}>
          This ticket is {ticket.status.toLowerCase()} and read-only.{" "}
          <Link href="/portal/tickets/new">Report a new issue</Link> if you need
          further help.
        </p>
      )}
      <p role="status" className={s.hint}>
        {feedback}
      </p>
      <div className={s.formColumns}>
        <section aria-label="Public conversation">
          <div className={s.conversationTitle}>
            <h2>
              Conversation{" "}
              <span className={s.tag}>{messages.length + 1} messages</span>
            </h2>
            <small>Visible to you & IT Support</small>
          </div>
          <article className={`${s.card} ${s.message}`}>
            <div className={s.messageHeader}>
              <span className={s.avatar}>AY</span>
              <div>
                <strong>
                  Amina Yusuf <span className={s.tag}>You</span>
                </strong>
                <time dateTime={ticket.createdAt}>
                  {new Date(ticket.createdAt).toLocaleString("en-GB", {
                    timeZone: "UTC",
                  })}{" "}
                  UTC
                </time>
              </div>
              <small>Initial Request</small>
            </div>
            <p className={s.reviewText}>{ticket.description}</p>
            {ticket.attachments?.map((file, i) => (
              <div key={`${file.name}-${i}`} className={s.file}>
                <span>
                  {file.name} · {(file.size / 1048576).toFixed(2)} MB
                  <small>
                    Filename reference only. Download unavailable: no file
                    content was uploaded.
                  </small>
                </span>
              </div>
            ))}
          </article>
          {messages.map((message) => (
            <article key={message.id} className={`${s.card} ${s.message}`}>
              <div className={s.messageHeader}>
                <span className={s.avatar}>
                  {message.author === "Amina Yusuf" ? "AY" : "IT"}
                </span>
                <div>
                  <strong>{message.author}</strong>
                  <time dateTime={message.at}>
                    {new Date(message.at).toLocaleString("en-GB", {
                      timeZone: "UTC",
                    })}{" "}
                    UTC
                  </time>
                </div>
                <small>Public Update</small>
              </div>
              <p className={s.reviewText}>{message.text}</p>
              {message.attachments?.map((file, i) => (
                <div className={s.file} key={`${file.name}-${i}`}>
                  <span>
                    {file.name} · {(file.size / 1048576).toFixed(2)} MB
                    <small>
                      Filename reference only; download unavailable in this
                      demo.
                    </small>
                  </span>
                </div>
              ))}
            </article>
          ))}
          {ticket.status === "Resolved" && (
            <section className={`${s.card} ${s.message}`}>
              <h2>Solution from IT Support</h2>
              <p>
                {ticket.id === "REQ-1039"
                  ? "Your Figma license has been provisioned. Sign in with your corporate account and check that you can access your team workspace."
                  : "Please review the latest public update for your solution."}
              </p>
            </section>
          )}
          {!readOnly && (
            <form
              className={s.card}
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
            >
              <h2>Reply to IT Support</h2>
              <label className={s.hint} htmlFor="public-reply">
                Public reply · Plain text · Do not include passwords or
                verification codes
              </label>
              <textarea
                id="public-reply"
                className={s.replyInput}
                maxLength={5000}
                rows={6}
                value={draft}
                disabled={busy}
                onChange={(e) => {
                  dispatch(saveReplyDraft({ id, text: e.target.value }));
                  setError("");
                }}
                placeholder="Type your reply or additional details here…"
              />
              <p className={s.hint}>
                {draft.length}/5000 · Text draft is kept during client
                navigation and resets on reload.
              </p>
              <label className={s.hint} htmlFor="reply-files">
                Add attachment references (PNG, JPG, PDF; 20 MB each; up to 5)
              </label>
              <input
                type="file"
                id="reply-files"
                multiple
                accept=".png,.jpg,.jpeg,.pdf"
                disabled={busy}
                onChange={(e) => {
                  attach(e.target.files);
                  e.target.value = "";
                }}
              />
              {attachments.map((file, i) => (
                <div className={s.file} key={`${file.name}-${i}`}>
                  <span>{file.name}</span>
                  <button
                    type="button"
                    disabled={busy}
                    aria-label={`Remove ${file.name}`}
                    onClick={() => {
                      setAttachments((old) =>
                        old.filter((_, index) => index !== i),
                      );
                      setError("");
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <p className={s.hint}>
                References only: no upload, scan or file-content persistence.
                Reattach files after leaving this page.
              </p>
              <label className={s.failure}>
                <input
                  type="checkbox"
                  checked={fail}
                  disabled={busy}
                  onChange={(e) => setFail(e.target.checked)}
                />
                Simulate failed send (demo)
              </label>
              {!action && error && (
                <p role="alert" className={s.error}>
                  {error}
                </p>
              )}
              <div className={s.reviewActions}>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    setFeedback(
                      "Text draft saved for this visit. File references are not retained when leaving.",
                    )
                  }
                >
                  Save Draft
                </button>
                <button className={s.primary} disabled={busy}>
                  {busy ? "Sending…" : "Send Reply →"}
                </button>
              </div>
            </form>
          )}
        </section>
        <aside className={s.aside}>
          <section className={s.card}>
            <h2>Ticket Details</h2>
            <dl className={s.detailList}>
              {[
                ["Current Status", ticket.status],
                ["Assigned Team", ticket.team ?? "IT Support"],
                ["Specialist", ticket.owner ?? "Awaiting assignment"],
                [
                  "Created",
                  new Date(ticket.createdAt).toLocaleDateString("en-GB", {
                    timeZone: "UTC",
                  }),
                ],
                ["Category", ticket.category],
                ["Service", ticket.service],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </section>
          {ticket.asset && (
            <section className={s.card}>
              <h2>Associated Device</h2>
              <div className={s.info}>{ticket.asset}</div>
            </section>
          )}
          <section className={s.card}>
            <h2>Recommended Help</h2>
            <p>
              Browse published troubleshooting guides for common VPN, account
              and hardware issues.
            </p>
            <Link className={s.textLink} href="/portal#guides">
              View knowledge guides →
            </Link>
          </section>
          <section className={s.info}>
            <h2>Need Urgent Help?</h2>
            <p>If your work is actively blocked, call the IT Help Desk.</p>
            <strong>ext. 4357 (HELP)</strong>
          </section>
        </aside>
      </div>
      <dialog
        ref={dialogRef}
        className={s.actionDialog}
        onCancel={(e) => {
          e.preventDefault();
          closeAction();
        }}
      >
        <h2>
          {action === "confirm"
            ? "Confirm solution"
            : action === "reopen"
              ? "Reopen issue"
              : "Cancel request"}
        </h2>
        <p>
          {action === "confirm"
            ? "Confirm that the solution worked. This closes the ticket and makes it read-only."
            : action === "reopen"
              ? "Tell IT Support what still does not work. Reopening returns the ticket to Open."
              : "Explain why you no longer need this request. Cancellation makes the record read-only."}
        </p>
        {action !== "confirm" && (
          <>
            <label htmlFor="action-reason">Reason *</label>
            <textarea
              id="action-reason"
              autoFocus
              rows={4}
              maxLength={2000}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError("");
              }}
            />
          </>
        )}
        {error && (
          <p role="alert" className={s.error}>
            {error}
          </p>
        )}
        <div className={s.reviewActions}>
          <button onClick={closeAction}>Keep ticket unchanged</button>
          <button className={s.primary} onClick={commitAction}>
            {action === "confirm"
              ? "Confirm and Close"
              : action === "reopen"
                ? "Reopen Ticket"
                : "Cancel Request"}
          </button>
        </div>
      </dialog>
    </>
  );
}
