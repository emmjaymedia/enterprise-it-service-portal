"use client";
import Link from "next/link";
import { useState } from "react";
import {
  useAddDemoMessageMutation,
  type DemoTicket,
} from "@/features/dashboard/dashboard-data";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { draftSaved, type ComposerDraft } from "./workspace-slice";
import type { Message } from "./ticket-model";
import Icon from "@/components/workspace/icon";
import styles from "./workspace-tickets.module.scss";
const emptyDraft: ComposerDraft = {
  public: "",
  internal: "",
  publicAttachments: [],
  internalAttachments: [],
};
export function displayTime(time: string) {
  return (
    new Date(time).toLocaleString("en-GB", {
      timeZone: "UTC",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }) + " UTC"
  );
}
export default function TicketConversation({ ticket }: { ticket: DemoTicket }) {
  const [mode, setMode] = useState<Message["visibility"]>("public");
  const [filter, setFilter] = useState("all");
  const [tab, setTab] = useState("conversation");
  const [feedback, setFeedback] = useState("");
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [send, { isLoading }] = useAddDemoMessageMutation();
  const [pendingVersion, setPendingVersion] = useState(0);
  const pending = isLoading || ticket.version < pendingVersion;
  const draft = useAppSelector(
    (s) => s.workspace.drafts[ticket.id] ?? emptyDraft,
  );
  const dispatch = useAppDispatch();
  const attachmentsKey =
    mode === "public" ? "publicAttachments" : "internalAttachments";
  const attachments = draft[attachmentsKey];
  const save = (patch: Partial<ComposerDraft>) =>
    dispatch(draftSaved({ id: ticket.id, draft: { ...draft, ...patch } }));
  async function submit() {
    setFeedback("");
    setPendingVersion(ticket.version + 1);
    try {
      const result = await send({
        id: ticket.id,
        version: ticket.version,
        body: draft[mode],
        visibility: mode,
        attachments,
        simulateFailure,
      }).unwrap();
      if (!result.ok) {
        setPendingVersion(0);
        setFeedback(result.error ?? "Message could not be sent.");
        return;
      }
      save({ [mode]: "", [attachmentsKey]: [] });
      setFeedback(
        mode === "public"
          ? "Public reply added to the mock conversation."
          : "Internal note saved for support staff only.",
      );
    } catch {
      setPendingVersion(0);
      setFeedback("Message failed. Your draft is preserved; please retry.");
    }
  }
  const messages = ticket.messages.filter(
    (m) => filter === "all" || m.visibility === filter,
  );
  return (
    <>
      <div className={styles.detailTabs} aria-label="Record sections">
        <button
          type="button"
          aria-pressed={tab === "conversation"}
          onClick={() => setTab("conversation")}
        >
          Conversation <span>{ticket.messages.length}</span>
        </button>
        <button
          type="button"
          aria-pressed={tab === "activity"}
          onClick={() => setTab("activity")}
        >
          Activity history <span>{ticket.activity.length}</span>
        </button>
        <Link href={`/workspace/tickets/${ticket.id}/tasks`}>Tasks & Time</Link>
        <Link href={`/workspace/tickets/${ticket.id}/related`}>
          Related Records
        </Link>
      </div>
      {tab === "activity" ? (
        <section
          className={styles.activityPanel}
          aria-labelledby="activity-history-title"
        >
          <h2 id="activity-history-title">Activity history</h2>
          <ol>
            {[...ticket.activity].reverse().map((event) => (
              <li key={event.id}>
                <span className={styles.timelineDot} />
                <div>
                  <strong>{event.text}</strong>
                  <time dateTime={event.time}>{displayTime(event.time)}</time>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : (
        <section aria-labelledby="conversation-title">
          <div className={styles.conversationHeading}>
            <h2 id="conversation-title">Activity Feed &amp; Case Dialogue</h2>
            <label>
              <span className={styles.srOnly}>
                Conversation visibility filter
              </span>
              <select
                aria-label="Conversation visibility filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">
                  All updates ({ticket.messages.length})
                </option>
                <option value="public">Public conversation</option>
                <option value="internal">Internal notes</option>
              </select>
            </label>
          </div>
          <div className={styles.messages}>
            {messages.map((message) => (
              <article
                key={message.id}
                className={`${styles.message} ${message.visibility === "internal" ? styles.internalMessage : ""}`}
              >
                {message.visibility === "internal" ? (
                  <div className={styles.internalBanner}>
                    <Icon name="settings" size={13} />
                    INTERNAL NOTE — SUPPORT STAFF ONLY · HIDDEN FROM REQUESTER
                  </div>
                ) : null}
                <div className={styles.messageContent}>
                  <header>
                    <span className={styles.personAvatar}>
                      {message.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                    <div>
                      <strong>{message.author}</strong>
                      <time dateTime={message.time}>
                        {displayTime(message.time)}
                      </time>
                    </div>
                    <span className={styles.visibilityBadge}>
                      {message.visibility === "public" ? "PUBLIC" : "INTERNAL"}
                    </span>
                  </header>
                  <p>{message.body}</p>
                  {message.attachments.map((name) => (
                    <div className={styles.attachment} key={name}>
                      <Icon name="box" size={17} />
                      <span>
                        {name}
                        <small>Mock attachment reference</small>
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
            {!messages.length ? (
              <p className={styles.empty}>
                No updates in this conversation view.
              </p>
            ) : null}
          </div>
        </section>
      )}
      <section
        className={`${styles.composer} ${mode === "internal" ? styles.internalComposer : ""}`}
        aria-label="Message composer"
      >
        <div className={styles.composerModes}>
          <button
            type="button"
            disabled={pending}
            aria-pressed={mode === "public"}
            onClick={() => {
              setMode("public");
              setFeedback("");
            }}
          >
            Public reply to requester
          </button>
          <button
            type="button"
            disabled={pending}
            aria-pressed={mode === "internal"}
            onClick={() => {
              setMode("internal");
              setFeedback("");
            }}
          >
            Private internal note
          </button>
        </div>
        <div className={styles.modeNotice}>
          {mode === "internal" ? (
            <>
              <Icon name="settings" size={14} />
              Internal note · support staff only. Never shared with the
              requester.
            </>
          ) : (
            <>
              <Icon name="team" size={14} />
              Public reply · visible to the requester.
            </>
          )}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <label htmlFor="reply-body" className={styles.srOnly}>
            {mode === "public" ? "Public reply" : "Internal note"}
          </label>
          <textarea
            id="reply-body"
            value={draft[mode]}
            onChange={(e) => save({ [mode]: e.target.value })}
            placeholder={
              mode === "public"
                ? "Write a reply to the requester…"
                : "Write a private note for the support team…"
            }
            required
            maxLength={5000}
            minLength={1}
            disabled={pending || ticket.status === "Resolved"}
            rows={6}
          />
          <div className={styles.draftStatus}>
            <span>
              Draft saved while navigating this app · {draft[mode].length}/5,000
            </span>
            <label className={styles.attachButton}>
              <Icon name="plus" size={14} />
              Attach files
              <input
                type="file"
                multiple
                disabled={pending || ticket.status === "Resolved"}
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  if (
                    files.some((file) => file.size > 5 * 1024 * 1024) ||
                    attachments.length + files.length > 5
                  ) {
                    setFeedback("Use up to 5 files, each no larger than 5 MB.");
                  } else {
                    save({
                      [attachmentsKey]: [
                        ...new Set([
                          ...attachments,
                          ...files.map((file) => file.name),
                        ]),
                      ],
                    });
                    setFeedback("");
                  }
                  e.target.value = "";
                }}
              />
            </label>
          </div>
          {attachments.length ? (
            <ul className={styles.draftAttachments}>
              {attachments.map((name) => (
                <li key={name}>
                  {name}
                  <button
                    type="button"
                    aria-label={`Remove attachment ${name}`}
                    disabled={pending}
                    onClick={() =>
                      save({
                        [attachmentsKey]: attachments.filter((n) => n !== name),
                      })
                    }
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          <p className={styles.railNote}>
            Mock attachments retain filenames only; no file content is uploaded.
          </p>
          <div className={styles.composerFooter}>
            <details className={styles.demoOptions}>
              <summary>Demo delivery options</summary>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  disabled={pending}
                  checked={simulateFailure}
                  onChange={(e) => setSimulateFailure(e.target.checked)}
                />
                Simulate a failed send
              </label>
            </details>
            <button
              type="submit"
              className={styles.primary}
              disabled={pending || ticket.status === "Resolved"}
            >
              {pending
                ? "Sending…"
                : mode === "public"
                  ? "Send public reply"
                  : "Add internal note"}
            </button>
          </div>
          {ticket.status === "Resolved" ? (
            <p role="status">
              This ticket is resolved. Reopen it to reply or add a note.
            </p>
          ) : null}
          <p role="status" className={styles.composerFeedback}>
            {feedback}
          </p>
        </form>
      </section>
    </>
  );
}
